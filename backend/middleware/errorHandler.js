

'use strict';

const env      = require('../config/env');
const AppError = require('../utils/AppError');


const handleCastErrorDB = (err) =>
  AppError.badRequest(`Invalid ${err.path}: ${err.value}`);


const handleDuplicateKeyDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return AppError.conflict(`${field} '${value}' is already in use`);
};

const handleValidationErrorDB = (err) => {
  const messages = Object.values(err.errors).map(e => e.message);
  return AppError.badRequest(`Validation failed: ${messages.join('. ')}`);
};


const handleJWTError = () =>
  AppError.unauthorized('Invalid token. Please log in again.');

const handleJWTExpiredError = () =>
  AppError.unauthorized('Your session has expired. Please log in again.');


const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success:    false,
    error: {
      code:    err.code,
      message: err.message,
      stack:   err.stack,        
      details: err.details || null,
    },
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
   
    res.status(err.statusCode).json({
      success: false,
      error: {
        code:    err.code,
        message: err.message,
        details: err.details || null,
      },
    });
  } else {
    
    console.error('💥 UNHANDLED ERROR:', err);

    res.status(500).json({
      success: false,
      error: {
        code:    'INTERNAL_ERROR',
        message: 'Something went wrong. Please try again later.',
      },
    });
  }
};


const errorHandler = (err, req, res, next) => { 

 console.error('STACK TRACE:\n', err.stack); 
 
  err.statusCode = err.statusCode || 500;
  err.code       = err.code       || 'INTERNAL_ERROR';

  if (env.IS_DEVELOPMENT) {
    console.error(`[${new Date().toISOString()}] ${err.statusCode} ${err.message}`);
  }


  let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);
  error.message = err.message; 

  if (error.name === 'CastError')             error = handleCastErrorDB(error);
  if (error.code === 11000)                   error = handleDuplicateKeyDB(error);
  if (error.name === 'ValidationError')       error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError')     error = handleJWTError();
  if (error.name === 'TokenExpiredError')     error = handleJWTExpiredError();
  if (env.IS_DEVELOPMENT) {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

module.exports = errorHandler;