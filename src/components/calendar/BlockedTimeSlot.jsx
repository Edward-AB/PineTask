import { useTheme } from '../../hooks/useTheme.js';
import { SLOT_HEIGHT, CALENDAR_LABEL_WIDTH } from '../../constants';

export default function BlockedTimeSlot({ block }) {
  const { theme } = useTheme();

  const top = block.startSlot * SLOT_HEIGHT;
  const height = (block.endSlot - block.startSlot) * SLOT_HEIGHT;

  const style = {
    position: 'absolute',
    top,
    left: CALENDAR_LABEL_WIDTH,
    right: 0,
    height,
    zIndex: 2,
    pointerEvents: 'none',
    background: `repeating-linear-gradient(
      45deg,
      transparent,
      transparent 4px,
      ${theme.border}30 4px,
      ${theme.border}30 8px
    )`,
    borderRadius: theme.radius.sm,
    opacity: 0.5,
  };

  return (
    <div style={style} title={block.label || 'Blocked'}>
      {block.label && (
        <span style={{
          position: 'absolute',
          top: 2,
          left: 4,
          fontSize: theme.font.label,
          color: theme.textTertiary,
          fontWeight: 500,
        }}>
          {block.label}
        </span>
      )}
    </div>
  );
}
