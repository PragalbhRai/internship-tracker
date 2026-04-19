const internshipService = require('../services/internshipService');
const asyncHandler = require('../utils/asyncHandler');

exports.getInternships = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const allInternships = await internshipService.getInternships(req.user);
    
    const total = allInternships.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = allInternships.slice(startIndex, endIndex);

    res.json({ data, total, page, limit });
});

exports.createInternship = asyncHandler(async (req, res) => {
    const internship_id = await internshipService.createInternship(req.body, req.user);
    res.status(201).json({ message: 'Internship created', internship_id });
});

exports.updateInternship = asyncHandler(async (req, res) => {
    await internshipService.updateInternship(req.params.id, req.body, req.user);
    res.status(200).json({ message: 'Internship updated successfully.' });
});

exports.deleteInternship = asyncHandler(async (req, res) => {
    await internshipService.deleteInternship(req.params.id);
    res.status(200).json({ message: 'Internship deleted.' });
});
