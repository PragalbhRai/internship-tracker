const internshipService = require('../services/internshipService');
const asyncHandler = require('../utils/asyncHandler');

exports.getInternships = asyncHandler(async (req, res) => {
    const internships = await internshipService.getInternships(req.user);
    res.json(internships);
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
