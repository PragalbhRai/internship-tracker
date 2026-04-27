const studentService = require('../services/studentService');
const asyncHandler = require('../utils/asyncHandler');

exports.getProfile = asyncHandler(async (req, res) => {
    const profile = await studentService.getProfile(req.user.user_id);
    res.status(200).json(profile);
});
