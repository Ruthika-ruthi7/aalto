const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const galleryController = require('../controllers/galleryController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');

// Configure multer for memory storage (for file size validation)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
    files: 50 // Maximum 50 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only jpg, jpeg, png, and webp are allowed.'), false);
    }
  }
});

// Validation rules - make fields optional for partial updates
const galleryValidation = [
  body('gallery_title').optional().notEmpty().withMessage('Gallery title is required'),
  body('category').optional().notEmpty().withMessage('Category is required'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status')
];

// Routes
router.get('/', galleryController.getAllGalleries);
router.get('/:id', galleryController.getGalleryById);
router.post('/', upload.array('images', 50), galleryValidation, galleryController.createGallery);
router.put('/:id', upload.array('images', 50), galleryValidation, galleryController.updateGallery);
router.delete('/:id', galleryController.deleteGallery);

module.exports = router;
