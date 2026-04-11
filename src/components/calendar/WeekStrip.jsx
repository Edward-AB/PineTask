import { useTheme } from '../../hooks/useTheme.js';
import { dateKey, getMonday, addDays } from '../../utils/dates.js';

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function WeekStrip({ date, onDateChange, tasks }) {
  const { theme } = useTheme();
  const monday = getMonday(date);
  const selectedKey = dateKey(date);
  const todayStr = dateKey(new Date());

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(monday, i);
    const key = dateKey(d);
    const dayTasks = tasks.filter((t) => t.date === key);
    const hasTasks = dayTasks.length > 0;
    const allDone = hasTasks && dayTasks.every((t) => t.done);
    const isSelected = key === selectedKey;
    const isToday = key === todayStr;
    return { d, key, num: d.getDate(), letter: DAY_LETTERS[i], hasTasks, allDone, isSelected, isToday };
  });

  const wrapStyle = {
    display: 'flex',
    gap: 4,
  };

  const dayStyle = (day) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: '8px 4px',
    borderRadius: theme.radius.md,
    cursor: 'pointer',
    border: day.isSelected ? `1.5px solid ${theme.selectedDayBorder}` : '1.5px solid transparent',
    background: day.isSelected ? theme.selectedDay : day.isToday ? theme.todayDayBg : 'transparent',
    transition: `all ${theme.transition}`,
  });

  const letterStyle = (day) => ({
    fontSize: theme.font.label,
    fontWeight: 600,
    color: day.isSelected ? theme.selectedDayText : theme.textTertiary,
  });

  const numStyle = (day) => ({
    fontSize: theme.font.body,
    fontWeight: 600,
    color: day.isSelected ? theme.selectedDayText : theme.textPrimary,
  });

  const dotRow = {
    display: 'flex',
    gap: 2,
    height: 5,
    alignItems: 'center',
  };

  const dotStyle = (done) => ({
    width: 4,
    height: 4,
    borderRadius: '50%',
    background: done ? theme.success : theme.accent,
  });

  return (
    <div style={wrapStyle}>
      {days.map((day) => (
        <div
          key={day.key}
          style={dayStyle(day)}
          onClick={() => onDateChange(day.d)}
        >
          <span style={letterStyle(day)}>{day.letter}</span>
          <span style={numStyle(day)}>{day.num}</span>
          <div style={dotRow}>
            {day.hasTasks && <span style={dotStyle(day.allDone)} />}
          </div>
        </div>
      ))}
    </div>
  );
}
