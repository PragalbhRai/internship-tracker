const Joi = require('joi');

const createInternshipValidation = Joi.object({
    title: Joi.string().required().messages({
        'any.required': 'Title is required for the internship.'
    }),
    description: Joi.string().required(),
    type: Joi.string().valid('SUMMER', 'WINTER', 'SIX_MONTHS', 'PPO').required(),
    stipend: Joi.number().min(0).required().messages({
        'number.min': 'Stipend must be a positive number or 0.',
        'any.required': 'Stipend is required.'
    }),
    location: Joi.string().required(),
    deadline: Joi.date().iso().required().messages({
        'any.required': 'Deadline is required.'
    }),
    min_cgpa: Joi.number().min(0).max(10).optional(),
    max_active_backlogs: Joi.number().min(0).optional(),
    allowed_years: Joi.string().optional(),
    allowed_department: Joi.string().optional()
});

const updateInternshipValidation = Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    type: Joi.string().valid('SUMMER', 'WINTER', 'SIX_MONTHS', 'PPO').optional(),
    stipend: Joi.number().min(0).optional(),
    location: Joi.string().optional(),
    deadline: Joi.date().iso().optional(),
    min_cgpa: Joi.number().min(0).max(10).optional(),
    max_active_backlogs: Joi.number().min(0).optional(),
    allowed_years: Joi.string().optional(),
    allowed_department: Joi.string().optional()
}).min(1);

module.exports = { createInternshipValidation, updateInternshipValidation };
