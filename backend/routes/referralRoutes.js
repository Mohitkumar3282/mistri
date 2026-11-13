import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { referralSummary, walletHistory } from '../controllers/referralController.js';

const router = express.Router();
router.use(protect);
router.get('/me', referralSummary);
router.get('/wallet', walletHistory);
export default router;
