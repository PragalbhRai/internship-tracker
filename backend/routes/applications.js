const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { applyValidation, updateStatusValidation } = require('../validations/applicationValidation');

router.use(authenticateToken); // Protect all routes

router.post('/', authorizeRoles('STUDENT'), validate(applyValidation), applicationController.apply);
router.patch('/:id/status', authorizeRoles('ADMIN', 'COMPANY_POC'), validate(updateStatusValidation), applicationController.updateStatus);
router.get('/', authorizeRoles('ADMIN', 'COMPANY_POC'), applicationController.getAllApplications);
router.get('/mine', authorizeRoles('STUDENT'), applicationController.myApplications);

module.exports = router;
