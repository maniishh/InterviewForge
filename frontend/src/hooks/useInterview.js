import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';

const useInterview = () => {
  const navigate = useNavigate();

  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [sessionResult, setSessionResult] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const startInterview = useCallback(async ({ company, jobRole, difficulty, questionCount }) => {
    setIsStarting(true);

    try {
      const { data } = await api.post('/interviews/start', {
        company,
        jobRole,
        difficulty,
        questionCount,
      });

      const { sessionId: id, questions: qs } = data.data;

      setSessionId(id);
      setQuestions(qs);
      setCurrentIndex(0);
      setAnswers({});
      setEvaluations({});

      toast.success(`Interview started — ${qs.length} questions ready`);
      navigate('/interview');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsStarting(false);
    }
  }, [navigate]);

  const submitAnswer = useCallback(async (answerText) => {
    if (!sessionId) return;

    setIsSubmitting(true);

    try {
      const { data } = await api.post(`/interviews/${sessionId}/submit`, {
        questionIndex: currentIndex,
        answerText,
      });

      const { evaluation } = data.data;

      setAnswers(prev => ({ ...prev, [currentIndex]: answerText }));
      setEvaluations(prev => ({ ...prev, [currentIndex]: evaluation }));

      toast.success(`Score: ${evaluation.overallScore}/10 — answer evaluated`);
      return evaluation;
    } catch (error) {
      toast.error(error.message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [sessionId, currentIndex]);

  const goToNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
    }
  }, [currentIndex, questions.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
    }
  }, [currentIndex]);

  const completeInterview = useCallback(async () => {
    if (!sessionId) return;

    setIsCompleting(true);

    try {
      const { data } = await api.post(`/interviews/${sessionId}/complete`);
      setSessionResult(data.data);

      toast.success('Interview complete! Preparing your results...');
      navigate('/feedback', {
        state: { result: data.data, sessionId },
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsCompleting(false);
    }
  }, [sessionId, navigate]);

  const currentQuestion = questions[currentIndex] || null;
  const isLastQuestion = currentIndex === questions.length - 1;
  const currentAnswer = answers[currentIndex] || '';
  const currentEvaluation = evaluations[currentIndex] || null;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length && questions.length > 0;
  const progress = questions.length > 0
    ? (answeredCount / questions.length) * 100
    : 0;

  return {
    sessionId,
    questions,
    currentIndex,
    answers,
    evaluations,
    sessionResult,
    isStarting,
    isSubmitting,
    isCompleting,
    currentQuestion,
    isLastQuestion,
    currentAnswer,
    currentEvaluation,
    answeredCount,
    allAnswered,
    progress,
    startInterview,
    submitAnswer,
    goToNext,
    goToPrev,
    completeInterview,
  };
};

export default useInterview;