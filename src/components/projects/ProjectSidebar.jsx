import { useTheme } from '../../hooks/useTheme.js';
import { daysUntil, formatShortDate } from '../../utils/dates.js';

export default function ProjectSidebar({ project, deadlines = [] }) {
  const { theme } = useTheme();

  const colorIdx = (project.color_idx || 0) % theme.deadline.length;
  const dlc = theme.deadline[colorIdx];
  const taskCount = project.task_count || 0;
  const doneCount = project.done_count || 0;
  const deadlineCount = project.deadline_count || deadlines.length;
  const completionPct = taskCount > 0 ? Math.round((doneCount / taskCount) * 100) : 0;

  const sidebarStyle = {
    width: 280,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  };

  const sectionStyle = {
    padding: 16,
    borderRadius: theme.radius.lg,
    border: `1px solid ${theme.border}`,
    background: theme.surface,
  };

  const sectionTitle = {
    fontSize: theme.font.label,
    fontWeight: 500,
    color: theme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 12,
  };

  const statRow = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
    fontSize: theme.font.bodySmall,
  };

  /** Mini progress pie for sidebar deadline list */
  function MiniPie({ pct, color, size = 18 }) {
    const cx = size / 2, cy = size / 2, r = (size - 3) / 2;
    if (pct >= 100) {
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={cx} cy={cy} r={r} fill={color} />
          <path d={`M${cx - 3},${cy} l2,2 4,-4`} stroke="#fff" strokeWidth={1.3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    const angle = (Math.min(Math.max(pct, 0), 100) / 100) * 2 * Math.PI;
    const x1 = cx, y1 = cy - r;
    const x2 = cx + r * Math.sin(angle);
    const y2 = cy - r * Math.cos(angle);
    const large = angle > Math.PI ? 1 : 0;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill={color} opacity={0.2} />
        {pct > 0 && (
          <path d={`M${cx},${cy} L${x1},${y1} A${r},${r},0,${large},1,${x2},${y2} Z`} fill={color} />
        )}
      </svg>
    );
  }

  return (
    <div style={sidebarStyle}>
      {/* Project info */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: dlc.dot, flexShrink: 0 }} />
          <div style={{ fontSize: theme.font.heading, fontWeight: 600, color: theme.textPrimary }}>{project.name}</div>
        </div>
        {project.description && (
          <p style={{ fontSize: theme.font.bodySmall, color: theme.textSecondary, lineHeight: 1.5, margin: 0 }}>
            {project.description}
          </p>
        )}
      </div>

      {/* Stats */}
      <div style={sectionStyle}>
        <div style={sectionTitle}>Stats</div>
        <div style={statRow}>
          <span style={{ color: theme.textSecondary }}>Tasks</span>
          <span style={{ fontWeight: 600, color: theme.textPrimary }}>{taskCount}</span>
        </div>
        <div style={statRow}>
          <span style={{ color: theme.textSecondary }}>Deadlines</span>
          <span style={{ fontWeight: 600, color: theme.textPrimary }}>{deadlineCount}</span>
        </div>
        <div style={statRow}>
          <span style={{ color: theme.textSecondary }}>Completion</span>
          <span style={{ fontWeight: 600, color: completionPct === 100 ? theme.success : theme.textPrimary }}>
            {completionPct}%
          </span>
        </div>
        <div style={statRow}>
          <span style={{ color: theme.textSecondary }}>Budget</span>
          <span style={{ fontWeight: 600, color: theme.textPrimary }}>
            {project.budget ? `$${project.budget}` : '\u2014'}
          </span>
        </div>

        {/* Completion bar */}
        <div style={{
          width: '100%', height: 6, background: theme.bgTertiary,
          borderRadius: theme.radius.full, overflow: 'hidden', marginTop: 8,
        }}>
          <div style={{
            width: `${completionPct}%`, height: '100%',
            background: completionPct === 100 ? theme.success : dlc.dot,
            borderRadius: theme.radius.full, transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Deadlines list */}
      {deadlines.length > 0 && (
        <div style={sectionStyle}>
          <div style={sectionTitle}>Deadlines</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {deadlines.map(dl => {
              const dc = theme.deadline[(dl.color_idx || 0) % theme.deadline.length];
              const dlTasks = dl.tasks || [];
              const dlDone = dlTasks.filter(t => t.done).length;
              const dlTotal = dlTasks.length;
              const dlPct = dlTotal > 0 ? Math.round((dlDone / dlTotal) * 100) : 0;
              const days = daysUntil(dl.due_date);
              const overdue = days !== null && days < 0 && dlPct < 100;
              return (
                <div key={dl.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MiniPie pct={dlPct} color={dc.dot} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: theme.font.bodySmall, fontWeight: 500, color: theme.textPrimary,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{dl.title}</div>
                    <div style={{ fontSize: theme.font.label, color: overdue ? theme.danger : theme.textTertiary }}>
                      {overdue ? 'Overdue' : formatShortDate(dl.due_date)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
