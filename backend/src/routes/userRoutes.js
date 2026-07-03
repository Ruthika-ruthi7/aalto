const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Validation rules
const userValidation = [
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['Super Admin', 'Admin', 'Editor', 'HR', 'Viewer']).withMessage('Invalid role'),
  body('status').isIn(['active', 'inactive']).withMessage('Invalid status')
];

const updateUserValidation = [
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('role').isIn(['Super Admin', 'Admin', 'Editor', 'HR', 'Viewer']).withMessage('Invalid role'),
  body('status').isIn(['active', 'inactive']).withMessage('Invalid status')
];

// Routes
router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.post('/', authMiddleware, userValidation, userController.createUser);
router.put('/:id', authMiddleware, updateUserValidation, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);
router.patch('/:id/toggle-status', authMiddleware, userController.toggleUserStatus);

module.exports = router;
