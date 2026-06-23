'use strict';

const AppError = require('../utils/AppError');

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: false,
  });

  if (error) {
    const details = error.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message.replace(/['"]/g, ''),
    }));

    const appErr = AppError.badRequest('Validation failed');
    appErr.details = details;
    return next(appErr);
  }

  req.body = value;
  next();
};

module.exports = validate;