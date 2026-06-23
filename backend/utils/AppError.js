

'use strict';


class AppError extends Error {

 
  constructor(message, statusCode, code = 'INTERNAL_ERROR') {
   
    super(message);

    this.statusCode = statusCode;
    this.code       = code;

  
    this.isOperational = true;

   
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

   
    this.name = this.constructor.name;
  }
}


AppError.badRequest  = (msg) => new AppError(msg, 400, 'BAD_REQUEST');
AppError.unauthorized= (msg) => new AppError(msg, 401, 'UNAUTHORIZED');
AppError.forbidden   = (msg) => new AppError(msg, 403, 'FORBIDDEN');
AppError.notFound    = (msg) => new AppError(msg, 404, 'NOT_FOUND');
AppError.conflict    = (msg) => new AppError(msg, 409, 'CONFLICT');
AppError.tooMany     = (msg) => new AppError(msg, 429, 'TOO_MANY_REQUESTS');
AppError.internal    = (msg) => new AppError(msg, 500, 'INTERNAL_ERROR');

module.exports = AppError;