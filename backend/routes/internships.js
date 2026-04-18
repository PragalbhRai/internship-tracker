const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken); // Protected routes

router.get('/', internshipController.getInternships);
router.post('/', authorizeRoles('ADMIN', 'COMPANY_POC'), internshipController.createInternship);
router.patch('/:id', authorizeRoles('ADMIN', 'COMPANY_POC'), internshipController.updateInternship);
router.delete('/:id', authorizeRoles('ADMIN'), internshipController.deleteInternship);

module.exports = router;
