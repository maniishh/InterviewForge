 'use strict';

const roadmapService = require('../services/roadmapService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.generateRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await roadmapService.generateRoadmap(req.user._id);

  res.status(201).json({
    success: true,
    data: { roadmap: roadmap.toJSON() },
    message: 'Roadmap generated successfully',
  });
});

exports.getActiveRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await roadmapService.getActiveRoadmap(req.user._id);

  if (!roadmap) {
    return res.status(200).json({
      success: true,
      data: { roadmap: null },
      message: 'No active roadmap found. Generate one from your analytics.',
    });
  }

  res.status(200).json({
    success: true,
    data: { roadmap: roadmap.toJSON() },
  });
});

exports.getRoadmapHistory = asyncHandler(async (req, res) => {
  const roadmaps = await roadmapService.getRoadmapHistory(req.user._id);

  res.status(200).json({
    success: true,
    data: { roadmaps: roadmaps.map(r => r.toJSON()), total: roadmaps.length },
  });
});

exports.getRoadmapById = asyncHandler(async (req, res) => {
  const Roadmap = require('../models/Roadmap');

  const roadmap = await Roadmap.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!roadmap) throw AppError.notFound('Roadmap not found');

  res.status(200).json({
    success: true,
    data: { roadmap: roadmap.toJSON() },
  });
});

exports.markTaskComplete = asyncHandler(async (req, res) => {
  const { week, day } = req.body;

  if (!week || !day) {
    throw AppError.badRequest('week (number) and day (string) are required');
  }

  const roadmap = await roadmapService.markTaskComplete(
    req.user._id,
    req.params.id,
    Number(week),
    day
  );

  res.status(200).json({
    success: true,
    data: { progressPct: roadmap.progressPct },
    message: `Task for ${day} Week ${week} marked complete`,
  });
});

exports.deleteRoadmap = asyncHandler(async (req, res) => {
  const Roadmap = require('../models/Roadmap');

  const roadmap = await Roadmap.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!roadmap) throw AppError.notFound('Roadmap not found');

  res.status(200).json({
    success: true,
    message: 'Roadmap deleted successfully',
  });
});