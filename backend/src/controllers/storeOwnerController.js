// src/controllers/storeOwnerController.js
const { query } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/responseUtils');

/**
 * Get store owner dashboard data
 */
const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get store owned by this user
    const storeResult = await query(
      'SELECT id, name, email, address FROM stores WHERE owner_id = $1',
      [userId]
    );

    if (storeResult.rows.length === 0) {
      return sendError(res, 404, 'No store found for this owner');
    }

    const store = storeResult.rows[0];

    // Get average rating and total ratings
    const ratingResult = await query(
      `SELECT 
        COALESCE(AVG(rating), 0) as average_rating,
        COUNT(id) as total_ratings
       FROM ratings 
       WHERE store_id = $1`,
      [store.id]
    );

    const ratingData = ratingResult.rows[0];

    sendSuccess(res, 200, 'Dashboard data retrieved', {
      store: {
        ...store,
        average_rating: parseFloat(ratingData.average_rating).toFixed(1),
        total_ratings: parseInt(ratingData.total_ratings)
      }
    });
  } catch (error) {
    console.error('Store owner dashboard error:', error);
    sendError(res, 500, 'Failed to fetch dashboard data');
  }
};

/**
 * Get users who rated the store
 */
const getRatings = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get store owned by this user
    const storeResult = await query(
      'SELECT id FROM stores WHERE owner_id = $1',
      [userId]
    );

    if (storeResult.rows.length === 0) {
      return sendError(res, 404, 'No store found for this owner');
    }

    const storeId = storeResult.rows[0].id;

    // Get all ratings for this store with user details
    const ratingsResult = await query(
      `SELECT 
        r.id, r.rating, r.created_at,
        u.name as user_name, u.email as user_email
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = $1
       ORDER BY r.created_at DESC`,
      [storeId]
    );

    sendSuccess(res, 200, 'Ratings retrieved successfully', {
      ratings: ratingsResult.rows
    });
  } catch (error) {
    console.error('Get ratings error:', error);
    sendError(res, 500, 'Failed to retrieve ratings');
  }
};

module.exports = {
  getDashboard,
  getRatings
};