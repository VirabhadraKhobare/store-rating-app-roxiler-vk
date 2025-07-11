// src/routes/admin.js
const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roleCheck');
const { validateAdminUserCreation, validateStoreCreation } = require('../middleware/validation');

// Apply authentication and admin role check to all routes
router.use(authenticate);
router.use(requireAdmin);

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get dashboard statistics
 * @access  Admin only
 */
router.get('/dashboard', adminController.getDashboard);

/**
 * @route   POST /api/admin/users
 * @desc    Add new user
 * @access  Admin only
 */
router.post('/users', validateAdminUserCreation, adminController.addUser);

/**
 * @route   POST /api/admin/stores
 * @desc    Add new store
 * @access  Admin only
 */
router.post('/stores', validateStoreCreation, adminController.addStore);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with filtering
 * @access  Admin only
 */
router.get('/users', adminController.getUsers);

/**
 * @route   GET /api/admin/stores
 * @desc    Get all stores with ratings
 * @access  Admin only
 */
router.get('/stores', adminController.getStores);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get user details by ID
 * @access  Admin only
 */
router.get('/users/:id', adminController.getUserById);

module.exports = router;