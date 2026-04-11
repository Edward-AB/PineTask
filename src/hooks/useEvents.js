import { useState, useCallback } from 'react';
import { apiGet, apiPost, apiPatch, apiDelete } from '../api/client.js';

export default function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = useCallback(async (from, to) => {
    setLoading(true);
    try {
      const res = await apiGet(`/api/events?from=${from}&to=${to}`);
      setEvents(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const addEvent = useCallback(async (e) => {
    const res = await apiPost('/api/events', e);
    setEvents((prev) => [...prev, res.data]);
    return res.data;
  }, []);

  const updateEvent = useCallback(async (id, updates) => {
    const res = await apiPatch(`/api/events/${id}`, updates);
    setEvents((prev) => prev.map((ev) => (ev.id === id ? res.data : ev)));
    return res.data;
  }, []);

  const deleteEvent = useCallback(async (id) => {
    await apiDelete(`/api/events/${id}`);
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  }, []);

  return {
    events,
    loading,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
  };
}
