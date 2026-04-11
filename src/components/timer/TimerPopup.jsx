import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme.js';

const PRESETS = [5, 15, 25, 30, 60, 120];

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function ProgressRing({ progress, size, stroke, color, trackColor }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={trackColor} strokeWidth={stroke}
      />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.4s ease' }}
      />
    </svg>
  );
}

export default function TimerPopup({
  timerState, onStart, onPause, onResume, onCancel, onAddTime, onClose,
}) {
  const { theme } = useTheme();
  const [minutes, setMinutes] = useState(25);
  const [editing, setEditing] = useState(false);
  const [visible, setVisible] = useState(false);
  const inputRef = useRef(null);
  const popupRef = useRef(null);

  // Animate in
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // Focus input when editing
  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const isActive = timerState && (timerState.state === 'running' || timerState.state === 'paused');

  const containerStyle = {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 8,
    width: 260,
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadow.lg,
    padding: 16,
    zIndex: 1000,
    opacity: visible ? 1 : 0,
    transform: visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-4px)',
    transition: `opacity 0.15s ease, transform 0.15s ease`,
  };

  const btnBase = {
    border: 'none',
    cursor: 'pointer',
    borderRadius: theme.radius.sm,
    fontWeight: 600,
    transition: `all ${theme.transition}`,
  };

  const presetBtn = (selected) => ({
    ...btnBase,
    padding: '6px 0',
    fontSize: theme.font.bodySmall,
    background: selected ? theme.accent : theme.bgSecondary,
    color: selected ? theme.accentBtnText : theme.textPrimary,
    flex: 1,
  });

  const adjBtn = {
    ...btnBase,
    width: 36,
    height: 36,
    fontSize: 18,
    background: theme.bgSecondary,
    color: theme.textPrimary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const startBtn = {
    ...btnBase,
    width: '100%',
    padding: '10px 0',
    fontSize: theme.font.body,
    background: theme.accent,
    color: theme.accentBtnText,
    marginTop: 12,
  };

  // --- SETUP MODE ---
  if (!isActive) {
    return (
      <div ref={popupRef} style={containerStyle}>
        <div style={{ fontSize: theme.font.label, color: theme.textSecondary, marginBottom: 10, fontWeight: 600 }}>
          Timer
        </div>

        {/* Presets */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
          {PRESETS.map((p) => (
            <button key={p} style={presetBtn(minutes === p)} onClick={() => setMinutes(p)}>
              {p >= 60 ? `${p / 60}h` : `${p}m`}
            </button>
          ))}
        </div>

        {/* Adjuster */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 4 }}>
          <button style={adjBtn} onClick={() => setMinutes((m) => Math.max(1, m - 5))}>
            −
          </button>
          {editing ? (
            <input
              ref={inputRef}
              type="number"
              min={1}
              max={999}
              defaultValue={minutes}
              onBlur={(e) => {
                const val = parseInt(e.target.value, 10);
                if (val > 0) setMinutes(val);
                setEditing(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.target.blur();
              }}
              style={{
                width: 60,
                textAlign: 'center',
                fontSize: 28,
                fontWeight: 700,
                fontFamily: 'ui-monospace, "SF Mono", monospace',
                color: theme.textPrimary,
                background: theme.bgSecondary,
                border: `2px solid ${theme.accent}`,
                borderRadius: theme.radius.sm,
                outline: 'none',
                padding: '2px 4px',
              }}
            />
          ) : (
            <span
              onDoubleClick={() => setEditing(true)}
              style={{
                fontSize: 28,
                fontWeight: 700,
                fontFamily: 'ui-monospace, "SF Mono", monospace',
                color: theme.textPrimary,
                cursor: 'default',
                minWidth: 60,
                textAlign: 'center',
                userSelect: 'none',
              }}
            >
              {minutes}
            </span>
          )}
          <button style={adjBtn} onClick={() => setMinutes((m) => m + 5)}>
            +
          </button>
        </div>
        <div style={{ textAlign: 'center', fontSize: theme.font.bodySmall, color: theme.textTertiary, marginBottom: 2 }}>
          minutes
        </div>

        <button style={startBtn} onClick={() => onStart(minutes)}>
          Start Timer
        </button>
      </div>
    );
  }

  // --- RUNNING / PAUSED MODE ---
  const { total, remaining, state } = timerState;
  const progress = total > 0 ? remaining / total : 0;
  const isPaused = state === 'paused';
  const ringColor = isPaused ? theme.warning : theme.accent;

  const addTimeBtn = (label, secs) => ({
    ...btnBase,
    padding: '6px 12px',
    fontSize: theme.font.bodySmall,
    background: theme.bgSecondary,
    color: theme.textPrimary,
  });

  const controlBtn = (bg, color) => ({
    ...btnBase,
    flex: 1,
    padding: '8px 0',
    fontSize: theme.font.body,
    background: bg,
    color,
  });

  return (
    <div ref={popupRef} style={containerStyle}>
      {/* Progress ring with time */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14, position: 'relative' }}>
        <ProgressRing
          progress={progress}
          size={120}
          stroke={6}
          color={ringColor}
          trackColor={theme.bgSecondary}
        />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 26,
          fontWeight: 700,
          fontFamily: 'ui-monospace, "SF Mono", monospace',
          color: isPaused ? theme.warning : theme.textPrimary,
        }}>
          {formatTime(remaining)}
        </div>
      </div>

      {/* Add time */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 14 }}>
        <button style={addTimeBtn('+1m', 60)} onClick={() => onAddTime(60)}>+1m</button>
        <button style={addTimeBtn('+5m', 300)} onClick={() => onAddTime(300)}>+5m</button>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          style={controlBtn(theme.bgSecondary, theme.textPrimary)}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          style={controlBtn(isPaused ? theme.accent : theme.warning, isPaused ? theme.accentBtnText : '#fff')}
          onClick={isPaused ? onResume : onPause}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
    </div>
  );
}
