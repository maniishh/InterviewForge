// src/hooks/useInterview.js
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';

/*
 * WHY sessionStorage?
 * useInterview state lives in React memory.
 * When React navigates to /interview, Setup unmounts → state is lost.
 * sessionStorage persists across page navigations within the same tab.
 * It's cleared when the tab closes — perfect for a single interview session.
 */

const STORAGE_KEY = 'interviewforge_session';

const saveToStorage = (data) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

const loadFromStorage = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const clearStorage = () => {
  try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
};

const useInterview = () => {
  const navigate = useNavigate();

  // Load from sessionStorage on first render
  const saved = loadFromStorage();

  const [sessionId,    setSessionId]    = useState(saved?.sessionId    || null);
  const [questions,    setQuestions]    = useState(saved?.questions    || []);
  const [currentIndex, setCurrentIndex] = useState(saved?.currentIndex || 0);
  const [answers,      setAnswers]      = useState(saved?.answers      || {});
  const [evaluations,  setEvaluations]  = useState(saved?.evaluations  || {});
  const [sessionResult,setSessionResult]= useState(null);
  const [isStarting,   setIsStarting]   = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // Persist to sessionStorage whenever key state changes
  useEffect(() => {
    if (sessionId) {
      saveToStorage({ sessionId, questions, currentIndex, answers, evaluations });
    }
  }, [sessionId, questions, currentIndex, answers, evaluations]);

  // ── START INTERVIEW ──────────────────────────────────────────────────────
  const startInterview = useCallback(async ({ company, jobRole, difficulty, questionCount }) => {
    setIsStarting(true);
    try {
      const { data } = await api.post('/interviews/start', {
        company, jobRole, difficulty, questionCount,
      });

      const { sessionId: id, questions: qs } = data.data;

      // Clear old session first
      clearStorage();

      setSessionId(id);
      setQuestions(qs);
      setCurrentIndex(0);
      setAnswers({});
      setEvaluations({});

      // Save immediately before navigating
      saveToStorage({ sessionId: id, questions: qs, currentIndex: 0, answers: {}, evaluations: {} });

      toast.success(`Interview started — ${qs.length} questions ready`);
      navigate('/interview');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsStarting(false);
    }
  }, [navigate]);

  // ── SUBMIT ANSWER ────────────────────────────────────────────────────────
  const submitAnswer = useCallback(async (answerText) => {
    if (!sessionId) return null;

    setIsSubmitting(true);
    try {
      const { data } = await api.post(`/interviews/${sessionId}/submit`, {
        questionIndex: currentIndex,
        answerText,
      });

      const { evaluation } = data.data;

      setAnswers(prev => {
        const updated = { ...prev, [currentIndex]: answerText };
        return updated;
      });

      setEvaluations(prev => {
        const updated = { ...prev, [currentIndex]: evaluation };
        return updated;
      });

      toast.success(`Score: ${evaluation.overallScore}/10`);
      return evaluation;
    } catch (error) {
      toast.error(error.message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [sessionId, currentIndex]);

  // ── NAVIGATE ─────────────────────────────────────────────────────────────
  const goToNext = useCallback(() => {
    setCurrentIndex(i => Math.min(i + 1, questions.length - 1));
  }, [questions.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex(i => Math.max(i - 1, 0));
  }, []);

  // ── COMPLETE ─────────────────────────────────────────────────────────────
  const completeInterview = useCallback(async () => {
    if (!sessionId) return;

    setIsCompleting(true);
    try {
      const { data } = await api.post(`/interviews/${sessionId}/complete`);
      setSessionResult(data.data);
      clearStorage();  // Clear session after completion
      toast.success('Interview complete!');
      navigate('/feedback', { state: { result: data.data, sessionId } });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsCompleting(false);
    }
  }, [sessionId, navigate]);

  // ── DERIVED STATE ─────────────────────────────────────────────────────────
  const currentQuestion   = questions[currentIndex] || null;
  const isLastQuestion    = currentIndex === questions.length - 1;
  const currentAnswer     = answers[currentIndex]     || '';
  const currentEvaluation = evaluations[currentIndex] || null;
  const answeredCount     = Object.keys(answers).length;
  const allAnswered       = answeredCount === questions.length && questions.length > 0;
  const progress          = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return {
    sessionId, questions, currentIndex, answers, evaluations,
    sessionResult, isStarting, isSubmitting, isCompleting,
    currentQuestion, isLastQuestion, currentAnswer,
    currentEvaluation, answeredCount, allAnswered, progress,
    startInterview, submitAnswer, goToNext, goToPrev, completeInterview,
  };
};

export default useInterview;