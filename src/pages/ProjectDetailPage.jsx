import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme.js';
import { apiGet } from '../api/client.js';

export default function ProjectDetailPage() {
  const { theme } = useTheme();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('manage');

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGet(`/api/projects/${id}`);
        setProject(res.data);
      } catch {}
      setLoading(false);
    })();
  }, [id]);

  if (loading) return (
    <div style={{ padding: 32 }}>
      <div className="skeleton" style={{ width: 300, height: 32, marginBottom: 20 }} />
      <div className="skeleton" style={{ width: '100%', height: 400 }} />
    </div>
  );

  if (!project) return (
    <div style={{ padding: 32, textAlign: 'center' }}>
      <p style={{ color: theme.textSecondary }}>Project not found</p>
      <Link to="/projects" style={{ color: theme.accent }}>Back to projects</Link>
    </div>
  );

  const dlc = theme.deadline[project.color_idx % theme.deadline.length];

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
      <Link to="/projects" style={{ fontSize: theme.font.bodySmall, color: theme.textTertiary, marginBottom: 16, display: 'inline-block' }}>
        &larr; Back to projects
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: dlc.dot }} />
        <h1 style={{ fontSize: theme.font.headingXl, fontWeight: 600, color: theme.textPrimary }}>{project.name}</h1>
      </div>
      {project.description && (
        <p style={{ color: theme.textSecondary, marginBottom: 20 }}>{project.description}</p>
      )}

      <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
        {['manage', 'analytics'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 20px', borderRadius: theme.radius.full, fontWeight: 500,
            fontSize: theme.font.bodySmall, textTransform: 'capitalize',
            background: tab === t ? theme.accentBg : 'transparent',
            color: tab === t ? theme.accentText : theme.textSecondary,
            border: `1px solid ${tab === t ? theme.accentBorder : 'transparent'}`,
          }}>{t}</button>
        ))}
      </div>

      {tab === 'manage' ? (
        <div style={{
          padding: 32, borderRadius: theme.radius.lg, border: `1px solid ${theme.border}`,
          background: theme.surface, minHeight: 300,
        }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, fontSize: theme.font.bodySmall, color: theme.textTertiary }}>
            <span>{project.task_count || 0} tasks</span>
            <span>{project.deadline_count || 0} deadlines</span>
            <span>Budget: {project.budget ? `$${project.budget}` : '—'}</span>
          </div>
          <h3 style={{ fontSize: theme.font.heading, fontWeight: 500, color: theme.textPrimary, marginBottom: 16 }}>Deadlines</h3>
          {(project.deadlines || []).length === 0 ? (
            <p style={{ color: theme.textTertiary, fontSize: theme.font.bodySmall }}>No deadlines in this project</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(project.deadlines || []).map(dl => (
                <div key={dl.id} style={{
                  padding: '12px 16px', borderRadius: theme.radius.md, border: `1px solid ${theme.border}`,
                  background: theme.bg,
                }}>
                  <div style={{ fontWeight: 500, color: theme.textPrimary, fontSize: theme.font.body }}>{dl.title}</div>
                  <div style={{ fontSize: theme.font.label, color: theme.textTertiary, marginTop: 4 }}>
                    Due: {dl.due_date}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{
          padding: 32, borderRadius: theme.radius.lg, border: `1px solid ${theme.border}`,
          background: theme.surface, minHeight: 300, textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
          <p style={{ color: theme.textSecondary }}>Project analytics coming soon</p>
          <p style={{ color: theme.textTertiary, fontSize: theme.font.bodySmall, marginTop: 4 }}>
            Gantt charts, progress tracking, and priority breakdowns
          </p>
        </div>
      )}
    </div>
  );
}
