import { useState, useCallback } from 'react';
import { apiGet, apiPost, apiDelete } from '../api/client.js';

export default function useBlockedTimes() {
  const [blockedTimes, setBlockedTimes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBlockedTimes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet('/api/blocked-times');
      setBlockedTimes(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const addBlockedTime = useCallback(async (bt) => {
    const res = await apiPost('/api/blocked-times', bt);
    setBlockedTimes((prev) => [...prev, res.data]);
    return res.data;
  }, []);

  const deleteBlockedTime = useCallback(async (id) => {
    await apiDelete(`/api/blocked-times/${id}`);
    setBlockedTimes((prev) => prev.filter((bt) => bt.id !== id));
  }, []);

  return {
    blockedTimes,
    loading,
    fetchBlockedTimes,
    addBlockedTime,
    deleteBlockedTime,
  };
}
