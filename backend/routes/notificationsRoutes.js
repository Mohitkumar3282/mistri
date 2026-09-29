import express from 'express';
import { getMyNotifications } from '../controllers/userNotificationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// /api/notifications - broadcasts to everyone, plus anything sent to this account by name.
router.get('/', protect, getMyNotifications);

export default router;
