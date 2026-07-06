const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const upload = require('../config/multer');

// Validation rules
const loginValidation = [
  body('password').notEmpty().withMessage('Password is required'),
  body().custom((value, { req }) => {
    if (!req.body.email && !req.body.username) {
      throw new Error('Email or username is required');
    }
    return true;
  })
];

// Routes
router.post('/login', loginValidation, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.getCurrentUser);
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, upload.single('profile_image'), authController.updateProfile);
router.post('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
