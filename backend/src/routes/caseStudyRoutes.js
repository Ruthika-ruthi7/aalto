const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const caseStudyController = require('../controllers/caseStudyController');
const authMiddleware = require('../middleware/auth');
const { checkPermission } = require('../middleware/rbac');
const multer = require('multer');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
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
const caseStudyValidation = [
  body('title').optional().notEmpty().withMessage('Title is required'),
  body('client_name').optional().notEmpty().withMessage('Client name is required'),
  body('service_type').optional().isIn(['consulting', 'engineering', 'construction', 'maintenance', 'automation', 'lifts_elevators', 'material_handling', 'warehouse_solutions', 'other']).withMessage('Invalid service type'),
  body('industry').optional().isIn(['manufacturing', 'construction', 'pharmaceutical', 'logistics', 'automotive', 'aerospace', 'food_beverage', 'textile', 'chemical', 'energy', 'other']).withMessage('Invalid industry'),
  body('status').optional().isIn(['draft', 'published', 'unpublished']).withMessage('Invalid status')
];

// Routes
router.get('/', authMiddleware, checkPermission('Case Studies', 'read'), caseStudyController.getAllCaseStudies);
router.get('/:id', authMiddleware, checkPermission('Case Studies', 'read'), caseStudyController.getCaseStudyById);
router.post('/', authMiddleware, checkPermission('Case Studies', 'create'), upload.single('featured_image'), caseStudyValidation, caseStudyController.createCaseStudy);
router.put('/:id', authMiddleware, checkPermission('Case Studies', 'update'), upload.single('featured_image'), caseStudyValidation, caseStudyController.updateCaseStudy);
router.delete('/:id', authMiddleware, checkPermission('Case Studies', 'delete'), caseStudyController.deleteCaseStudy);

module.exports = router;
