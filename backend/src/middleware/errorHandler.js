const { sendError } = require('../utils/responseUtils');
const config = require('../config/config');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err);

  // Default error
  let error = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal Server Error'
  };

  // Specific error types
  if (err.name === 'ValidationError') {
    // Mongoose validation error
    error.statusCode = 400;
    error.message = 'Validation Error';
  } else if (err.code === '23505') {
    // PostgreSQL unique constraint violation
    error.statusCode = 409;
    error.message = 'Resource already exists';
  } else if (err.code === '23503') {
    // PostgreSQL foreign key constraint violation
    error.statusCode = 400;
    error.message = 'Invalid reference to related resource';
  } else if (err.code === '42P01') {
    // PostgreSQL table does not exist
    error.statusCode = 500;
    error.message = 'Database configuration error';
  } else if (err.name === 'JsonWebTokenError') {
    error.statusCode = 401;
    error.message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    error.statusCode = 401;
    error.message = 'Token expired';
  }

  // Don't leak error details in production
  if (config.nodeEnv === 'production') {
    if (error.statusCode === 500) {
      error.message = 'Internal Server Error';
    }
  }

  sendError(res, error.statusCode, error.message);
};

/**
 * 404 handler for unmatched routes
 */
const notFoundHandler = (req, res) => {
  sendError(res, 404, `Route ${req.originalUrl} not found`);
};

module.exports = {
  errorHandler,
  notFoundHandler
};