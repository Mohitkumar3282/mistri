import Order from '../models/Order.js';
import PaymentIntent from '../models/PaymentIntent.js';
import buildCrud from './crudFactory.js';
import { notifyNewOrder } from './notificationHooks.js';
import { priceCart } from '../utils/orderPricing.js';
import { confirmPayment, sandboxAllowed } from '../utils/razorpay.js';
import { sendPushToOwner } from '../utils/push.js';
import { nextSequence } from '../utils/counters.js';
import { getReferralConfig, processCompletedOrder } from '../services/referrals.js';
import User from '../models/User.js';
import { WalletTransaction } from '../models/Referral.js';
import { consumeCouponUse, releaseCouponUse, reserveCouponUse, restoreCouponUsageForOrder } from '../services/coupons.js';

/**
 * Material orders
 * @route /api/orders  - customers create/read their own, admins manage all
 */
const handleOrderUpdate = async (order) => {
  const status = `${String(order.statusCode || '').toLowerCase()} ${String(order.status || '').toLowerCase()}`;
  if (status.includes('cancel')) await restoreCouponUsageForOrder(order);
  await processCompletedOrder(order);
};
const orderCrud = buildCrud(Order, { scopeToOwner: true, onCreate: notifyNewOrder, onUpdate: handleOrderUpdate });
export default orderCrud;

const ONLINE_METHOD = /online|upi|card|net ?banking|wallet|razorpay|phonepe|paytm|google pay|gpay/i;

// Presentation details the customer chooses; everything priced or status-related is
// decided on the server.
const CUSTOMER_FIELDS = [
  'customerName',
  'customerPhone',
  'deliverySlot',
  'vehicleAccess',
  'unloadingNotes',
  'siteAddress',
  'shippingAddress',
  'expectedDelivery',
  'deliveryDate',
  'deliveryMessage',
  'isAfter8PMOrder',
  'deliveryOption',
  'date',
  'time',
  'driverName',
  'driverPhone',
  'vehicleNumber',
];

const fail = (res, status, message) => res.status(status).json({ success: false, message });
const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

// Sequential and short (MST-1, MST-2, ...) rather than a random 6-digit id, so order
// numbers are easy to read out over the phone and reference in invoices.
const newOrderId = async () => `MST-${await nextSequence('orderNumber')}`;

const initialTracking = (body) => ({
  currentStep: 2,
  driverName: body?.tracking?.driverName || body?.driverName || '',
  driverPhone: body?.tracking?.driverPhone || body?.driverPhone || '',
  vehicleNumber: body?.tracking?.vehicleNumber || body?.vehicleNumber || '',
  liveEtaMinutes: 720,
  steps: [
    { title: 'Order Placed', time: 'Just now', done: true, desc: 'Material order received & approved' },
    { title: 'Order Confirmed', time: 'In Progress', done: true, desc: 'Depot stock allocated' },
    { title: 'Warehouse Dispatch', time: 'Pending', done: false, desc: 'Will load on crane vehicle' },
    { title: 'In Transit', time: 'Pending', done: false, desc: 'En route to construction site' },
    { title: 'Out for Delivery', time: 'Pending', done: false, desc: 'Driver will call 30 mins prior' },
    { title: 'Delivered & Unloaded', time: 'Pending', done: false, desc: 'Site sign-off required' },
  ],
});

/**
 * @desc  Place an order. Customers send what they want (products, quantities, variants,
 *        coupon, delivery details); the server prices it from the database. Online
 *        orders must carry a Razorpay payment that the server confirms for exactly the
 *        amount it asked the gateway to collect.
 * @route POST /api/orders
 * @access Private
 */
