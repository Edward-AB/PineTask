import { useTheme } from '../../hooks/useTheme.js';
import { useAuth } from '../../hooks/useAuth.js';
import RoleBadge from './RoleBadge.jsx';
import { Avatar } from './MemberAvatarStack.jsx';

export default function MemberList({
  members = [],
  userRole,           // current user's role
  onRemove,
  onChangeRole,
  onLeave,
  onMessage,
}) {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <div style={{
      background: theme.bgSecondary,
      border: `0.5px solid ${theme.border}`,
      borderRadius: 14, padding: 14, marginBottom: 12,
    }}>
      <div style={{
        fontSize: 10, fontWeight: 500, color: theme.textTertiary,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        marginBottom: 10,
      }}>Members ({members.length})</div>

      {members.length === 0 ? (
        <EmptyState text="No members invited yet" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {members.map((m) => {
            const isSelf = m.id === user?.id;
            const joined = m.joined_at ? new Date(m.joined_at).toLocaleDateString('en-GB') : '';
            const canRemove = !isSelf && (
              userRole === 'owner' ||
              (userRole === 'admin' && m.role === 'member')
            );
            const canPromote = !isSelf && userRole === 'owner' && m.role === 'member';
            const canDemote = !isSelf && userRole === 'owner' && m.role === 'admin';

            return (
              <div key={m.id} className="trow" style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '6px 4px', borderRadius: 8,
              }}>
                <Avatar user={m} size={28} ring={false} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: theme.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.username}{isSelf && ' (you)'}
                    </span>
                    <RoleBadge role={m.role} />
                  </div>
                  <div style={{ fontSize: 10, color: theme.textTertiary }}>Joined {joined}</div>
                </div>

                <div className="ta" style={{ display: 'flex', gap: 4 }}>
                  {!isSelf && onMessage && (
                    <button
                      title="Message"
                      onClick={() => onMessage(m)}
                      style={iconBtn(theme)}
                    >
                      <svg width={12} height={12} viewBox="0 0 14 14" fill="none">
                        <path d="M1.5 3.5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-7l-2.5 2V3.5z" stroke="currentColor" strokeWidth={1.2} strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                  {canPromote && (
                    <button onClick={() => onChangeRole?.(m.id, 'admin')} style={textBtn(theme)}>Make admin</button>
                  )}
                  {canDemote && (
                    <button onClick={() => onChangeRole?.(m.id, 'member')} style={textBtn(theme)}>Demote</button>
                  )}
                  {isSelf && m.role !== 'owner' && (
                    <button onClick={() => onLeave?.()} style={{ ...textBtn(theme), color: theme.danger }}>Leave</button>
                  )}
                  {canRemove && (
                    <button onClick={() => onRemove?.(m.id)} style={{ ...iconBtn(theme), color: theme.danger }}>
                      <svg width={12} height={12} viewBox="0 0 12 12" fill="none">
                        <path d="M2 3h8M5 1h2M4 3v7M8 3v7M3 3l0.5 8h5L9 3" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function iconBtn(theme) {
  return {
    width: 24, height: 24, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: 'none', border: `0.5px solid ${theme.border}`,
    borderRadius: 6, color: theme.textSecondary, cursor: 'pointer',
  };
}
function textBtn(theme) {
  return {
    background: 'none', border: `0.5px solid ${theme.border}`,
    borderRadius: 6, padding: '3px 8px',
    fontSize: 10, color: theme.textSecondary, cursor: 'pointer',
    fontFamily: 'inherit',
  };
}

function EmptyState({ text }) {
  const { theme } = useTheme();
  return (
    <div style={{ padding: '18px 0', textAlign: 'center', color: theme.textTertiary, fontSize: 12 }}>
      <svg width={28} height={28} viewBox="0 0 32 32" fill="none" style={{ margin: '0 auto 6px', display: 'block', opacity: 0.5 }}>
        <path d="M16 3 L8 12 L12 12 L10 20 L14 20 L13 29 L19 29 L18 20 L22 20 L20 12 L24 12 Z" fill="currentColor"/>
      </svg>
      {text}
    </div>
  );
}
