import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../hooks/useTheme.js';
import { useNarrow } from '../../hooks/useNarrow.js';
import { apiPatch, apiPost } from '../../api/client.js';
import { dateKey, addDays, formatDate } from '../../utils/dates.js';
import {
  HOUR_HEIGHT, SLOT_HEIGHT, CALENDAR_HOURS, CALENDAR_LABEL_WIDTH,
} from '../../constants';
import useTeamSchedules from '../../hooks/useTeamSchedules.js';
import ScheduleColumn from './ScheduleColumn.jsx';
import MemberFilter from './MemberFilter.jsx';
import TaskPalette from './TaskPalette.jsx';
import NowLine from '../calendar/NowLine.jsx';

const TOTAL_HEIGHT = CALENDAR_HOURS * HOUR_HEIGHT;
const HOURS_ARRAY = Array.from({ length: CALENDAR_HOURS }, (_, i) => i);

export default function SchedulingAssistant({ team, deadlines = [] }) {
  const { theme } = useTheme();
  const narrow = useNarrow();
  const [date, setDate] = useState(() => new Date());
  const { schedules, loading, fetchSchedules } = useTeamSchedules();
  const [selected, setSelected] = useState(new Set());
  const [narrowMemberId, setNarrowMemberId] = useState(null);

  const dk = dateKey(date);

  useEffect(() => {
    if (team?.id) fetchSchedules(team.id, dk);
  }, [team?.id, dk, fetchSchedules]);

  // Initialise selection when schedules load
  useEffect(() => {
    if (schedules.length && selected.size === 0) {
      setSelected(new Set(schedules.map((s) => s.userId)));
      setNarrowMemberId(schedules[0]?.userId || null);
    }
  }, [schedules, selected.size]);

  const members = useMemo(() => schedules.map((s) => ({
    id: s.userId, username: s.username, avatar_url: s.avatar_url, role: s.role,
  })), [schedules]);

  const toggleMember = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const visible = schedules.filter((s) => {
    if (narrow) return s.userId === narrowMemberId;
    return selected.has(s.userId);
  });

  // Drag task from palette → member column
  const handleDropTask = async (assigneeId, taskId, slot) => {
    try {
      await apiPatch(`/api/tasks/${taskId}`, { slot, date: dk });
      // If drop target is a different member, create an assignment pointing to them
      await apiPost(`/api/tasks/${taskId}/assign`, {
        teamId: team.id,
        assignedTo: assigneeId,
      }).catch(() => {});
      fetchSchedules(team.id, dk);
    } catch {}
  };

  const btn = {
    background: 'none', border: `0.5px solid ${theme.border}`,
    borderRadius: 7, padding: '4px 10px', fontSize: 11,
    color: theme.textPrimary, cursor: 'pointer', fontFamily: 'inherit',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Header */}
      <div style={{
        background: theme.bgSecondary, border: `0.5px solid ${theme.border}`,
        borderRadius: 14, padding: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: theme.textPrimary }}>
              {team?.name} — Scheduling Assistant
            </div>
            <div style={{ fontSize: 11, color: theme.textSecondary, marginTop: 2 }}>
              Drag tasks from the palette onto a member's column to assign them.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button style={btn} onClick={() => setDate((d) => addDays(d, -1))}>‹</button>
            <span style={{ fontSize: 12, fontWeight: 500, color: theme.textPrimary, minWidth: 180, textAlign: 'center' }}>
              {formatDate(date)}
            </span>
            <button style={btn} onClick={() => setDate((d) => addDays(d, 1))}>›</button>
            <button style={btn} onClick={() => setDate(new Date())}>Today</button>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          {narrow ? (
            <select
              value={narrowMemberId || ''}
              onChange={(e) => setNarrowMemberId(e.target.value)}
              style={{
                fontFamily: 'inherit', fontSize: 12,
                padding: '6px 9px', borderRadius: 7,
                border: `0.5px solid ${theme.border}`,
                background: theme.surface, color: theme.textPrimary,
              }}
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>@{m.username}</option>
              ))}
            </select>
          ) : (
            <MemberFilter members={members} selected={selected} onToggle={toggleMember} />
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', gap: 12 }}>
        {!narrow && (
          <TaskPalette teamId={team?.id} currentDate={dk} onTaskCreated={() => fetchSchedules(team.id, dk)} />
        )}

        <div style={{
          flex: 1, background: theme.bgSecondary,
          border: `0.5px solid ${theme.border}`, borderRadius: 14,
          padding: '12px 14px',
          display: 'flex', flexDirection: 'column',
        }}>
          {loading ? (
            <div style={{ fontSize: 12, color: theme.textTertiary, padding: 12 }}>Loading schedules…</div>
          ) : visible.length === 0 ? (
            <div style={{ fontSize: 12, color: theme.textTertiary, padding: 12 }}>
              No members selected.
            </div>
          ) : (
            <div style={{
              display: 'flex',
              maxHeight: 'calc(100vh - 300px)',
              overflowY: 'auto', overflowX: 'auto',
              borderRadius: 12, border: `0.5px solid ${theme.border}`,
              background: theme.calBg,
            }}>
              {/* Time labels */}
              <div style={{ width: CALENDAR_LABEL_WIDTH, flexShrink: 0, position: 'relative' }}>
                <div style={{ height: 36, borderBottom: `0.5px solid ${theme.border}`, background: theme.bgSecondary, position: 'sticky', top: 0, zIndex: 2 }} />
                <div style={{ position: 'relative', height: TOTAL_HEIGHT }}>
                  {HOURS_ARRAY.map((h, hi) => (
                    <div key={h} style={{
                      position: 'absolute',
                      top: hi * HOUR_HEIGHT, left: 0, right: 0,
                      height: HOUR_HEIGHT,
                      padding: '4px 7px 0 0',
                      fontSize: 10, color: theme.textTertiary,
                      textAlign: 'right',
                      borderBottom: hi < HOURS_ARRAY.length - 1 ? `0.5px solid ${theme.hourRule}` : 'none',
                    }}>
                      {String(h).padStart(2, '0')}:00
                    </div>
                  ))}
                </div>
              </div>
              {/* Member columns */}
              {visible.map((s) => (
                <ScheduleColumn
                  key={s.userId}
                  member={{ id: s.userId, username: s.username, avatar_url: s.avatar_url, role: s.role }}
                  tasks={s.tasks || []}
                  blockedTimes={s.blockedTimes || []}
                  deadlines={deadlines}
                  onDropTask={handleDropTask}
                  canAssign
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
