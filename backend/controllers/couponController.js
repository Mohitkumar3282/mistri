import Coupon from '../models/Coupon.js';
import CouponUsage from '../models/CouponUsage.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { priceCart } from '../utils/orderPricing.js';

const stripInternal = (coupon) => {
  const { _id, usageByUser, reservedCount, ...safe } = coupon;
  return safe;
};

const resolveCouponOwner = async (ownerId) => {
  if (!ownerId) return { id: null, name: '' };
  let owner = await User.findOne({ clientId: String(ownerId) }).select('_id name role').lean();
  if (!owner && mongoose.Types.ObjectId.isValid(String(ownerId))) {
    owner = await User.findById(String(ownerId)).select('_id name role').lean();
  }
  if (!owner || owner.role !== 'customer') throw Object.assign(new Error('Select a registered customer as the coupon owner'), { status: 400 });
  return { id: String(owner._id), name: owner.name || '' };
};

const cleanCouponInput = async (body, { creating = false } = {}) => {
  const fields = { ...(body || {}) };
  delete fields._id;
  delete fields.__v;
  delete fields.reservedCount;
  delete fields.usageByUser;
  if (fields.ownerUserId !== undefined) {
    const owner = await resolveCouponOwner(fields.ownerUserId);
    fields.ownerUserId = owner.id;
    fields.ownerName = owner.name;
  }
  for (const [field, endOfDay] of [['startDate', false], ['expiryDate', true]]) {
    if (fields[field] === '') fields[field] = null;
    if (fields[field] && /^\d{4}-\d{2}-\d{2}$/.test(String(fields[field]))) {
      fields[field] = new Date(`${fields[field]}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}Z`);
    } else if (fields[field] && Number.isNaN(new Date(fields[field]).getTime())) {
      throw Object.assign(new Error(`Invalid ${field === 'startDate' ? 'start' : 'expiry'} date`), { status: 400 });
    }
  }
  if (creating) {
    const code = String(fields.code || '').trim().toUpperCase();
    if (!/^[A-Z0-9_-]{3,40}$/.test(code)) throw Object.assign(new Error('Coupon code must be 3–40 letters, numbers, dashes, or underscores'), { status: 400 });
    fields.code = code;
    if (fields.discountType === 'percentage') {
      if (Number(fields.discountPercentage) <= 0 || Number(fields.discountPercentage) > 100) throw Object.assign(new Error('Percentage discount must be between 1 and 100'), { status: 400 });
    } else if (Number(fields.flatAmount) <= 0) {
      throw Object.assign(new Error('Fixed discount must be greater than zero'), { status: 400 });
    }
    fields.usageCount = 0;
    fields.reservedCount = 0;
    fields.usageByUser = {};
  }
  if (fields.totalUsageLimit !== undefined && Number(fields.totalUsageLimit) < 0) throw Object.assign(new Error('Total usage limit cannot be negative'), { status: 400 });
  if (fields.perUserUsageLimit !== undefined && Number(fields.perUserUsageLimit) < 0) throw Object.assign(new Error('Per-user usage limit cannot be negative'), { status: 400 });
  return fields;
};

