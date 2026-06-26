'use strict';

const analyticsService = require('../services/analyticsService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.getOverview = asyncHandler(async (req, res) => {
  const data = await analyticsService.getOverview(req.user._id);

  res.status(200).json({
    success: true,
    data,
    message: 'Analytics overview retrieved successfully',
  });
});

exports.getTrends = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 50);

  const data = await analyticsService.getTrends(req.user._id, limit);

  res.status(200).json({
    success: true,
    data,
    meta: {
      sessionCount: data.length,
      limit,
    },
  });
});

exports.getTopics = asyncHandler(async (req, res) => {
  const data = await analyticsService.getTopicAnalysis(req.user._id);

  res.status(200).json({
    success: true,
    data,
    meta: {
      totalTopics: data.all.length,
      strongCount: data.strong.length,
      weakCount: data.weak.length,
      developingCount: data.developing.length,
    },
  });
});

exports.getCompanies = asyncHandler(async (req, res) => {
  const data = await analyticsService.getCompanyStats(req.user._id);

  res.status(200).json({
    success: true,
    data,
  });
});

exports.getBreakdown = asyncHandler(async (req, res) => {
  const data = await analyticsService.getDifficultyBreakdown(req.user._id);

  res.status(200).json({
    success: true,
    data,
  });
});

exports.getDashboard = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 50);
  const userId = req.user._id;

  const [overview, trends, topics, companies, breakdown] = await Promise.all([
    analyticsService.getOverview(userId),
    analyticsService.getTrends(userId, limit),
    analyticsService.getTopicAnalysis(userId),
    analyticsService.getCompanyStats(userId),
    analyticsService.getDifficultyBreakdown(userId),
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview,
      trends,
      topics,
      companies,
      breakdown,
    },
    meta: {
      computedAt: new Date().toISOString(),
      sessionCount: overview.totalSessions,
    },
  });
});