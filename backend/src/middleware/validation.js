const { body, validationResult } = require('express-validator');
const { sendValidationError } = require('../utils/responseUtils');
const { validatePasswordStrength } = require('../utils/passwordUtils');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    return sendValidationError(res, formattedErrors);
  }
  next();
};

/**
 * Custom password validation
 */
const validatePassword = (value) => {
  const validation = validatePasswordStrength(value);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(', '));
  }
  return true;
};

/**
 * Validation rules for user registration
 */
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters long')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .custom(validatePassword),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address cannot exceed 400 characters'),
  
  handleValidationErrors
];

/**
 * Validation rules for user login
 */
const validateUserLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

/**
 * Validation rules for password update
 */
const validatePasswordUpdate = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .custom(validatePassword),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),
  
  handleValidationErrors
];

/**
 * Validation rules for store creation
 */
const validateStoreCreation = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Store name must be between 20 and 60 characters long'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address cannot exceed 400 characters'),
  
  body('ownerId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Owner ID must be a positive integer'),
  
  handleValidationErrors
];

/**
 * Validation rules for rating submission
 */
const validateRatingSubmission = [
  body('storeId')
    .isInt({ min: 1 })
    .withMessage('Store ID must be a positive integer'),
  
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  handleValidationErrors
];

/**
 * Validation rules for admin user creation
 */
const validateAdminUserCreation = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters long')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .custom(validatePassword),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address cannot exceed 400 characters'),
  
  body('role')
    .isIn(['system_admin', 'normal_user', 'store_owner'])
    .withMessage('Role must be system_admin, normal_user, or store_owner'),
  
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validatePasswordUpdate,
  validateStoreCreation,
  validateRatingSubmission,
  validateAdminUserCreation,
  handleValidationErrors
};