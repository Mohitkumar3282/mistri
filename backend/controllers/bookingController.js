import Booking from '../models/Booking.js';
import { initialBookings, initialServices, initialMistris } from '../utils/mockData.js';

let inMemoryBookings = [...initialBookings];

/**
 * @desc    Create a new service booking
 * @route   POST /api/bookings
 * @access  Private
 */
export const createBooking = async (req, res, next) => {
  try {
    const {
      serviceId,
      mistriId,
      bookingDate,
      timeSlot,
      serviceAddress,
      problemDescription,
      amount,
      paymentMethod,
    } = req.body;

    if (!serviceId || !bookingDate || !timeSlot || !serviceAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide serviceId, bookingDate, timeSlot, and serviceAddress',
      });
    }

    try {
      const booking = await Booking.create({
        customer: req.user._id,
        service: serviceId,
        mistri: mistriId || null,
        bookingDate,
        timeSlot,
        serviceAddress,
        problemDescription: problemDescription || '',
        amount: Number(amount) || 299,
        paymentMethod: paymentMethod || 'Cash on Service',
        paymentStatus: 'Pending',
        status: 'Confirmed',
      });

      const populatedBooking = await Booking.findById(booking._id)
        .populate('service')
        .populate('mistri')
        .populate('customer', 'name email phone');

      return res.status(201).json({ success: true, data: populatedBooking });
    } catch (dbErr) {
      // In-memory fallback
      const foundService = initialServices.find((s) => s._id === serviceId) || {
        _id: serviceId,
        title: 'Selected Service',
        basePrice: amount || 299,
        icon: 'Wrench',
      };
      const foundMistri = mistriId ? initialMistris.find((m) => m._id === mistriId) : null;

      const newBooking = {
        _id: `bok_${Date.now()}`,
        customer: {
          _id: req.user?._id || 'usr_guest',
          name: serviceAddress.fullName || req.user?.name || 'Customer',
          email: req.user?.email || 'customer@example.com',
          phone: serviceAddress.phone || req.user?.phone || '+91 99999 88888',
        },
        service: foundService,
        mistri: foundMistri,
        bookingDate,
        timeSlot,
        serviceAddress,
        problemDescription,
        amount: Number(amount) || foundService.basePrice || 299,
        paymentMethod: paymentMethod || 'Cash on Service',
        paymentStatus: 'Pending',
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
      };

      inMemoryBookings.unshift(newBooking);
      return res.status(201).json({ success: true, data: newBooking });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's bookings
 * @route   GET /api/bookings/my
 * @access  Private
 */
export const getMyBookings = async (req, res, next) => {
  try {
    try {
      const bookings = await Booking.find({ customer: req.user._id })
        .populate('service')
        .populate('mistri')
        .sort({ createdAt: -1 });

      if (bookings && bookings.length > 0) {
        return res.json({ success: true, count: bookings.length, data: bookings });
      }
    } catch (dbErr) {}

    res.json({ success: true, count: inMemoryBookings.length, data: inMemoryBookings });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all bookings (Admin/Dashboard)
 * @route   GET /api/bookings
 * @access  Private (Admin)
 */
export const getAllBookings = async (req, res, next) => {
  try {
    try {
      const bookings = await Booking.find({})
        .populate('service')
        .populate('mistri')
        .populate('customer', 'name email phone')
        .sort({ createdAt: -1 });

      if (bookings && bookings.length > 0) {
        return res.json({ success: true, count: bookings.length, data: bookings });
      }
    } catch (dbErr) {}

    res.json({ success: true, count: inMemoryBookings.length, data: inMemoryBookings });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update booking status (Pending, Confirmed, In Progress, Completed, Cancelled)
 * @route   PATCH /api/bookings/:id/status
 * @access  Private
 */
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const booking = await Booking.findById(id);
      if (booking) {
        booking.status = status || booking.status;
        if (status === 'Completed') {
          booking.paymentStatus = 'Paid';
        }
        await booking.save();
        return res.json({ success: true, data: booking });
      }
    } catch (dbErr) {}

    const bookingIndex = inMemoryBookings.findIndex((b) => b._id === id);
    if (bookingIndex !== -1) {
      inMemoryBookings[bookingIndex].status = status;
      if (status === 'Completed') {
        inMemoryBookings[bookingIndex].paymentStatus = 'Paid';
      }
      return res.json({ success: true, data: inMemoryBookings[bookingIndex] });
    }

    res.status(404).json({ success: false, message: 'Booking not found' });
  } catch (error) {
    next(error);
  }
};
