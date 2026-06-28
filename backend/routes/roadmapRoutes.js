 
'use strict';

const express            = require('express');
const router             = express.Router();
const roadmapController  = require('../controllers/roadmapController');
const { protect }        = require('../middleware/authMiddleware');
const { aiLimiter }      = require('../middleware/rateLimiter');

 
router.use(protect);

router.post('/generate',              aiLimiter, roadmapController.generateRoadmap);
router.get('/active',                            roadmapController.getActiveRoadmap);
router.get('/history',                           roadmapController.getRoadmapHistory);
router.get('/:id',                               roadmapController.getRoadmapById);
router.patch('/:id/task/complete',               roadmapController.markTaskComplete);
router.delete('/:id',                            roadmapController.deleteRoadmap);

module.exports = router;