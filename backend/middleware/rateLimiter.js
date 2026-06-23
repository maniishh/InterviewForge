// backend/middleware/rateLimiter.js
'use strict';

const rateLimit = require('express-rate-limit');
const env       = require('../config/env');

const generalLimiter = rateLimit({
  windowMs:        env.RATE_LIMIT_WINDOW_MS,
  max:             env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders:   false,
  skip:            () => env.IS_TEST,
  message: {
    success: false,
    error: {
      code:    'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP. Please wait 15 minutes.',
      details: null,
    },
  },
});

const authLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             10,
  standardHeaders: true,
  legacyHeaders:   false,
  skip:            () => env.IS_TEST,
  message: {
    success: false,
    error: {
      code:    'TOO_MANY_REQUESTS',
      message: 'Too many login attempts. Please wait 15 minutes.',
      details: null,
    },
  },
});

const aiLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             20,
  standardHeaders: true,
  legacyHeaders:   false,
  skip:            () => env.IS_TEST,
  message: {
    success: false,
    error: {
      code:    'TOO_MANY_REQUESTS',
      message: 'AI request limit reached. Please wait.',
      details: null,
    },
  },
});

module.exports = { generalLimiter, authLimiter, aiLimiter };