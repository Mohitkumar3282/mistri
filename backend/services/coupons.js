import Coupon from '../models/Coupon.js';
import CouponUsage from '../models/CouponUsage.js';
import Setting from '../models/Setting.js';

const number = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const usageKey = (userId) => String(userId || 'guest').replace(/[^a-zA-Z0-9_-]/g, '_');
const asDate = (value, endOfDay = false) => {
  if (!value) return null;
  const date = new Date(value);
  if (endOfDay && /^\d{4}-\d{2}-\d{2}$/.test(String(value))) date.setHours(23, 59, 59, 999);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const getCouponSettings = async () => {
  const site = await Setting.findOne({ key: 'site' }).lean();
  return {
    allowSelfRedemption: site?.couponSettings?.allowSelfRedemption === true,
    allowCouponStacking: site?.couponSettings?.allowCouponStacking === true,
    enableCouponSharing: site?.couponSettings?.enableCouponSharing !== false,
    restoreCouponOnCancellation: site?.couponSettings?.restoreCouponOnCancellation !== false,
    maxDiscountPerOrder: Math.max(0, number(site?.couponSettings?.maxDiscountPerOrder)),
  };
};

const getEligibleSubtotal = (coupon, lines, subtotal) => {
  const productIds = Array.isArray(coupon.productIds) ? coupon.productIds.map(String) : [];
  const categoryIds = Array.isArray(coupon.categoryIds) ? coupon.categoryIds.map(String) : [];
  if (!productIds.length && !categoryIds.length) return subtotal;
  return (lines || []).reduce((sum, line) => {
    const product = line.product || {};
    const categories = [product.categoryId, product.category, ...(product.categoryIds || [])].filter(Boolean).map(String);
    const eligible = productIds.includes(String(product.id)) || categories.some((id) => categoryIds.includes(id));
    return sum + (eligible ? number(line.lineTotal, number(line.price) * number(line.quantity)) : 0);
  }, 0);
};

export const getCouponEligibility = async ({ code, subtotal, userId = null, lines = [], now = new Date() }) => {
  const cleanCode = String(code || '').trim().toUpperCase();
  if (!cleanCode) throw Object.assign(new Error('Enter a coupon code'), { status: 400 });
  const coupon = await Coupon.findOne({ code: cleanCode }).lean();
  if (!coupon) throw Object.assign(new Error('This coupon code is invalid'), { status: 400 });
  if (coupon.isActive === false) throw Object.assign(new Error('This coupon is inactive'), { status: 400 });
  const start = asDate(coupon.startDate);
  const expiry = asDate(coupon.expiryDate, true);
  if (start && start > now) throw Object.assign(new Error('This coupon is not active yet'), { status: 400 });
  if (expiry && expiry < now) throw Object.assign(new Error('This coupon has expired'), { status: 400 });

  const settings = await getCouponSettings();
  const ownerUserId = coupon.ownerUserId ? String(coupon.ownerUserId) : '';
  const customerId = userId ? String(userId) : '';
  if (ownerUserId && !customerId && !settings.enableCouponSharing) {
    throw Object.assign(new Error('Sign in to use this personal coupon'), { status: 401 });
  }
  if (ownerUserId && customerId === ownerUserId && !settings.allowSelfRedemption) {
    throw Object.assign(new Error('You cannot redeem your own coupon'), { status: 400 });
  }
  if (ownerUserId && customerId !== ownerUserId && !settings.enableCouponSharing) {
    throw Object.assign(new Error('Coupon sharing is currently disabled'), { status: 400 });
  }

  const eligibleSubtotal = getEligibleSubtotal(coupon, lines, number(subtotal));
  const minimum = number(coupon.minOrderValue);
  if (eligibleSubtotal < minimum) {
    throw Object.assign(new Error(`Minimum eligible order is ₹${minimum.toLocaleString('en-IN')}`), { status: 400 });
  }

  const totalLimit = number(coupon.totalUsageLimit);
  const reserved = number(coupon.reservedCount);
  const used = number(coupon.usageCount);
  if (totalLimit > 0 && used + reserved >= totalLimit) {
    throw Object.assign(new Error('This coupon has reached its usage limit'), { status: 400 });
  }
  const userUsage = customerId ? number(coupon.usageByUser?.[usageKey(customerId)]) : 0;
  const perUserLimit = number(coupon.perUserUsageLimit);
  if (customerId && perUserLimit > 0 && userUsage >= perUserLimit) {
    throw Object.assign(new Error('You have reached the usage limit for this coupon'), { status: 400 });
  }

  let discount = 0;
  const fixed = coupon.discountType === 'flat' || (number(coupon.flatAmount) > 0 && !number(coupon.discountPercentage));
  if (fixed) discount = number(coupon.flatAmount || coupon.discountAmount);
  else discount = Math.round(eligibleSubtotal * (number(coupon.discountPercentage) / 100));
  const couponCap = number(coupon.maxDiscount);
  const orderCap = Math.min(
    couponCap > 0 ? couponCap : Number.POSITIVE_INFINITY,
    number(coupon.maxDiscountPerOrder) > 0 ? number(coupon.maxDiscountPerOrder) : Number.POSITIVE_INFINITY,
    settings.maxDiscountPerOrder > 0 ? settings.maxDiscountPerOrder : Number.POSITIVE_INFINITY
  );
  if (Number.isFinite(orderCap)) discount = Math.min(discount, orderCap);
  discount = Math.max(0, Math.min(discount, eligibleSubtotal));
  return {
    coupon,
    discount,
    eligibleSubtotal,
    ownerUserId,
    settings,
  };
};

/** Atomically reserve both the coupon-wide and per-user limit for a checkout. */
export const reserveCouponUse = async ({ code, userId, referenceId, discountAmount, orderValue, userName = '', userPhone = '' }) => {
  const cleanCode = String(code || '').trim().toUpperCase();
  const customerId = String(userId || 'guest');
  const key = usageKey(customerId);
  const usageId = `${cleanCode}:${referenceId}`;
  const usageData = {
    id: usageId,
    code: cleanCode,
    userId: customerId,
    referenceId: String(referenceId),
    paymentIntentId: String(referenceId).startsWith('order_') ? String(referenceId) : null,
    orderId: String(referenceId).startsWith('MST-') ? String(referenceId) : null,
    discountAmount: number(discountAmount),
    orderValue: number(orderValue),
    userName,
    userPhone,
    createdAt: new Date(),
  };
  let usage = await CouponUsage.findOne({ id: usageId }).lean();
  if (usage && usage.status !== 'released') {
    if (usage.status === 'pending') throw Object.assign(new Error('This coupon reservation is already being processed'), { status: 409 });
    return usage;
  }
  if (usage) {
    usage = await CouponUsage.findOneAndUpdate({ id: usageId, status: 'released' }, { $set: { ...usageData, status: 'pending', releasedAt: null } }, { new: true }).lean();
    if (!usage) throw Object.assign(new Error('This coupon reservation is already being processed'), { status: 409 });
  } else {
    try {
      usage = await CouponUsage.create({ ...usageData, status: 'pending' });
    } catch (error) {
      if (error.code === 11000) {
        const concurrent = await CouponUsage.findOne({ id: usageId }).lean();
        if (concurrent && concurrent.status !== 'pending') return concurrent;
        throw Object.assign(new Error('This coupon reservation is already being processed'), { status: 409 });
      }
      throw error;
    }
  }

  let updated;
  try {
    const coupon = await Coupon.findOne({ code: cleanCode }).lean();
    if (!coupon) throw Object.assign(new Error('This coupon code is invalid'), { status: 400 });
    if (typeof coupon.usageCount === 'string') {
      const normalizedCount = Math.max(0, number(coupon.usageCount));
      await Coupon.updateOne({ code: cleanCode, usageCount: { $type: 'string' } }, { $set: { usageCount: normalizedCount } });
      coupon.usageCount = normalizedCount;
    }
  const totalLimit = number(coupon.totalUsageLimit);
  const perUserLimit = number(coupon.perUserUsageLimit);
  const now = new Date();
  const starts = asDate(coupon.startDate);
  const expires = asDate(coupon.expiryDate, true);
  if (coupon.isActive === false || (starts && starts > now) || (expires && expires < now)) {
    throw Object.assign(new Error('This coupon is no longer available'), { status: 409 });
  }
  const filter = { code: cleanCode, isActive: { $ne: false } };
  if (totalLimit > 0) {
    filter.$expr = { $lt: [{ $add: [{ $ifNull: ['$usageCount', 0] }, { $ifNull: ['$reservedCount', 0] }] }, totalLimit] };
  }
  if (perUserLimit > 0) {
    filter.$and = [{ $or: [{ [`usageByUser.${key}`]: { $exists: false } }, { [`usageByUser.${key}`]: { $lt: perUserLimit } }] }];
  }
    updated = await Coupon.findOneAndUpdate(
      filter,
      { $inc: { reservedCount: 1, [`usageByUser.${key}`]: 1 } },
      { new: true }
    ).lean();
    if (!updated) throw Object.assign(new Error('This coupon usage limit has just been reached'), { status: 409 });
    const reservedUsage = await CouponUsage.findOneAndUpdate(
      { id: usageId, status: 'pending' },
      { $set: { status: 'reserved', ownerUserId: updated.ownerUserId || null, sharedByUserId: updated.ownerUserId || null } },
      { new: true }
    ).lean();
    if (!reservedUsage) throw Object.assign(new Error('Could not finalize the coupon reservation'), { status: 409 });
    return reservedUsage;
  } catch (error) {
    if (updated) await Coupon.updateOne({ code: cleanCode }, { $inc: { reservedCount: -1, [`usageByUser.${key}`]: -1 } });
    await CouponUsage.updateOne({ id: usageId, status: 'pending' }, { $set: { status: 'released', releasedAt: new Date() } });
    throw error;
  }
};

export const consumeCouponUse = async ({ code, userId, referenceId, orderId }) => {
  const usageId = `${String(code).toUpperCase()}:${referenceId}`;
  const usage = await CouponUsage.findOneAndUpdate(
    { id: usageId, status: 'reserved' },
    { $set: { status: 'redeemed', orderId: orderId || null, redeemedAt: new Date() } },
    { new: true }
  ).lean();
  if (usage) {
    await Coupon.updateOne({ code: usage.code }, { $inc: { reservedCount: -1, usageCount: 1 } });
    return usage;
  }
  return CouponUsage.findOne({ id: usageId, status: 'redeemed' }).lean();
};

export const releaseCouponUse = async ({ code, userId, referenceId }) => {
  const usageId = `${String(code).toUpperCase()}:${referenceId}`;
  const usage = await CouponUsage.findOneAndUpdate(
    { id: usageId, status: 'reserved' },
    { $set: { status: 'released', releasedAt: new Date() } },
    { new: true }
  ).lean();
  if (usage) {
    await Coupon.updateOne(
      { code: usage.code },
      { $inc: { reservedCount: -1, [`usageByUser.${usageKey(userId || usage.userId)}`]: -1 } }
    );
  }
  return usage;
};

export const restoreCouponUsageForOrder = async (order) => {
  const settings = await getCouponSettings();
  if (!settings.restoreCouponOnCancellation) return null;
  const orderId = String(order?.id || order?.orderNumber || '');
  const codes = [...new Set(String(order?.couponCode || '').toUpperCase().split(',').filter(Boolean))];
  if (!orderId || !codes.length) return null;
  const restored = [];
  for (const code of codes) {
    const usage = await CouponUsage.findOneAndUpdate(
      { code, orderId, status: 'redeemed' },
      { $set: { status: 'refunded', releasedAt: new Date() } },
      { new: true }
    ).lean();
    if (usage) {
      await Coupon.updateOne(
        { code },
        { $inc: { usageCount: -1, [`usageByUser.${usageKey(usage.userId)}`]: -1 } }
      );
      restored.push(usage);
    }
  }
  return restored;
};

export const couponUsageId = (code, referenceId) => `${String(code).toUpperCase()}:${referenceId}`;
