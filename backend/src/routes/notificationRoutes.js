const express = require('express');
const router = express.Router();
const {
  getAllNotifications,
  getNotificationById,
  createNotification,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all notifications for the authenticated user
router.get('/', getAllNotifications);

// Get unread count
router.get('/unread-count', getUnreadCount);

// Get notification by ID
router.get('/:id', getNotificationById);

// Create notification (admin only)
router.post('/', createNotification);

// Mark notification as read
router.patch('/:id/read', markAsRead);

// Mark notification as unread
router.patch('/:id/unread', markAsUnread);

// Mark all notifications as read
router.patch('/mark-all-read', markAllAsRead);

// Delete notification
router.delete('/:id', deleteNotification);

module.exports = router;
