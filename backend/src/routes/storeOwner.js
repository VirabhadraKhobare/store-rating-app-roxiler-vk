// src/routes/storeOwner.js
const express = require('express');
const router = express.Router();

const storeOwnerController = require('../controllers/storeOwnerController');
const { authenticate } = require('../middleware/auth');
const { requireStoreOwner } = require('../middleware/roleCheck');

// Apply authentication and store owner role check
router.use(authenticate);
router.use(requireStoreOwner);

/**
 * @route   GET /api/store-owner/dashboard
 * @desc    Get store owner dashboard data
 * @access  Store Owner only
 */
router.get('/dashboard', storeOwnerController.getDashboard);

/**
 * @route   GET /api/store-owner/ratings
 * @desc    Get all ratings for owner's store
 * @access  Store Owner only
 */
router.get('/ratings', storeOwnerController.getRatings);

module.exports = router;