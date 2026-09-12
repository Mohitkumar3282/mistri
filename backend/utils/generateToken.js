import jwt from 'jsonwebtoken';

/**
 * Generate a JWT token for authentication
 * @param {string} id - User ID
 * @returns {string} - JWT Token
 */
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'mistri_super_secret_jwt_key_2026', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

export default generateToken;
