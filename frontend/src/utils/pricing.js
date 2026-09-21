/**
 * Order pricing rules - the single definition of how a cart is charged.
 *
 * IMPORTANT: this is a copy of backend/utils/pricing.js, which decides what the customer
 * is actually charged. Change both files together, or customers will see one total at
 * checkout and be charged another.
 */

// Pricing-related defaults, matching the storefront's built-in site settings.
export const DEFAULT_PRICING_SETTINGS = {
  gstRatePercent: 18,
  isGstInclusive: false,
  deliveryType: 'free', // 'free' | 'flat' | 'min_order_free' | 'km_based'
  flatDeliveryFee: 49,
  minFreeDeliveryOrder: 500,
  deliveryBaseKm: 5,
  deliveryBaseFee: 0,
  deliveryPerKmFee: 15,
  estimatedDeliveryKm: 5,
  enableUnloadingFee: false,
  unloadingChargeStandard: 500,
  freeUnloadingThreshold: 50000,
};

// A number, or the fallback when the value is missing. Unlike `Number(v) || fallback`,
// an explicit 0 (e.g. 0% GST, free flat delivery) is respected.
const num = (value, fallback) => {
  if (value === null || value === undefined || value === '') return fallback;
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
};

const optionLabel = (opt) => (opt && typeof opt === 'object' ? opt.name ?? opt.label ?? opt.value : opt);

/**
 * Resolve the chosen variant options of a product.
 * `selection` maps a variant group id (or "default" for a flat options list) to the
 * chosen option's name. Missing choices fall back to the storefront's default option.
 * Returns { options, error }.
 */
export const resolveVariantOptions = (product, selection = {}) => {
  const options = [];
  if (Array.isArray(product?.variantGroups) && product.variantGroups.length > 0) {
    for (const group of product.variantGroups) {
      const groupOptions = Array.isArray(group?.options) ? group.options : [];
      if (!groupOptions.length) continue;
      const wanted = selection?.[group.id];
      const opt =
        wanted !== undefined && wanted !== null
          ? groupOptions.find((o) => String(optionLabel(o)) === String(wanted))
          : groupOptions.find((o) => o?.isPopular) || groupOptions[0];
      if (!opt) return { options, error: `Unknown option "${wanted}" for ${product.name}` };
      options.push(opt);
    }
  } else if (Array.isArray(product?.optionsList) && product.optionsList.length > 0) {
    const wanted = selection?.default;
    const opt =
      wanted !== undefined && wanted !== null
        ? product.optionsList.find((o) => String(optionLabel(o)) === String(wanted))
        : product.optionsList[0];
    if (!opt) return { options, error: `Unknown option "${wanted}" for ${product.name}` };
    options.push(opt);
  }
  return { options, error: null };
};

/**
 * Price of one unit: the product price, replaced by the last chosen option that has
 * its own price, then by the best matching bulk (wholesale) tier for the quantity.
 */
export const unitPrice = (product, quantity, options = []) => {
  let price = num(product?.price, 0);
  options.forEach((opt) => {
    if (opt && opt.price) price = num(opt.price, price);
  });
  if (Array.isArray(product?.wholesaleTiers)) {
    const tier = [...product.wholesaleTiers]
      .sort((a, b) => num(b?.minQty, 0) - num(a?.minQty, 0))
      .find((t) => quantity >= num(t?.minQty, 0));
    if (tier && tier.price) price = num(tier.price, price);
  }
  return price;
};

/**
 * Discount a coupon gives on a subtotal. Returns { amount, reason } where a non-empty
 * reason explains why the coupon does not apply.
 */
export const couponDiscount = (coupon, subtotal, now = new Date()) => {
  if (!coupon) return { amount: 0, reason: '' };
  if (coupon.isActive === false) return { amount: 0, reason: 'This coupon is no longer active' };
  if (coupon.expiryDate) {
    const expires = new Date(coupon.expiryDate);
    if (!Number.isNaN(expires.getTime()) && expires < now) return { amount: 0, reason: 'This coupon has expired' };
  }
  const minOrder = num(coupon.minOrderValue, 0);
  if (subtotal < minOrder) {
    return { amount: 0, reason: `Minimum order amount of ₹${minOrder.toLocaleString('en-IN')} required` };
  }
  let amount = Math.round(subtotal * (num(coupon.discountPercentage, 0) / 100));
  const cap = num(coupon.maxDiscount, 0);
  if (cap > 0 && amount > cap) amount = cap;
  return { amount: Math.max(0, Math.min(amount, subtotal)), reason: '' };
};

/**
 * Everything charged on top of the item subtotal.
 * @returns {{ subtotal, discount, subtotalAfterDiscount, deliveryFee, deliveryNote,
 *             unloadingCharge, gstAmount, isGstInclusive, deliveryType, grandTotal }}
 */
export const computeTotals = ({ subtotal, coupon = null, settings = {} }) => {
  const s = { ...DEFAULT_PRICING_SETTINGS, ...(settings || {}) };
  const discount = couponDiscount(coupon, subtotal).amount;
  const subtotalAfterDiscount = Math.max(0, subtotal - discount);

  let deliveryFee = 0;
  let deliveryNote = 'FREE';
  const deliveryType = s.deliveryType || 'free';

  if (subtotal > 0 && deliveryType === 'flat') {
    deliveryFee = num(s.flatDeliveryFee, 0);
    deliveryNote = deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`;
  } else if (subtotal > 0 && deliveryType === 'min_order_free') {
    const threshold = num(s.minFreeDeliveryOrder, 500);
    const flatFee = num(s.flatDeliveryFee, 99);
    if (subtotal >= threshold) {
      deliveryNote = `FREE (Orders above ₹${threshold.toLocaleString('en-IN')})`;
    } else {
      deliveryFee = flatFee;
      deliveryNote = `₹${deliveryFee} (Free above ₹${threshold.toLocaleString('en-IN')})`;
    }
  } else if (subtotal > 0 && deliveryType === 'km_based') {
    const km = num(s.estimatedDeliveryKm, 5);
    const baseKm = num(s.deliveryBaseKm, 5);
    const baseFee = num(s.deliveryBaseFee, 0);
    const perKm = num(s.deliveryPerKmFee, 15);
    if (km <= baseKm) {
      deliveryFee = baseFee;
      deliveryNote = baseFee === 0 ? `FREE (within ${baseKm} km)` : `₹${baseFee} (within ${baseKm} km)`;
    } else {
      deliveryFee = baseFee + Math.round((km - baseKm) * perKm);
      deliveryNote = `₹${deliveryFee} (${km} km @ ₹${perKm}/km)`;
    }
  }

  const unloadingCharge =
    subtotal > 0 && Boolean(s.enableUnloadingFee)
      ? subtotal >= num(s.freeUnloadingThreshold, 50000)
        ? 0
        : num(s.unloadingChargeStandard, 500)
      : 0;

  const gstRate = num(s.gstRatePercent, 18) / 100;
  const isGstInclusive = Boolean(s.isGstInclusive);
  const gstAmount = isGstInclusive
    ? Math.round(subtotalAfterDiscount * (gstRate / (1 + gstRate)))
    : Math.round(subtotalAfterDiscount * gstRate);

  const grandTotal = Math.max(
    0,
    subtotalAfterDiscount + deliveryFee + unloadingCharge + (isGstInclusive ? 0 : gstAmount)
  );

  return {
    subtotal,
    discount,
    subtotalAfterDiscount,
    deliveryFee,
    deliveryNote,
    unloadingCharge,
    gstAmount,
    isGstInclusive,
    deliveryType,
    grandTotal,
  };
};
