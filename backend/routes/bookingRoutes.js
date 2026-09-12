import express from 'express';
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/', protect, authorize('admin'), getAllBookings);
router.patch('/:id/status', protect, updateBookingStatus);

export default router;
