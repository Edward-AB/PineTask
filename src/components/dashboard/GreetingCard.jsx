import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme.js';
import { useAuth } from '../../hooks/useAuth.js';
import WeekStrip from '../calendar/WeekStrip.jsx';
import MonthCalendar from '../calendar/MonthCalendar.jsx';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function GreetingCard({ date, onDateChange, tasks, calView, onCalViewChange }) {
  const { theme } = useTheme();
  const { user } = useAuth();

  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const cardStyle = {
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: theme.radius.lg,
    padding: '20px',
  };

  const greetStyle = {
    fontSize: theme.font.heading,
    fontWeight: 700,
    color: theme.textPrimary,
    marginBottom: 4,
  };

  const progressTextStyle = {
    fontSize: theme.font.bodySmall,
    color: theme.textSecondary,
    marginBottom: 10,
  };

  const trackStyle = {
    width: '100%',
    height: 6,
    background: theme.bgTertiary,
    borderRadius: theme.radius.full,
    overflow: 'hidden',
    marginBottom: 16,
  };

  const fillStyle = {
    width: `${pct}%`,
    height: '100%',
    background: theme.accent,
    borderRadius: theme.radius.full,
    transition: 'width 0.4s ease',
  };

  const toggleWrap = {
    display: 'flex',
    gap: 4,
    background: theme.bgTertiary,
    borderRadius: theme.radius.md,
    padding: 3,
    marginBottom: 14,
  };

  const toggleBtn = (active) => ({
    flex: 1,
    padding: '5px 0',
    border: 'none',
    borderRadius: theme.radius.sm,
    background: active ? theme.surface : 'transparent',
    color: active ? theme.textPrimary : theme.textTertiary,
    fontSize: theme.font.bodySmall,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: active ? theme.shadow.sm : 'none',
    transition: `all ${theme.transition}`,
  });

  return (
    <div style={cardStyle}>
      <div style={greetStyle}>
        {getGreeting()}, @{user?.username || 'friend'}
      </div>
      <div style={progressTextStyle}>
        {total > 0 ? `${done} of ${total} tasks done` : 'No tasks for today'}
      </div>
      <div style={trackStyle}>
        <div style={fillStyle} />
      </div>

      {/* Week / Month toggle */}
      <div style={toggleWrap}>
        <button style={toggleBtn(calView === 'week')} onClick={() => onCalViewChange('week')}>
          Week
        </button>
        <button style={toggleBtn(calView === 'month')} onClick={() => onCalViewChange('month')}>
          Month
        </button>
      </div>

      {calView === 'week' ? (
        <WeekStrip date={date} onDateChange={onDateChange} tasks={tasks} />
      ) : (
        <MonthCalendar date={date} onDateChange={onDateChange} tasks={tasks} />
      )}
    </div>
  );
}
