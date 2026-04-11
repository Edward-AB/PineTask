import { useTheme } from '../../hooks/useTheme.js';

function hourLabel(h) {
  if (h === 0) return '12 AM';
  if (h < 12) return `${h} AM`;
  if (h === 12) return '12 PM';
  return `${h - 12} PM`;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function WorkHoursStep({ startHour, endHour, onStartChange, onEndChange, onNext, onBack }) {
  const { theme } = useTheme();

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

  const selectRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    width: '100%',
    justifyContent: 'center',
  };

  const selectGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  };

  const selectLabelStyle = {
    fontSize: theme.font.label,
    color: theme.textTertiary,
    fontWeight: 500,
  };

  const selectStyle = {
    padding: '8px 12px',
    fontSize: theme.font.body,
    fontWeight: 500,
    color: theme.textPrimary,
    background: theme.bgSecondary,
    border: `1px solid ${theme.border}`,
    borderRadius: theme.radius.md,
    outline: 'none',
    cursor: 'pointer',
    minWidth: 100,
    textAlign: 'center',
  };

  const arrowStyle = {
    fontSize: theme.font.body,
    color: theme.textTertiary,
    marginTop: 18,
  };

  // Timeline preview
  const timelineBarStyle = {
    width: '100%',
    height: 36,
    borderRadius: theme.radius.md,
    background: theme.bgSecondary,
    border: `1px solid ${theme.border}`,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 8,
  };

  const startPct = (startHour / 24) * 100;
  const endPct = (endHour / 24) * 100;
  const widthPct = Math.max(endPct - startPct, 0);

  const activeRangeStyle = {
    position: 'absolute',
    left: `${startPct}%`,
    width: `${widthPct}%`,
    top: 0,
    bottom: 0,
    background: theme.accentBg,
    borderLeft: `2px solid ${theme.accent}`,
    borderRight: `2px solid ${theme.accent}`,
    transition: 'left 200ms, width 200ms',
  };

  const timelineLabelsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 28,
  };

  const tLabelStyle = {
    fontSize: theme.font.label,
    color: theme.textTertiary,
  };

  const summaryStyle = {
    fontSize: theme.font.bodySmall,
    color: theme.textSecondary,
    marginBottom: 28,
    textAlign: 'center',
  };

  const btnRowStyle = {
    display: 'flex',
    gap: 10,
    width: '100%',
  };

  const backBtnStyle = {
    flex: 1,
    padding: '10px 16px',
    fontSize: theme.font.body,
    fontWeight: 500,
    color: theme.textSecondary,
    background: 'transparent',
    border: `1px solid ${theme.border}`,
    borderRadius: theme.radius.md,
    cursor: 'pointer',
  };

  const nextBtnStyle = {
    flex: 2,
    padding: '10px 16px',
    fontSize: theme.font.body,
    fontWeight: 600,
    color: theme.accentBtnText,
    background: theme.accentBtn,
    border: 'none',
    borderRadius: theme.radius.md,
    cursor: 'pointer',
    transition: theme.transition,
  };

  const workHours = endHour > startHour ? endHour - startHour : 0;

  return (
    <div style={containerStyle}>
      <div style={headingStyle}>When do you usually work?</div>
      <div style={subStyle}>
        We'll focus your daily schedule on these hours
      </div>

      <div style={selectRowStyle}>
        <div style={selectGroupStyle}>
          <span style={selectLabelStyle}>Start</span>
          <select
            value={startHour}
            onChange={(e) => onStartChange(Number(e.target.value))}
            style={selectStyle}
          >
            {HOURS.map(h => (
              <option key={h} value={h}>{hourLabel(h)}</option>
            ))}
          </select>
        </div>

        <span style={arrowStyle}>→</span>

        <div style={selectGroupStyle}>
          <span style={selectLabelStyle}>End</span>
          <select
            value={endHour}
            onChange={(e) => onEndChange(Number(e.target.value))}
            style={selectStyle}
          >
            {HOURS.map(h => (
              <option key={h} value={h}>{hourLabel(h)}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={timelineBarStyle}>
        {widthPct > 0 && <div style={activeRangeStyle} />}
      </div>
      <div style={timelineLabelsStyle}>
        <span style={tLabelStyle}>12 AM</span>
        <span style={tLabelStyle}>6 AM</span>
        <span style={tLabelStyle}>12 PM</span>
        <span style={tLabelStyle}>6 PM</span>
        <span style={tLabelStyle}>12 AM</span>
      </div>

      <div style={summaryStyle}>
        {workHours > 0
          ? `${hourLabel(startHour)} to ${hourLabel(endHour)} (${workHours} hours)`
          : 'Select a valid time range'
        }
      </div>

      <div style={btnRowStyle}>
        <button style={backBtnStyle} onClick={onBack}>
          Back
        </button>
        <button style={nextBtnStyle} onClick={onNext}>
          Continue
        </button>
      </div>
    </div>
  );
}
