import { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme.js';
import { apiGet, apiPost, apiDelete } from '../../api/client.js';
import useTeams from '../../hooks/useTeams.js';

export default function ProjectTeamSection({ projectId }) {
  const { theme } = useTheme();
  const { teams } = useTeams();
  const [assignments, setAssignments] = useState([]);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await apiGet(`/api/projects/${projectId}/team`);
      setAssignments(res?.data || []);
    } catch {}
  };

  useEffect(() => { if (projectId) load(); }, [projectId]);

  const assign = async (teamId) => {
    try {
      setSaving(true);
      await apiPost(`/api/projects/${projectId}/team`, { teamId });
      setAdding(false);
      load();
    } catch {} finally { setSaving(false); }
  };

  const unassign = async (teamId) => {
    try {
      await apiDelete(`/api/projects/${projectId}/team/${teamId}`);
      load();
    } catch {}
  };

  const assignedIds = new Set(assignments.map((a) => a.team_id));
  const available = teams.filter((t) => !assignedIds.has(t.id));

  const sectionStyle = {
    padding: 16,
    borderRadius: theme.radius.lg,
    border: `1px solid ${theme.border}`,
    background: theme.surface,
    marginBottom: 16,
  };

  const sectionTitle = {
    fontSize: theme.font.label,
    fontWeight: 500,
    color: theme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  };

  return (
    <div style={sectionStyle}>
      <div style={sectionTitle}>
        <span>Teams</span>
        {teams.length > 0 && (
          <button onClick={() => setAdding((a) => !a)} style={{
            background: 'none', border: `0.5px solid ${theme.border}`,
            borderRadius: 6, padding: '3px 9px', fontSize: 10,
            color: theme.textSecondary, cursor: 'pointer',
            fontFamily: 'inherit', textTransform: 'none', letterSpacing: 0,
          }}>{adding ? 'Cancel' : '+ Assign'}</button>
        )}
      </div>

      {adding && (
        <div style={{ marginBottom: 10 }}>
          {available.length === 0 ? (
            <div style={{ fontSize: 11, color: theme.textTertiary }}>
              {teams.length === 0 ? 'No teams yet' : 'All teams already assigned'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 180, overflowY: 'auto' }}>
              {available.map((t) => (
                <button key={t.id} onClick={() => assign(t.id)} disabled={saving} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  textAlign: 'left', background: theme.bgSecondary,
                  border: `0.5px solid ${theme.borderLight}`,
                  borderRadius: 6, padding: '6px 8px',
                  fontSize: 12, color: theme.textPrimary,
                  cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: t.color || theme.accent,
                  }} />
                  {t.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {assignments.length === 0 ? (
        <div style={{ fontSize: 11, color: theme.textTertiary }}>
          No teams assigned. {teams.length === 0 ? 'Create a team to collaborate on this project.' : 'Assign a team to share this project.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {assignments.map((a) => (
            <div key={a.team_id} className="trow" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: theme.bgSecondary,
              border: `0.5px solid ${theme.borderLight}`,
              borderRadius: 8, padding: '6px 10px',
            }}>
              <span style={{
                width: 10, height: 10, borderRadius: '50%',
                background: a.team_color || theme.accent,
              }} />
              <span style={{ flex: 1, fontSize: 12, color: theme.textPrimary }}>
                {a.team_name}
              </span>
              <button
                onClick={() => unassign(a.team_id)}
                className="ta"
                title="Unassign team"
                style={{
                  background: 'none', border: 'none',
                  color: theme.danger, fontSize: 14,
                  cursor: 'pointer', lineHeight: 1,
                }}
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
