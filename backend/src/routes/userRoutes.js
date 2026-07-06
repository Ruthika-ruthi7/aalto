const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const { checkPermission } = require('../middleware/rbac');

// Validation rules
const userValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain a number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain a special character'),
  body('role').isIn(['Super Admin', 'Admin', 'Editor', 'HR', 'Viewer']).withMessage('Invalid role'),
  body('status').isIn(['active', 'inactive']).withMessage('Invalid status')
];

const updateUserValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('role').isIn(['Super Admin', 'Admin', 'Editor', 'HR', 'Viewer']).withMessage('Invalid role'),
  body('status').isIn(['active', 'inactive']).withMessage('Invalid status')
];

const resetPasswordValidation = [
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain a number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain a special character')
];

// Routes
router.get('/', authMiddleware, checkPermission('User Management', 'read'), userController.getAllUsers);
router.get('/:id', authMiddleware, checkPermission('User Management', 'read'), userController.getUserById);
router.post('/', authMiddleware, checkPermission('User Management', 'create'), userValidation, userController.createUser);
router.put('/:id', authMiddleware, checkPermission('User Management', 'update'), updateUserValidation, userController.updateUser);
router.delete('/:id', authMiddleware, checkPermission('User Management', 'delete'), userController.deleteUser);
router.patch('/:id/toggle-status', authMiddleware, checkPermission('User Management', 'update'), userController.toggleUserStatus);
router.post('/:id/reset-password', authMiddleware, checkPermission('User Management', 'update'), resetPasswordValidation, userController.resetPassword);

module.exports = router;
