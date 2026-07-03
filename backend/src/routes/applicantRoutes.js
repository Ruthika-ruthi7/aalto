const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const applicantController = require('../controllers/applicantController');
const authMiddleware = require('../middleware/auth');

// Validation rules
const applicantValidation = [
  body('applicant_name').notEmpty().withMessage('Applicant name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('mobile').notEmpty().withMessage('Mobile is required'),
  body('career_id').isInt().withMessage('Valid career ID is required')
];

// Routes
router.get('/', applicantController.getAllApplicants);
router.get('/:id', applicantController.getApplicantById);
router.post('/', applicantValidation, applicantController.createApplicant);
router.put('/:id', applicantController.updateApplicant);
router.delete('/:id', applicantController.deleteApplicant);

module.exports = router;
