import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme.js';
import { apiGet } from '../api/client.js';
import ProjectSidebar from '../components/projects/ProjectSidebar.jsx';
import ProjectDetail from '../components/projects/ProjectDetail.jsx';
import ProjectAnalytics from '../components/projects/ProjectAnalytics.jsx';
import GanttChart from '../components/projects/GanttChart.jsx';

export default function ProjectDetailPage() {
  const { theme } = useTheme();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('manage');

  const fetchProject = useCallback(async () => {
    try {
      const res = await apiGet(`/api/projects/${id}`);
      setProject(res.data);
    } catch {}
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchProject(); }, [fetchProject]);

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
  const deadlines = project.deadlines || [];

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
      <Link to="/projects" style={{ fontSize: theme.font.bodySmall, color: theme.textTertiary, marginBottom: 16, display: 'inline-block' }}>
        &larr; Back to projects
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: dlc.dot }} />
        <h1 style={{ fontSize: theme.font.headingXl, fontWeight: 600, color: theme.textPrimary, margin: 0 }}>{project.name}</h1>
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
            cursor: 'pointer',
          }}>{t}</button>
        ))}
      </div>

      {tab === 'manage' ? (
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <ProjectSidebar project={project} deadlines={deadlines} />
          <ProjectDetail project={project} onRefresh={fetchProject} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <ProjectAnalytics project={project} />
          <GanttChart deadlines={deadlines} />
        </div>
      )}
    </div>
  );
}
