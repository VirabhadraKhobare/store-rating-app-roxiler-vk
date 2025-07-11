const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Generate JWT token for user
 * @param {object} user - User object
 * @returns {string} - JWT token
 */
const generateToken = (user) => {
  try {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };
    
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
      issuer: 'store-rating-app',
      audience: 'store-rating-users'
    });
    
    return token;
  } catch (error) {
    console.error('Error generating JWT token:', error);
    throw new Error('Token generation failed');
  }
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {object} - Decoded token payload
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret, {
      issuer: 'store-rating-app',
      audience: 'store-rating-users'
    });
    
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} - Extracted token or null
 */
const extractTokenFromHeader = (authHeader) => {
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

module.exports = {
  generateToken,
  verifyToken,
  extractTokenFromHeader
};