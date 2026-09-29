import Notification from '../models/Notification.js';
import { sendPushToAdmin } from '../utils/push.js';

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

// Saves the in-app admin notification (always) and, if the admin has registered a
// device, a real push so it reaches them even without the admin panel open.
const record = async (fields) => {
  const doc = await Notification.create({
    unread: true,
    time: 'Just now',
    createdAt: new Date().toISOString(),
    ...fields,
  });
  sendPushToAdmin({
    title: fields.title,
    body: fields.message,
    data: { url: '/admin?tab=orders', orderId: fields.orderId, bookingId: fields.bookingId },
  }).catch((err) => console.warn('Admin push send failed:', err.message));
  return doc;
};

// Each hook runs after a customer-facing record is first created.

export const notifyNewOrder = (order) => {
  const method = order.payment?.method || order.paymentMethod || 'Cash on Delivery';
  const isOnline = /online|upi|card|net banking|wallet/i.test(method);
  const amount = order.grandTotal ?? order.total ?? order.summary?.totalAmount ?? 0;
  return record({
    id: `anot_order_${order.id}`,
    type: 'new_order',
    title: `New ${isOnline ? 'Online' : 'Cash'} Order #${order.id}`,
    message: `${order.customerName || 'A customer'} placed an order for ${inr(amount)} (${method})`,
    orderId: order.id,
    amount,
    paymentMethod: method,
    customerName: order.customerName,
  });
};

export const notifyNewBooking = (booking) =>
  record({
    id: `anot_booking_${booking.id}`,
    type: 'new_booking',
    title: `New Technician Booking #${booking.id}`,
    message: `${booking.customerName || 'A customer'} booked ${booking.serviceTitle || booking.serviceName || 'a service'}`,
    bookingId: booking.id,
  });

export const notifyNewQuotation = (quote) =>
  record({
    id: `anot_quote_${quote.id}`,
    type: 'new_quotation',
    title: `New Quotation Request #${quote.id}`,
    message: `${quote.customerName || quote.name || 'A customer'} requested a quotation`,
    quotationId: quote.id,
  });

export const notifyNewSupportMessage = (msg) =>
  record({
    id: `anot_msg_${msg.id}`,
    type: 'support_message',
    title: `New Support Message${msg.subject ? `: ${msg.subject}` : ''}`,
    message: `${msg.name || msg.email || 'A visitor'} sent a message`,
    messageId: msg.id,
  });
