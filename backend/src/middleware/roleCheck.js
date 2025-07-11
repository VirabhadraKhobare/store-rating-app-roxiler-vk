const { sendForbidden } = require('../utils/responseUtils');

/**
 * Role-based access control middleware
 * @param {array} allowedRoles - Array of allowed roles
 * @returns {function} - Express middleware function
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user is attached to request (authentication should happen first)
      if (!req.user) {
        return sendForbidden(res, 'Authentication required');
      }
      
      // Check if user's role is in allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return sendForbidden(res, `Access denied. Required roles: ${allowedRoles.join(', ')}`);
      }
      
      next();
    } catch (error) {
      console.error('Role check middleware error:', error);
      return sendForbidden(res, 'Access denied');
    }
  };
};

/**
 * Specific role middleware functions for convenience
 */
const requireAdmin = requireRole(['system_admin']);
const requireUser = requireRole(['normal_user']);
const requireStoreOwner = requireRole(['store_owner']);
const requireAdminOrStoreOwner = requireRole(['system_admin', 'store_owner']);
const requireUserOrStoreOwner = requireRole(['normal_user', 'store_owner']);

module.exports = {
  requireRole,
  requireAdmin,
  requireUser,
  requireStoreOwner,
  requireAdminOrStoreOwner,
  requireUserOrStoreOwner
};