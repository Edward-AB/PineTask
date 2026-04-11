import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme.js';
import { formatShortDate, daysUntil } from '../../utils/dates.js';

export default function OverdueAlert({ overdueDeadlines }) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);

  if (!overdueDeadlines || overdueDeadlines.length === 0) return null;

  const count = overdueDeadlines.length;

  const bannerStyle = {
    background: `${theme.danger}14`,
    border: `1px solid ${theme.danger}40`,
    borderRadius: theme.radius.md,
    padding: '10px 14px',
    marginBottom: 12,
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
  };

  const iconTextStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const dotStyle = {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: theme.danger,
    flexShrink: 0,
    animation: 'pulse 2s ease-in-out infinite',
  };

  const countStyle = {
    fontSize: theme.font.body,
    fontWeight: 600,
    color: theme.danger,
  };

  const toggleStyle = {
    fontSize: theme.font.label,
    color: theme.danger,
    opacity: 0.7,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '2px 6px',
    borderRadius: theme.radius.sm,
  };

  const listStyle = {
    marginTop: 10,
    paddingTop: 10,
    borderTop: `1px solid ${theme.danger}20`,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  };

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: theme.font.bodySmall,
    color: theme.danger,
    padding: '4px 0',
  };

  const daysLabelStyle = {
    fontSize: theme.font.label,
    color: theme.danger,
    opacity: 0.7,
    flexShrink: 0,
    marginLeft: 8,
  };

  return (
    <div style={bannerStyle}>
      <div style={headerStyle} onClick={() => setExpanded(!expanded)}>
        <div style={iconTextStyle}>
          <span style={dotStyle} />
          <span style={countStyle}>
            {count} overdue deadline{count !== 1 ? 's' : ''}
          </span>
        </div>
        <button style={toggleStyle}>
          {expanded ? '▾ Hide' : '▸ Show'}
        </button>
      </div>

      {expanded && (
        <div style={listStyle}>
          {overdueDeadlines.map(dl => {
            const days = daysUntil(dl.due_date);
            const overdueDays = days !== null ? Math.abs(days) : 0;
            return (
              <div key={dl.id} style={itemStyle}>
                <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {dl.title}
                </span>
                <span style={daysLabelStyle}>
                  {formatShortDate(dl.due_date)} ({overdueDays}d overdue)
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
