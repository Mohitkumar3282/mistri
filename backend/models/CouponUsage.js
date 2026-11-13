import { createAppModel, Mixed } from './appModel.js';

const CouponUsage = createAppModel('CouponUsage', {
  key: 'id',
  collection: 'coupon_usages',
  fields: {
    code: { type: String, index: true },
    ownerUserId: { type: String, index: true },
    sharedByUserId: { type: String, index: true },
    userId: { type: String, index: true },
    orderId: { type: String, index: true },
    paymentIntentId: { type: String, index: true },
    status: { type: String, index: true }, // reserved | redeemed | released
    discountAmount: Number,
    orderValue: Number,
    createdAt: { type: Date, default: Date.now },
    redeemedAt: Date,
    releasedAt: Date,
    userName: Mixed,
    userPhone: Mixed,
  },
});

export default CouponUsage;
