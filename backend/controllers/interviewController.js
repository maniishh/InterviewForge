'use strict';

const Session = require('../models/Session');
const aiService = require('../services/aiService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.startInterview = asyncHandler(async (req, res) => {
  const { company, jobRole, difficulty, questionCount } = req.body;

  const questions = await aiService.generateQuestions({
    company,
    jobRole,
    difficulty,
    count: questionCount,
  });

  const session = await Session.create({
    userId: req.user._id,
    company,
    jobRole,
    difficulty,
    questions,
  });

  res.status(201).json({
    success: true,
    data: {
      sessionId: session._id,
      company: session.company,
      jobRole: session.jobRole,
      difficulty: session.difficulty,
      questions: session.questions,
      status: session.status,
    },
    message: 'Interview session started successfully',
  });
});

exports.submitAnswer = asyncHandler(async (req, res) => {
  const { id: sessionId } = req.params;
  const { questionIndex, answerText } = req.body;

  const session = await Session.findOne({
    _id: sessionId,
    userId: req.user._id,
  });

  if (!session) {
    throw AppError.notFound('Interview session not found');
  }

  if (session.status !== 'in-progress') {
    throw AppError.badRequest('This interview session is already completed');
  }

  const question = session.questions[questionIndex];

  if (!question) {
    throw AppError.badRequest(
      `Question at index ${questionIndex} does not exist`
    );
  }

  const alreadyAnswered = session.answers.some(
    (a) => a.questionIndex === questionIndex
  );

  if (alreadyAnswered) {
    throw AppError.badRequest('This question has already been answered');
  }

  const evaluation = await aiService.evaluateAnswer({
    question,
    answer: answerText,
    company: session.company,
    jobRole: session.jobRole,
  });

await Session.findByIdAndUpdate(
  sessionId,
  {
    $push: {
      answers: {
        text:          answerText,
        questionIndex,
        submittedAt:   new Date(),
      },
      evaluations: {
        ...evaluation,   // spreads all 4 scores + feedback fields
        questionIndex,
      },
    },
  },
  { new: true }
);

res.status(200).json({
  success: true,
  data: {
    questionIndex,
    evaluation: {
      technicalScore:     evaluation.technicalScore,
      communicationScore: evaluation.communicationScore,
      depthScore:         evaluation.depthScore,
      overallScore:       evaluation.overallScore,
      feedback:           evaluation.feedback,
      strengths:          evaluation.strengths,
      improvements:       evaluation.improvements,
      suggestedAnswer:    evaluation.suggestedAnswer,
    },
  },
  message: 'Answer submitted and evaluated successfully',
});
});


exports.completeInterview = asyncHandler(async (req, res) => {
  const { id: sessionId } = req.params;

  const session = await Session.findOne({
    _id:    sessionId,
    userId: req.user._id,
  });

  if (!session)                        throw AppError.notFound('Interview session not found');
  if (session.status === 'completed')  throw AppError.badRequest('Session already completed');

  const evals = session.evaluations;

 const avg = (arr, key) => {
    if (!arr.length) return 0;
    return Math.round(
      (arr.reduce((sum, e) => sum + (e[key] || 0), 0) / arr.length) * 10
    ) / 10;
  };

   const avgTechnicalScore     = avg(evals, 'technicalScore');
  const avgCommunicationScore = avg(evals, 'communicationScore');
  const avgDepthScore         = avg(evals, 'depthScore');

  const overallScore = Math.round(
    (avgTechnicalScore * 0.4 + avgCommunicationScore * 0.3 + avgDepthScore * 0.3) * 10
  ) / 10;
         
  const getPerformanceLabel = (score) => {
    if (score >= 9)  return { label: 'Outstanding',  color: 'green'  };
    if (score >= 7)  return { label: 'Strong',        color: 'teal'   };
    if (score >= 5)  return { label: 'Developing',    color: 'amber'  };
    if (score >= 3)  return { label: 'Needs Work',    color: 'orange' };
    return                  { label: 'Beginning',     color: 'red'    };
  };
 const updatedSession = await Session.findByIdAndUpdate(
    sessionId,
    {
      status:                'completed',
      overallScore,
      avgTechnicalScore,
      avgCommunicationScore,
      avgDepthScore,
      completedAt:           new Date(),
    },
    { new: true }
  );

   res.status(200).json({
    success: true,
    data: {
      session:              updatedSession.toJSON(),
      overallScore,
      avgTechnicalScore,
      avgCommunicationScore,
      avgDepthScore,
      performance:          getPerformanceLabel(overallScore),
      durationMinutes:      updatedSession.durationMinutes,
      totalQuestions:       session.questions.length,
      answeredQuestions:    session.answers.length,
    },
    message: 'Interview completed successfully',
  });
});

exports.getSession = asyncHandler(async (req, res) => {
  const session = await Session.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!session) {
    throw AppError.notFound('Interview session not found');
  }

  res.status(200).json({
    success: true,
    data: { session: session.toJSON() },
  });
});