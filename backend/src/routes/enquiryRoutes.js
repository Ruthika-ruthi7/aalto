const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const enquiryController = require('../controllers/enquiryController');
const authMiddleware = require('../middleware/auth');
const { checkPermission } = require('../middleware/rbac');

// Validation rules
const enquiryValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('mobile').notEmpty().withMessage('Mobile is required'),
  body('subject').optional().isLength({ max: 255 }).withMessage('Subject must be less than 255 characters'),
  body('message').notEmpty().withMessage('Message is required'),
  body('assigned_to').optional().isLength({ max: 100 }).withMessage('Assigned to must be less than 100 characters'),
  body('status').optional().isIn(['NEW', 'IN PROGRESS', 'CLOSED', 'new', 'start_working', 'on_hold', 'spam', 'closed']).withMessage('Invalid status')
];

// Routes
router.get('/', authMiddleware, checkPermission('Enquiries', 'read'), enquiryController.getAllEnquiries);
router.get('/:id', authMiddleware, checkPermission('Enquiries', 'read'), enquiryController.getEnquiryById);
router.post('/', authMiddleware, checkPermission('Enquiries', 'create'), enquiryValidation, enquiryController.createEnquiry);
router.put('/:id', authMiddleware, checkPermission('Enquiries', 'update'), enquiryController.updateEnquiry);
router.delete('/:id', authMiddleware, checkPermission('Enquiries', 'delete'), enquiryController.deleteEnquiry);

module.exports = router;
