import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme.js';

export default function SubtaskList({ parentTaskId, subtasks = [] }) {
  const { theme } = useTheme();
  const [checked, setChecked] = useState(() => {
    const map = {};
    subtasks.forEach(st => { map[st.id] = !!st.done; });
    return map;
  });

  const count = subtasks.length;
  const doneCount = Object.values(checked).filter(Boolean).length;

  const containerStyle = {
    marginTop: 6,
    paddingLeft: 26,
  };

  const summaryStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: theme.font.label,
    color: theme.textTertiary,
  };

  const addBtnStyle = {
    fontSize: theme.font.label,
    color: theme.accent,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '2px 6px',
    borderRadius: theme.radius.sm,
  };

  const listStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    marginTop: 6,
  };

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: theme.font.bodySmall,
    color: theme.textSecondary,
  };

  const checkboxStyle = (done) => ({
    width: 14,
    height: 14,
    borderRadius: 3,
    flexShrink: 0,
    border: `1.5px solid ${done ? theme.accent : theme.border}`,
    background: done ? theme.accent : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  });

  const handleToggle = (id) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={containerStyle}>
      <div style={summaryStyle}>
        <span>{count > 0 ? `${doneCount}/${count} subtasks` : '0 subtasks'}</span>
        <button style={addBtnStyle} onClick={() => { /* stub: future implementation */ }}>
          + Add subtask
        </button>
      </div>

      {count > 0 && (
        <div style={listStyle}>
          {subtasks.map(st => (
            <div key={st.id} style={itemStyle}>
              <button
                style={checkboxStyle(!!checked[st.id])}
                onClick={() => handleToggle(st.id)}
              >
                {checked[st.id] && (
                  <svg width={8} height={8} viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <span style={{
                textDecoration: checked[st.id] ? 'line-through' : 'none',
                opacity: checked[st.id] ? 0.5 : 1,
              }}>
                {st.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
