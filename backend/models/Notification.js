import { createAppModel, Mixed } from './appModel.js';

// Admin panel notifications. The server creates these when customers place orders,
// bookings, quotation requests or support messages.
const Notification = createAppModel('Notification', {
  collection: 'admin_notifications',
  fields: {
    type: Mixed,
    title: Mixed,
    message: Mixed,
    orderId: Mixed,
    amount: Mixed,
    unread: Mixed,
    createdAt: Mixed,
  },
});

export default Notification;