export const placeOrder = async (req, res) => {
  // Administrators may record orders directly (e.g. taken over the phone).
  if (req.user.role === 'admin') return orderCrud.upsert(req, res);

  const body = req.body || {};
  const payment = body.payment || {};
  const methodLabel = String(body.paymentMethod || payment.method || 'Cash on Delivery');
  const isWallet = /mistri wallet/i.test(methodLabel);
  const isOnline = ONLINE_METHOD.test(methodLabel) && !/cash/i.test(methodLabel) && !isWallet;
  const userId = String(req.user._id);

  let lines;
  let totals;
  let couponCode;
  let paymentStatus;
  let gateway;
  const reservedCoupons = [];
  let couponOwnerUserId = null;
  let couponDiscounts = [];
  let intentId = null;
  const razorpayOrderId = payment.razorpayOrderId || body.razorpayOrderId || null;
  const razorpayPaymentId = payment.razorpayPaymentId || body.razorpayPaymentId || null;
  const razorpaySignature = payment.razorpaySignature || body.razorpaySignature || null;

  try {
    if (isOnline) {
      if (!razorpayOrderId || !razorpayPaymentId) {
        return fail(res, 400, 'Online orders need a completed payment');
      }

      // Claim the payment first so it can never be used for two orders.
      const intent = await PaymentIntent.findOneAndUpdate(
        { id: razorpayOrderId, userId, status: 'created' },
        { $set: { status: 'used' } },
        { new: true }
      ).lean();
      if (!intent) {
        const existing = await PaymentIntent.findOne({ id: razorpayOrderId }).lean();
        if (existing?.status === 'used') return fail(res, 409, 'This payment has already been used for an order');
        return fail(res, 400, 'This payment was not started from your account');
      }
      intentId = intent.id;

      const isSandbox = intent.id.startsWith('order_local_') || !razorpaySignature;
      if (isSandbox) {
        if (!sandboxAllowed()) {
          await PaymentIntent.updateOne({ id: intentId }, { $set: { status: 'created' } });
          return fail(res, 400, 'Payment could not be verified');
        }
        paymentStatus = 'Paid (Sandbox)';
        gateway = 'Razorpay Sandbox (not verified)';
      } else {
        const result = await confirmPayment({
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          expectedAmountPaise: intent.amountPaise,
        });
        if (!result.ok) {
          await PaymentIntent.updateOne({ id: intentId }, { $set: { status: 'created' } });
          return fail(res, 400, `Payment could not be verified: ${result.reason}`);
        }
        paymentStatus = 'Paid';
        gateway = 'Razorpay';
      }

      // The order is exactly what was priced and paid for.
      ({ lines, totals, couponCode, couponDiscounts = [] } = intent);
      couponOwnerUserId = intent.couponOwnerUserId || null;
    } else {
      ({ lines, totals, couponCode, couponDiscounts = [] } = await priceCart({
        items: body.items,
        couponCode: body.couponCode,
        userId,
        includeUnloading: Boolean(body.includeUnloading ?? body.isUnloadingSelected ?? false),
        deliveryOption: body.deliveryOption === 'express' ? 'express' : 'normal',
      }));
      if (isWallet) {
        const config = await getReferralConfig();
        if (!config.useForPurchases) return fail(res, 403, 'Referral wallet funds are not enabled for purchases');
        paymentStatus = 'Paid (Mistri Wallet)';
        gateway = 'Mistri Wallet';
      } else {
        paymentStatus = 'Pending (Pay on Site)';
        gateway = 'Cash On Site';
      }
    }

    const id = await newOrderId();
    const now = new Date();
    let walletDebit = null;
    if (isWallet) {
      const transactionId = `PUR-${id}`;
      await User.updateOne({ _id: userId, walletBalance: { $exists: false } }, { $set: { walletBalance: 0 } });
      walletDebit = await User.findOneAndUpdate(
        { _id: userId, walletBalance: { $gte: totals.grandTotal }, walletTransactionIds: { $ne: transactionId } },
        { $inc: { walletBalance: -totals.grandTotal }, $addToSet: { walletTransactionIds: transactionId } },
        { new: true }
      ).select('walletBalance').lean();
      if (!walletDebit) return fail(res, 400, 'Wallet balance is insufficient or the wallet transaction was already used');
    }
    if (couponCode && !isOnline) {
      try {
        const codes = couponCode.split(',').filter(Boolean);
        for (const code of codes) {
          reservedCoupons.push(await reserveCouponUse({
            code,
            userId,
            referenceId: id,
            discountAmount: couponDiscounts.find((item) => item.code === code)?.amount || 0,
            orderValue: totals.subtotal,
            userName: req.user.name || '',
            userPhone: req.user.phone || '',
          }));
        }
      } catch (error) {
        await Promise.all(reservedCoupons.map((reservation) => releaseCouponUse({ code: reservation.code, userId, referenceId: reservation.referenceId }).catch(() => {})));
        reservedCoupons.length = 0;
        if (walletDebit) {
          await User.updateOne({ _id: userId }, { $inc: { walletBalance: totals.grandTotal }, $pull: { walletTransactionIds: `PUR-${id}` } });
        }
        throw error;
      }
    }
    const customer = Object.fromEntries(CUSTOMER_FIELDS.filter((f) => body[f] !== undefined).map((f) => [f, body[f]]));

    const order = {
      ...customer,
      id,
      orderNumber: id,
      userId,
      customerEmail: req.user.email ? String(req.user.email).toLowerCase() : undefined,
      createdAt: now.toISOString(),
      date: customer.date || now.toISOString().split('T')[0],
      status: 'Confirmed',
      statusCode: 'confirmed',
      items: lines,
      itemCount: lines.reduce((acc, l) => acc + l.quantity, 0),
      couponCode: couponCode || null,
      ...(couponCode ? { couponOwnerUserId: couponOwnerUserId || reservedCoupons.map((item) => item.ownerUserId).filter(Boolean)[0] || null } : {}),
      grandTotal: totals.grandTotal,
      total: totals.grandTotal,
      summary: {
        subtotal: totals.subtotal,
        bulkDiscount: totals.discount,
        cashbackAmount: totals.cashbackAmount,
        unloadingCharge: totals.unloadingCharge,
        gstAmount: totals.gstAmount,
        deliveryCharge: totals.deliveryFee,
        deliveryOption: body.deliveryOption === 'express' ? 'express' : 'normal',
        expressDeliveryFee: totals.expressDeliveryFee,
        deliveryNote: totals.deliveryNote,
        isGstInclusive: totals.isGstInclusive,
        deliveryType: totals.deliveryType,
        totalAmount: totals.grandTotal,
      },
      paymentMethod: methodLabel,
      paymentStatus,
      payment: {
        method: methodLabel,
        status: paymentStatus,
        gateway,
        transactionId: razorpayPaymentId || `TXN-MST-${now.getTime()}`,
        ...(isOnline ? { razorpayOrderId, razorpayPaymentId } : {}),
      },
      ...(isOnline ? { razorpayPaymentId } : {}),
      tracking: initialTracking(body),
    };

    if (walletDebit) {
      try {
        await WalletTransaction.create({ transactionId: `PUR-${id}`, userId, orderId: id, type: 'adjustment', status: 'Credited', amount: -totals.grandTotal, balanceAfter: walletDebit.walletBalance, description: `Purchase paid from referral wallet for ${id}` });
      } catch (error) {
        await User.updateOne({ _id: userId }, { $inc: { walletBalance: totals.grandTotal }, $pull: { walletTransactionIds: `PUR-${id}` } });
        throw error;
      }
    }

    let saved;
    try {
      saved = (await Order.create(order)).toJSON();
    } catch (err) {
      if (walletDebit) {
        await User.updateOne({ _id: userId }, { $inc: { walletBalance: totals.grandTotal }, $pull: { walletTransactionIds: `PUR-${id}` } });
        await WalletTransaction.deleteOne({ transactionId: `PUR-${id}` });
      }
      if (intentId) await PaymentIntent.updateOne({ id: intentId }, { $set: { status: 'created' } });
      if (err?.code === 11000) return fail(res, 409, 'This payment has already been used for an order');
      throw err;
    }


    if (intentId) await PaymentIntent.updateOne({ id: intentId }, { $set: { orderId: id } });
    if (couponCode) {
      await Promise.all(couponCode.split(',').filter(Boolean).map((code) => consumeCouponUse({ code, userId, referenceId: isOnline ? razorpayOrderId : id, orderId: id })));
    }
    notifyNewOrder(saved).catch((err) => console.warn('Order notification failed:', err.message));
    // Real device push to whoever placed the order, so they know it went through even
    // if they close the tab right after checking out.
    sendPushToOwner(userId, {
      title: `Order Placed Successfully (${saved.id})`,
      body: `Your order for ${inr(saved.grandTotal)} is confirmed. Expected delivery: ${saved.expectedDelivery || 'soon'}.`,
      data: { url: `/order-details?id=${saved.id}`, orderId: saved.id },
    }).catch((err) => console.warn('Customer push send failed:', err.message));

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    await Promise.all(reservedCoupons.map((reservation) => releaseCouponUse({ code: reservation.code, userId, referenceId: reservation.referenceId }).catch(() => {})));
    if (intentId && !error.status) {
      await PaymentIntent.updateOne({ id: intentId }, { $set: { status: 'created' } }).catch(() => {});
    }
    fail(res, error.status || 500, error.message);
  }
};
