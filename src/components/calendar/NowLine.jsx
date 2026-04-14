import { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme.js';
import { nowY } from '../../utils/slots.js';
import { CALENDAR_LABEL_WIDTH, CALENDAR_HEIGHT } from '../../constants';

export default function NowLine() {
  const { theme } = useTheme();
  const [y, setY] = useState(nowY());

  useEffect(() => {
    const timer = setInterval(() => setY(nowY()), 10000);
    return () => clearInterval(timer);
  }, []);

  if (y < 0 || y > CALENDAR_HEIGHT) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: y,
        zIndex: 20,
        pointerEvents: 'none',
        transform: 'translateY(-50%)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            width: CALENDAR_LABEL_WIDTH,
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <svg width={11} height={11} viewBox="0 0 11 11">
            <path
              d="M1.5 1.5 L10 5.5 L1.5 9.5 Z"
              fill={theme.nowLine}
              stroke={theme.nowLine}
              strokeWidth={2}
            />
          </svg>
        </div>
        <div
          style={{
            flex: 1,
            height: 1.5,
            background: theme.nowLine,
            opacity: 0.9,
            marginLeft: -2,
          }}
        />
      </div>
    </div>
  );
}
