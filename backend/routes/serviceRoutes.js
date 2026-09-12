import express from 'express';
import { getServices, getServiceById, createService } from '../controllers/serviceController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getServices);
router.get('/:id', getServiceById);
router.post('/', protect, authorize('admin'), createService);

export default router;
