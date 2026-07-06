const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const applicantController = require('../controllers/applicantController');
const authMiddleware = require('../middleware/auth');
const { checkPermission } = require('../middleware/rbac');

// Validation rules
const applicantValidation = [
  body('applicant_name').notEmpty().withMessage('Applicant name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('mobile').notEmpty().withMessage('Mobile is required'),
  body('career_id').isInt().withMessage('Valid career ID is required')
];

// Routes
router.get('/', authMiddleware, checkPermission('Applicants', 'read'), applicantController.getAllApplicants);
router.get('/:id', authMiddleware, checkPermission('Applicants', 'read'), applicantController.getApplicantById);
router.post('/', authMiddleware, checkPermission('Applicants', 'create'), applicantValidation, applicantController.createApplicant);
router.put('/:id', authMiddleware, checkPermission('Applicants', 'update'), applicantController.updateApplicant);
router.delete('/:id', authMiddleware, checkPermission('Applicants', 'delete'), applicantController.deleteApplicant);

module.exports = router;
