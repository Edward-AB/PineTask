import { useTheme } from '../../hooks/useTheme.js';
import { dateKey } from '../../utils/dates.js';

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MonthCalendar({ date, onDateChange, tasks }) {
  const { theme } = useTheme();
  const selectedKey = dateKey(date);
  const todayStr = dateKey(new Date());

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Day of week for first day (Mon=0)
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const daysInMonth = lastDay.getDate();
  const cells = [];

  // Leading blanks
  for (let i = 0; i < startDow; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  const goMonth = (delta) => {
    const next = new Date(year, month + delta, 1);
    onDateChange(next);
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  };

  const monthLabel = {
    fontSize: theme.font.bodySmall,
    fontWeight: 600,
    color: theme.textPrimary,
  };

  const navBtn = {
    background: 'none',
    border: 'none',
    color: theme.textTertiary,
    cursor: 'pointer',
    fontSize: theme.font.body,
    padding: '2px 6px',
    fontFamily: 'inherit',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 2,
  };

  const dayHeaderStyle = {
    fontSize: theme.font.label,
    fontWeight: 600,
    color: theme.textTertiary,
    textAlign: 'center',
    padding: '4px 0',
  };

  const cellStyle = (dayNum) => {
    if (!dayNum) return { padding: '4px 0' };
    const d = new Date(year, month, dayNum);
    const key = dateKey(d);
    const isSelected = key === selectedKey;
    const isToday = key === todayStr;
    return {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4px 0',
      borderRadius: theme.radius.sm,
      cursor: 'pointer',
      background: isSelected ? theme.selectedDay : isToday ? theme.todayDayBg : 'transparent',
      border: isSelected ? `1px solid ${theme.selectedDayBorder}` : '1px solid transparent',
      transition: `all ${theme.transition}`,
      minHeight: 28,
    };
  };

  const numStyle = (dayNum) => {
    if (!dayNum) return {};
    const d = new Date(year, month, dayNum);
    const key = dateKey(d);
    const isSelected = key === selectedKey;
    return {
      fontSize: theme.font.bodySmall,
      fontWeight: 500,
      color: isSelected ? theme.selectedDayText : theme.textPrimary,
      lineHeight: 1,
    };
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div>
      <div style={headerStyle}>
        <button style={navBtn} onClick={() => goMonth(-1)}>{'\u2039'}</button>
        <span style={monthLabel}>{monthNames[month]} {year}</span>
        <button style={navBtn} onClick={() => goMonth(1)}>{'\u203A'}</button>
      </div>
      <div style={gridStyle}>
        {DAY_HEADERS.map((h) => (
          <div key={h} style={dayHeaderStyle}>{h}</div>
        ))}
        {cells.map((dayNum, idx) => {
          if (!dayNum) return <div key={`blank-${idx}`} style={cellStyle(null)} />;
          const d = new Date(year, month, dayNum);
          const key = dateKey(d);
          const hasTasks = tasks.some((t) => t.date === key);
          return (
            <div
              key={dayNum}
              style={cellStyle(dayNum)}
              onClick={() => onDateChange(d)}
            >
              <span style={numStyle(dayNum)}>{dayNum}</span>
              {hasTasks && (
                <span style={{
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  background: theme.accent,
                  marginTop: 2,
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
