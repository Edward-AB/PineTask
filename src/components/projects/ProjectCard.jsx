import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme.js';

export default function ProjectCard({ project }) {
  const { theme } = useTheme();
  const [hovered, setHovered] = useState(false);

  const colorIdx = (project.color_idx || 0) % theme.deadline.length;
  const dlc = theme.deadline[colorIdx];
  const taskCount = project.task_count || 0;
  const doneCount = project.done_count || 0;
  const deadlineCount = project.deadline_count || 0;
  const pct = taskCount > 0 ? Math.round((doneCount / taskCount) * 100) : 0;

  const desc = project.description || '';
  const truncated = desc.length > 100 ? desc.slice(0, 100) + '...' : desc;

  const cardStyle = {
    display: 'block',
    textDecoration: 'none',
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderLeft: `4px solid ${dlc.dot}`,
    borderRadius: theme.radius.lg,
    padding: '20px',
    transition: `box-shadow ${theme.transition}, transform ${theme.transition}`,
    boxShadow: hovered ? theme.shadow.md : 'none',
    transform: hovered ? 'translateY(-2px)' : 'none',
    cursor: 'pointer',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  };

  const dotStyle = {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: dlc.dot,
    flexShrink: 0,
  };

  const nameStyle = {
    fontSize: theme.font.heading,
    fontWeight: 600,
    color: theme.textPrimary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const descStyle = {
    fontSize: theme.font.bodySmall,
    color: theme.textSecondary,
    marginBottom: 14,
    lineHeight: 1.5,
    minHeight: 18,
  };

  const metaStyle = {
    display: 'flex',
    gap: 12,
    fontSize: theme.font.label,
    color: theme.textTertiary,
    marginBottom: 10,
  };

  const trackStyle = {
    width: '100%',
    height: 4,
    background: theme.bgTertiary,
    borderRadius: theme.radius.full,
    overflow: 'hidden',
  };

  const fillStyle = {
    width: `${pct}%`,
    height: '100%',
    background: dlc.dot,
    borderRadius: theme.radius.full,
    transition: 'width 0.4s ease',
  };

  const pctStyle = {
    fontSize: theme.font.label,
    color: theme.textTertiary,
    marginTop: 4,
    textAlign: 'right',
  };

  return (
    <Link
      to={`/projects/${project.id}`}
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={headerStyle}>
        <div style={dotStyle} />
        <div style={nameStyle}>{project.name}</div>
      </div>
      <div style={descStyle}>{truncated}</div>
      <div style={metaStyle}>
        <span>{taskCount} task{taskCount !== 1 ? 's' : ''}</span>
        <span>{deadlineCount} deadline{deadlineCount !== 1 ? 's' : ''}</span>
      </div>
      <div style={trackStyle}>
        <div style={fillStyle} />
      </div>
      <div style={pctStyle}>{pct}% complete</div>
    </Link>
  );
}
