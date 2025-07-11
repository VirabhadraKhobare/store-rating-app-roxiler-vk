const express = require('express');
const router = express.Router();

// Import controllers and middleware
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { 
  validateUserRegistration, 
  validateUserLogin, 
  validatePasswordUpdate 
} = require('../middleware/validation');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new normal user
 * @access  Public
 */
router.post('/register', validateUserRegistration, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateUserLogin, authController.login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, authController.getProfile);

/**
 * @route   PUT /api/auth/password
 * @desc    Update user password
 * @access  Private
 */
router.put('/password', authenticate, validatePasswordUpdate, authController.updatePassword);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @route   GET /api/auth/verify
 * @desc    Verify JWT token
 * @access  Private
 */
router.get('/verify', authenticate, authController.verifyToken);

module.exports = router;