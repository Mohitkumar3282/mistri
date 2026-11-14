import User from '../models/User.js';
import { Referral, ReferralConfig, WalletTransaction } from '../models/Referral.js';
import { getReferralConfig } from '../services/referrals.js';

const id = (user) => String(user._id);

const getClientBaseUrl = (req) => {
  const configuredUrl = process.env.CLIENT_URL?.split(',')[0]?.trim();
  const configuredIsLocal = configuredUrl && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(configuredUrl);
  // A local development default must not leak into referral links sent from production.
  const requestOrigin = req.get('origin');
  const baseUrl = configuredUrl && !configuredIsLocal ? configuredUrl : (requestOrigin || configuredUrl || 'http://localhost:5173');
  return baseUrl.replace(/\/$/, '');
};

export const referralSummary = async (req, res, next) => {
  try {
    const userId = id(req.user);
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const config = await getReferralConfig();
    const referrals = await Referral.find({ referrerId: userId }).sort({ createdAt: -1 }).lean();
    const [ownReferral, ledger] = await Promise.all([
      Referral.findOne({ referredUserId: userId }).lean(),
      WalletTransaction.find({ userId, type: { $in: ['referral_reward', 'reversal'] } }).sort({ createdAt: -1 }).lean(),
    ]);
    const limit = user.referralLimitOverride ?? config.limits?.[user.referralCategory || 'Normal'] ?? config.limits?.Normal ?? 0;
    const used = Number(user.referralLimitUsed || 0);
    res.json({ success: true, data: {
      code: user.referralCode,
      link: `${getClientBaseUrl(req)}/signup?ref=${encodeURIComponent(user.referralCode)}`,
      referrals,
      ownReferral,
      ledger,
      walletBalance: Number(user.walletBalance || 0),
      usedLimit: used,
      remainingLimit: limit === -1 ? null : Math.max(0, limit - used),
      limit,
      config: { enabled: config.enabled, useForPurchases: config.useForPurchases, allowWithdrawals: config.allowWithdrawals, referrerReward: config.referrerReward, referredReward: config.referredReward },
    } });
  } catch (error) { next(error); }
};

export const adminReferralData = async (_req, res, next) => {
  try {
    const [config, referrals, users, ledger] = await Promise.all([
      getReferralConfig(), Referral.find().sort({ createdAt: -1 }).lean(),
      User.find({ role: { $ne: 'admin' } }).select('name email phone referralCode referralCategory referralLimitOverride referralLimitUsed').lean(),
      WalletTransaction.find({ type: 'referral_reward' }).lean(),
    ]);
    const statusCount = (status) => referrals.filter((r) => r.status === status).length;
    const enriched = await Promise.all(referrals.map(async (r) => {
      const [referrer, referred] = await Promise.all([User.findById(r.referrerId).select('name phone').lean(), User.findById(r.referredUserId).select('name phone').lean()]);
      return { ...r, referrerName: referrer?.name || 'Unknown', referredName: referred?.name || 'Unknown' };
    }));
    res.json({ success: true, data: {
      config, referrals: enriched, users,
      analytics: { total: referrals.length, successful: statusCount('Credited'), pending: statusCount('Pending') + statusCount('Eligible'), distributed: ledger.filter((t) => t.status === 'Credited').reduce((s, t) => s + t.amount, 0), pendingRewards: referrals.filter((r) => ['Pending', 'Eligible'].includes(r.status)).reduce((s, r) => s + r.referrerReward + r.referredReward, 0), reversed: ledger.filter((t) => t.status === 'Reversed').reduce((s, t) => s + Math.abs(t.amount), 0), categories: users.reduce((a, u) => ({ ...a, [u.referralCategory || 'Normal']: (a[u.referralCategory || 'Normal'] || 0) + 1 }), {}) },
    } });
  } catch (error) { next(error); }
};

