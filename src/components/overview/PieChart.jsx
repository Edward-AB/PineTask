import { useTheme } from '../../hooks/useTheme.js';

/**
 * SVG donut chart for task breakdown.
 * segments: [{ value, color, label }]
 */
export default function PieChart({ segments, size = 100, centerCount }) {
  const { theme } = useTheme();
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - 12) / 2;
  const circumference = 2 * Math.PI * r;

  const total = segments.reduce((s, seg) => s + seg.value, 0);

  if (total === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={theme.border} strokeWidth={8} opacity={0.3} />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
            fill={theme.textTertiary} fontSize={theme.font.bodySmall} fontWeight={500}>
            No tasks
          </text>
        </svg>
      </div>
    );
  }

  // Check if one segment is 100%
  const full = segments.find((s) => s.value === total);
  if (full) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={full.color} strokeWidth={8} />
        <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="central"
          fill={theme.textPrimary} fontSize="16" fontWeight={700}>
          {centerCount ?? total}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" dominantBaseline="central"
          fill={theme.textTertiary} fontSize="9" fontWeight={500}>
          tasks
        </text>
      </svg>
    );
  }

  let offset = 0;
  const arcs = segments.filter((s) => s.value > 0).map((seg) => {
    const pct = seg.value / total;
    const dash = circumference * pct;
    const gap = circumference - dash;
    const rotation = (offset / total) * 360 - 90;
    offset += seg.value;
    return { ...seg, dash, gap, rotation };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {arcs.map((arc, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={arc.color}
          strokeWidth={8}
          strokeDasharray={`${arc.dash} ${arc.gap}`}
          transform={`rotate(${arc.rotation} ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 0.4s ease' }}
        />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="central"
        fill={theme.textPrimary} fontSize="16" fontWeight={700}>
        {centerCount ?? total}
      </text>
      <text x={cx} y={cy + 8} textAnchor="middle" dominantBaseline="central"
        fill={theme.textTertiary} fontSize="9" fontWeight={500}>
        tasks
      </text>
    </svg>
  );
}
