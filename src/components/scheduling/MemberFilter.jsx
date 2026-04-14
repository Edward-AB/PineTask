import { useTheme } from '../../hooks/useTheme.js';
import { Avatar } from '../teams/MemberAvatarStack.jsx';

export default function MemberFilter({ members = [], selected = new Set(), onToggle }) {
  const { theme } = useTheme();
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      {members.map((m) => {
        const isSelected = selected.has(m.id);
        return (
          <button
            key={m.id}
            onClick={() => onToggle?.(m.id)}
            title={`@${m.username}`}
            style={{
              background: 'none', border: 'none', padding: 0,
              cursor: 'pointer', position: 'relative',
              opacity: isSelected ? 1 : 0.45,
              transition: `opacity ${theme.transition}`,
              outline: isSelected ? `2px solid ${theme.accent}` : 'none',
              outlineOffset: 2,
              borderRadius: '50%',
            }}
          >
            <Avatar user={m} size={28} ring={false} />
          </button>
        );
      })}
    </div>
  );
}
