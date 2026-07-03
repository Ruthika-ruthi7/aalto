const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');
require('dotenv').config();

// Login
const login = async (req, res) => {
  try {
    const { email, password, remember_me } = req.body;

    // Find user by username (email field doesn't exist, using User_name)
    const [users] = await pool.query(
      'SELECT * FROM admin_users WHERE User_name = ?',
      [email]
    );

    if (users.length === 0) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const user = users[0];

    // Verify password (stored in plain text in existing database)
    if (user.User_password !== password) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Generate tokens
    const tokenExpiry = remember_me ? '7d' : process.env.JWT_EXPIRES_IN || '1h';
    
    const accessToken = jwt.sign(
      { 
        id: user.User_id, 
        username: user.User_name, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: tokenExpiry }
    );

    const refreshToken = jwt.sign(
      { id: user.User_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.User_id, refreshToken, expiresAt]
    );

    // Return user data without password
    const { User_password, ...userWithoutPassword } = user;

    successResponse(res, {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: remember_me ? 604800 : 3600,
      user: {
        id: user.User_id,
        username: user.User_name,
        role: user.role,
        Bu_id: user.Bu_id,
        permissions: user.permissions
      }
    }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    errorResponse(res, 'Login failed', 500, error);
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT User_id, User_name, role, Bu_id, permissions, created_at FROM admin_users WHERE User_id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return errorResponse(res, 'User not found', 404);
    }

    const user = users[0];
    successResponse(res, {
      id: user.User_id,
      username: user.User_name,
      role: user.role,
      Bu_id: user.Bu_id,
      permissions: user.permissions,
      created_at: user.created_at
    }, 'User retrieved successfully');
  } catch (error) {
    console.error('Get current user error:', error);
    errorResponse(res, 'Failed to retrieve user', 500, error);
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return errorResponse(res, 'Refresh token is required', 400);
    }

    // Verify refresh token
    const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);

    // Check if refresh token exists in database and is not revoked
    const [tokens] = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token = ? AND user_id = ? AND is_revoked = FALSE AND expires_at > NOW()',
      [refresh_token, decoded.id]
    );

    if (tokens.length === 0) {
      return errorResponse(res, 'Invalid or expired refresh token', 401);
    }

    // Get user
    const [users] = await pool.query(
      'SELECT * FROM admin_users WHERE User_id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return errorResponse(res, 'User not found', 404);
    }

    const user = users[0];

    // Generate new access token
    const accessToken = jwt.sign(
      { 
        id: user.User_id, 
        username: user.User_name, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    successResponse(res, {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600
    }, 'Token refreshed successfully');
  } catch (error) {
    console.error('Refresh token error:', error);
    errorResponse(res, 'Failed to refresh token', 401, error);
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (refresh_token) {
      // Revoke refresh token
      await pool.query(
        'UPDATE refresh_tokens SET is_revoked = TRUE, revoked_at = NOW() WHERE token = ?',
        [refresh_token]
      );
    }

    successResponse(res, null, 'Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    errorResponse(res, 'Logout failed', 500, error);
  }
};

module.exports = {
  login,
  getCurrentUser,
  refreshToken,
  logout
};
