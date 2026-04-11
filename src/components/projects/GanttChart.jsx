import { useMemo } from 'react';
import { useTheme } from '../../hooks/useTheme.js';
import { parseDate } from '../../utils/dates.js';

export default function GanttChart({ deadlines = [], startDate, endDate }) {
  const { theme } = useTheme();

  const { bars, ticks, totalDays, chartStart } = useMemo(() => {
    if (deadlines.length === 0) return { bars: [], ticks: [], totalDays: 0, chartStart: null };

    // Compute chart range
    let minDate = startDate ? parseDate(startDate) : null;
    let maxDate = endDate ? parseDate(endDate) : null;
    deadlines.forEach(dl => {
      const s = dl.start_date ? parseDate(dl.start_date) : null;
      const d = dl.due_date ? parseDate(dl.due_date) : null;
      if (s && (!minDate || s < minDate)) minDate = s;
      if (d && (!maxDate || d > maxDate)) maxDate = d;
    });
    if (!minDate || !maxDate) return { bars: [], ticks: [], totalDays: 0, chartStart: null };

    // Add padding: 3 days each side
    const cs = new Date(minDate);
    cs.setDate(cs.getDate() - 3);
    const ce = new Date(maxDate);
    ce.setDate(ce.getDate() + 3);
    const td = Math.max(1, Math.ceil((ce - cs) / 86400000));

    // Build time ticks (first of each month or every two weeks)
    const ticksArr = [];
    const cur = new Date(cs);
    cur.setDate(1);
    if (cur < cs) cur.setMonth(cur.getMonth() + 1);
    while (cur <= ce) {
      const dayOff = Math.ceil((cur - cs) / 86400000);
      ticksArr.push({
        label: cur.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
        offset: dayOff / td,
      });
      cur.setMonth(cur.getMonth() + 1);
    }

    // Build bar data
    const barsArr = deadlines.map(dl => {
      const s = dl.start_date ? parseDate(dl.start_date) : parseDate(dl.due_date);
      const d = parseDate(dl.due_date);
      const startOff = Math.max(0, (s - cs) / 86400000) / td;
      const endOff = Math.min(td, (d - cs) / 86400000) / td;
      const dlTasks = dl.tasks || [];
      const done = dlTasks.filter(t => t.done).length;
      const total = dlTasks.length;
      const pct = total > 0 ? done / total : 0;
      return { id: dl.id, title: dl.title, startOff, endOff, pct, colorIdx: dl.color_idx || 0 };
    });

    return { bars: barsArr, ticks: ticksArr, totalDays: td, chartStart: cs };
  }, [deadlines, startDate, endDate]);

  if (deadlines.length === 0 || bars.length === 0) {
    return (
      <div style={{
        padding: 32, borderRadius: theme.radius.lg, border: `1px solid ${theme.border}`,
        background: theme.surface, textAlign: 'center',
      }}>
        <p style={{ color: theme.textTertiary, fontSize: theme.font.bodySmall }}>No deadlines to display</p>
      </div>
    );
  }

  const leftW = 140;
  const chartW = 600;
  const rowH = 32;
  const headerH = 28;
  const totalH = headerH + bars.length * rowH + 8;

  return (
    <div style={{
      borderRadius: theme.radius.lg, border: `1px solid ${theme.border}`,
      background: theme.surface, padding: 16, overflowX: 'auto',
    }}>
      <svg width={leftW + chartW} height={totalH} style={{ display: 'block' }}>
        {/* Time axis */}
        {ticks.map((tick, i) => {
          const x = leftW + tick.offset * chartW;
          return (
            <g key={i}>
              <line x1={x} y1={headerH - 4} x2={x} y2={totalH} stroke={theme.border} strokeWidth={1} strokeDasharray="3,3" />
              <text x={x + 4} y={headerH - 10} fill={theme.textTertiary} fontSize={10} fontFamily="inherit">
                {tick.label}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {bars.map((bar, i) => {
          const dc = theme.deadline[bar.colorIdx % theme.deadline.length];
          const y = headerH + i * rowH + 4;
          const barX = leftW + bar.startOff * chartW;
          const barW = Math.max(4, (bar.endOff - bar.startOff) * chartW);
          const fillW = barW * bar.pct;
          return (
            <g key={bar.id}>
              {/* Deadline name */}
              <text x={leftW - 8} y={y + rowH / 2 - 2} fill={theme.textPrimary} fontSize={11}
                fontFamily="inherit" textAnchor="end" dominantBaseline="central"
                style={{ overflow: 'hidden' }}>
                {bar.title.length > 18 ? bar.title.slice(0, 18) + '...' : bar.title}
              </text>
              {/* Background bar */}
              <rect x={barX} y={y + 4} width={barW} height={rowH - 12}
                rx={4} fill={dc.bg} stroke={dc.border} strokeWidth={0.5} />
              {/* Progress fill */}
              {fillW > 0 && (
                <rect x={barX} y={y + 4} width={fillW} height={rowH - 12}
                  rx={4} fill={dc.dot} opacity={0.7} />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
