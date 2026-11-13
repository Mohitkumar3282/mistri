import express from 'express';
import { getAdminStats, getUsers, createUser, updateUser, deleteUser, notificationCrud } from '../controllers/adminController.js';
import { sendNotification, listSentNotifications } from '../controllers/userNotificationController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { adminRouter } from './routeFactory.js';
import { adminReferralData, saveReferralConfig, updateReferralUser, updateReferralStatus } from '../controllers/referralController.js';
import { couponAnalytics } from '../controllers/couponController.js';

const router = express.Router();

// Every admin endpoint requires a signed-in administrator.
router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/coupons/analytics', couponAnalytics);
router.get('/referrals', adminReferralData);
router.put('/referrals/config', saveReferralConfig);
router.patch('/referrals/users/:id', updateReferralUser);
router.patch('/referrals/:id/status', updateReferralStatus);
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.use('/notifications', adminRouter(notificationCrud));

// Notifications the admin sends out to customers (all, or one by name).
router.route('/send-notification').get(listSentNotifications).post(sendNotification);

export default router;
