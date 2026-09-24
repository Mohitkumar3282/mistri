import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes - Verifies JWT bearer token
 */
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mistri_super_secret_jwt_key_2026');

      // A stored user is authoritative. Otherwise fall back to the identity carried
      // by the token itself (covers the built-in admin, which has no DB document).
      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch (err) {
        req.user = null;
      }

      if (req.user && (req.user.status === 'Deactivated' || req.user.status === 'Inactive') && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Your account has been deactivated. Please contact support.',
        });
      }

      if (!req.user) {
        req.user = {
          _id: decoded.id,
          name: decoded.name || 'Demo User',
          role: decoded.role || (decoded.id === 'usr_admin_root' ? 'admin' : 'customer'),
        };
      }

      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed or expired',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

/**
 * Role-based authorization middleware
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role || 'guest'}' is not authorized to access this route`,
      });
    }
    next();
  };
};
