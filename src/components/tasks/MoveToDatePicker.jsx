import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme.js';
import { dateKey, addDays, getMonday } from '../../utils/dates.js';

export default function MoveToDatePicker({ onSelect, onClose }) {
  const { theme } = useTheme();
  const ref = useRef(null);
  const [customDate, setCustomDate] = useState('');

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const today = new Date();
  const tomorrow = addDays(today, 1);
  const daysUntilMonday = (8 - today.getDay()) % 7 || 7;
  const nextMonday = addDays(today, daysUntilMonday);

  const handleQuick = (date) => {
    onSelect(dateKey(date));
  };

  const handleCustom = () => {
    if (customDate) onSelect(customDate);
  };

  const popupStyle = {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 4,
    zIndex: 100,
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: theme.radius.md,
    padding: 12,
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    minWidth: 200,
  };

  const titleStyle = {
    fontSize: theme.font.label,
    fontWeight: 500,
    color: theme.textTertiary,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginBottom: 10,
  };

  const quickBtnStyle = {
    width: '100%',
    textAlign: 'left',
    padding: '7px 10px',
    fontSize: theme.font.bodySmall,
    color: theme.textPrimary,
    background: theme.bgSecondary,
    border: `1px solid ${theme.border}`,
    borderRadius: theme.radius.sm,
    cursor: 'pointer',
    transition: theme.transition,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const dateHintStyle = {
    fontSize: theme.font.label,
    color: theme.textTertiary,
  };

  const dividerStyle = {
    height: 1,
    background: theme.border,
    margin: '10px 0',
  };

  const inputStyle = {
    width: '100%',
    padding: '6px 8px',
    fontSize: theme.font.bodySmall,
    border: `1px solid ${theme.border}`,
    borderRadius: theme.radius.sm,
    background: theme.bg,
    color: theme.textPrimary,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const applyBtnStyle = {
    marginTop: 8,
    width: '100%',
    padding: '6px 10px',
    fontSize: theme.font.bodySmall,
    fontWeight: 500,
    color: theme.accentBtnText,
    background: theme.accentBtn,
    border: 'none',
    borderRadius: theme.radius.sm,
    cursor: customDate ? 'pointer' : 'default',
    opacity: customDate ? 1 : 0.5,
  };

  const formatLabel = (d) =>
    d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div ref={ref} style={popupStyle}>
      <div style={titleStyle}>Move to</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button style={quickBtnStyle} onClick={() => handleQuick(tomorrow)}>
          <span>Tomorrow</span>
          <span style={dateHintStyle}>{formatLabel(tomorrow)}</span>
        </button>
        <button style={quickBtnStyle} onClick={() => handleQuick(nextMonday)}>
          <span>Next Monday</span>
          <span style={dateHintStyle}>{formatLabel(nextMonday)}</span>
        </button>
      </div>

      <div style={dividerStyle} />

      <label style={{ fontSize: theme.font.label, color: theme.textTertiary, marginBottom: 4, display: 'block' }}>
        Pick a date
      </label>
      <input
        type="date"
        value={customDate}
        onChange={(e) => setCustomDate(e.target.value)}
        min={dateKey(addDays(today, 1))}
        style={inputStyle}
      />
      <button style={applyBtnStyle} onClick={handleCustom} disabled={!customDate}>
        Move
      </button>
    </div>
  );
}
