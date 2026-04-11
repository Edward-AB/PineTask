import { useTheme } from '../../hooks/useTheme.js';
import { SLOT_HEIGHT, CALENDAR_LABEL_WIDTH } from '../../constants';

export default function GhostPreview({ slot, duration, text }) {
  const { theme } = useTheme();

  const top = slot * SLOT_HEIGHT;
  const height = duration * SLOT_HEIGHT;

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: CALENDAR_LABEL_WIDTH,
        right: 0,
        height,
        background: `${theme.accent || '#10b981'}25`,
        border: `2px dashed ${theme.accent || '#10b981'}80`,
        borderRadius: theme.radius.md,
        zIndex: 8,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        boxSizing: 'border-box',
        transition: `top ${theme.transition}, height ${theme.transition}`,
      }}
    >
      {text && (
        <span style={{
          fontSize: theme.font.label,
          color: theme.accent || '#10b981',
          fontWeight: 500,
          opacity: 0.8,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {text}
        </span>
      )}
    </div>
  );
}
