import { useState, useCallback } from 'react';
import { apiGet, apiPut } from '../api/client.js';

export default function useDayNotes() {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchNote = useCallback(async (date) => {
    setLoading(true);
    try {
      const res = await apiGet(`/api/day-notes?date=${date}`);
      setNote(res.data.content || '');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveNote = useCallback(async (date, content) => {
    await apiPut('/api/day-notes', { date, content });
    setNote(content);
  }, []);

  return {
    note,
    loading,
    fetchNote,
    saveNote,
  };
}
