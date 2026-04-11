import { useState, useCallback } from 'react';
import { apiGet } from '../api/client.js';

export default function useStats() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet('/api/stats');
      setStats(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    loading,
    fetchStats,
  };
}
