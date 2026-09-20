import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  updateFcmToken,
  getFcmTokenStatus,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

// Middleware to optionally authenticate if Bearer token is provided
const optionalProtect = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

// FCM Token Endpoints (supports GET for inspection and POST for saving token)
router.route('/fcm-token')
  .get(getFcmTokenStatus)
  .post(optionalProtect, updateFcmToken);

router.route('/fcm-token/')
  .get(getFcmTokenStatus)
  .post(optionalProtect, updateFcmToken);

export default router;

