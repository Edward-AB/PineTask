import { useTheme } from '../../hooks/useTheme.js';
import { formatShortDate, daysUntil } from '../../utils/dates.js';

export default function ProjectDetail({ project, onRefresh }) {
  const { theme } = useTheme();

  const deadlines = project.deadlines || [];
  const taskCount = project.task_count || 0;
  const doneCount = project.done_count || 0;
  const completionPct = taskCount > 0 ? Math.round((doneCount / taskCount) * 100) : 0;

  const containerStyle = {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  };

  const sectionStyle = {
    padding: 20,
    borderRadius: theme.radius.lg,
    border: `1px solid ${theme.border}`,
    background: theme.surface,
  };

  const sectionTitle = {
    fontSize: theme.font.heading,
    fontWeight: 500,
    color: theme.textPrimary,
    marginBottom: 14,
  };

  return (
    <div style={containerStyle}>
      {/* Task summary */}
      <div style={sectionStyle}>
        <div style={sectionTitle}>Task Summary</div>
        <div style={{ display: 'flex', gap: 20, fontSize: theme.font.bodySmall, color: theme.textTertiary, marginBottom: 12 }}>
          <span>{taskCount} task{taskCount !== 1 ? 's' : ''}</span>
          <span>{doneCount} done</span>
          <span>{completionPct}% complete</span>
        </div>
        <div style={{
          width: '100%', height: 6, background: theme.bgTertiary,
          borderRadius: theme.radius.full, overflow: 'hidden',
        }}>
          <div style={{
            width: `${completionPct}%`, height: '100%',
            background: completionPct === 100 ? theme.success : theme.accent,
            borderRadius: theme.radius.full, transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Budget */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: theme.font.bodySmall, color: theme.textSecondary }}>Budget</span>
          <span style={{ fontSize: theme.font.heading, fontWeight: 600, color: theme.textPrimary }}>
            {project.budget ? `$${project.budget}` : '\u2014'}
          </span>
        </div>
      </div>

      {/* Deadlines */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={sectionTitle}>Deadlines</div>
          <span style={{ fontSize: theme.font.label, color: theme.textTertiary }}>
            {deadlines.length} deadline{deadlines.length !== 1 ? 's' : ''}
          </span>
        </div>
        {deadlines.length === 0 ? (
          <p style={{ color: theme.textTertiary, fontSize: theme.font.bodySmall }}>No deadlines in this project</p>
        ) : (
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
                <div key={dl.id} style={{
                  padding: '12px 16px', borderRadius: theme.radius.md,
                  border: `1px solid ${dc.border}30`, background: dc.bg,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ fontSize: theme.font.body, fontWeight: 500, color: dc.text }}>{dl.title}</div>
                    <div style={{ fontSize: theme.font.label, color: overdue ? theme.danger : dc.text, opacity: overdue ? 1 : 0.7 }}>
                      {overdue ? 'OVERDUE' : days === 0 ? 'Due today' : days === 1 ? 'Due tomorrow' : days !== null ? `${days}d left` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      flex: 1, height: 4, background: `${dc.border}30`,
                      borderRadius: theme.radius.full, overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${dlPct}%`, height: '100%',
                        background: dc.dot, borderRadius: theme.radius.full,
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
                    <span style={{ fontSize: theme.font.label, color: dc.text, opacity: 0.7, flexShrink: 0 }}>
                      {dlDone}/{dlTotal}
                    </span>
                  </div>
                  <div style={{ fontSize: theme.font.label, color: dc.text, opacity: 0.5, marginTop: 4 }}>
                    {formatShortDate(dl.start_date)} &rarr; {formatShortDate(dl.due_date)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
