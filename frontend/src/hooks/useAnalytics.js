// frontend/src/hooks/useAnalytics.js
import { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';

const useAnalytics = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data: res } = await api.get('/analytics/dashboard?limit=20');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    overview: data?.overview || null,
    trends: data?.trends || [],
    topics: data?.topics || { all: [], strong: [], weak: [], developing: [] },
    companies: data?.companies || [],
    breakdown: data?.breakdown || [],
    isLoading,
    error,
    refetch: fetchAnalytics,
  };
};

export default useAnalytics;