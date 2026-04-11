import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme.js';

export default function ProjectForm({ project, onSubmit, onCancel }) {
  const { theme } = useTheme();
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [colorIdx, setColorIdx] = useState(project?.color_idx ?? 0);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Project name is required'); return; }
    onSubmit({ name: name.trim(), description, color_idx: colorIdx });
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.border}`,
    background: theme.bg,
    color: theme.textPrimary,
    fontSize: theme.font.body,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: theme.font.label,
    fontWeight: 500,
    color: theme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: 4,
    display: 'block',
  };

  const formStyle = {
    padding: 16,
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.border}`,
    background: theme.bgSecondary,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      {error && (
        <div style={{ fontSize: theme.font.bodySmall, color: theme.danger, padding: '6px 10px', background: theme.dangerBg, borderRadius: theme.radius.sm }}>
          {error}
        </div>
      )}

      <div>
        <label style={labelStyle}>Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Project name"
          style={inputStyle}
          autoFocus
        />
      </div>

      <div>
        <label style={labelStyle}>Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Brief description (optional)"
          rows={3}
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>

      <div>
        <label style={labelStyle}>Colour</label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
          {theme.deadline.map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setColorIdx(i)}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: c.dot,
                border: colorIdx === i ? `2.5px solid ${theme.textPrimary}` : '2.5px solid transparent',
                cursor: 'pointer',
                padding: 0,
                transition: `transform 150ms`,
                transform: colorIdx === i ? 'scale(1.15)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button type="submit" style={{
          padding: '7px 18px',
          borderRadius: theme.radius.sm,
          background: theme.accentBtn,
          color: theme.accentBtnText,
          fontWeight: 600,
          fontSize: theme.font.bodySmall,
          cursor: 'pointer',
          border: 'none',
        }}>
          {project ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} style={{
          padding: '7px 18px',
          borderRadius: theme.radius.sm,
          border: `1px solid ${theme.border}`,
          color: theme.textSecondary,
          fontSize: theme.font.bodySmall,
          cursor: 'pointer',
          background: 'transparent',
        }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
