import { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

const useRoadmap = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const fetchRoadmap = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data } = await api.get('/roadmap/active');
      setRoadmap(data.data.roadmap);
    } catch (err) {
      setError(err.message || 'Failed to load roadmap');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  const generateRoadmap = useCallback(async () => {
    setIsGenerating(true);
    setError('');
    const toastId = toast.loading('AI is generating your personalised roadmap...');
    try {
      await api.post('/roadmap/generate');
      await fetchRoadmap();
      toast.success('Your roadmap is ready!', { id: toastId });
    } catch (err) {
      setError(err.message || 'Failed to generate roadmap');
      toast.error(err.message || 'Generation failed', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  }, [fetchRoadmap]);

  const markTaskComplete = useCallback(async (roadmapId, week, day) => {
    setRoadmap(prev => {
      if (!prev) return prev;
      const updated = JSON.parse(JSON.stringify(prev));

      updated.phases?.forEach(phase => {
        phase.weeks?.forEach(w => {
          if (w.week === week) {
            w.dailyTasks?.forEach(task => {
              if (task.day === day && !task.completed) {
                task.completed = true;
                task.completedAt = new Date().toISOString();
              }
            });
          }
        });
      });

      return updated;
    });

    try {
      const { data } = await api.patch(`/roadmap/${roadmapId}/task/complete`, { week, day });
      setRoadmap(prev => prev ? { ...prev, progressPct: data.data.progressPct } : prev);
      toast.success(`Task completed! Progress: ${data.data.progressPct}%`);
    } catch (err) {
      await fetchRoadmap();
      toast.error('Failed to mark task complete');
    }
  }, [fetchRoadmap]);

  const hasRoadmap = !!roadmap;
  const progressPct = roadmap?.progressPct || 0;
  const currentWeek = roadmap?.phases?.flatMap(p => p.weeks)
    .find(w => !w.completed)?.week || 1;

  return {
    roadmap,
    isLoading,
    isGenerating,
    error,
    hasRoadmap,
    progressPct,
    currentWeek,
    generateRoadmap,
    markTaskComplete,
    refetch: fetchRoadmap,
  };
};

export default useRoadmap;