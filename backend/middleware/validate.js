const AppError = require('../utils/AppError');

const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true // Removes unknown keys from the validated object
        });

        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            return next(new AppError(errorMessage, 400));
        }

        // Reassign req.body to the validated & stripped value
        req.body = value;
        next();
    };
};

module.exports = validate;
