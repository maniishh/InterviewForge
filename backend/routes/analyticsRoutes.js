'use strict';

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/dashboard', analyticsController.getDashboard);

router.get('/overview', analyticsController.getOverview);
router.get('/trends', analyticsController.getTrends);
router.get('/topics', analyticsController.getTopics);
router.get('/companies', analyticsController.getCompanies);
router.get('/breakdown', analyticsController.getBreakdown);

module.exports = router;