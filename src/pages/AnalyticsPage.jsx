import { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme.js';
import { apiGet } from '../api/client.js';

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGet('/api/stats');
        setStats(res.data);
      } catch {}
      setLoading(false);
    })();
  }, []);

  if (loading) return (
    <div style={{ padding: 32 }}>
      <div className="skeleton" style={{ width: 200, height: 28, marginBottom: 20 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 100 }} />)}
      </div>
    </div>
  );

  const s = stats || {};

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: theme.font.headingXl, fontWeight: 600, color: theme.textPrimary, marginBottom: 28 }}>Analytics</h1>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Tasks', value: s.total_tasks || 0, icon: '📋' },
          { label: 'Completed', value: s.completed_tasks || 0, icon: '✅' },
          { label: 'Completion Rate', value: `${s.completion_rate || 0}%`, icon: '📊' },
          { label: 'Current Streak', value: `${s.current_streak || 0} days`, icon: '🔥' },
          { label: 'Longest Streak', value: `${s.longest_streak || 0} days`, icon: '🏆' },
          { label: 'Tasks This Week', value: s.tasks_this_week || 0, icon: '📅' },
        ].map((item, i) => (
          <div key={i} style={{
            padding: 24, borderRadius: theme.radius.lg, border: `1px solid ${theme.border}`,
            background: theme.surface,
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
            <div style={{ fontSize: theme.font.headingLg, fontWeight: 600, color: theme.textPrimary }}>{item.value}</div>
            <div style={{ fontSize: theme.font.bodySmall, color: theme.textTertiary, marginTop: 4 }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Productivity chart placeholder */}
      <div style={{
        padding: 32, borderRadius: theme.radius.lg, border: `1px solid ${theme.border}`,
        background: theme.surface, marginBottom: 20,
      }}>
        <h2 style={{ fontSize: theme.font.heading, fontWeight: 500, color: theme.textPrimary, marginBottom: 20 }}>
          30-Day Productivity
        </h2>
        {(s.daily_counts || []).length > 0 ? (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 120 }}>
            {(s.daily_counts || []).map((d, i) => {
              const max = Math.max(...(s.daily_counts || []).map(x => x.count), 1);
              return (
                <div key={i} style={{
                  flex: 1, minWidth: 0, borderRadius: '3px 3px 0 0',
                  background: d.count > 0 ? theme.accent : theme.border,
                  height: `${Math.max(4, (d.count / max) * 100)}%`,
                  opacity: d.count > 0 ? 1 : 0.3,
                  transition: 'height 500ms',
                }} title={`${d.date}: ${d.count} tasks`} />
              );
            })}
          </div>
        ) : (
          <p style={{ color: theme.textTertiary, textAlign: 'center' }}>Complete some tasks to see your chart</p>
        )}
      </div>

      {/* Priority breakdown */}
      <div style={{
        padding: 32, borderRadius: theme.radius.lg, border: `1px solid ${theme.border}`,
        background: theme.surface,
      }}>
        <h2 style={{ fontSize: theme.font.heading, fontWeight: 500, color: theme.textPrimary, marginBottom: 20 }}>
          Priority Breakdown
        </h2>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'High', count: s.priority_high || 0, color: theme.chartHigh },
            { label: 'Medium', count: s.priority_medium || 0, color: theme.chartMedium },
            { label: 'Low', count: s.priority_low || 0, color: theme.chartLow },
            { label: 'None', count: s.priority_none || 0, color: theme.chartNone },
          ].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: p.color }} />
              <span style={{ fontSize: theme.font.body, color: theme.textSecondary }}>{p.label}: {p.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
