const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken); // Protect all routes

router.post('/', authorizeRoles('STUDENT'), applicationController.apply);
router.patch('/:id/status', authorizeRoles('ADMIN', 'COMPANY_POC'), applicationController.updateStatus);
router.get('/', authorizeRoles('ADMIN', 'COMPANY_POC'), applicationController.getAllApplications);
router.get('/mine', authorizeRoles('STUDENT'), applicationController.myApplications);

module.exports = router;
