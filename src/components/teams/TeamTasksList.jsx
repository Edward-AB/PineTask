import { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme.js';
import { apiGet } from '../../api/client.js';

export default function TeamTasksList({ teamId }) {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) return;
    setLoading(true);
    apiGet(`/api/teams/${teamId}/tasks`)
      .then((res) => setTasks(res?.data || []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, [teamId]);

  return (
    <div style={{
      background: theme.bgSecondary,
      border: `0.5px solid ${theme.border}`,
      borderRadius: 14, padding: 14,
    }}>
      <div style={{
        fontSize: 10, fontWeight: 500, color: theme.textTertiary,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        marginBottom: 10,
      }}>Team tasks ({tasks.length})</div>

      {loading ? (
        <div style={{ fontSize: 11, color: theme.textTertiary, padding: '8px 0' }}>Loading…</div>
      ) : tasks.length === 0 ? (
        <div style={{ fontSize: 11, color: theme.textTertiary, textAlign: 'center', padding: '12px 0' }}>
          No tasks assigned to this team yet
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 360, overflowY: 'auto' }}>
          {tasks.map((t) => (
            <div key={t.id} style={{
              background: theme.surface,
              border: `0.5px solid ${theme.borderLight}`,
              borderRadius: 8, padding: '8px 10px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 12, fontWeight: 500, color: theme.textPrimary,
                  textDecoration: t.done ? 'line-through' : 'none',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {t.text}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 2, fontSize: 10, color: theme.textTertiary }}>
                  <span>{t.date}</span>
                  {t.priority && <span>{t.priority}</span>}
                  {t.assignee_username && <span>@{t.assignee_username}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
