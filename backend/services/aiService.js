// backend/services/aiService.js
'use strict';

const { GoogleGenAI } = require("@google/genai");

const env            = require('../config/env');
const promptBuilder  = require('../utils/promptBuilder');
const responseParser = require('../utils/responseParser');
const AppError       = require('../utils/AppError');

class AIService {

  // ─── SECTION 1: CONSTRUCTOR ───────────────────────────────────────────────
  constructor() {
    if (env.AI_PROVIDER === 'gemini') {
      this.gemini   = new GoogleGenerativeAI(env.GEMINI_API_KEY);
      this.provider = 'gemini';
    } else if (env.AI_PROVIDER === 'openai') {
      const OpenAI  = require('openai');
      this.openai   = new OpenAI({ apiKey: env.OPENAI_API_KEY });
      this.provider = 'openai';
    } else {
      throw new Error(`Unknown AI_PROVIDER: ${env.AI_PROVIDER}`);
    }
    console.log(`✅  AI Service initialised with provider: ${this.provider}`);
  }



async callGemini(messages, options = {}) {
  const maxRetries = 3;
  const delays     = [5000, 15000, 30000]; // wait 5s, 15s, 30s between retries

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const model = this.gemini.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: {
          temperature:      options.temperature ?? 0.7,
          maxOutputTokens:  options.max_tokens  ?? 2000,
          responseMimeType: 'application/json',
        },
      });

      const systemMessage = messages.find(m => m.role === 'system');
      const userMessages  = messages.filter(m => m.role !== 'system');

      const chat = model.startChat({
        systemInstruction: systemMessage
          ? { parts: [{ text: systemMessage.content }] }
          : undefined,
        history: [],
      });

      const lastUserMessage = userMessages[userMessages.length - 1];
      const result = await chat.sendMessage(lastUserMessage.content);
      return result.response.text();

    } catch (error) {
      const isRateLimit = error.status === 429 ||
                          error.message?.includes('429') ||
                          error.message?.includes('quota') ||
                          error.message?.includes('rate');

      if (isRateLimit && attempt < maxRetries) {
        console.log(`Gemini rate limit hit. Retrying in ${delays[attempt]/1000}s... (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(r => setTimeout(r, delays[attempt]));
        continue;
      }

      if (isRateLimit) {
        throw AppError.tooMany('AI rate limit reached. Please wait 1 minute and try again.');
      }
      if (error.status === 400) throw AppError.badRequest(`Gemini error: ${error.message}`);
      if (error.status === 403) throw AppError.unauthorized('Invalid Gemini API key.');
      throw AppError.internal(`Gemini error: ${error.message}`);
    }
  }
}

  async callOpenAI(messages, options = {}) {
    try {
      const response = await this.openai.chat.completions.create({
        model:           'gpt-4o-mini',
        messages,
        temperature:     options.temperature ?? 0.7,
        max_tokens:      options.max_tokens  ?? 2000,
        response_format: { type: 'json_object' },
      });
      return response.choices[0].message.content;
    } catch (error) {
      if (error.status === 401) throw AppError.unauthorized('Invalid OpenAI API key.');
      if (error.status === 429) throw AppError.tooMany('OpenAI rate limit exceeded.');
      throw AppError.internal(`OpenAI error: ${error.message}`);
    }
  }

  async call(messages, options = {}) {
    if (this.provider === 'gemini') return this.callGemini(messages, options);
    return this.callOpenAI(messages, options);
  }

  async generateQuestions({ company, jobRole, difficulty, count = 5 }) {

    
    if (env.USE_AI_MOCK === 'true') {
      return [
        {
          text:       `At ${company}, how would you design a distributed cache system?`,
          type:       'system-design',
          category:   'Scalability',
          orderIndex: 0,
        },
        {
          text:       'Explain the difference between HashMap and TreeMap. When would you use each?',
          type:       'technical',
          category:   'Data Structures',
          orderIndex: 1,
        },
        {
          text:       'Tell me about a time you had to meet a tight deadline. How did you handle it?',
          type:       'behavioral',
          category:   'Leadership',
          orderIndex: 2,
        },
        {
          text:       `Design a real-time notification system for ${company} with millions of users.`,
          type:       'system-design',
          category:   'System Design',
          orderIndex: 3,
        },
        {
          text:       'What is the time complexity of quicksort? Explain best, average, and worst cases.',
          type:       'technical',
          category:   'Algorithms',
          orderIndex: 4,
        },
      ].slice(0, count);
    }

    // REAL AI CALL
    const messages = promptBuilder.buildQuestionsPrompt({
      company,
      jobRole,
      difficulty,
      count,
    });

    const raw = await this.call(messages, {
      temperature: 0.8,
      max_tokens:  2000,
    });

    return responseParser.parseQuestions(raw);
  }
  // services/aiService.js — replace mock evaluateAnswer block

async evaluateAnswer({ question, answer, company, jobRole }) {
  if (env.USE_AI_MOCK === 'true') {
    /*
     * Mock evaluation with realistic 4-dimension scores.
     * Score varies by answer length to simulate real evaluation.
     */
    const len = answer ? answer.length : 0;

    const technicalScore     = len < 30  ? 3.0 : len < 100 ? 5.5 : len < 300 ? 7.0 : 8.5;
    const communicationScore = len < 30  ? 2.5 : len < 100 ? 5.0 : len < 300 ? 7.5 : 8.0;
    const depthScore         = len < 30  ? 2.0 : len < 100 ? 4.5 : len < 300 ? 6.5 : 8.0;
    const overallScore = Math.round(
      (technicalScore * 0.4 + communicationScore * 0.3 + depthScore * 0.3) * 10
    ) / 10;

    return {
      technicalScore,
      communicationScore,
      depthScore,
      overallScore,
      feedback:        `Your answer demonstrates ${len > 100 ? 'good' : 'basic'} understanding of the concept. ${len > 200 ? 'The explanation was detailed and well-structured.' : 'The answer could benefit from more detail.'}`,
      strengths:       len > 100
        ? 'Good use of relevant terminology and structured explanation. You addressed the core concept clearly.'
        : 'You identified the relevant topic area and provided a starting point.',
      improvements:   'Consider discussing time and space complexity, edge cases, and alternative approaches. Adding a concrete example would strengthen your answer significantly.',
      suggestedAnswer: `An ideal answer would: (1) define the core concept, (2) explain the mechanism with an example, (3) discuss trade-offs and when to use it, (4) mention edge cases and complexity.`,
    };
  }

  // Real AI call
  const messages = promptBuilder.buildEvaluationPrompt({
    question, answer, company, jobRole,
  });
  const raw = await this.call(messages, { temperature: 0.3, max_tokens: 1200 });
  return responseParser.parseEvaluation(raw);
}
}

module.exports = new AIService();