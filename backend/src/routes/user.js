// src/routes/user.js
const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { requireUser } = require('../middleware/roleCheck');
const { validateRatingSubmission } = require('../middleware/validation');

// Apply authentication and user role check
router.use(authenticate);
router.use(requireUser);

/**
 * @route   GET /api/user/stores
 * @desc    Get all stores with user's ratings
 * @access  Normal User only
 */
router.get('/stores', userController.getStores);

/**
 * @route   POST /api/user/ratings
 * @desc    Submit or update rating for a store
 * @access  Normal User only
 */
router.post('/ratings', validateRatingSubmission, userController.submitRating);

module.exports = router;