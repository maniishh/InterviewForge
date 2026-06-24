'use strict';

const express = require('express');
const router = express.Router();

const interviewController = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { aiLimiter } = require('../middleware/rateLimiter');
const {
  startInterviewSchema,
  submitAnswerSchema,
} = require('../validators/interviewValidator');

router.use(protect);

router.post(
  '/start',
  aiLimiter,
  validate(startInterviewSchema),
  interviewController.startInterview
);

router.post(
  '/:id/submit',
  aiLimiter,
  validate(submitAnswerSchema),
  interviewController.submitAnswer
);

router.post(
  '/:id/complete',
  interviewController.completeInterview
);

router.get(
  '/:id',
  interviewController.getSession
);

module.exports = router;