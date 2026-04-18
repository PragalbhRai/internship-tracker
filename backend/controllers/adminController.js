const adminService = require('../services/adminService');
const asyncHandler = require('../utils/asyncHandler');

exports.getDashboardStats = asyncHandler(async (req, res) => {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
});

exports.getStudents = asyncHandler(async (req, res) => {
    const students = await adminService.getStudents();
    res.json(students);
});
