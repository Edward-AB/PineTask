import { useTheme } from '../../hooks/useTheme.js';
import PieChart from './PieChart.jsx';
import StatsGrid from './StatsGrid.jsx';

export default function OverviewCard({ tasks }) {
  const { theme } = useTheme();

  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const left = total - done;
  const scheduled = tasks.filter((t) => t.slot != null).length;

  // Remaining tasks by priority
  const remaining = tasks.filter((t) => !t.done);
  const highCount = remaining.filter((t) => t.priority === 'high').length;
  const medCount = remaining.filter((t) => t.priority === 'medium').length;
  const lowCount = remaining.filter((t) => t.priority === 'low').length;
  const noneCount = remaining.filter((t) => !t.priority || t.priority === 'none').length;

  const segments = [
    { value: done, color: theme.chartDone, label: 'Done' },
    { value: highCount, color: theme.chartHigh, label: 'High' },
    { value: medCount, color: theme.chartMedium, label: 'Medium' },
    { value: lowCount, color: theme.chartLow, label: 'Low' },
    { value: noneCount, color: theme.chartNone, label: 'None' },
  ];

  const cardStyle = {
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: theme.radius.lg,
    padding: '20px',
  };

  const titleStyle = {
    fontSize: theme.font.label,
    fontWeight: 500,
    color: theme.textTertiary,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 14,
  };

  const chartWrap = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 16,
  };

  const legendStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    justifyContent: 'center',
  };

  const legendItem = {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontSize: theme.font.label,
    color: theme.textSecondary,
  };

  const legendDot = (color) => ({
    width: 8,
    height: 8,
    borderRadius: 2,
    background: color,
    flexShrink: 0,
  });

  return (
    <div style={cardStyle}>
      <div style={titleStyle}>OVERVIEW</div>
      <div style={chartWrap}>
        <PieChart segments={segments} />
      </div>
      <div style={legendStyle}>
        {segments.filter((s) => s.value > 0).map((s) => (
          <div key={s.label} style={legendItem}>
            <span style={legendDot(s.color)} />
            {s.label} ({s.value})
          </div>
        ))}
      </div>
      <StatsGrid total={total} done={done} left={left} scheduled={scheduled} />
    </div>
  );
}
