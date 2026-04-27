const Joi = require('joi');

exports.updateProfileValidation = Joi.object({
    resume_url: Joi.string().uri().allow('', null).max(255).messages({
        'string.uri': 'Resume link must be a valid URL.',
        'string.max': 'Resume link must be 255 characters or fewer.'
    })
});
