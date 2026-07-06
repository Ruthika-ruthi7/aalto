const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const careerController = require('../controllers/careerController');
const authMiddleware = require('../middleware/auth');
const { checkPermission } = require('../middleware/rbac');

// Validation rules
const careerValidation = [
  body('job_title').notEmpty().withMessage('Job title is required'),
  body('employment_type').isIn(['full_time', 'part_time', 'contract', 'internship', 'freelance']).withMessage('Invalid employment type'),
  body('work_mode').isIn(['on_site', 'remote', 'hybrid']).withMessage('Invalid work mode')
];

// Routes
router.get('/', authMiddleware, checkPermission('Careers', 'read'), careerController.getAllCareers);
router.get('/:id', authMiddleware, checkPermission('Careers', 'read'), careerController.getCareerById);
router.post('/', authMiddleware, checkPermission('Careers', 'create'), careerValidation, careerController.createCareer);
router.put('/:id', authMiddleware, checkPermission('Careers', 'update'), careerController.updateCareer);
router.delete('/:id', authMiddleware, checkPermission('Careers', 'delete'), careerController.deleteCareer);

module.exports = router;
