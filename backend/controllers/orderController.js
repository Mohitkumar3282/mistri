import Order from '../models/Order.js';
import Coupon from '../models/Coupon.js';
import PaymentIntent from '../models/PaymentIntent.js';
import buildCrud from './crudFactory.js';
import { notifyNewOrder } from './notificationHooks.js';
import { priceCart } from '../utils/orderPricing.js';
import { confirmPayment, sandboxAllowed } from '../utils/razorpay.js';

/**
 * Material orders
 * @route /api/orders  - customers create/read their own, admins manage all
 */
const orderCrud = buildCrud(Order, { scopeToOwner: true, onCreate: notifyNewOrder });
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
  'date',
  'time',
  'driverName',
  'driverPhone',
  'vehicleNumber',
];

const fail = (res, status, message) => res.status(status).json({ success: false, message });

const newOrderId = async () => {
  for (let attempt = 0; attempt < 8; attempt++) {
    const id = `MST-${Math.floor(100000 + Math.random() * 900000)}`;
    if (!(await Order.exists({ id }))) return id;
  }
  return `MST-${Date.now()}`;
};

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
  const isOnline = ONLINE_METHOD.test(methodLabel) && !/cash/i.test(methodLabel);
  const userId = String(req.user._id);

  let lines;
  let totals;
  let couponCode;
  let paymentStatus;
  let gateway;
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
      ({ lines, totals, couponCode } = intent);
    } else {
      ({ lines, totals, couponCode } = await priceCart({
        items: body.items,
        couponCode: body.couponCode,
        includeUnloading: Boolean(body.includeUnloading ?? body.isUnloadingSelected ?? false),
      }));
      paymentStatus = 'Pending (Pay on Site)';
      gateway = 'Cash On Site';
    }

    const id = await newOrderId();
    const now = new Date();
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
      grandTotal: totals.grandTotal,
      total: totals.grandTotal,
      summary: {
        subtotal: totals.subtotal,
        bulkDiscount: totals.discount,
        unloadingCharge: totals.unloadingCharge,
        gstAmount: totals.gstAmount,
        deliveryCharge: totals.deliveryFee,
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

    let saved;
    try {
      saved = (await Order.create(order)).toJSON();
    } catch (err) {
      if (intentId) await PaymentIntent.updateOne({ id: intentId }, { $set: { status: 'created' } });
      if (err?.code === 11000) return fail(res, 409, 'This payment has already been used for an order');
      throw err;
    }

    if (intentId) await PaymentIntent.updateOne({ id: intentId }, { $set: { orderId: id } });
    if (couponCode) {
      // Count the redemption (skipped if an admin stored usageCount as text).
      await Coupon.updateOne(
        { code: couponCode, usageCount: { $not: { $type: 'string' } } },
        { $inc: { usageCount: 1 } }
      ).catch(() => {});
    }
    notifyNewOrder(saved).catch((err) => console.warn('Order notification failed:', err.message));

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    if (intentId && !error.status) {
      await PaymentIntent.updateOne({ id: intentId }, { $set: { status: 'created' } }).catch(() => {});
    }
    fail(res, error.status || 500, error.message);
  }
};
