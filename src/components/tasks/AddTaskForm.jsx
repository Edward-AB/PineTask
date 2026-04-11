import { useState, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme.js';
import TaskColorPicker from './TaskColorPicker.jsx';

export default function AddTaskForm({ onAdd, deadlines = [], projects = [] }) {
  const { theme } = useTheme();
  const [text, setText] = useState('');
  const [priority, setPriority] = useState(null);
  const [colorId, setColorId] = useState('white');
  const [duration, setDuration] = useState(2);
  const [deadlineId, setDeadlineId] = useState('');
  const [projectId, setProjectId] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd({
      text: text.trim(), priority, color_id: colorId, duration,
      deadline_id: deadlineId || null, project_id: projectId || null,
    });
    setText('');
    setPriority(null);
    setColorId('white');
    inputRef.current?.focus();
  };

  const priorities = ['High', 'Medium', 'Low'];

  return (
    <div style={{
      padding: 16, borderRadius: theme.radius.lg, border: `1px solid ${theme.border}`,
      background: theme.surface,
    }}>
      <form onSubmit={handleSubmit}>
        <input ref={inputRef} value={text} onChange={e => setText(e.target.value)}
          placeholder="Add a task..." style={{
            width: '100%', padding: '10px 12px', borderRadius: theme.radius.md,
            border: `1px solid ${theme.border}`, background: theme.bg,
            color: theme.textPrimary, fontSize: theme.font.body, outline: 'none',
            marginBottom: 12,
          }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
          <TaskColorPicker value={colorId} onChange={setColorId} />

          <div style={{ display: 'flex', gap: 4 }}>
            {priorities.map(p => {
              const key = p.toLowerCase();
              const active = priority === key;
              const pc = theme.priority[key];
              return (
                <button key={key} type="button"
                  onClick={() => setPriority(active ? null : key)}
                  style={{
                    padding: '3px 10px', borderRadius: theme.radius.full,
                    fontSize: theme.font.label, fontWeight: 500,
                    background: active ? pc.bg : 'transparent',
                    color: active ? pc.text : theme.textTertiary,
                    border: `1px solid ${active ? pc.border : theme.border}`,
                  }}>{p}</button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={duration} onChange={e => setDuration(Number(e.target.value))}
            style={{
              padding: '5px 8px', borderRadius: theme.radius.sm, border: `1px solid ${theme.border}`,
              background: theme.bg, color: theme.textSecondary, fontSize: theme.font.label,
            }}>
            {[1,2,3,4,6,8,12].map(d => <option key={d} value={d}>{d * 15}m</option>)}
          </select>

          {deadlines.length > 0 && (
            <select value={deadlineId} onChange={e => setDeadlineId(e.target.value)}
              style={{
                padding: '5px 8px', borderRadius: theme.radius.sm, border: `1px solid ${theme.border}`,
                background: theme.bg, color: theme.textSecondary, fontSize: theme.font.label, maxWidth: 140,
              }}>
              <option value="">No deadline</option>
              {deadlines.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
            </select>
          )}

          {projects.length > 0 && (
            <select value={projectId} onChange={e => setProjectId(e.target.value)}
              style={{
                padding: '5px 8px', borderRadius: theme.radius.sm, border: `1px solid ${theme.border}`,
                background: theme.bg, color: theme.textSecondary, fontSize: theme.font.label, maxWidth: 140,
              }}>
              <option value="">No project</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          )}

          <button type="submit" style={{
            marginLeft: 'auto', padding: '6px 16px', borderRadius: theme.radius.md,
            background: theme.accentBtn, color: theme.accentBtnText,
            fontWeight: 500, fontSize: theme.font.bodySmall,
          }}>Add task</button>
        </div>
      </form>
    </div>
  );
}
