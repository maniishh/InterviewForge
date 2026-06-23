

'use strict';

const rateLimit = require('express-rate-limit');
const env       = require('../config/env');
const AppError  = require('../utils/AppError');

 
const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,   
  max:      env.RATE_LIMIT_MAX,          
   
  standardHeaders: true,

  
  legacyHeaders: false,

 
  handler: (req, res, next) => {
    next(AppError.tooMany(
      'Too many requests from this IP. Please wait 15 minutes before retrying.'
    ));
  },
 
  skip: () => env.IS_TEST,
});

 
const authLimiter = rateLimit({
  windowMs:       15 * 60 * 1000,   // 15 minutes (hardcoded — auth limit is not configurable)
  max:            10,
  standardHeaders:true,
  legacyHeaders:  false,
  message:        undefined,         // Suppress default — we use handler below
  handler: (req, res, next) => {
    next(AppError.tooMany(
      'Too many login attempts. Please wait 15 minutes before trying again.'
    ));
  },
  skip: () => env.IS_TEST,
});

 
const aiLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             20,
  standardHeaders: true,
  legacyHeaders:   false,
  handler: (req, res, next) => {
    next(AppError.tooMany(
      'AI request limit reached. Please wait before starting a new interview.'
    ));
  },
  skip: () => env.IS_TEST,
});

module.exports = { generalLimiter, authLimiter, aiLimiter };