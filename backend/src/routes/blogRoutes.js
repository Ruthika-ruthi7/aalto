const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/auth');
const { checkPermission } = require('../middleware/rbac');

// Validation rules
const blogValidation = [
  body('title').optional().isLength({ max: 255 }).withMessage('Title must be less than 255 characters'),
  body('description').optional().isLength({ max: 255 }).withMessage('Description must be less than 255 characters'),
  body('author').optional().isLength({ max: 100 }).withMessage('Author must be less than 100 characters'),
  body('featured_image').optional().isLength({ max: 255 }).withMessage('Featured image path must be less than 255 characters'),
  body('category').optional().isLength({ max: 100 }).withMessage('Category must be less than 100 characters'),
  body('publish_date').optional().isISO8601().withMessage('Invalid publish date format'),
  body('status').optional().isIn(['ACTIVE', 'CLOSED', 'draft', 'published', 'scheduled', 'archived', 'unpublished']).withMessage('Invalid status')
];

// Routes
router.get('/', authMiddleware, checkPermission('Blogs', 'read'), blogController.getAllBlogs);
router.get('/:id', authMiddleware, checkPermission('Blogs', 'read'), blogController.getBlogById);
router.post('/', authMiddleware, checkPermission('Blogs', 'create'), blogValidation, blogController.createBlog);
router.put('/:id', authMiddleware, checkPermission('Blogs', 'update'), blogController.updateBlog);
router.delete('/:id', authMiddleware, checkPermission('Blogs', 'delete'), blogController.deleteBlog);

module.exports = router;
