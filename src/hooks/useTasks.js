import { useState, useCallback } from 'react';
import { apiGet, apiPost, apiPatch, apiDelete } from '../api/client.js';

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async (from, to) => {
    setLoading(true);
    try {
      const res = await apiGet(`/api/tasks?from=${from}&to=${to}`);
      setTasks(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async (task) => {
    const res = await apiPost('/api/tasks', task);
    setTasks((prev) => [...prev, res.data]);
    return res.data;
  }, []);

  const updateTask = useCallback(async (id, updates) => {
    const res = await apiPatch(`/api/tasks/${id}`, updates);
    setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    return res.data;
  }, []);

  const deleteTask = useCallback(async (id) => {
    await apiDelete(`/api/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTask = useCallback(async (id, done) => {
    const res = await apiPatch(`/api/tasks/${id}`, {
      done: done ? 1 : 0,
      done_at: done ? Date.now() : null,
    });
    setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    return res.data;
  }, []);

  const moveTask = useCallback(async (taskId, newDate) => {
    const res = await apiPost('/api/tasks/move', { taskId, newDate });
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...res.data } : t)));
    return res.data;
  }, []);

  const reorderTasks = useCallback(async (taskIds) => {
    await apiPost('/api/tasks/reorder', { taskIds });
  }, []);

  return {
    tasks,
    loading,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    moveTask,
    reorderTasks,
  };
}
