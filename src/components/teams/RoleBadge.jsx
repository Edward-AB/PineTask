import { useTheme } from '../../hooks/useTheme.js';

export default function RoleBadge({ role }) {
  const { theme } = useTheme();
  const r = String(role || 'member').toLowerCase();

  const styles = {
    owner: { bg: theme.priority.high.bg, text: theme.priority.high.text, border: theme.priority.high.border, label: 'Owner' },
    admin: { bg: theme.warningBg, text: '#633806', border: '#EF9F27', label: 'Admin' },
    member: { bg: theme.priority.none.bg, text: theme.priority.none.text, border: theme.priority.none.border, label: 'Member' },
  };
  const s = styles[r] || styles.member;

  return (
    <span style={{
      display: 'inline-block',
      fontSize: 9,
      fontWeight: 500,
      padding: '1px 6px',
      borderRadius: 20,
      background: s.bg,
      color: s.text,
      border: `0.5px solid ${s.border}`,
      letterSpacing: '0.02em',
    }}>
      {s.label}
    </span>
  );
}
