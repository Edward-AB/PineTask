import { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme.js';
import { apiGet, apiPost } from '../../api/client.js';

export default function TaskPalette({ teamId, currentDate, onTaskCreated }) {
  const { theme } = useTheme();
  const [unassigned, setUnassigned] = useState([]);
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('none');
  const [duration, setDuration] = useState(2);

  const load = async () => {
    if (!teamId) return;
    try {
      const res = await apiGet(`/api/teams/${teamId}/tasks`);
      const all = res?.data || [];
      const un = all.filter((t) => t.slot == null);
      setUnassigned(un);
    } catch {}
  };
  useEffect(() => { load(); }, [teamId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await apiPost('/api/tasks', {
        date: currentDate,
        text: text.trim(),
        priority: priority === 'none' ? null : priority,
        duration,
      });
      const task = res?.data;
      if (task?.id) {
        await apiPost(`/api/tasks/${task.id}/assign`, { teamId });
      }
      setText(''); setPriority('none'); setDuration(2);
      load();
      onTaskCreated?.(task);
    } catch {}
  };

  const inputStyle = {
    fontFamily: 'inherit', fontSize: 12,
    padding: '6px 9px', borderRadius: 7,
    border: `0.5px solid ${theme.border}`,
    background: theme.surface, color: theme.textPrimary,
    outline: 'none', width: '100%',
  };

  return (
    <div style={{
      width: 250, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      {/* Unassigned tasks */}
      <div style={{
        background: theme.bgSecondary, border: `0.5px solid ${theme.border}`,
        borderRadius: 14, padding: 14,
      }}>
        <div style={{
          fontSize: 10, fontWeight: 500, color: theme.textTertiary,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          marginBottom: 8,
        }}>Unassigned ({unassigned.length})</div>
        {unassigned.length === 0 ? (
          <div style={{ fontSize: 11, color: theme.textTertiary, padding: '6px 0' }}>
            All team tasks are scheduled
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 260, overflowY: 'auto' }}>
            {unassigned.map((t) => (
              <div key={t.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', t.id);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                style={{
                  background: theme.surface,
                  border: `0.5px solid ${theme.borderLight}`,
                  borderRadius: 7, padding: '6px 8px',
                  fontSize: 11, color: theme.textPrimary,
                  cursor: 'grab', display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <span style={{
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
                }}>{t.text}</span>
                <span style={{ fontSize: 9, color: theme.textTertiary }}>
                  {(t.duration || 2) * 15}m
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick create */}
      <form onSubmit={handleCreate} style={{
        background: theme.bgSecondary, border: `0.5px solid ${theme.border}`,
        borderRadius: 14, padding: 14, display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <div style={{
          fontSize: 10, fontWeight: 500, color: theme.textTertiary,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>Quick create</div>
        <input
          placeholder="Task text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={inputStyle}
        />
        <div style={{ display: 'flex', gap: 6 }}>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}>
            <option value="none">No priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}
            style={{ ...inputStyle, width: 80 }}>
            <option value={1}>15m</option>
            <option value={2}>30m</option>
            <option value={4}>1h</option>
            <option value={8}>2h</option>
          </select>
        </div>
        <button type="submit" disabled={!text.trim()} style={{
          background: theme.accentBtn, color: theme.accentBtnText,
          border: 'none', borderRadius: 8, padding: '7px 0',
          fontSize: 12, fontWeight: 500,
          cursor: text.trim() ? 'pointer' : 'not-allowed',
          opacity: text.trim() ? 1 : 0.6,
        }}>Create task</button>
      </form>
    </div>
  );
}
