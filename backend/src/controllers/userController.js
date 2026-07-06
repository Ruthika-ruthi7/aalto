const { pool } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');
const bcrypt = require('bcryptjs');

// Get all users with pagination and filters
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, username, role, status, last_login, created_at, created_by FROM users WHERE deleted_at IS NULL';
    const params = [];

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (username LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [users] = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE deleted_at IS NULL';
    const countParams = [];

    if (role) {
      countQuery += ' AND role = ?';
      countParams.push(role);
    }

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    if (search) {
      countQuery += ' AND (username LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm);
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    successResponse(res, {
      items: users,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }, 'Users retrieved successfully');
  } catch (error) {
    console.error('Get users error:', error);
    errorResponse(res, 'Failed to retrieve users', 500, error);
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.query('SELECT id, username, role, status, permissions, last_login, created_at FROM users WHERE id = ? AND deleted_at IS NULL', [id]);

    if (users.length === 0) {
      return errorResponse(res, 'User not found', 404);
    }

    successResponse(res, users[0], 'User retrieved successfully');
  } catch (error) {
    console.error('Get user error:', error);
    errorResponse(res, 'Failed to retrieve user', 500, error);
  }
};

// Create user
const createUser = async (req, res) => {
  try {
    const {
      username,
      password,
      role,
      permissions,
      status = 'active'
    } = req.body;

    // Check if username already exists
    const [existingUsername] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUsername.length > 0) {
      return errorResponse(res, 'Username already exists', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users 
       (username, password_hash, role, permissions, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, hashedPassword, role, JSON.stringify(permissions), status, req.user?.id || 1]
    );

    const [newUser] = await pool.query('SELECT id, username, role, status, permissions, last_login, created_at FROM users WHERE id = ?', [result.insertId]);

    successResponse(res, newUser[0], 'User created successfully', 201);
  } catch (error) {
    console.error('Create user error:', error);
    errorResponse(res, 'Failed to create user', 500, error);
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      username,
      password,
      role,
      permissions,
      status
    } = req.body;

    // Check if username already exists (excluding current user)
    const [existingUsername] = await pool.query('SELECT id FROM users WHERE username = ? AND id != ?', [username, id]);
    if (existingUsername.length > 0) {
      return errorResponse(res, 'Username already exists', 400);
    }

    // Build update query dynamically
    let updateQuery = 'UPDATE users SET username = ?, role = ?, permissions = ?, status = ?';
    const updateParams = [username, role, JSON.stringify(permissions), status];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += ', password_hash = ?';
      updateParams.push(hashedPassword);
    }

    updateQuery += ' WHERE id = ? AND deleted_at IS NULL';
    updateParams.push(id);

    const [result] = await pool.query(updateQuery, updateParams);

    if (result.affectedRows === 0) {
      return errorResponse(res, 'User not found', 404);
    }

    const [updatedUser] = await pool.query('SELECT id, username, role, status, permissions, last_login, created_at FROM users WHERE id = ?', [id]);

    successResponse(res, updatedUser[0], 'User updated successfully');
  } catch (error) {
    console.error('Update user error:', error);
    errorResponse(res, 'Failed to update user', 500, error);
  }
};

// Soft Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting super admin
    const [user] = await pool.query('SELECT role FROM users WHERE id = ?', [id]);
    if (user.length > 0 && user[0].role === 'Super Admin') {
      return errorResponse(res, 'Cannot delete Super Admin', 403);
    }

    // Soft delete
    const [result] = await pool.query('UPDATE users SET deleted_at = NOW() WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return errorResponse(res, 'User not found', 404);
    }

    successResponse(res, null, 'User deleted successfully');
  } catch (error) {
    console.error('Delete user error:', error);
    errorResponse(res, 'Failed to delete user', 500, error);
  }
};

// Toggle user status (activate/deactivate)
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const [user] = await pool.query('SELECT status, role FROM users WHERE id = ? AND deleted_at IS NULL', [id]);
    if (user.length === 0) {
      return errorResponse(res, 'User not found', 404);
    }

    // Prevent deactivating super admin
    if (user[0].role === 'Super Admin') {
      return errorResponse(res, 'Cannot deactivate Super Admin', 403);
    }

    const newStatus = user[0].status === 'active' ? 'inactive' : 'active';

    const [result] = await pool.query('UPDATE users SET status = ? WHERE id = ?', [newStatus, id]);

    if (result.affectedRows === 0) {
      return errorResponse(res, 'User not found', 404);
    }

    const [updatedUser] = await pool.query('SELECT id, username, role, status, last_login, created_at FROM users WHERE id = ?', [id]);

    successResponse(res, updatedUser[0], `User ${newStatus} successfully`);
  } catch (error) {
    console.error('Toggle user status error:', error);
    errorResponse(res, 'Failed to toggle user status', 500, error);
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return errorResponse(res, 'New password is required', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query('UPDATE users SET password_hash = ? WHERE id = ? AND deleted_at IS NULL', [hashedPassword, id]);

    if (result.affectedRows === 0) {
      return errorResponse(res, 'User not found', 404);
    }

    successResponse(res, null, 'Password reset successfully');
  } catch (error) {
    console.error('Reset password error:', error);
    errorResponse(res, 'Failed to reset password', 500, error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  resetPassword
};
