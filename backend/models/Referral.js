import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
  key: { type: String, default: 'default', unique: true },
  enabled: { type: Boolean, default: false },
  rewardType: { type: String, enum: ['fixed'], default: 'fixed' },
  referrerReward: { type: Number, default: 200, min: 0 },
  referredReward: { type: Number, default: 100, min: 0 },
  eligibility: { type: String, enum: ['orders', 'minimumOrder'], default: 'orders' },
  successfulOrdersRequired: { type: Number, default: 1, min: 1 },
  minimumOrderAmount: { type: Number, default: 0, min: 0 },
  rewardExpiryDays: { type: Number, default: 0, min: 0 },
  startDate: Date,
  endDate: Date,
  refundPolicy: { type: String, enum: ['reverse', 'keep'], default: 'reverse' },
  useForPurchases: { type: Boolean, default: true },
  allowWithdrawals: { type: Boolean, default: false },
  limits: { type: mongoose.Schema.Types.Mixed, default: { Normal: 10, Premium: 50, VIP: 100 } },
  categories: { type: [mongoose.Schema.Types.Mixed], default: [{ name: 'Normal', limit: 10 }, { name: 'Premium', limit: 50 }, { name: 'VIP', limit: 100 }] },
}, { timestamps: true });

const referralSchema = new mongoose.Schema({
  referrerId: { type: String, required: true, index: true },
  referredUserId: { type: String, required: true, unique: true, index: true },
  referralCode: { type: String, required: true, index: true },
  status: { type: String, enum: ['Pending', 'Eligible', 'Approved', 'Credited', 'Rejected', 'Reversed'], default: 'Pending', index: true },
  successfulOrders: { type: Number, default: 0 },
  successfulOrderIds: { type: [String], default: [] },
  qualifyingOrderId: { type: String, default: '' },
  qualifyingOrderValue: { type: Number, default: 0 },
  referrerReward: { type: Number, default: 0 },
  referredReward: { type: Number, default: 0 },
  expiresAt: Date,
}, { timestamps: true });

const walletTransactionSchema = new mongoose.Schema({
  transactionId: { type: String, unique: true, required: true },
  userId: { type: String, required: true, index: true },
  referralId: { type: mongoose.Schema.Types.ObjectId, index: true },
  orderId: String,
  type: { type: String, enum: ['referral_reward', 'reversal', 'adjustment'], required: true },
  status: { type: String, enum: ['Pending', 'Credited', 'Reversed', 'Rejected'], default: 'Credited' },
  amount: { type: Number, required: true },
  balanceAfter: { type: Number, default: 0 },
  description: String,
}, { timestamps: true });

export const ReferralConfig = mongoose.models.ReferralConfig || mongoose.model('ReferralConfig', configSchema);
export const Referral = mongoose.models.Referral || mongoose.model('Referral', referralSchema);
export const WalletTransaction = mongoose.models.WalletTransaction || mongoose.model('WalletTransaction', walletTransactionSchema);
