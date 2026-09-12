import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    mistri: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mistri',
      default: null,
    },
    bookingDate: {
      type: String,
      required: [true, 'Please select a service date'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Please select a time slot'],
      enum: ['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM', '04:00 PM - 06:00 PM', '06:00 PM - 08:00 PM'],
    },
    serviceAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
      landmark: { type: String, default: '' },
    },
    problemDescription: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['Cash on Service', 'UPI / Online', 'Card'],
      default: 'Cash on Service',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded'],
      default: 'Pending',
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
