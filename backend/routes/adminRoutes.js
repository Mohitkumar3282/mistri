import express from 'express';
import { getAdminStats, getUsers, notificationCrud } from '../controllers/adminController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { adminRouter } from './routeFactory.js';

const router = express.Router();

// Every admin endpoint requires a signed-in administrator.
router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.use('/notifications', adminRouter(notificationCrud));

export default router;
