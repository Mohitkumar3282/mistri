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
  },
});

export default Coupon;
