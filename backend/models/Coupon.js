import { createAppModel, Mixed } from './appModel.js';

// Discount coupons, addressed by their code.
const Coupon = createAppModel('Coupon', {
  key: 'code',
  collection: 'coupons',
  fields: {
    discountPercentage: Mixed,
    maxDiscount: Mixed,
    minOrderValue: Mixed,
    description: Mixed,
    expiryDate: Mixed,
    usageCount: Mixed,
    isActive: Mixed,
    ownerUserId: { type: String, index: true },
    ownerName: Mixed,
    startDate: Mixed,
    totalUsageLimit: Mixed,
    perUserUsageLimit: Mixed,
    reservedCount: { type: Number, default: 0 },
    usageByUser: Mixed,
    allowSelfRedemption: Mixed,
    allowStacking: Mixed,
    allowSharing: Mixed,
    maxDiscountPerOrder: Mixed,
    categoryIds: Mixed,
    productIds: Mixed,
  },
});

export default Coupon;
