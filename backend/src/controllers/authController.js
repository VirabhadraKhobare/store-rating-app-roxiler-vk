const { query } = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/jwtUtils');
const { sendSuccess, sendError, sendUnauthorized } = require('../utils/responseUtils');

/**
 * User registration
 */
const register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    
    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return sendError(res, 409, 'User with this email already exists');
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const result = await query(
      `INSERT INTO users (name, email, password, address, role) 
       VALUES ($1, $2, $3, $4, 'normal_user') 
       RETURNING id, name, email, address, role, created_at`,
      [name, email, hashedPassword, address]
    );
    
    const user = result.rows[0];
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Return user data and token
    sendSuccess(res, 201, 'User registered successfully', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        createdAt: user.created_at
      },
      token
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    sendError(res, 500, 'Registration failed');
  }
};

/**
 * User login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const result = await query(
      'SELECT id, name, email, password, address, role FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return sendUnauthorized(res, 'Invalid email or password');
    }
    
    const user = result.rows[0];
    
    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      return sendUnauthorized(res, 'Invalid email or password');
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Return user data and token (exclude password)
    sendSuccess(res, 200, 'Login successful', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role
      },
      token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, 500, 'Login failed');
  }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res) => {
  try {
    // User is already attached to req by authentication middleware
    const user = req.user;
    
    sendSuccess(res, 200, 'Profile retrieved successfully', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    sendError(res, 500, 'Failed to retrieve profile');
  }
};

/**
 * Update user password
 */
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    
    // Get current user with password
    const userResult = await query(
      'SELECT password FROM users WHERE id = $1',
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      return sendError(res, 404, 'User not found');
    }
    
    const user = userResult.rows[0];
    
    // Verify current password
    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      return sendUnauthorized(res, 'Current password is incorrect');
    }
    
    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);
    
    // Update password
    await query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedNewPassword, userId]
    );
    
    sendSuccess(res, 200, 'Password updated successfully');
    
  } catch (error) {
    console.error('Update password error:', error);
    sendError(res, 500, 'Failed to update password');
  }
};

/**
 * Logout (client-side token removal)
 */
const logout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is primarily handled client-side
    // Server can optionally maintain a blacklist of tokens
    
    sendSuccess(res, 200, 'Logged out successfully', {
      message: 'Please remove the token from client storage'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    sendError(res, 500, 'Logout failed');
  }
};

/**
 * Verify token endpoint
 */
const verifyToken = async (req, res) => {
  try {
    // If we reach here, authentication middleware has already verified the token
    const user = req.user;
    
    sendSuccess(res, 200, 'Token is valid', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Verify token error:', error);
    sendError(res, 500, 'Token verification failed');
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updatePassword,
  logout,
  verifyToken
};