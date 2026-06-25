'use strict';
const express  = require('express');
const router   = express.Router();
const { getHistory, getSessionById } = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/',    getHistory);
router.get('/:id', getSessionById);

module.exports = router;