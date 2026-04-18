const Joi = require('joi');

const registerValidation = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email address.',
        'any.required': 'Email is required.'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long.',
        'any.required': 'Password is required.'
    }),
    role: Joi.string().valid('STUDENT', 'COMPANY_POC', 'ADMIN').required(),
    
    // Student specifics
    roll_number: Joi.string().when('role', { is: 'STUDENT', then: Joi.required() }),
    first_name: Joi.string().when('role', { is: 'STUDENT', then: Joi.required() }),
    last_name: Joi.string().when('role', { is: 'STUDENT', then: Joi.required() }),
    department: Joi.string().when('role', { is: 'STUDENT', then: Joi.required() }),
    year_of_study: Joi.number().when('role', { is: 'STUDENT', then: Joi.required() }),
    cgpa: Joi.number().min(0).max(10).when('role', { is: 'STUDENT', then: Joi.required() }),

    // Company specifics
    name: Joi.string().when('role', { is: 'COMPANY_POC', then: Joi.required() }),
    industry: Joi.string().when('role', { is: 'COMPANY_POC', then: Joi.required() }),
    website: Joi.string().uri().optional(),
    description: Joi.string().optional()
});

const loginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = { registerValidation, loginValidation };
