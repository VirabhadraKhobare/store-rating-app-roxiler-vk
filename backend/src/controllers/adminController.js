// src/controllers/adminController.js
const { query } = require('../config/database');
const { hashPassword } = require('../utils/passwordUtils');
const { sendSuccess, sendError } = require('../utils/responseUtils');

/**
 * Get dashboard statistics
 */
const getDashboard = async (req, res) => {
  try {
    // Get total counts
    const userCount = await query('SELECT COUNT(*) FROM users');
    const storeCount = await query('SELECT COUNT(*) FROM stores');
    const ratingCount = await query('SELECT COUNT(*) FROM ratings');

    sendSuccess(res, 200, 'Dashboard data retrieved', {
      totalUsers: parseInt(userCount.rows[0].count),
      totalStores: parseInt(storeCount.rows[0].count),
      totalRatings: parseInt(ratingCount.rows[0].count)
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    sendError(res, 500, 'Failed to fetch dashboard data');
  }
};

/**
 * Add new user
 */
const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return sendError(res, 409, 'User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const result = await query(
      `INSERT INTO users (name, email, password, address, role) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, address, role, created_at`,
      [name, email, hashedPassword, address, role]
    );

    sendSuccess(res, 201, 'User created successfully', {
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Add user error:', error);
    sendError(res, 500, 'Failed to create user');
  }
};

/**
 * Add new store
 */
const addStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    // Check if store already exists
    const existingStore = await query('SELECT id FROM stores WHERE email = $1', [email]);
    if (existingStore.rows.length > 0) {
      return sendError(res, 409, 'Store with this email already exists');
    }

    // If ownerId provided, check if it's a valid store owner
    if (ownerId) {
      const owner = await query('SELECT id FROM users WHERE id = $1 AND role = $2', [ownerId, 'store_owner']);
      if (owner.rows.length === 0) {
        return sendError(res, 400, 'Invalid store owner ID');
      }
    }

    // Create store
    const result = await query(
      `INSERT INTO stores (name, email, address, owner_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, address, owner_id, created_at`,
      [name, email, address, ownerId || null]
    );

    sendSuccess(res, 201, 'Store created successfully', {
      store: result.rows[0]
    });
  } catch (error) {
    console.error('Add store error:', error);
    sendError(res, 500, 'Failed to create store');
  }
};

/**
 * Get all users with filtering
 */
const getUsers = async (req, res) => {
  try {
    const { search, role, sortBy = 'name', sortOrder = 'asc' } = req.query;
    
    let queryText = `
      SELECT id, name, email, address, role, created_at
      FROM users
      WHERE 1=1
    `;
    const queryParams = [];
    let paramCount = 0;

    // Add search filter
    if (search) {
      paramCount++;
      queryText += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount} OR address ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    // Add role filter
    if (role) {
      paramCount++;
      queryText += ` AND role = $${paramCount}`;
      queryParams.push(role);
    }

    // Add sorting
    const validSortFields = ['name', 'email', 'role', 'created_at'];
    const validSortOrders = ['asc', 'desc'];
    
    if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder)) {
      queryText += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    }

    const result = await query(queryText, queryParams);

    sendSuccess(res, 200, 'Users retrieved successfully', {
      users: result.rows
    });
  } catch (error) {
    console.error('Get users error:', error);
    sendError(res, 500, 'Failed to retrieve users');
  }
};

/**
 * Get all stores with filtering and ratings
 */
const getStores = async (req, res) => {
  try {
    const { search, sortBy = 'name', sortOrder = 'asc' } = req.query;
    
    let queryText = `
      SELECT 
        s.id, s.name, s.email, s.address, s.created_at,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const queryParams = [];
    let paramCount = 0;

    // Add search filter
    if (search) {
      paramCount++;
      queryText += ` AND (s.name ILIKE $${paramCount} OR s.email ILIKE $${paramCount} OR s.address ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    queryText += ` GROUP BY s.id, s.name, s.email, s.address, s.created_at`;

    // Add sorting
    const validSortFields = ['name', 'email', 'average_rating', 'total_ratings', 'created_at'];
    const validSortOrders = ['asc', 'desc'];
    
    if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder)) {
      queryText += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    }

    const result = await query(queryText, queryParams);

    sendSuccess(res, 200, 'Stores retrieved successfully', {
      stores: result.rows.map(store => ({
        ...store,
        average_rating: parseFloat(store.average_rating).toFixed(1),
        total_ratings: parseInt(store.total_ratings)
      }))
    });
  } catch (error) {
    console.error('Get stores error:', error);
    sendError(res, 500, 'Failed to retrieve stores');
  }
};

/**
 * Get user details by ID
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT id, name, email, address, role, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return sendError(res, 404, 'User not found');
    }

    const user = result.rows[0];

    // If user is store owner, get their store rating
    if (user.role === 'store_owner') {
      const storeResult = await query(
        `SELECT 
          s.id, s.name, 
          COALESCE(AVG(r.rating), 0) as average_rating,
          COUNT(r.id) as total_ratings
         FROM stores s
         LEFT JOIN ratings r ON s.id = r.store_id
         WHERE s.owner_id = $1
         GROUP BY s.id, s.name`,
        [id]
      );

      if (storeResult.rows.length > 0) {
        user.store = {
          ...storeResult.rows[0],
          average_rating: parseFloat(storeResult.rows[0].average_rating).toFixed(1),
          total_ratings: parseInt(storeResult.rows[0].total_ratings)
        };
      }
    }

    sendSuccess(res, 200, 'User details retrieved', { user });
  } catch (error) {
    console.error('Get user by ID error:', error);
    sendError(res, 500, 'Failed to retrieve user details');
  }
};

module.exports = {
  getDashboard,
  addUser,
  addStore,
  getUsers,
  getStores,
  getUserById
};