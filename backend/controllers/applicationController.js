const applicationService = require('../services/applicationService');
const asyncHandler = require('../utils/asyncHandler');

exports.apply = asyncHandler(async (req, res) => {
    // Ensuring student_id is derived completely from req.user
    await applicationService.apply(req.body.internship_id, req.user);
    res.status(201).json({ message: 'Application submitted successfully.' });
});

exports.updateStatus = asyncHandler(async (req, res) => {
    await applicationService.updateStatus(req.params.id, req.body.status, req.user);
    res.status(200).json({ message: 'Status updated successfully.' });
});

exports.myApplications = asyncHandler(async (req, res) => {
    const applications = await applicationService.myApplications(req.user.user_id);
    res.status(200).json(applications);
});

exports.getAllApplications = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const allApplications = await applicationService.getAllApplications(req.user);
    
    const total = allApplications.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = allApplications.slice(startIndex, endIndex);

    res.status(200).json({ data, total, page, limit });
});