export const saveReferralConfig = async (req, res, next) => {
  try {
    const allowed = ['enabled', 'rewardType', 'referrerReward', 'referredReward', 'eligibility', 'successfulOrdersRequired', 'minimumOrderAmount', 'rewardExpiryDays', 'startDate', 'endDate', 'refundPolicy', 'useForPurchases', 'allowWithdrawals', 'limits', 'categories'];
    const values = Object.fromEntries(allowed.filter((key) => req.body[key] !== undefined).map((key) => [key, req.body[key]]));
    for (const key of ['referrerReward', 'referredReward', 'minimumOrderAmount', 'rewardExpiryDays', 'successfulOrdersRequired']) if (values[key] !== undefined && (!Number.isFinite(Number(values[key])) || Number(values[key]) < (key === 'successfulOrdersRequired' ? 1 : 0))) return res.status(400).json({ success: false, message: `Invalid ${key}` });
    const config = await ReferralConfig.findOneAndUpdate({ key: 'default' }, { $set: values, $setOnInsert: { key: 'default' } }, { upsert: true, new: true, runValidators: true });
    res.json({ success: true, data: config });
  } catch (error) { next(error); }
};

export const updateReferralUser = async (req, res, next) => {
  try {
    const changes = {};
    if (req.body.category !== undefined) changes.referralCategory = String(req.body.category);
    if (req.body.limit !== undefined) changes.referralLimitOverride = req.body.limit === null ? null : Math.max(-1, Number(req.body.limit));
    if (req.body.reset) changes.referralLimitUsed = 0;
    const user = await User.findByIdAndUpdate(req.params.id, { $set: changes }, { new: true }).select('name referralCategory referralLimitOverride referralLimitUsed').lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
};

export const updateReferralStatus = async (req, res, next) => {
  try {
    if (!['Rejected', 'Reversed'].includes(req.body.status)) return res.status(400).json({ success: false, message: 'Unsupported status change' });
    const prior = await Referral.findById(req.params.id).lean();
    if (!prior) return res.status(404).json({ success: false, message: 'Referral not found' });
    if (req.body.status === 'Reversed' && prior.status !== 'Credited') return res.status(400).json({ success: false, message: 'Only credited rewards can be reversed' });
    const referral = await Referral.findOneAndUpdate({ _id: req.params.id, status: prior.status }, { $set: { status: req.body.status } }, { new: true }).lean();
    if (!referral) return res.status(409).json({ success: false, message: 'Referral status changed; refresh and try again' });
    if (req.body.status === 'Rejected' && prior.status !== 'Rejected') await User.updateOne({ _id: prior.referrerId, referralLimitUsed: { $gt: 0 } }, { $inc: { referralLimitUsed: -1 } });
    if (!referral) return res.status(404).json({ success: false, message: 'Referral not found' });
    if (req.body.status === 'Reversed') {
      for (const [userId, amount, role] of [[referral.referrerId, referral.referrerReward, 'referrer'], [referral.referredUserId, referral.referredReward, 'referred']]) {
        const transactionId = `REV-${referral._id}-${role}`;
        await User.updateOne({ _id: userId, walletTransactionIds: { $ne: transactionId } }, { $inc: { walletBalance: -Math.abs(amount) }, $addToSet: { walletTransactionIds: transactionId } });
        await WalletTransaction.updateOne({ transactionId }, { $setOnInsert: { transactionId, userId, referralId: referral._id, type: 'reversal', status: 'Reversed', amount: -Math.abs(amount), description: 'Referral reward reversal' } }, { upsert: true });
      }
    }
    res.json({ success: true, data: referral });
  } catch (error) { next(error); }
};

export const walletHistory = async (req, res, next) => {
  try {
    const transactions = await WalletTransaction.find({ userId: id(req.user) }).sort({ createdAt: -1 }).lean();
    const user = await User.findById(id(req.user)).select('walletBalance').lean();
    res.json({ success: true, data: { balance: user?.walletBalance || 0, transactions } });
  } catch (error) { next(error); }
};
