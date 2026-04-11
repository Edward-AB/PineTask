import { useTheme } from '../../hooks/useTheme.js';
import { SLOT_HEIGHT, CALENDAR_LABEL_WIDTH } from '../../constants';

export default function WorkingHours({ startSlot, endSlot }) {
  const { theme } = useTheme();

  const top = startSlot * SLOT_HEIGHT;
  const height = (endSlot - startSlot) * SLOT_HEIGHT;

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: CALENDAR_LABEL_WIDTH,
        right: 0,
        height,
        background: theme.calWorkBg || 'rgba(255, 247, 230, 0.45)',
        zIndex: 1,
        pointerEvents: 'none',
        borderRadius: 0,
      }}
    />
  );
}
