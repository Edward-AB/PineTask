import { useTheme } from '../../hooks/useTheme.js';
import { getTaskColor } from '../../utils/colors.js';
import {
  SLOT_HEIGHT, HOUR_HEIGHT, CALENDAR_HOURS, TOTAL_SLOTS,
} from '../../constants';
import { Avatar } from '../teams/MemberAvatarStack.jsx';
import RoleBadge from '../teams/RoleBadge.jsx';
import PrivateBlock from './PrivateBlock.jsx';

const TOTAL_HEIGHT = CALENDAR_HOURS * HOUR_HEIGHT;
const HOURS_ARRAY = Array.from({ length: CALENDAR_HOURS }, (_, i) => i);

export default function ScheduleColumn({
  member, tasks = [], blockedTimes = [], deadlines = [],
  onDropTask, canAssign,
}) {
  const { theme } = useTheme();

  const handleDragOver = (e) => {
    if (!canAssign) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const handleDrop = (e) => {
    if (!canAssign) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top + e.currentTarget.scrollTop;
    const slot = Math.max(0, Math.min(Math.floor(y / SLOT_HEIGHT), TOTAL_SLOTS - 1));
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) onDropTask?.(member.id, taskId, slot);
  };

  return (
    <div style={{
      flex: 1, minWidth: 180,
      display: 'flex', flexDirection: 'column',
      borderLeft: `0.5px solid ${theme.border}`,
    }}>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 2,
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 8px',
        background: theme.bgSecondary,
        borderBottom: `0.5px solid ${theme.border}`,
      }}>
        <Avatar user={member} size={24} ring={false} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 11, fontWeight: 500, color: theme.textPrimary,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{member.username}</div>
        </div>
        <RoleBadge role={member.role} />
      </div>

      {/* Column body */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{ position: 'relative', height: TOTAL_HEIGHT, width: '100%' }}
      >
        {/* Hour lines */}
        {HOURS_ARRAY.map((h, hi) => (
          <div key={h} style={{
            position: 'absolute',
            top: hi * HOUR_HEIGHT, left: 0, right: 0,
            height: HOUR_HEIGHT,
            borderBottom: hi < HOURS_ARRAY.length - 1 ? `0.5px solid ${theme.hourRule}` : 'none',
          }}>
            {[1, 2, 3].map((q) => (
              <div key={q} style={{
                position: 'absolute', top: q * SLOT_HEIGHT, left: 0, right: 0,
                borderTop: `0.5px dashed ${theme.dashLine}`, opacity: 0.7,
              }} />
            ))}
          </div>
        ))}

        {/* Blocked times */}
        {blockedTimes.map((b, i) => (
          <div key={b.id || i} style={{
            position: 'absolute',
            top: b.start_slot * SLOT_HEIGHT,
            height: (b.end_slot - b.start_slot) * SLOT_HEIGHT,
            left: 2, right: 2,
            background: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0 6px, rgba(0,0,0,0.12) 6px 12px)',
            border: `0.5px solid ${theme.border}`,
            borderRadius: 6, pointerEvents: 'none',
          }} title={b.label || 'Blocked'}/>
        ))}

        {/* Tasks */}
        {tasks.map((t) => {
          if (t.private) {
            return <PrivateBlock key={t.id} task={t} username={member.username} />;
          }
          const tc = getTaskColor(t, deadlines, theme);
          const top = t.slot * SLOT_HEIGHT;
          const height = Math.max((t.duration || 2) * SLOT_HEIGHT, SLOT_HEIGHT);
          return (
            <div key={t.id} style={{
              position: 'absolute', left: 2, right: 2,
              top, height,
              background: tc.bg, border: `1px solid ${tc.border}`,
              borderRadius: 8, padding: '3px 6px',
              overflow: 'hidden',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
              <span style={{
                fontSize: 10, fontWeight: 500, color: tc.text,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{t.text}</span>
              {height >= SLOT_HEIGHT * 2 && (
                <span style={{ fontSize: 9, color: tc.dot }}>
                  {(t.duration || 2) * 15}m
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
