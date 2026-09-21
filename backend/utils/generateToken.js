import jwt from 'jsonwebtoken';

/**
 * Generate a JWT token for authentication
 * @param {string} id - User ID
 * @param {string} role - User role, embedded so that role checks still work for
 *                        identities that are not backed by a MongoDB document.
 * @returns {string} - JWT Token
 */
export const generateToken = (id, role = 'customer') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'mistri_super_secret_jwt_key_2026', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

export default generateToken;
