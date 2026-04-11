import { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme.js';
import { nowY } from '../../utils/slots.js';
import { CALENDAR_LABEL_WIDTH } from '../../constants';

export default function NowLine() {
  const { theme } = useTheme();
  const [y, setY] = useState(nowY());

  useEffect(() => {
    const timer = setInterval(() => setY(nowY()), 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: 0,
        right: 0,
        height: 0,
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      {/* Arrow marker */}
      <div
        style={{
          position: 'absolute',
          left: CALENDAR_LABEL_WIDTH - 8,
          top: -4,
          width: 0,
          height: 0,
          borderTop: '4px solid transparent',
          borderBottom: '4px solid transparent',
          borderLeft: `6px solid ${theme.nowLine}`,
        }}
      />
      {/* Line */}
      <div
        style={{
          position: 'absolute',
          left: CALENDAR_LABEL_WIDTH,
          right: 0,
          height: 2,
          background: theme.nowLine,
          top: -1,
        }}
      />
    </div>
  );
}
