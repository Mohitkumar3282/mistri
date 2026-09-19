import express from 'express';
import {
  getRazorpayKey,
  createRazorpayOrder,
  verifyPayment,
} from '../controllers/paymentController.js';

const router = express.Router();

router.get('/key', getRazorpayKey);
router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyPayment);

export default router;
