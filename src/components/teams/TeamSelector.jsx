import { useTheme } from '../../hooks/useTheme.js';
import RoleBadge from './RoleBadge.jsx';

export default function TeamSelector({ teams = [], selectedId, onSelect, onCreate }) {
  const { theme } = useTheme();

  return (
    <div style={{
      display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
      marginBottom: 16,
    }}>
      {teams.map((t) => {
        const active = t.id === selectedId;
        return (
          <button
            key={t.id}
            onClick={() => onSelect?.(t.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: active ? theme.accentBg : theme.bgSecondary,
              border: `${active ? 1 : 0.5}px solid ${active ? theme.accentBorder : theme.border}`,
              borderRadius: 14, padding: '8px 12px',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: `all ${theme.transition}`,
            }}
          >
            <span style={{
              width: 10, height: 10, borderRadius: '50%',
              background: t.color || theme.accent, flexShrink: 0,
            }} />
            <span style={{
              fontSize: 13, fontWeight: 500,
              color: active ? theme.accentText : theme.textPrimary,
              maxWidth: 140,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{t.name}</span>
            <span style={{ fontSize: 10, color: theme.textTertiary }}>
              {t.member_count ?? 1}
            </span>
            <RoleBadge role={t.user_role} />
          </button>
        );
      })}
      <button
        onClick={() => onCreate?.()}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: theme.accentBtn, color: theme.accentBtnText,
          border: 'none', borderRadius: 14, padding: '8px 14px',
          cursor: 'pointer', fontFamily: 'inherit',
          fontSize: 12, fontWeight: 500,
        }}
      >
        <svg width={12} height={12} viewBox="0 0 12 12" fill="none">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"/>
        </svg>
        New team
      </button>
    </div>
  );
}
