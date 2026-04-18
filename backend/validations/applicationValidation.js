const Joi = require('joi');

const applyValidation = Joi.object({
    internship_id: Joi.number().required().messages({
        'any.required': 'internship_id is required.'
    }),
    student_id: Joi.any().forbidden().messages({
        'any.unknown': 'Do not include user IDs in the request body.'
    })
});

const updateStatusValidation = Joi.object({
    status: Joi.string().valid('APPLIED', 'TESTING', 'INTERVIEW', 'SELECTED', 'REJECTED').required()
});

module.exports = { applyValidation, updateStatusValidation };
