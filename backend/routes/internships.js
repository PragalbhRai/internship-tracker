const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createInternshipValidation, updateInternshipValidation } = require('../validations/internshipValidation');

router.use(authenticateToken); // Protected routes

router.get('/', internshipController.getInternships);
router.post('/', authorizeRoles('COMPANY_POC', 'ADMIN'), validate(createInternshipValidation), internshipController.createInternship);
router.patch('/:id', authorizeRoles('ADMIN', 'COMPANY_POC'), validate(updateInternshipValidation), internshipController.updateInternship);
router.delete('/:id', authorizeRoles('ADMIN'), internshipController.deleteInternship);

module.exports = router;
