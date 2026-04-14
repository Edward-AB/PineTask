import { useTheme } from '../../hooks/useTheme.js';
import { SLOT_HEIGHT } from '../../constants';

export default function PrivateBlock({ task, username }) {
  const { theme } = useTheme();
  const top = task.slot * SLOT_HEIGHT;
  const height = Math.max((task.duration || 2) * SLOT_HEIGHT, SLOT_HEIGHT);
  const isDark = theme.name === 'dark';
  const bg = isDark ? '#181818' : '#B8B8B8';
  const border = isDark ? '#404040' : '#111111';

  return (
    <div
      title={username ? `Private — ${username} is busy` : 'Private'}
      style={{
        position: 'absolute', left: 2, right: 2,
        top, height,
        background: bg, border: `1px solid ${border}`,
        borderRadius: 8, opacity: 0.95, pointerEvents: 'auto',
      }}
    />
  );
}
