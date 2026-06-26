'use strict';

const Session = require('../models/Session');
const analyticsService = {
 
  _baseMatch(userId) {
    return {
      $match: {
        userId:      require('mongoose').Types.ObjectId.createFromHexString(userId.toString()),
        status:      'completed',
        completedAt: { $exists: true },
      },
    };
  },

   
  async getOverview(userId) {
    const pipeline = [
      this._baseMatch(userId),

      {
        $group: {
          _id:                  null,
          totalSessions:        { $sum:  1 },
          avgOverallScore:      { $avg:  '$overallScore' },
          bestScore:            { $max:  '$overallScore' },
          worstScore:           { $min:  '$overallScore' },
          avgTechnicalScore:    { $avg:  '$avgTechnicalScore' },
          avgCommunicationScore:{ $avg:  '$avgCommunicationScore' },
          avgDepthScore:        { $avg:  '$avgDepthScore' },
          totalQuestions:       { $sum:  { $size: '$questions' } },
          avgDuration:          { $avg:  '$storedDurationMinutes' },
          totalTechnical:       { $sum:  '$questionTypeCount.technical' },
          totalBehavioral:      { $sum:  '$questionTypeCount.behavioral' },
          totalSystemDesign:    { $sum:  '$questionTypeCount.systemDesign' },

          
          allScores: { $push: '$overallScore' },
        },
      },

      {
        $project: {
          _id:                   0,
          totalSessions:         1,
          avgOverallScore:       { $round: ['$avgOverallScore',      1] },
          bestScore:             { $round: ['$bestScore',            1] },
          worstScore:            { $round: ['$worstScore',           1] },
          avgTechnicalScore:     { $round: ['$avgTechnicalScore',    1] },
          avgCommunicationScore: { $round: ['$avgCommunicationScore',1] },
          avgDepthScore:         { $round: ['$avgDepthScore',        1] },
          totalQuestions:        1,
          avgDuration:           { $round: ['$avgDuration',          0] },
          totalTechnical:        1,
          totalBehavioral:       1,
          totalSystemDesign:     1,

           
          recentAvgScore: {
            $round: [
              { $avg: { $slice: ['$allScores', -5] } },
              1,
            ],
          },
        },
      },
    ];

    const result = await Session.aggregate(pipeline);

    if (!result.length) {
      return {
        totalSessions:         0,
        avgOverallScore:       0,
        bestScore:             0,
        worstScore:            0,
        avgTechnicalScore:     0,
        avgCommunicationScore: 0,
        avgDepthScore:         0,
        totalQuestions:        0,
        avgDuration:           0,
        totalTechnical:        0,
        totalBehavioral:       0,
        totalSystemDesign:     0,
        recentAvgScore:        0,
        improvementPct:        0,
      };
    }

    const data = result[0];

  
    data.improvementPct = data.avgOverallScore > 0
      ? Math.round(
          ((data.recentAvgScore - data.avgOverallScore) / data.avgOverallScore) * 100
        )
      : 0;

    return data;
  },
 
  async getTrends(userId, limit = 20) {
    const pipeline = [
      this._baseMatch(userId),
      { $sort:  { completedAt: 1 } },
      { $limit: limit },
      {
        $project: {
          _id:                   0,
          sessionId:             '$_id',
          date:                  '$completedAt',
          company:               1,
          jobRole:               1,
          difficulty:            1,
          overallScore:          1,
          avgTechnicalScore:     1,
          avgCommunicationScore: 1,
          avgDepthScore:         1,
          durationMinutes:       '$storedDurationMinutes',
        },
      },
    ];

    const sessions = await Session.aggregate(pipeline);
 
    return sessions.map((session, index) => {
      const windowStart = Math.max(0, index - 2);
      const windowScores = sessions
        .slice(windowStart, index + 1)
        .map(s => s.overallScore);
      const movingAvg = Math.round(
        (windowScores.reduce((s, n) => s + n, 0) / windowScores.length) * 10
      ) / 10;

      return {
        ...session,
        sessionNumber: index + 1,
        movingAvg,
      };
    });
  },

   
  async getTopicAnalysis(userId) {
    const pipeline = [
      this._baseMatch(userId),
 
      {
        $addFields: {
          topicScores: {
            $map: {
              input: '$evaluations',
              as:    'eval',
              in: {
                category: {
                  $arrayElemAt: ['$questions.category', '$$eval.questionIndex'],
                },
                score: '$$eval.overallScore',
              },
            },
          },
        },
      },

       
      { $unwind: '$topicScores' },

       
      {
        $match: {
          'topicScores.category': { $exists: true, $ne: null, $ne: '' },
          'topicScores.score':    { $exists: true },
        },
      },

   
      
      {
        $group: {
          _id:       '$topicScores.category',
          avgScore:  { $avg:  '$topicScores.score' },
          attempts:  { $sum:  1 },
          scores:    { $push: '$topicScores.score' },
          lastScore: { $last: '$topicScores.score' },
        },
      },

      { $sort: { avgScore: -1 } },

      {
        $project: {
          _id:      0,
          topic:    '$_id',
          avgScore: { $round: ['$avgScore', 1] },
          attempts: 1,
          lastScore:{ $round: ['$lastScore', 1] },

          
          classification: {
            $cond: {
              if:   { $gte: ['$avgScore', 7.0] },
              then: 'strong',
              else: {
                $cond: {
                  if:   { $lt: ['$avgScore', 5.5] },
                  then: 'weak',
                  else: 'developing',
                },
              },
            },
          },
        },
      },
    ];

    const topics = await Session.aggregate(pipeline);

   
    const withTrend = topics.map(t => ({
      ...t,
      trend: t.lastScore > (t.scores?.[0] || 0) ? 'improving'
           : t.lastScore < (t.scores?.[0] || 0) ? 'declining'
           : 'stable',
    }));

    return {
      all:        withTrend,
      strong:     withTrend.filter(t => t.classification === 'strong'),
      weak:       withTrend.filter(t => t.classification === 'weak'),
      developing: withTrend.filter(t => t.classification === 'developing'),
    };
  },

  async getCompanyStats(userId) {
    const pipeline = [
      this._baseMatch(userId),
      {
        $group: {
          _id:      '$company',
          sessions: { $sum: 1 },
          avgScore: { $avg: '$overallScore' },
          bestScore:{ $max: '$overallScore' },
        },
      },
      { $sort: { sessions: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id:      0,
          company:  '$_id',
          sessions: 1,
          avgScore: { $round: ['$avgScore',  1] },
          bestScore:{ $round: ['$bestScore', 1] },
        },
      },
    ];

    return Session.aggregate(pipeline);
  },

 
  async getDifficultyBreakdown(userId) {
    const pipeline = [
      this._baseMatch(userId),
      {
        $group: {
          _id:                   '$difficulty',
          sessions:              { $sum:  1 },
          avgOverallScore:       { $avg:  '$overallScore' },
          avgTechnicalScore:     { $avg:  '$avgTechnicalScore' },
          avgCommunicationScore: { $avg:  '$avgCommunicationScore' },
          avgDepthScore:         { $avg:  '$avgDepthScore' },
        },
      },
      {
        $project: {
          _id:                   0,
          difficulty:            '$_id',
          sessions:              1,
          avgOverallScore:       { $round: ['$avgOverallScore',       1] },
          avgTechnicalScore:     { $round: ['$avgTechnicalScore',     1] },
          avgCommunicationScore: { $round: ['$avgCommunicationScore', 1] },
          avgDepthScore:         { $round: ['$avgDepthScore',         1] },
        },
      },
      { $sort: { difficulty: 1 } },
    ];

    return Session.aggregate(pipeline);
  },
};

module.exports = analyticsService;