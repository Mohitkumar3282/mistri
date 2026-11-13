import crypto from 'crypto';
import User from '../models/User.js';
import { Referral, ReferralConfig, WalletTransaction } from '../models/Referral.js';

export const ensureReferralCode = async (user) => {
  if (user.referralCode) return user.referralCode;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = `${String(user.name || 'MISTRI').replace(/[^a-z]/gi, '').slice(0, 4).toUpperCase() || 'USER'}${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    try {
      const updated = await User.findByIdAndUpdate(user._id, { $set: { referralCode: code } }, { new: true });
      if (updated) { user.referralCode = updated.referralCode; return code; }
    } catch (error) { if (error.code !== 11000) throw error; }
  }
  throw new Error('Could not create a unique referral code');
};

export const getReferralConfig = async () => (await ReferralConfig.findOneAndUpdate(
  { key: 'default' }, { $setOnInsert: { key: 'default' } }, { upsert: true, new: true, setDefaultsOnInsert: true }
)).toObject();

export const attachReferral = async (newUser, rawCode) => {
  if (!rawCode) return null;
  const config = await getReferralConfig();
  if (!config.enabled) throw new Error('Referral rewards are currently unavailable');
  const code = String(rawCode).trim().toUpperCase();
  const referrer = await User.findOne({ referralCode: code });
  if (!referrer) throw new Error('Referral code was not recognized');
  if (String(referrer._id) === String(newUser._id)) throw new Error('You cannot use your own referral code');
  if (newUser.referredBy || await Referral.exists({ referredUserId: String(newUser._id) })) throw new Error('A referral code has already been used for this account');
  const used = Number(referrer.referralLimitUsed || 0);
  const limit = referrer.referralLimitOverride ?? config.limits?.[referrer.referralCategory || 'Normal'] ?? config.limits?.Normal ?? 0;
  if (limit !== -1 && used >= limit) throw new Error('This user has reached their referral limit');
  const start = config.startDate && new Date(config.startDate);
  const end = config.endDate && new Date(config.endDate);
  if ((start && Date.now() < start) || (end && Date.now() > end)) throw new Error('Referral program is outside its active dates');
  const reservationFilter = { _id: referrer._id, ...(limit === -1 ? {} : { $or: [{ referralLimitUsed: { $lt: limit } }, { referralLimitUsed: { $exists: false } }] }) };
  const reserved = await User.findOneAndUpdate(reservationFilter, { $inc: { referralLimitUsed: 1 } }, { new: true });
  if (!reserved) throw new Error('This user has reached their referral limit');
  try {
    await Referral.create({ referrerId: String(referrer._id), referredUserId: String(newUser._id), referralCode: code });
    newUser.referredBy = String(referrer._id);
    await newUser.save();
  } catch (error) {
    await User.updateOne({ _id: referrer._id }, { $inc: { referralLimitUsed: -1 } });
    throw error;
  }
};

const completedSuccessfully = (order) => {
  const status = String(order.statusCode || order.status || '').toLowerCase();
  const payment = String(order.paymentStatus || order.payment?.status || '').toLowerCase();
  return ['completed', 'delivered', 'successful', 'complete'].includes(status)
    && !/cancel|fail|refund/.test(`${status} ${payment}`)
    && !/failed|refund|cancel/.test(payment);
};

const creditReward = async ({ referral, userId, amount, orderId, role }) => {
  if (!(amount > 0)) return;
  const transactionId = `RWD-${referral._id}-${role}`;
  await User.updateOne(
    { _id: userId, walletTransactionIds: { $ne: transactionId } },
    { $inc: { walletBalance: amount }, $addToSet: { walletTransactionIds: transactionId } }
  );
  const ledger = await WalletTransaction.updateOne(
    { transactionId },
    { $setOnInsert: { transactionId, userId, referralId: referral._id, orderId, type: 'referral_reward', status: 'Credited', amount, description: `Referral ${role} reward` } },
    { upsert: true }
  );
  if (ledger.upsertedCount) {
    const user = await User.findById(userId).select('walletBalance').lean();
    await WalletTransaction.updateOne({ transactionId }, { $set: { balanceAfter: user?.walletBalance || amount } });
  }
};

export const processCompletedOrder = async (order) => {
  const userId = String(order.userId || '');
  const state = `${String(order.statusCode || '')} ${String(order.status || '')} ${String(order.paymentStatus || '')} ${String(order.payment?.status || '')}`.toLowerCase();
  const isRefunded = /refund/.test(state);
  if (isRefunded) {
    const config = await getReferralConfig();
    if (config.refundPolicy === 'reverse') {
      const referral = await Referral.findOne({ referredUserId: userId, status: 'Credited' });
      if (referral && String(referral.qualifyingOrderId) === String(order.id || order.orderNumber || order._id)) {
        const reversed = await Referral.findOneAndUpdate({ _id: referral._id, status: 'Credited' }, { $set: { status: 'Reversed' } }, { new: true });
        if (reversed) {
          for (const [walletUserId, amount, role] of [[reversed.referrerId, reversed.referrerReward, 'referrer'], [reversed.referredUserId, reversed.referredReward, 'referred']]) {
            const transactionId = `REV-${reversed._id}-${role}`;
            await User.updateOne({ _id: walletUserId, walletTransactionIds: { $ne: transactionId } }, { $inc: { walletBalance: -Math.abs(amount) }, $addToSet: { walletTransactionIds: transactionId } });
            await WalletTransaction.updateOne({ transactionId }, { $setOnInsert: { transactionId, userId: walletUserId, referralId: reversed._id, orderId: reversed.qualifyingOrderId, type: 'reversal', status: 'Reversed', amount: -Math.abs(amount), description: 'Refunded order referral reward reversal' } }, { upsert: true });
          }
        }
      }
    }
    return;
  }
  if (!completedSuccessfully(order)) return;
  const referral = await Referral.findOne({ referredUserId: userId, status: { $in: ['Pending', 'Eligible', 'Approved'] } });
  if (!referral) return;
  const config = await getReferralConfig();
  if (!config.enabled) return;
  const value = Number(order.grandTotal || order.total || 0);
  const orderId = String(order.id || order.orderNumber || order._id);
  let claimed = referral;
  if (referral.status !== 'Approved') {
    const advanced = await Referral.findOneAndUpdate(
      { _id: referral._id, status: { $in: ['Pending', 'Eligible'] }, successfulOrderIds: { $ne: orderId } },
      { $inc: { successfulOrders: 1 }, $addToSet: { successfulOrderIds: orderId } },
      { new: true }
    );
    if (!advanced) return;
    const qualified = config.eligibility === 'minimumOrder'
      ? value >= Number(config.minimumOrderAmount || 0)
      : advanced.successfulOrders >= Number(config.successfulOrdersRequired || 1);
    if (!qualified) return;
    claimed = await Referral.findOneAndUpdate(
      { _id: advanced._id, status: { $in: ['Pending', 'Eligible'] } },
      { $set: { status: 'Approved', qualifyingOrderId: orderId, qualifyingOrderValue: value, referrerReward: Number(config.referrerReward || 0), referredReward: Number(config.referredReward || 0), expiresAt: config.rewardExpiryDays ? new Date(Date.now() + config.rewardExpiryDays * 86400000) : null } },
      { new: true }
    );
  }
  if (!claimed) return;
  const [referrer, referred] = await Promise.all([
    User.findById(claimed.referrerId).select('referralCategory').lean(),
    User.findById(claimed.referredUserId).select('referralCategory').lean(),
  ]);
  const categoryReward = (category, key, fallback) => {
    const rule = (config.categories || []).find((entry) => entry.name === (category || 'Normal'));
    return Number(rule?.[key] ?? fallback);
  };
  const referrerReward = categoryReward(referrer?.referralCategory, 'referrerReward', claimed.referrerReward);
  const referredReward = categoryReward(referred?.referralCategory, 'referredReward', claimed.referredReward);
  await Referral.updateOne({ _id: claimed._id }, { $set: { referrerReward, referredReward } });
  claimed.referrerReward = referrerReward;
  claimed.referredReward = referredReward;
  await creditReward({ referral: claimed, userId: claimed.referrerId, amount: referrerReward, orderId: claimed.qualifyingOrderId, role: 'referrer' });
  await creditReward({ referral: claimed, userId: claimed.referredUserId, amount: referredReward, orderId: claimed.qualifyingOrderId, role: 'referred' });
  await Referral.updateOne({ _id: claimed._id, status: 'Approved' }, { $set: { status: 'Credited' } });
};
