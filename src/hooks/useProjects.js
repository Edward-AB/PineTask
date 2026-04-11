import { useState, useCallback } from 'react';
import { apiGet, apiPost, apiPatch, apiDelete } from '../api/client.js';

export default function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet('/api/projects');
      setProjects(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProject = useCallback(async (p) => {
    const res = await apiPost('/api/projects', p);
    setProjects((prev) => [...prev, res.data]);
    return res.data;
  }, []);

  const updateProject = useCallback(async (id, updates) => {
    const res = await apiPatch(`/api/projects/${id}`, updates);
    setProjects((prev) => prev.map((p) => (p.id === id ? res.data : p)));
    return res.data;
  }, []);

  const deleteProject = useCallback(async (id) => {
    await apiDelete(`/api/projects/${id}`);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return {
    projects,
    loading,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
  };
}
