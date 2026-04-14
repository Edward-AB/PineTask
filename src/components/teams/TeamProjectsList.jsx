import { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme.js';
import { apiGet, apiPost, apiDelete } from '../../api/client.js';

export default function TeamProjectsList({ teamId }) {
  const { theme } = useTheme();
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [adding, setAdding] = useState(false);

  const load = async () => {
    try {
      const [pr, all] = await Promise.all([
        apiGet(`/api/projects?team_id=${teamId}`).catch(() => ({ data: [] })),
        apiGet('/api/projects').catch(() => ({ data: [] })),
      ]);
      // If /api/projects?team_id isn't supported, derive by fetching team assignments for each owned project.
      // Fallback: fetch assignments per project.
      const list = pr?.data || [];
      setAllProjects(all?.data || []);
      if (list.length) {
        setProjects(list);
      } else {
        // Lookup per project
        const assigned = [];
        for (const p of (all?.data || [])) {
          try {
            const t = await apiGet(`/api/projects/${p.id}/team`);
            if ((t?.data || []).some((a) => a.team_id === teamId)) assigned.push(p);
          } catch {}
        }
        setProjects(assigned);
      }
    } catch {}
  };

  useEffect(() => { if (teamId) load(); }, [teamId]);

  const assignProject = async (projectId) => {
    try {
      await apiPost(`/api/projects/${projectId}/team`, { teamId });
      setAdding(false);
      load();
    } catch {}
  };

  const removeProject = async (projectId) => {
    try {
      await apiDelete(`/api/projects/${projectId}/team/${teamId}`);
      load();
    } catch {}
  };

  const assignedIds = new Set(projects.map((p) => p.id));
  const available = allProjects.filter((p) => !assignedIds.has(p.id));

  return (
    <div style={{
      background: theme.bgSecondary,
      border: `0.5px solid ${theme.border}`,
      borderRadius: 14, padding: 14, marginBottom: 12,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 10,
      }}>
        <div style={{
          fontSize: 10, fontWeight: 500, color: theme.textTertiary,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>Projects ({projects.length})</div>
        <button onClick={() => setAdding((a) => !a)} style={{
          background: 'none', border: `0.5px solid ${theme.border}`,
          borderRadius: 6, padding: '3px 9px', fontSize: 10,
          color: theme.textSecondary, cursor: 'pointer',
          fontFamily: 'inherit',
        }}>{adding ? 'Cancel' : '+ Assign'}</button>
      </div>

      {adding && (
        <div style={{ marginBottom: 10 }}>
          {available.length === 0 ? (
            <div style={{ fontSize: 11, color: theme.textTertiary }}>No unassigned projects</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 140, overflowY: 'auto' }}>
              {available.map((p) => (
                <button key={p.id} onClick={() => assignProject(p.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  textAlign: 'left', background: theme.surface,
                  border: `0.5px solid ${theme.borderLight}`,
                  borderRadius: 6, padding: '5px 8px',
                  fontSize: 11, color: theme.textPrimary,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {projects.length === 0 ? (
        <EmptyState text="No projects assigned" />
      ) : (
        <div style={{ display: 'grid', gap: 6 }}>
          {projects.map((p) => (
            <div key={p.id} className="trow" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: theme.surface,
              border: `0.5px solid ${theme.borderLight}`,
              borderRadius: 8, padding: '8px 10px',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: theme.textPrimary }}>
                  {p.name}
                </div>
                {p.description && (
                  <div style={{ fontSize: 10, color: theme.textTertiary, marginTop: 2 }}>
                    {p.description}
                  </div>
                )}
              </div>
              <button onClick={() => removeProject(p.id)} className="ta" style={{
                background: 'none', border: 'none', color: theme.danger,
                fontSize: 14, cursor: 'pointer', lineHeight: 1,
              }}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ text }) {
  const { theme } = useTheme();
  return (
    <div style={{ padding: '16px 0', textAlign: 'center', color: theme.textTertiary, fontSize: 11 }}>
      {text}
    </div>
  );
}
