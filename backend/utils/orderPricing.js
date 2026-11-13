import Product from '../models/Product.js';
import Setting from '../models/Setting.js';
import { resolveVariantOptions, unitPrice, computeTotals } from './pricing.js';
import { getCouponEligibility, getCouponSettings } from '../services/coupons.js';

export class PricingError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

const MAX_LINES = 200;
const MAX_QTY = 100000;

const optionLabel = (opt) => (opt && typeof opt === 'object' ? opt.name ?? opt.label ?? opt.value : opt);

/**
 * Price a cart from the database. Only product ids, quantities, chosen variants and a
 * coupon code are taken from the caller; every amount comes from stored data.
 *
 * @param {Array}  items       cart lines: { product: { id, variantSelection }, quantity }
 * @param {string} couponCode  optional
 * @returns {Promise<{ lines, totals, couponCode }>}
 */
export const priceCart = async ({ items, couponCode, userId = null, includeUnloading = false, deliveryOption = 'normal' }) => {
  if (!Array.isArray(items) || items.length === 0) throw new PricingError('Your cart is empty');
  if (items.length > MAX_LINES) throw new PricingError('Too many items in one order');

  const ids = items.map((item) => String(item?.product?.id ?? item?.productId ?? item?.id ?? ''));
  const products = await Product.find({ id: { $in: ids.filter(Boolean) } }).lean();
  const byId = new Map(products.map(({ _id, ...p }) => [p.id, p]));

  const lines = items.map((item, i) => {
    const product = byId.get(ids[i]);
    if (!product) throw new PricingError('An item in your cart is no longer available. Please review your cart.');
    if (product.inStock === false) throw new PricingError(`${product.name} is out of stock`);

    const quantity = Math.floor(Number(item?.quantity));
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > MAX_QTY) {
      throw new PricingError(`Invalid quantity for ${product.name}`);
    }

    const selection = item?.product?.variantSelection || item?.variantSelection || {};
    const { options, error } = resolveVariantOptions(product, selection);
    if (error) throw new PricingError(error);

    const price = unitPrice(product, quantity, options);
    const variantSummary = options.map(optionLabel).filter(Boolean).join(' • ');

    return {
      product: {
        ...product,
        name: variantSummary ? `${product.name} (${variantSummary})` : product.name,
        price,
        variantSelection: selection,
        selectedVariant: variantSummary || undefined,
      },
      quantity,
      price,
      lineTotal: price * quantity,
    };
  });

  const subtotal = lines.reduce((acc, l) => acc + l.lineTotal, 0);

  let coupon = null;
  let couponDiscountAmount = 0;
  let couponOwnerUserId = null;
  let couponDiscounts = [];
  const codes = couponCode ? [...new Set(String(couponCode).split(',').map((value) => value.trim().toUpperCase()).filter(Boolean))] : [];
  if (codes.length) {
    try {
      const couponSettings = await getCouponSettings();
      if (codes.length > 1 && !couponSettings.allowCouponStacking) throw new PricingError('Only one coupon can be used on an order');
      const eligibilities = [];
      for (const code of codes) eligibilities.push(await getCouponEligibility({ code, subtotal, userId, lines }));
      const rawDiscount = eligibilities.reduce((sum, item) => sum + item.discount, 0);
      const orderDiscount = Math.min(rawDiscount, subtotal, couponSettings.maxDiscountPerOrder > 0 ? couponSettings.maxDiscountPerOrder : Number.POSITIVE_INFINITY);
      const scale = rawDiscount > 0 ? orderDiscount / rawDiscount : 0;
      couponDiscounts = eligibilities.map((item, index) => ({ code: codes[index], amount: Math.floor(item.discount * scale) }));
      const remainder = orderDiscount - couponDiscounts.reduce((sum, item) => sum + item.amount, 0);
      if (remainder > 0 && couponDiscounts.length) couponDiscounts[0].amount += remainder;
      couponDiscountAmount = couponDiscounts.reduce((sum, item) => sum + item.amount, 0);
      couponOwnerUserId = eligibilities.map((item) => item.ownerUserId).filter(Boolean)[0] || null;
      coupon = {
        ...eligibilities[0].coupon,
        discountType: 'flat',
        flatAmount: couponDiscountAmount,
        discountPercentage: 0,
      };
    } catch (error) {
      throw new PricingError(error.message);
    }
  }

  const { _id, key, ...settings } = (await Setting.findOne({ key: 'site' }).lean()) || {};
  const isExpressDelivery = deliveryOption === 'express' && settings.expressDeliveryEnabled !== false;
  const totals = computeTotals({
    subtotal,
    coupon,
    settings,
    includeUnloading: Boolean(includeUnloading),
    isExpressDelivery,
  });

  return { lines, totals, couponCode: coupon ? codes.join(',') : null, couponDiscountAmount, couponDiscounts, couponOwnerUserId };
};
