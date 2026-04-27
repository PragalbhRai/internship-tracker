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

exports.updateStudent = asyncHandler(async (req, res) => {
    const { cgpa, active_backlogs } = req.body;
    await adminService.updateStudent(req.params.id, cgpa, active_backlogs);
    res.json({ message: 'Student updated successfully.' });
});

exports.getAllApplications = asyncHandler(async (req, res) => {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.department) filters.department = req.query.department;
    const applications = await adminService.getAllApplications(filters);
    res.json(applications);
});

exports.getDepartmentStats = asyncHandler(async (req, res) => {
    const stats = await adminService.getDepartmentStats();
    res.json(stats);
});
