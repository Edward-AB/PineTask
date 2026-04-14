import { useTheme } from '../../hooks/useTheme.js';

function Avatar({ user, size = 28, ring = true }) {
  const { theme } = useTheme();
  const initial = (user?.username || user?.email || '?')[0].toUpperCase();
  return user?.avatar_url ? (
    <img src={user.avatar_url} alt={user.username} style={{
      width: size, height: size, borderRadius: '50%',
      border: ring ? `2px solid ${theme.bg}` : 'none',
      objectFit: 'cover', display: 'block',
    }} />
  ) : (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: ring ? `2px solid ${theme.bg}` : 'none',
      background: theme.accent, color: theme.accentBtnText,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.max(10, Math.round(size * 0.4)), fontWeight: 600,
    }}>{initial}</div>
  );
}

export default function MemberAvatarStack({ members = [], max = 5, size = 28 }) {
  const shown = members.slice(0, max);
  const rest = members.length - shown.length;
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {shown.map((u, i) => (
        <div key={u.id || i} style={{ marginLeft: i === 0 ? 0 : -6, zIndex: shown.length - i }}>
          <Avatar user={u} size={size} />
        </div>
      ))}
      {rest > 0 && (
        <div style={{
          marginLeft: -6,
          width: size, height: size, borderRadius: '50%',
          background: '#E8E5DE', color: '#5F5E5A',
          fontSize: 10, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid #fff',
        }}>+{rest}</div>
      )}
    </div>
  );
}

export { Avatar };
