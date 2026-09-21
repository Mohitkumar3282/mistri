import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import Setting from '../models/Setting.js';
import { resolveVariantOptions, unitPrice, couponDiscount, computeTotals } from './pricing.js';

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
export const priceCart = async ({ items, couponCode }) => {
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
  const code = couponCode ? String(couponCode).trim().toUpperCase() : '';
  if (code) {
    const { _id, ...found } = (await Coupon.findOne({ code }).lean()) || {};
    if (!found.code) throw new PricingError(`Coupon ${code} is not valid`);
    const { reason } = couponDiscount(found, subtotal);
    if (reason) throw new PricingError(`Coupon ${code}: ${reason}`);
    coupon = found;
  }

  const { _id, key, ...settings } = (await Setting.findOne({ key: 'site' }).lean()) || {};
  const totals = computeTotals({ subtotal, coupon, settings });

  return { lines, totals, couponCode: coupon ? code : null };
};
