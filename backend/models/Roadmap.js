'use strict';

const mongoose = require('mongoose');

const dailyTaskSchema = new mongoose.Schema({
  day: { type: String },
  task: { type: String },
  duration: { type: String },
  category: { type: String, enum: ['technical', 'behavioral', 'system-design', 'practice'] },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  resource: { type: String },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
}, { _id: false });

const weekSchema = new mongoose.Schema({
  week: { type: Number },
  theme: { type: String },
  goal: { type: String },
  dailyTasks: [dailyTaskSchema],
  weeklyChallenge: { type: String },
  successMetric: { type: String },
  completed: { type: Boolean, default: false },
}, { _id: false });

const phaseSchema = new mongoose.Schema({
  phase: { type: Number },
  title: { type: String },
  weekRange: { type: String },
  focus: { type: String },
  weeks: [weekSchema],
}, { _id: false });

const resourceSchema = new mongoose.Schema({
  name: { type: String },
  type: { type: String },
  url: { type: String },
  priority: { type: String, enum: ['must-have', 'recommended', 'optional'] },
  reason: { type: String },
}, { _id: false });

const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    analyticsSnapshot: {
      avgOverallScore: { type: Number },
      avgTechnicalScore: { type: Number },
      avgCommunicationScore: { type: Number },
      avgDepthScore: { type: Number },
      totalSessions: { type: Number },
      weakTopics: [String],
      strongTopics: [String],
    },

    title: { type: String, required: true },
    summary: { type: String },
    targetScore: { type: Number, min: 0, max: 10 },
    estimatedWeeks: { type: Number },
    phases: [phaseSchema],
    keyResources: [resourceSchema],

    behavioralPlan: {
      focus: { type: String },
      starStories: { type: Number },
      practiceFrequency: { type: String },
      topics: [String],
    },

    mockInterviewSchedule: {
      startingWeek: { type: Number },
      frequency: { type: String },
      focus: { type: String },
    },

    rawData: { type: mongoose.Schema.Types.Mixed },

    isActive: { type: Boolean, default: true },
    startedAt: { type: Date, default: Date.now },
    targetDate: { type: Date },

    progressPct: { type: Number, default: 0, min: 0, max: 100 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

roadmapSchema.index({ userId: 1, createdAt: -1 });

roadmapSchema.virtual('totalTasks').get(function () {
  return this.phases?.reduce((sum, phase) =>
    sum + phase.weeks?.reduce((ws, week) =>
      ws + (week.dailyTasks?.length || 0), 0) || 0, 0) || 0;
});

module.exports = mongoose.model('Roadmap', roadmapSchema);