import { useTheme } from '../../hooks/useTheme.js';
import { daysUntil, formatShortDate } from '../../utils/dates.js';

export default function ProjectAnalytics({ project }) {
  const { theme } = useTheme();

  const deadlines = project.deadlines || [];
  const allTasks = deadlines.flatMap(dl => dl.tasks || []);
  const totalTasks = project.task_count || allTasks.length;
  const doneTasks = project.done_count || allTasks.filter(t => t.done).length;
  const remaining = totalTasks - doneTasks;
  const completionPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Priority distribution from available tasks
  const high = allTasks.filter(t => !t.done && t.priority === 'high').length;
  const med = allTasks.filter(t => !t.done && t.priority === 'medium').length;
  const low = allTasks.filter(t => !t.done && t.priority === 'low').length;
  const none = allTasks.filter(t => !t.done && (!t.priority || t.priority === 'none')).length;
  const priTotal = high + med + low + none;

  // Deadlines met
  const deadlinesMet = deadlines.filter(dl => {
    const dlTasks = dl.tasks || [];
    return dlTasks.length > 0 && dlTasks.every(t => t.done);
  }).length;

  const sectionStyle = {
    padding: 20,
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
    marginBottom: 14,
  };

  // Donut chart
  const donutSize = 130;
  const cx = donutSize / 2, cy = donutSize / 2, r = (donutSize - 16) / 2;
  const circ = 2 * Math.PI * r;
  const doneDash = totalTasks > 0 ? circ * (doneTasks / totalTasks) : 0;
  const remDash = circ - doneDash;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Metrics grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Total Tasks', value: totalTasks, color: theme.textPrimary },
          { label: 'Completion', value: `${completionPct}%`, color: theme.success },
          { label: 'Deadlines Met', value: `${deadlinesMet}/${deadlines.length}`, color: theme.accent },
          { label: 'Remaining', value: remaining, color: theme.textSecondary },
        ].map(m => (
          <div key={m.label} style={{
            padding: '12px 10px', borderRadius: theme.radius.md,
            background: theme.bgTertiary, textAlign: 'center',
          }}>
            <div style={{ fontSize: theme.font.headingLg, fontWeight: 700, color: m.color, lineHeight: 1.2 }}>
              {m.value}
            </div>
            <div style={{ fontSize: theme.font.label, color: theme.textTertiary, fontWeight: 500, marginTop: 2 }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        {/* Donut chart */}
        <div style={{ ...sectionStyle, flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={sectionTitle}>Task Completion</div>
          <svg width={donutSize} height={donutSize} viewBox={`0 0 ${donutSize} ${donutSize}`}>
            {totalTasks === 0 ? (
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={theme.border} strokeWidth={10} opacity={0.3} />
            ) : (
              <>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={theme.bgTertiary} strokeWidth={10} />
                <circle cx={cx} cy={cy} r={r} fill="none"
                  stroke={theme.success} strokeWidth={10}
                  strokeDasharray={`${doneDash} ${remDash}`}
                  transform={`rotate(-90 ${cx} ${cy})`}
                  style={{ transition: 'stroke-dasharray 0.4s ease' }} />
              </>
            )}
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
              fill={theme.textPrimary} fontSize={theme.font.heading} fontWeight={700}>
              {completionPct}%
            </text>
          </svg>
          <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: theme.font.label, color: theme.textSecondary }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: theme.success }} /> Done ({doneTasks})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: theme.bgTertiary }} /> Left ({remaining})
            </span>
          </div>
        </div>

        {/* Priority distribution */}
        <div style={{ ...sectionStyle, flex: 1 }}>
          <div style={sectionTitle}>Priority Distribution</div>
          {priTotal === 0 ? (
            <p style={{ color: theme.textTertiary, fontSize: theme.font.bodySmall }}>No remaining tasks</p>
          ) : (
            <>
              <div style={{
                display: 'flex', width: '100%', height: 18, borderRadius: theme.radius.full,
                overflow: 'hidden', marginBottom: 10,
              }}>
                {[
                  { val: high, color: theme.chartHigh, label: 'High' },
                  { val: med, color: theme.chartMedium, label: 'Medium' },
                  { val: low, color: theme.chartLow, label: 'Low' },
                  { val: none, color: theme.chartNone, label: 'None' },
                ].filter(s => s.val > 0).map(s => (
                  <div key={s.label} style={{
                    width: `${(s.val / priTotal) * 100}%`, height: '100%',
                    background: s.color, transition: 'width 0.4s ease',
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: theme.font.label, color: theme.textSecondary }}>
                {[
                  { val: high, color: theme.chartHigh, label: 'High' },
                  { val: med, color: theme.chartMedium, label: 'Medium' },
                  { val: low, color: theme.chartLow, label: 'Low' },
                  { val: none, color: theme.chartNone, label: 'None' },
                ].filter(s => s.val > 0).map(s => (
                  <span key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                    {s.label} ({s.val})
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Deadline progress bars */}
      {deadlines.length > 0 && (
        <div style={sectionStyle}>
          <div style={sectionTitle}>Deadline Progress</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {deadlines.map(dl => {
              const dc = theme.deadline[(dl.color_idx || 0) % theme.deadline.length];
              const dlTasks = dl.tasks || [];
              const dlDone = dlTasks.filter(t => t.done).length;
              const dlTotal = dlTasks.length;
              const dlPct = dlTotal > 0 ? Math.round((dlDone / dlTotal) * 100) : 0;
              const days = daysUntil(dl.due_date);
              const overdue = days !== null && days < 0 && dlPct < 100;
              return (
                <div key={dl.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <span style={{ fontSize: theme.font.bodySmall, fontWeight: 500, color: theme.textPrimary }}>
                      {dl.title}
                    </span>
                    <span style={{ fontSize: theme.font.label, color: overdue ? theme.danger : theme.textTertiary }}>
                      {overdue ? 'Overdue' : formatShortDate(dl.due_date)} &middot; {dlPct}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%', height: 6, background: theme.bgTertiary,
                    borderRadius: theme.radius.full, overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${dlPct}%`, height: '100%',
                      background: overdue ? theme.danger : dc.dot,
                      borderRadius: theme.radius.full,
                      transition: 'width 0.4s ease',
                    }} />
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
