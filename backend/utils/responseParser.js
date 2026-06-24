'use strict';

const AppError = require('./AppError');

const responseParser = {
  extractJSON(rawText) {
    if (!rawText || typeof rawText !== 'string') {
      throw AppError.internal('AI returned empty or non-string response');
    }

    let text = rawText.trim();

    text = text
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/i, '');

    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1) {
      throw AppError.internal('AI response did not contain a valid JSON object');
    }

    text = text.slice(firstBrace, lastBrace + 1);

    try {
      return JSON.parse(text);
    } catch (e) {
      throw AppError.internal(`AI returned malformed JSON: ${e.message}`);
    }
  },

  parseQuestions(rawText) {
    const parsed = this.extractJSON(rawText);

    let questions = Array.isArray(parsed) ? parsed : parsed.questions;

    if (!Array.isArray(questions) || questions.length === 0) {
      throw AppError.internal('AI did not return a valid questions array');
    }

    const validTypes = ['technical', 'behavioral', 'system-design'];

    return questions.map((q, index) => ({
      text:
        typeof q.text === 'string' && q.text.trim()
          ? q.text.trim()
          : `Question ${index + 1}`,

      type: validTypes.includes(q.type) ? q.type : 'technical',

      category:
        typeof q.category === 'string' && q.category.trim()
          ? q.category.trim()
          : 'General',

      orderIndex:
        typeof q.orderIndex === 'number'
          ? q.orderIndex
          : index,
    }));
  },
parseEvaluation(rawText) {
  const parsed = this.extractJSON(rawText);

  const parseScore = (value, fallback = 5) => {
    if (typeof value === 'number' && !isNaN(value)) {
      return Math.round(Math.min(10, Math.max(0, value)) * 10) / 10;
    }

    if (typeof value === 'string') {
      const match = value.match(/(\d+(?:\.\d+)?)/);
      if (match) {
        return Math.round(
          Math.min(10, Math.max(0, parseFloat(match[1]))) * 10
        ) / 10;
      }
    }

    return fallback;
  };

  const technicalScore = parseScore(parsed.technicalScore, 5);
  const communicationScore = parseScore(parsed.communicationScore, 5);
  const depthScore = parseScore(parsed.depthScore, 5);

  const overallScore = Math.round(
    (technicalScore * 0.4 +
      communicationScore * 0.3 +
      depthScore * 0.3) * 10
  ) / 10;

  return {
    technicalScore,
    communicationScore,
    depthScore,
    overallScore,
    feedback: this._safeString(
      parsed.feedback,
      'The answer was evaluated by AI.'
    ),
    strengths: this._safeString(
      parsed.strengths,
      'Some relevant points were made.'
    ),
    improvements: this._safeString(
      parsed.improvements,
      'Focus on depth and specific examples.'
    ),
    suggestedAnswer: this._safeString(
      parsed.suggestedAnswer,
      'Not provided.'
    ),
    evaluatedAt: new Date(),
  };
},
};

module.exports = responseParser;