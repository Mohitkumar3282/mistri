import express from 'express';
import { getAdminStats, getUsers, createUser, updateUser, deleteUser, notificationCrud } from '../controllers/adminController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { adminRouter } from './routeFactory.js';

const router = express.Router();

// Every admin endpoint requires a signed-in administrator.
router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.use('/notifications', adminRouter(notificationCrud));

export default router;
