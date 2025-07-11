/**
 * Send successful response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {object} data - Response data
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Send error response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {array} errors - Array of error details
 */
const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
};

/**
 * Send validation error response
 * @param {object} res - Express response object
 * @param {array} errors - Array of validation errors
 */
const sendValidationError = (res, errors) => {
  return sendError(res, 400, 'Validation failed', errors);
};

/**
 * Send unauthorized response
 * @param {object} res - Express response object
 * @param {string} message - Custom message
 */
const sendUnauthorized = (res, message = 'Unauthorized access') => {
  return sendError(res, 401, message);
};

/**
 * Send forbidden response
 * @param {object} res - Express response object
 * @param {string} message - Custom message
 */
const sendForbidden = (res, message = 'Access forbidden') => {
  return sendError(res, 403, message);
};

/**
 * Send not found response
 * @param {object} res - Express response object
 * @param {string} message - Custom message
 */
const sendNotFound = (res, message = 'Resource not found') => {
  return sendError(res, 404, message);
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  sendUnauthorized,
  sendForbidden,
  sendNotFound
};