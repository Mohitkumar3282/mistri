import { createAppModel, Mixed } from './appModel.js';

// Technician service bookings.
const Booking = createAppModel('Booking', {
  collection: 'bookings',
  fields: {
    userId: { type: String, index: true },
    customerName: Mixed,
    customerPhone: Mixed,
    customerEmail: { type: String, lowercase: true, trim: true, index: true },
    serviceId: Mixed,
    serviceTitle: Mixed,
    mistriId: Mixed,
    mistriName: Mixed,
    date: Mixed,
    timeSlot: Mixed,
    address: Mixed,
    status: Mixed,
    paymentStatus: Mixed,
    createdAt: Mixed,
  },
});

export default Booking;
