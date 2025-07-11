// src/controllers/userController.js
const { query } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/responseUtils');

/**
 * Get all stores with user's ratings
 */
const getStores = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search } = req.query;
    
    let queryText = `
      SELECT 
        s.id, s.name, s.email, s.address,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_ratings,
        ur.rating as user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = $1
      WHERE 1=1
    `;
    const queryParams = [userId];
    let paramCount = 1;

    // Add search filter
    if (search) {
      paramCount++;
      queryText += ` AND (s.name ILIKE $${paramCount} OR s.address ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    queryText += ` GROUP BY s.id, s.name, s.email, s.address, ur.rating ORDER BY s.name`;

    const result = await query(queryText, queryParams);

    const stores = result.rows.map(store => ({
      ...store,
      average_rating: parseFloat(store.average_rating).toFixed(1),
      total_ratings: parseInt(store.total_ratings),
      user_rating: store.user_rating || null
    }));

    sendSuccess(res, 200, 'Stores retrieved successfully', { stores });
  } catch (error) {
    console.error('Get stores error:', error);
    sendError(res, 500, 'Failed to retrieve stores');
  }
};

/**
 * Submit rating for a store
 */
const submitRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storeId, rating } = req.body;

    // Check if store exists
    const storeResult = await query('SELECT id FROM stores WHERE id = $1', [storeId]);
    if (storeResult.rows.length === 0) {
      return sendError(res, 404, 'Store not found');
    }

    // Insert or update rating
    const result = await query(
      `INSERT INTO ratings (user_id, store_id, rating) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (user_id, store_id) 
       DO UPDATE SET rating = $3, updated_at = CURRENT_TIMESTAMP
       RETURNING id, rating, created_at`,
      [userId, storeId, rating]
    );

    sendSuccess(res, 200, 'Rating submitted successfully', {
      rating: result.rows[0]
    });
  } catch (error) {
    console.error('Submit rating error:', error);
    sendError(res, 500, 'Failed to submit rating');
  }
};

module.exports = {
  getStores,
  submitRating
};