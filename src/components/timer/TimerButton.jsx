import { useTheme } from '../../hooks/useTheme.js';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const PULSE_KEYFRAMES = `
@keyframes timerPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
`;

let styleInjected = false;
function injectKeyframes() {
  if (styleInjected) return;
  const sheet = document.createElement('style');
  sheet.textContent = PULSE_KEYFRAMES;
  document.head.appendChild(sheet);
  styleInjected = true;
}

export default function TimerButton({ timerState, onClick }) {
  const { theme } = useTheme();

  injectKeyframes();

  const state = timerState?.state ?? null;

  const baseBtn = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    border: 'none',
    background: 'transparent',
    borderRadius: theme.radius.sm,
    cursor: 'pointer',
    color: theme.headerText,
    transition: `all ${theme.transition}`,
    padding: '0 8px',
    gap: 6,
  };

  // No timer -- show clock icon
  if (!state) {
    return (
      <button style={baseBtn} onClick={onClick} aria-label="Open timer">
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
          <circle cx={8} cy={8} r={6.5} stroke="currentColor" strokeWidth={1.5} />
          <line x1={8} y1={4} x2={8} y2={8} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
          <line x1={8} y1={8} x2={11} y2={8} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      </button>
    );
  }

  // Done -- red badge
  if (state === 'done') {
    const doneStyle = {
      ...baseBtn,
      background: theme.danger,
      color: '#fff',
      borderRadius: theme.radius.full,
      padding: '0 12px',
      fontSize: theme.font.bodySmall,
      fontWeight: 700,
      animation: 'timerPulse 1s ease-in-out infinite',
    };
    return (
      <button style={doneStyle} onClick={onClick} aria-label="Timer done">
        Timer Done!
      </button>
    );
  }

  // Running or paused -- show countdown
  const isRunning = state === 'running';
  const countdownColor = isRunning ? theme.success : theme.warning;

  const countdownStyle = {
    ...baseBtn,
    fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Segoe UI Mono", monospace',
    fontSize: theme.font.body,
    fontWeight: 700,
    color: countdownColor,
    letterSpacing: '0.5px',
    animation: isRunning ? 'timerPulse 2s ease-in-out infinite' : 'none',
  };

  const dotStyle = {
    width: 6,
    height: 6,
    borderRadius: theme.radius.full,
    background: countdownColor,
    flexShrink: 0,
  };

  return (
    <button style={countdownStyle} onClick={onClick} aria-label="Timer">
      <span style={dotStyle} />
      {formatTime(timerState.remaining)}
    </button>
  );
}
