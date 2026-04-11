import { useState, useCallback } from 'react';
import { apiGet, apiPost, apiPatch, apiDelete } from '../api/client.js';

export default function useDeadlines() {
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDeadlines = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet('/api/deadlines');
      setDeadlines(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const addDeadline = useCallback(async (dl) => {
    const res = await apiPost('/api/deadlines', dl);
    setDeadlines((prev) => [...prev, res.data]);
    return res.data;
  }, []);

  const updateDeadline = useCallback(async (id, updates) => {
    const res = await apiPatch(`/api/deadlines/${id}`, updates);
    setDeadlines((prev) => prev.map((d) => (d.id === id ? res.data : d)));
    return res.data;
  }, []);

  const deleteDeadline = useCallback(async (id) => {
    await apiDelete(`/api/deadlines/${id}`);
    setDeadlines((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return {
    deadlines,
    loading,
    fetchDeadlines,
    addDeadline,
    updateDeadline,
    deleteDeadline,
  };
}
