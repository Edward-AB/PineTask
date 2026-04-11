import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme.js';
import { dateKey } from '../../utils/dates.js';

export default function DeadlineForm({ projects = [], onSubmit, onCancel, deadline }) {
  const { theme } = useTheme();
  const today = dateKey(new Date());
  const [title, setTitle] = useState(deadline?.title || '');
  const [desc, setDesc] = useState(deadline?.description || '');
  const [startDate, setStartDate] = useState(deadline?.start_date || today);
  const [dueDate, setDueDate] = useState(deadline?.due_date || '');
  const [colorIdx, setColorIdx] = useState(deadline?.color_idx ?? 0);
  const [projectId, setProjectId] = useState(deadline?.project_id || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title required'); return; }
    if (!dueDate) { setError('Due date required'); return; }
    if (startDate > dueDate) { setError('Start date must be before due date'); return; }
    onSubmit({
      title: title.trim(), description: desc, start_date: startDate,
      due_date: dueDate, color_idx: colorIdx, project_id: projectId || null,
    });
  };

  const inputStyle = {
    width: '100%', padding: '6px 10px', borderRadius: theme.radius.sm,
    border: `1px solid ${theme.border}`, background: theme.bg,
    color: theme.textPrimary, fontSize: theme.font.bodySmall, outline: 'none',
  };

  return (
    <form onSubmit={handleSubmit} style={{
      padding: 12, borderRadius: theme.radius.md, border: `1px solid ${theme.border}`,
      background: theme.bgSecondary, display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      {error && <div style={{ fontSize: theme.font.label, color: theme.danger }}>{error}</div>}
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Deadline title" style={inputStyle} autoFocus />
      <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description (optional)" style={inputStyle} />
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: theme.font.label, color: theme.textTertiary, display: 'block', marginBottom: 2 }}>Start</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: theme.font.label, color: theme.textTertiary, display: 'block', marginBottom: 2 }}>Due</label>
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} min={startDate} style={inputStyle} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span style={{ fontSize: theme.font.label, color: theme.textTertiary }}>Colour:</span>
        {theme.deadline.map((c, i) => (
          <button key={i} type="button" onClick={() => setColorIdx(i)} style={{
            width: 20, height: 20, borderRadius: '50%', background: c.dot,
            border: colorIdx === i ? `2px solid ${theme.textPrimary}` : '2px solid transparent',
            cursor: 'pointer', padding: 0,
          }} />
        ))}
      </div>
      {projects.length > 0 && (
        <select value={projectId} onChange={e => setProjectId(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
          <option value="">No project</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      )}
      <div style={{ display: 'flex', gap: 6 }}>
        <button type="submit" style={{
          padding: '5px 14px', borderRadius: theme.radius.sm, background: theme.accentBtn,
          color: theme.accentBtnText, fontWeight: 500, fontSize: theme.font.bodySmall,
        }}>{deadline ? 'Save' : 'Create'}</button>
        <button type="button" onClick={onCancel} style={{
          padding: '5px 14px', borderRadius: theme.radius.sm, border: `1px solid ${theme.border}`,
          color: theme.textSecondary, fontSize: theme.font.bodySmall,
        }}>Cancel</button>
      </div>
    </form>
  );
}
