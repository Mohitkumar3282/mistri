import express from 'express';
import {
  getAdminStats,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getQuotations,
  updateQuotation,
  getSettings,
  updateSettings,
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/stats', getAdminStats);
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:code', updateCoupon);
router.delete('/coupons/:code', deleteCoupon);
router.get('/quotations', getQuotations);
router.put('/quotations/:id', updateQuotation);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;