export const createCoupon = async (req, res) => {
  try {
    const fields = await cleanCouponInput(req.body, { creating: true });
    const exists = await Coupon.exists({ code: fields.code });
    if (exists) return res.status(409).json({ success: false, message: 'That coupon code already exists' });
    const saved = await Coupon.create(fields);
    res.status(201).json({ success: true, data: stripInternal(saved.toJSON()) });
  } catch (error) {
    res.status(error.status || (error.code === 11000 ? 409 : 400)).json({ success: false, message: error.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const code = String(req.params.key || '').toUpperCase();
    const existing = await Coupon.findOne({ code }).lean();
    if (!existing) return res.status(404).json({ success: false, message: 'Coupon not found' });
    if (req.body?.code && String(req.body.code).trim().toUpperCase() !== code) {
      return res.status(400).json({ success: false, message: 'Coupon codes cannot be changed after creation' });
    }
    const fields = await cleanCouponInput(req.body);
    delete fields.code;
    const saved = await Coupon.findOneAndUpdate({ code }, { $set: fields }, { new: true }).lean();
    res.json({ success: true, data: stripInternal(saved) });
  } catch (error) {
    res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const code = String(req.params.key || '').toUpperCase();
    if (await CouponUsage.exists({ code, status: 'reserved' })) {
      return res.status(409).json({ success: false, message: 'This coupon has a payment in progress. Disable it and try deleting again after checkout finishes.' });
    }
    const deleted = await Coupon.deleteOne({ code });
    if (!deleted.deletedCount) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, data: { code, deleted: true } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const validateCouponCode = async (req, res) => {
  try {
    const { items, couponCode, includeUnloading, deliveryOption } = req.body || {};
    const priced = await priceCart({
      items,
      couponCode,
      userId: req.user?._id ? String(req.user._id) : null,
      includeUnloading: Boolean(includeUnloading),
      deliveryOption: deliveryOption === 'express' ? 'express' : 'normal',
    });
    const codes = String(priced.couponCode || '').split(',').filter(Boolean);
    const coupons = await Coupon.find({ code: { $in: codes } }).lean();
    res.json({
      success: true,
      data: {
        coupon: { ...stripInternal(coupons[0]), code: priced.couponCode, stackedCoupons: coupons.map(stripInternal) },
        discountAmount: priced.couponDiscountAmount,
        subtotal: priced.totals.subtotal,
        total: priced.totals.grandTotal,
      },
    });
  } catch (error) {
    res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

export const couponAnalytics = async (_req, res) => {
  try {
    const [coupons, usages, orders] = await Promise.all([
      Coupon.find().sort({ _id: -1 }).lean(),
      CouponUsage.find({ status: 'redeemed' }).sort({ redeemedAt: -1 }).lean(),
      Order.find({ couponCode: { $exists: true, $nin: [null, ''] } }).lean(),
    ]);
    const byCode = new Map();
    for (const usage of usages) byCode.set(usage.code, [...(byCode.get(usage.code) || []), usage]);
    const ordersByCode = new Map();
    for (const order of orders) {
      const orderState = `${order.statusCode || ''} ${order.status || ''} ${order.paymentStatus || ''}`.toLowerCase();
      if (/cancel|fail|refund/.test(orderState)) continue;
      for (const code of String(order.couponCode || '').toUpperCase().split(',').filter(Boolean)) {
        ordersByCode.set(code, [...(ordersByCode.get(code) || []), order]);
      }
    }
    const records = coupons.map(({ _id, usageByUser, reservedCount, ...coupon }) => {
      const codeUsages = byCode.get(coupon.code) || [];
      const codeOrders = ordersByCode.get(coupon.code) || [];
      return {
        ...coupon,
        actualUsageCount: codeUsages.length || Number(coupon.usageCount) || 0,
        totalDiscountProvided: codeUsages.reduce((sum, usage) => sum + Number(usage.discountAmount || 0), 0),
        successfulOrders: codeOrders.length,
        generatedOrderValue: codeOrders.reduce((sum, order) => sum + Number(order.grandTotal || order.total || 0), 0),
        redemptions: codeUsages.map((usage) => ({
          id: usage.id,
          userId: usage.userId,
          userName: usage.userName || 'Customer',
          userPhone: usage.userPhone || '',
          orderId: usage.orderId || '',
          discountAmount: Number(usage.discountAmount || 0),
          orderValue: Number(usage.orderValue || 0),
          redeemedAt: usage.redeemedAt || usage.createdAt,
        })),
      };
    });
    const now = new Date();
    const expired = coupons.filter((c) => c.expiryDate && new Date(c.expiryDate) < now).length;
    res.json({
      success: true,
      data: {
        totals: {
          totalCoupons: coupons.length,
          activeCoupons: coupons.filter((c) => c.isActive !== false && (!c.startDate || new Date(c.startDate) <= now) && (!c.expiryDate || new Date(c.expiryDate) >= now) && (!(Number(c.totalUsageLimit) > 0) || Number(c.usageCount || 0) + Number(c.reservedCount || 0) < Number(c.totalUsageLimit))).length,
          expiredCoupons: expired,
          totalUsage: usages.length,
          totalDiscounts: usages.reduce((sum, usage) => sum + Number(usage.discountAmount || 0), 0),
        },
        coupons: records,
        usageHistory: usages.map(({ _id, ...usage }) => usage),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
