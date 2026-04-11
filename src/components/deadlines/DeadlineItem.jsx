import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme.js';
import { daysUntil, formatShortDate } from '../../utils/dates.js';

export default function DeadlineItem({ deadline, tasks = [], onDelete, onEdit }) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const dlc = theme.deadline[deadline.color_idx % theme.deadline.length];
  const dlTasks = tasks.filter(t => t.deadline_id === deadline.id);
  const doneTasks = dlTasks.filter(t => t.done).length;
  const totalTasks = dlTasks.length;
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const days = daysUntil(deadline.due_date);
  const overdue = days !== null && days < 0 && pct < 100;

  return (
    <div style={{
      borderRadius: theme.radius.md, border: `1px solid ${dlc.border}30`,
      background: dlc.bg, padding: '10px 12px', cursor: 'pointer',
    }} onClick={() => setExpanded(!expanded)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width={26} height={26} viewBox="0 0 28 28" style={{ flexShrink: 0 }}>
          {pct >= 100 ? (
            <>
              <circle cx={14} cy={14} r={11} fill={dlc.dot} opacity={0.25} />
              <circle cx={14} cy={14} r={11} fill={dlc.dot} />
              <path d="M9 14l3 3 7-7" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </>
          ) : pct <= 0 ? (
            <circle cx={14} cy={14} r={11} fill={dlc.dot} opacity={0.2} />
          ) : (() => {
            const r = 11, cx = 14, cy = 14;
            const sw = (pct / 100) * 2 * Math.PI;
            const x1 = cx + r * Math.cos(-Math.PI / 2);
            const y1 = cy + r * Math.sin(-Math.PI / 2);
            const x2 = cx + r * Math.cos(-Math.PI / 2 + sw);
            const y2 = cy + r * Math.sin(-Math.PI / 2 + sw);
            return (
              <>
                <circle cx={cx} cy={cy} r={r} fill={dlc.dot} opacity={0.2} />
                <path d={`M${cx},${cy} L${x1},${y1} A${r},${r},0,${sw > Math.PI ? 1 : 0},1,${x2},${y2} Z`} fill={dlc.dot} />
              </>
            );
          })()}
        </svg>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: theme.font.body, fontWeight: 500, color: dlc.text }}>{deadline.title}</div>
          <div style={{ fontSize: theme.font.label, color: dlc.text, opacity: 0.7, marginTop: 2 }}>
            {overdue ? (
              <span style={{ color: theme.danger, fontWeight: 600 }}>OVERDUE</span>
            ) : days !== null ? (
              days === 0 ? 'Due today' : days === 1 ? 'Due tomorrow' : `${days} days left`
            ) : ''}
            {totalTasks > 0 && ` · ${doneTasks}/${totalTasks} tasks`}
          </div>
        </div>
        <span style={{ fontSize: 11, color: dlc.text, opacity: 0.5 }}>{expanded ? '▾' : '▸'}</span>
      </div>

      {expanded && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${dlc.border}30` }}>
          <div style={{ fontSize: theme.font.bodySmall, color: dlc.text, opacity: 0.7, marginBottom: 6 }}>
            {formatShortDate(deadline.start_date)} → {formatShortDate(deadline.due_date)}
          </div>
          {dlTasks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {dlTasks.map(t => (
                <div key={t.id} style={{ fontSize: theme.font.bodySmall, color: dlc.text, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ opacity: t.done ? 0.5 : 1 }}>{t.done ? '✓' : '○'}</span>
                  <span style={{ textDecoration: t.done ? 'line-through' : 'none', opacity: t.done ? 0.5 : 1 }}>{t.text}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: theme.font.bodySmall, color: dlc.text, opacity: 0.5 }}>No tasks linked</div>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            {onEdit && <button onClick={e => { e.stopPropagation(); onEdit(deadline); }} style={{
              fontSize: theme.font.label, padding: '3px 10px', borderRadius: theme.radius.sm,
              border: `1px solid ${dlc.border}40`, color: dlc.text,
            }}>Edit</button>}
            {onDelete && <button onClick={e => { e.stopPropagation(); onDelete(deadline.id); }} style={{
              fontSize: theme.font.label, padding: '3px 10px', borderRadius: theme.radius.sm,
              border: `1px solid ${theme.danger}40`, color: theme.danger,
            }}>Delete</button>}
          </div>
        </div>
      )}
    </div>
  );
}
