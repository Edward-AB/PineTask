import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme.js';

export default function FirstProjectStep({ onCreateProject, onSkip, onBack }) {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [colorIdx, setColorIdx] = useState(0);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 16px',
    maxWidth: 420,
    margin: '0 auto',
  };

  const headingStyle = {
    fontSize: theme.font.heading,
    fontWeight: 700,
    color: theme.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  };

  const subStyle = {
    fontSize: theme.font.bodySmall,
    color: theme.textSecondary,
    marginBottom: 28,
    textAlign: 'center',
  };

  const formStyle = {
    width: '100%',
    marginBottom: 24,
  };

  const labelStyle = {
    fontSize: theme.font.label,
    fontWeight: 500,
    color: theme.textTertiary,
    marginBottom: 6,
    display: 'block',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    fontSize: theme.font.body,
    color: theme.textPrimary,
    background: theme.bgSecondary,
    border: `1px solid ${theme.border}`,
    borderRadius: theme.radius.md,
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: 18,
  };

  const colorsLabel = {
    ...labelStyle,
    marginBottom: 8,
  };

  const colorsRowStyle = {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 24,
  };

  const colorSwatchStyle = (dlColor, isSelected) => ({
    width: 32,
    height: 32,
    borderRadius: theme.radius.sm,
    background: dlColor.bg,
    border: isSelected
      ? `2.5px solid ${dlColor.dot}`
      : `2px solid ${dlColor.border}40`,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: theme.transition,
  });

  const previewStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: theme.radius.md,
    background: theme.deadline[colorIdx % theme.deadline.length].bg,
    borderLeft: `4px solid ${theme.deadline[colorIdx % theme.deadline.length].dot}`,
    marginBottom: 24,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    minHeight: 44,
  };

  const previewDotStyle = {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: theme.deadline[colorIdx % theme.deadline.length].dot,
    flexShrink: 0,
  };

  const previewNameStyle = {
    fontSize: theme.font.body,
    fontWeight: 500,
    color: theme.deadline[colorIdx % theme.deadline.length].text,
  };

  const createBtnStyle = {
    width: '100%',
    padding: '10px 16px',
    fontSize: theme.font.body,
    fontWeight: 600,
    color: theme.accentBtnText,
    background: theme.accentBtn,
    border: 'none',
    borderRadius: theme.radius.md,
    cursor: name.trim() ? 'pointer' : 'default',
    opacity: name.trim() ? 1 : 0.5,
    marginBottom: 10,
    transition: theme.transition,
  };

  const skipStyle = {
    fontSize: theme.font.bodySmall,
    color: theme.textTertiary,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: '6px 12px',
    marginBottom: 16,
  };

  const backBtnStyle = {
    padding: '8px 16px',
    fontSize: theme.font.bodySmall,
    fontWeight: 500,
    color: theme.textSecondary,
    background: 'transparent',
    border: `1px solid ${theme.border}`,
    borderRadius: theme.radius.md,
    cursor: 'pointer',
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreateProject({ name: name.trim(), color_idx: colorIdx });
  };

  return (
    <div style={containerStyle}>
      <div style={headingStyle}>Create your first project</div>
      <div style={subStyle}>
        Projects group tasks and deadlines together
      </div>

      <div style={formStyle}>
        <label style={labelStyle}>Project name</label>
        <input
          type="text"
          placeholder="e.g. Work, School, Side project..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          autoFocus
        />

        <label style={colorsLabel}>Color</label>
        <div style={colorsRowStyle}>
          {theme.deadline.map((dlColor, i) => (
            <div
              key={i}
              style={colorSwatchStyle(dlColor, colorIdx === i)}
              onClick={() => setColorIdx(i)}
            >
              {colorIdx === i && (
                <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
                  <path d="M3 7l3 3 5-5" stroke={dlColor.dot} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          ))}
        </div>

        {name.trim() && (
          <div style={previewStyle}>
            <div style={previewDotStyle} />
            <div style={previewNameStyle}>{name.trim()}</div>
          </div>
        )}
      </div>

      <button style={createBtnStyle} onClick={handleCreate} disabled={!name.trim()}>
        Create project
      </button>
      <button style={skipStyle} onClick={onSkip}>
        Skip for now
      </button>
      <button style={backBtnStyle} onClick={onBack}>
        Back
      </button>
    </div>
  );
}
