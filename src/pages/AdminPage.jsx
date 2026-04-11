import { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme.js';
import { apiGet } from '../api/client.js';

export default function AdminPage() {
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          apiGet('/api/admin/stats'),
          apiGet(`/api/admin/users?page=${page}&limit=20&search=${search}`),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data || []);
      } catch {}
      setLoading(false);
    })();
  }, [page, search]);

  if (loading) return (
    <div style={{ padding: 32 }}>
      <div className="skeleton" style={{ width: 200, height: 28, marginBottom: 20 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 80 }} />)}
      </div>
    </div>
  );

  const s = stats || {};

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: theme.font.headingXl, fontWeight: 600, color: theme.textPrimary, marginBottom: 28 }}>Admin</h1>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Users', value: s.total_users || 0 },
          { label: 'Total Tasks', value: s.total_tasks || 0 },
          { label: 'Active (7d)', value: s.active_users || 0 },
          { label: 'Signups This Week', value: s.signups_this_week || 0 },
        ].map((item, i) => (
          <div key={i} style={{
            padding: 20, borderRadius: theme.radius.lg, border: `1px solid ${theme.border}`,
            background: theme.surface,
          }}>
            <div style={{ fontSize: theme.font.headingLg, fontWeight: 600, color: theme.textPrimary }}>{item.value}</div>
            <div style={{ fontSize: theme.font.bodySmall, color: theme.textTertiary, marginTop: 4 }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div style={{
        padding: 24, borderRadius: theme.radius.lg, border: `1px solid ${theme.border}`,
        background: theme.surface,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: theme.font.heading, fontWeight: 500, color: theme.textPrimary }}>Users</h2>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search users..." style={{
              padding: '6px 12px', borderRadius: theme.radius.md, border: `1px solid ${theme.border}`,
              background: theme.bg, color: theme.textPrimary, fontSize: theme.font.bodySmall, outline: 'none',
            }} />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: theme.font.bodySmall }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                {['Username', 'Email', 'Tasks', 'Joined', 'Admin'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: theme.textTertiary, fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: `1px solid ${theme.borderLight}` }}>
                  <td style={{ padding: '10px 12px', color: theme.textPrimary, fontWeight: 500 }}>@{u.username}</td>
                  <td style={{ padding: '10px 12px', color: theme.textSecondary }}>{u.email}</td>
                  <td style={{ padding: '10px 12px', color: theme.textSecondary }}>{u.task_count || 0}</td>
                  <td style={{ padding: '10px 12px', color: theme.textTertiary }}>
                    {u.created_at ? new Date(u.created_at).toLocaleDateString('en-GB') : '—'}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    {u.is_admin ? <span style={{ color: theme.accent, fontWeight: 500 }}>Yes</span> : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length >= 20 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'center' }}>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{
              padding: '6px 14px', borderRadius: theme.radius.md, border: `1px solid ${theme.border}`,
              color: theme.textSecondary, opacity: page <= 1 ? 0.5 : 1,
            }}>Previous</button>
            <span style={{ padding: '6px 14px', color: theme.textTertiary }}>Page {page}</span>
            <button onClick={() => setPage(p => p + 1)} style={{
              padding: '6px 14px', borderRadius: theme.radius.md, border: `1px solid ${theme.border}`,
              color: theme.textSecondary,
            }}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
