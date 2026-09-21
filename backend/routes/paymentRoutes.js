import express from 'express';
import {
  getRazorpayKey,
  createRazorpayOrder,
  verifyPayment,
} from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/key', getRazorpayKey);

// Payments are tied to the shopper's account so they can only be used for their order.
router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);

export default router;
