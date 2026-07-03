const { pool } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

// Get all notifications for a user with pagination
const getAllNotifications = async (req, res) => {
  try {
    const userId = req.user?.id || 1; // Default to user ID 1 for now
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const query = `
      SELECT id, user_id, title, module_name, description, is_read, created_at, updated_at
      FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const [notifications] = await pool.query(query, [userId, parseInt(limit), parseInt(offset)]);

    // Get total count
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM notifications WHERE user_id = ?', [userId]);
    const total = countResult[0].total;

    // Get unread count
    const [unreadResult] = await pool.query('SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND is_read = FALSE', [userId]);
    const unread = unreadResult[0].unread;

    successResponse(res, {
      items: notifications,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      unread
    }, 'Notifications retrieved successfully');
  } catch (error) {
    console.error('Get notifications error:', error);
    errorResponse(res, 'Failed to retrieve notifications', 500, error);
  }
};

// Get notification by ID
const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 1;

    const [notifications] = await pool.query(
      'SELECT * FROM notifications WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (notifications.length === 0) {
      return errorResponse(res, 'Notification not found', 404);
    }

    successResponse(res, notifications[0], 'Notification retrieved successfully');
  } catch (error) {
    console.error('Get notification error:', error);
    errorResponse(res, 'Failed to retrieve notification', 500, error);
  }
};

// Create notification
const createNotification = async (req, res) => {
  try {
    const { user_id, title, module_name, description, is_read = false } = req.body;

    if (!user_id || !title || !module_name) {
      return errorResponse(res, 'Missing required fields', 400);
    }

    const [result] = await pool.query(
      'INSERT INTO notifications (user_id, title, module_name, description, is_read) VALUES (?, ?, ?, ?, ?)',
      [user_id, title, module_name, description, is_read]
    );

    const [newNotification] = await pool.query('SELECT * FROM notifications WHERE id = ?', [result.insertId]);

    successResponse(res, newNotification[0], 'Notification created successfully');
  } catch (error) {
    console.error('Create notification error:', error);
    errorResponse(res, 'Failed to create notification', 500, error);
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 1;

    const [result] = await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return errorResponse(res, 'Notification not found', 404);
    }

    const [notification] = await pool.query('SELECT * FROM notifications WHERE id = ?', [id]);

    successResponse(res, notification[0], 'Notification marked as read');
  } catch (error) {
    console.error('Mark as read error:', error);
    errorResponse(res, 'Failed to mark notification as read', 500, error);
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?.id || 1;

    const [result] = await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );

    successResponse(res, { affectedRows: result.affectedRows }, 'All notifications marked as read');
  } catch (error) {
    console.error('Mark all as read error:', error);
    errorResponse(res, 'Failed to mark all notifications as read', 500, error);
  }
};

// Mark notification as unread
const markAsUnread = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 1;

    const [result] = await pool.query(
      'UPDATE notifications SET is_read = FALSE WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return errorResponse(res, 'Notification not found', 404);
    }

    const [notification] = await pool.query('SELECT * FROM notifications WHERE id = ?', [id]);

    successResponse(res, notification[0], 'Notification marked as unread');
  } catch (error) {
    console.error('Mark as unread error:', error);
    errorResponse(res, 'Failed to mark notification as unread', 500, error);
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 1;

    const [result] = await pool.query(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return errorResponse(res, 'Notification not found', 404);
    }

    successResponse(res, null, 'Notification deleted successfully');
  } catch (error) {
    console.error('Delete notification error:', error);
    errorResponse(res, 'Failed to delete notification', 500, error);
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user?.id || 1;

    const [result] = await pool.query(
      'SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );

    successResponse(res, { unread: result[0].unread }, 'Unread count retrieved successfully');
  } catch (error) {
    console.error('Get unread count error:', error);
    errorResponse(res, 'Failed to get unread count', 500, error);
  }
};

module.exports = {
  getAllNotifications,
  getNotificationById,
  createNotification,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
};
