const { verifyToken, extractTokenFromHeader } = require('../utils/jwtUtils');
const { sendUnauthorized } = require('../utils/responseUtils');
const { query } = require('../config/database');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return sendUnauthorized(res, 'Access token is required');
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database to ensure user still exists
    const userResult = await query(
      'SELECT id, name, email, role, address FROM users WHERE id = $1',
      [decoded.userId]
    );
    
    if (userResult.rows.length === 0) {
      return sendUnauthorized(res, 'User not found');
    }
    
    // Attach user to request object
    req.user = userResult.rows[0];
    req.token = token;
    
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return sendUnauthorized(res, error.message);
  }
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't require authentication
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (token) {
      const decoded = verifyToken(token);
      const userResult = await query(
        'SELECT id, name, email, role, address FROM users WHERE id = $1',
        [decoded.userId]
      );
      
      if (userResult.rows.length > 0) {
        req.user = userResult.rows[0];
        req.token = token;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth
};