const studentService = require('../services/studentService');
const asyncHandler = require('../utils/asyncHandler');

exports.getProfile = asyncHandler(async (req, res) => {
    const profile = await studentService.getProfile(req.user.user_id);
    res.status(200).json(profile);
});

exports.updateProfile = asyncHandler(async (req, res) => {
    const profile = await studentService.updateProfile(req.user.user_id, req.body.resume_url);
    res.status(200).json(profile);
});
