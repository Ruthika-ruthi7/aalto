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
const { checkPermission } = require('../middleware/rbac');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all notifications for the authenticated user
router.get('/', checkPermission('Notifications', 'read'), getAllNotifications);

// Get unread count
router.get('/unread-count', checkPermission('Notifications', 'read'), getUnreadCount);

// Get notification by ID
router.get('/:id', checkPermission('Notifications', 'read'), getNotificationById);

// Create notification (admin only)
router.post('/', checkPermission('Notifications', 'create'), createNotification);

// Mark notification as read
router.patch('/:id/read', checkPermission('Notifications', 'update'), markAsRead);

// Mark notification as unread
router.patch('/:id/unread', checkPermission('Notifications', 'update'), markAsUnread);

// Mark all notifications as read
router.patch('/mark-all-read', checkPermission('Notifications', 'update'), markAllAsRead);

// Delete notification
router.delete('/:id', checkPermission('Notifications', 'delete'), deleteNotification);

module.exports = router;
