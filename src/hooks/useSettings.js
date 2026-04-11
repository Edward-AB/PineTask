import { useState, useCallback } from 'react';
import { apiGet, apiPut } from '../api/client.js';

export default function useSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet('/api/account/settings');
      setSettings(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (updates) => {
    const res = await apiPut('/api/account/settings', updates);
    setSettings(res.data);
    return res.data;
  }, []);

  return {
    settings,
    loading,
    fetchSettings,
    updateSettings,
  };
}
