import User from '../models/User.js';
import { Referral, ReferralConfig, WalletTransaction } from '../models/Referral.js';
import { getReferralConfig } from '../services/referrals.js';

const id = (user) => String(user._id);

<<<<<<< HEAD
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.emistri.user&pcampaignid=web_share';
=======
const getClientBaseUrl = (req) => {
  const configuredUrl = process.env.CLIENT_URL?.split(',')[0]?.trim();
  const configuredIsLocal = configuredUrl && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(configuredUrl);
  // A local development default must not leak into referral links sent from production.
  const requestOrigin = req.get('origin');
  const baseUrl = configuredUrl && !configuredIsLocal ? configuredUrl : (requestOrigin || 'https://m-mistri.com');
  return baseUrl.replace(/\/$/, '');
};
>>>>>>> 4f1c1de6b35d0bf2edc0012a2195973091b28f9a

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
      link: PLAY_STORE_URL,
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
    const [config, referrals, users, ledger, withdrawals] = await Promise.all([
      getReferralConfig(), Referral.find().sort({ createdAt: -1 }).lean(),
      User.find({ role: { $ne: 'admin' } }).select('name email phone referralCode referralCategory referralLimitOverride referralLimitUsed').lean(),
      WalletTransaction.find({ type: 'referral_reward' }).lean(),
      WalletTransaction.find({ type: 'adjustment', description: /^Wallet withdrawal/ }).sort({ createdAt: -1 }).lean(),
    ]);
    const statusCount = (status) => referrals.filter((r) => r.status === status).length;
    const enriched = await Promise.all(referrals.map(async (r) => {
      const [referrer, referred] = await Promise.all([User.findById(r.referrerId).select('name phone').lean(), User.findById(r.referredUserId).select('name phone').lean()]);
      return { ...r, referrerName: referrer?.name || 'Unknown', referredName: referred?.name || 'Unknown' };
    }));
    res.json({ success: true, data: {
      config, referrals: enriched, users, withdrawals,
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
    const user = await User.findById(id(req.user)).select('walletBalance bankAccount').lean();
    const config = await getReferralConfig();
    res.json({ success: true, data: { balance: user?.walletBalance || 0, bankAccount: user?.bankAccount || {}, allowWithdrawals: Boolean(config.allowWithdrawals), transactions } });
  } catch (error) { next(error); }
};

export const requestWalletWithdrawal = async (req, res, next) => {
  try {
    const amount = Number(req.body?.amount);
    if (!Number.isFinite(amount) || amount <= 0 || Math.round(amount * 100) !== amount * 100) return res.status(400).json({ success: false, message: 'Enter a valid withdrawal amount' });
    const config = await getReferralConfig();
    if (!config.allowWithdrawals) return res.status(403).json({ success: false, message: 'Wallet withdrawals are currently disabled' });
    const userId = id(req.user);
    const user = await User.findById(userId).select('walletBalance bankAccount').lean();
    const bank = user?.bankAccount || {};
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!bank.accountHolderName || !bank.accountNumber || !bank.ifscCode || !bank.bankName) return res.status(400).json({ success: false, message: 'Save complete bank account details before requesting a withdrawal' });
    const transactionId = `WDR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const debited = await User.findOneAndUpdate(
      { _id: userId, walletBalance: { $gte: amount }, walletTransactionIds: { $ne: transactionId } },
      { $inc: { walletBalance: -amount }, $addToSet: { walletTransactionIds: transactionId } },
      { new: true }
    ).select('walletBalance').lean();
    if (!debited) return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    try {
      await WalletTransaction.create({ transactionId, userId, type: 'adjustment', status: 'Pending', amount: -amount, balanceAfter: debited.walletBalance, bankAccount: { accountHolderName: bank.accountHolderName, accountNumber: bank.accountNumber, ifscCode: bank.ifscCode, bankName: bank.bankName, accountType: bank.accountType, upiId: bank.upiId || '' }, description: `Wallet withdrawal request to ${bank.bankName} (A/C ending ${String(bank.accountNumber).slice(-4)})` });
    } catch (error) {
      await User.updateOne({ _id: userId }, { $inc: { walletBalance: amount }, $pull: { walletTransactionIds: transactionId } });
      throw error;
    }
    res.status(201).json({ success: true, data: { transactionId, amount, status: 'Pending', balance: debited.walletBalance } });
  } catch (error) { next(error); }
};

export const updateWalletWithdrawal = async (req, res, next) => {
  try {
    const status = String(req.body?.status || '');
    if (!['Paid', 'Rejected'].includes(status)) return res.status(400).json({ success: false, message: 'Choose Paid or Rejected' });
    const transaction = await WalletTransaction.findOneAndUpdate(
      { transactionId: req.params.id, type: 'adjustment', status: 'Pending', description: /^Wallet withdrawal request/ },
      { $set: { status, ...(status === 'Paid' ? { description: 'Wallet withdrawal paid' } : { description: 'Wallet withdrawal rejected and refunded' }) } },
      { new: true }
    ).lean();
    if (!transaction) return res.status(404).json({ success: false, message: 'Pending withdrawal request not found' });
    if (status === 'Rejected') {
      const refundId = `WDR-REFUND-${transaction.transactionId}`;
      const refunded = await User.findOneAndUpdate({ _id: transaction.userId, walletTransactionIds: { $ne: refundId } }, { $inc: { walletBalance: Math.abs(transaction.amount) }, $addToSet: { walletTransactionIds: refundId } }, { new: true }).select('walletBalance').lean();
      if (refunded) await WalletTransaction.updateOne({ transactionId: refundId }, { $setOnInsert: { transactionId: refundId, userId: transaction.userId, type: 'adjustment', status: 'Credited', amount: Math.abs(transaction.amount), balanceAfter: refunded.walletBalance, description: `Refund for rejected withdrawal ${transaction.transactionId}` } }, { upsert: true });
    }
    res.json({ success: true, data: transaction });
  } catch (error) { next(error); }
};

export const saveWalletBankAccount = async (req, res, next) => {
  try {
    const accountHolderName = String(req.body.accountHolderName || '').trim();
    const accountNumber = String(req.body.accountNumber || '').replace(/\s/g, '');
    const ifscCode = String(req.body.ifscCode || '').trim().toUpperCase();
    const bankName = String(req.body.bankName || '').trim();
    const accountType = String(req.body.accountType || 'Savings');
    const upiId = String(req.body.upiId || '').trim().toLowerCase();

    if (!accountHolderName || accountHolderName.length > 100) return res.status(400).json({ success: false, message: 'Enter the account holder name (up to 100 characters)' });
    if (!/^\d{9,18}$/.test(accountNumber)) return res.status(400).json({ success: false, message: 'Enter a valid bank account number (9–18 digits)' });
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) return res.status(400).json({ success: false, message: 'Enter a valid IFSC code' });
    if (!bankName || bankName.length > 100) return res.status(400).json({ success: false, message: 'Enter a valid bank name' });
    if (!['Savings', 'Current'].includes(accountType)) return res.status(400).json({ success: false, message: 'Choose Savings or Current account' });
    if (upiId && !/^[\w.-]{2,256}@[\w.-]{2,64}$/.test(upiId)) return res.status(400).json({ success: false, message: 'Enter a valid UPI ID' });

    const user = await User.findByIdAndUpdate(id(req.user), {
      $set: { bankAccount: { accountHolderName, accountNumber, ifscCode, bankName, accountType, upiId } },
    }, { new: true, runValidators: true }).select('bankAccount').lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user.bankAccount });
  } catch (error) { next(error); }
};
