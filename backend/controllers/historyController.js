'use strict';
const Session      = require('../models/Session');
const asyncHandler = require('../utils/asyncHandler');
const AppError     = require('../utils/AppError');

exports.getHistory = asyncHandler(async (req, res) => {
  const page  = Number(req.query.page)  || 1;
  const limit = Number(req.query.limit) || 20;
  const skip  = (page - 1) * limit;

  const sessions = await Session.find({
    userId: req.user._id,
    status: 'completed',
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Session.countDocuments({
    userId: req.user._id,
    status: 'completed',
  });

  res.status(200).json({
    success: true,
    data: { sessions, total, page, pages: Math.ceil(total / limit) },
  });
});

exports.getSessionById = asyncHandler(async (req, res) => {
  const session = await Session.findOne({
    _id:    req.params.id,
    userId: req.user._id,
  });
  if (!session) throw AppError.notFound('Session not found');
  res.status(200).json({ success: true, data: { session } });
});