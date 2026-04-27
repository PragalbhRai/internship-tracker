const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken);
router.use(authorizeRoles('ADMIN')); // These routes are strictly Admin-only

router.get('/dashboard', adminController.getDashboardStats);
router.get('/students', adminController.getStudents);
router.patch('/students/:id', adminController.updateStudent);
router.get('/applications', adminController.getAllApplications);
router.get('/stats/departments', adminController.getDepartmentStats);

module.exports = router;
