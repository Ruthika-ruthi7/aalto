const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/auth');

// Validation rules
const blogValidation = [
  body('title').optional().isLength({ max: 255 }).withMessage('Title must be less than 255 characters'),
  body('description').optional().isLength({ max: 255 }).withMessage('Description must be less than 255 characters'),
  body('author').optional().isLength({ max: 100 }).withMessage('Author must be less than 100 characters'),
  body('featured_image').optional().isLength({ max: 255 }).withMessage('Featured image path must be less than 255 characters'),
  body('category').optional().isLength({ max: 100 }).withMessage('Category must be less than 100 characters'),
  body('publish_date').optional().isISO8601().withMessage('Invalid publish date format'),
  body('status').optional().isIn(['ACTIVE', 'CLOSED', 'draft', 'published', 'unpublished']).withMessage('Invalid status')
];

// Routes
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.post('/', blogValidation, blogController.createBlog);
router.put('/:id', blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);

module.exports = router;
