const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { updateProfileValidation } = require('../validations/studentValidation');

router.use(authenticateToken);
router.use(authorizeRoles('STUDENT'));

router.get('/profile', studentController.getProfile);
router.put('/profile', validate(updateProfileValidation), studentController.updateProfile);

module.exports = router;
