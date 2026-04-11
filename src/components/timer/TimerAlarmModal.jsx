import { useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme.js';
import { playAlarm } from '../../utils/sounds.js';

const PULSE_BORDER_KEYFRAMES = `
@keyframes alarmBorderPulse {
  0%, 100% { box-shadow: 0 0 0 0px rgba(76, 175, 80, 0.5); }
  50% { box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
}
`;

let styleInjected = false;
function injectKeyframes() {
  if (styleInjected) return;
  const sheet = document.createElement('style');
  sheet.textContent = PULSE_BORDER_KEYFRAMES;
  document.head.appendChild(sheet);
  styleInjected = true;
}

export default function TimerAlarmModal({ onRepeat, onDismiss }) {
  const { theme } = useTheme();

  injectKeyframes();

  // Play alarm on mount and repeat every 3s
  useEffect(() => {
    playAlarm();
    const id = setInterval(playAlarm, 3000);
    return () => clearInterval(id);
  }, []);

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2000,
  };

  const modalStyle = {
    background: theme.surface,
    borderRadius: theme.radius.lg,
    padding: '32px 40px',
    textAlign: 'center',
    border: `2px solid ${theme.success}`,
    animation: 'alarmBorderPulse 1.5s ease-in-out infinite',
    boxShadow: theme.shadow.lg,
    maxWidth: 340,
    width: '90%',
  };

  const headingStyle = {
    fontSize: theme.font.headingXl,
    fontWeight: 800,
    color: theme.textPrimary,
    marginBottom: 8,
  };

  const subStyle = {
    fontSize: theme.font.body,
    color: theme.textSecondary,
    marginBottom: 28,
  };

  const btnRow = {
    display: 'flex',
    gap: 10,
    justifyContent: 'center',
  };

  const btnBase = {
    border: 'none',
    cursor: 'pointer',
    borderRadius: theme.radius.sm,
    fontWeight: 600,
    fontSize: theme.font.body,
    padding: '10px 24px',
    transition: `all ${theme.transition}`,
  };

  const repeatBtn = {
    ...btnBase,
    background: theme.bgSecondary,
    color: theme.textPrimary,
  };

  const doneBtn = {
    ...btnBase,
    background: theme.accent,
    color: theme.accentBtnText,
  };

  // Bell icon
  const BellIcon = () => (
    <svg width={40} height={40} viewBox="0 0 24 24" fill="none" style={{ marginBottom: 12 }}>
      <path
        d="M12 2C10.343 2 9 3.343 9 5v.26A5.001 5.001 0 005 10v4l-2 2v1h18v-1l-2-2v-4a5.001 5.001 0 00-4-4.74V5c0-1.657-1.343-3-3-3z"
        fill={theme.success}
        opacity={0.2}
      />
      <path
        d="M12 2a3 3 0 00-3 3v.26A5.001 5.001 0 005 10v4l-2 2v1h18v-1l-2-2v-4a5.001 5.001 0 00-4-4.74V5a3 3 0 00-3-3zM10 20a2 2 0 104 0"
        stroke={theme.success}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div style={overlayStyle} onClick={onDismiss}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <BellIcon />
        <div style={headingStyle}>Time's up!</div>
        <div style={subStyle}>Your timer has finished.</div>
        <div style={btnRow}>
          <button style={repeatBtn} onClick={onRepeat}>
            Repeat
          </button>
          <button style={doneBtn} onClick={onDismiss}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
