import { useTheme } from '../../hooks/useTheme.js';

export default function TaskColorPicker({ value, onChange }) {
  const { theme } = useTheme();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 24px)', gap: 6 }}>
      {theme.taskColor.map(c => (
        <button key={c.id} type="button" onClick={() => onChange(c.id)} style={{
          width: 24, height: 24, borderRadius: '50%', background: c.bg,
          border: value === c.id ? `2px solid ${theme.textPrimary}` : `1.5px solid ${c.border}`,
          cursor: 'pointer', padding: 0,
          transition: 'transform 150ms',
          transform: value === c.id ? 'scale(1.15)' : 'scale(1)',
        }} />
      ))}
    </div>
  );
}
