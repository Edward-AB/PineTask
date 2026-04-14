import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme.js';
import { dateKey } from '../../utils/dates.js';
import TaskItem from './TaskItem.jsx';
import DeadlineItem from '../deadlines/DeadlineItem.jsx';

export default function TaskList({
  date, tasks, allTasks, deadlines,
  onToggle, onDelete, onNote, onUpdate, onMove, onDrop,
  onEditDeadline,
}) {
  const { theme } = useTheme();
  const dayStr = dateKey(date);
  const todayStr = dateKey(new Date());
  const [overUnsch, setOverUnsch] = useState(false);
  const [expTodDl, setExpTodDl] = useState(null);

  // Tasks for this day
  const dayTasks = (tasks || []).filter((t) => t.date === dayStr);

  // Unscheduled / scheduled — ALL tasks including deadline-linked (matches v1)
  const unsch = dayTasks.filter((t) => t.slot == null);
  const sched = dayTasks.filter((t) => t.slot != null).sort((a, b) => a.slot - b.slot);

  // All tasks for a deadline (across all dates)
  const allTFDl = (dlId) => (allTasks || []).filter((t) => (t.deadlineId || t.deadline_id) === dlId);

  // Deadline sections — v1 lines 635-643
  const dueTodayDl = (deadlines || []).filter((dl) => (dl.date || dl.due_date) === dayStr);
  const dueTodayIds = new Set(dueTodayDl.map((d) => d.id));
  const activeDl = (deadlines || []).filter((dl) =>
    dayTasks.some((task) => (task.deadlineId || task.deadline_id) === dl.id && task.slot != null)
  );
  const scheduledOnlyDl = activeDl.filter((dl) => !dueTodayIds.has(dl.id));
  const overdueDl = dayStr >= todayStr
    ? (deadlines || []).filter((dl) => {
        const dlDate = dl.date || dl.due_date;
        if (!dlDate || dlDate >= todayStr) return false;
        const allT = allTFDl(dl.id);
        if (allT.length === 0) return false;
        return !allT.every((x) => x.done);
      })
    : [];

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setOverUnsch(true);
  };
  const handleDragLeave = () => setOverUnsch(false);
  const handleDrop2 = (e) => {
    e.preventDefault();
    setOverUnsch(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId && onDrop) onDrop(taskId, null);
  };

  const itemProps = { deadlines, onToggle, onDelete, onNote, onUpdate, onMove };
  const dlColor = (dl) => theme.deadline[(dl.color_idx ?? dl.colorIdx ?? 0) % theme.deadline.length];

  // Deadline section label with colored dot — v1 style
  const dlSectionLabel = (text, color, dotColor) => (
    <div style={{
      fontSize: 10, fontWeight: 500, color: color || theme.textTertiary,
      letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6,
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: dotColor }} />
      {text}
    </div>
  );

  // Simple section label (no dot) — v1 style
  const sectionLabel = (text) => (
    <div style={{
      fontSize: 10, fontWeight: 500, color: theme.textTertiary,
      letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6,
    }}>{text}</div>
  );

  const divider = () => (
    <div style={{ height: '0.5px', background: theme.hourRule || theme.borderLight, margin: '8px 0' }} />
  );

  const renderDlItem = (dl, tasksForDl) => (
    <DeadlineItem
      key={dl.id}
      deadline={dl}
      color={dlColor(dl)}
      allTasks={tasksForDl || allTFDl(dl.id)}
      expanded={expTodDl === dl.id}
      onToggle={() => setExpTodDl(expTodDl === dl.id ? null : dl.id)}
      onRemove={() => {}}
      onSaveEdit={(updated) => onEditDeadline?.(updated.id, { title: updated.title, due_date: updated.due_date, color_idx: updated.color_idx })}
      showRemove={false}
      theme={theme}
    />
  );

  return (
    <div
      className="col-scroll"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop2}
      style={{
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 280px)',
        border: `0.5px solid ${overUnsch ? theme.accent : theme.border}`,
        borderRadius: 14,
        padding: '12px 14px',
        background: theme.bgSecondary,
      }}
    >
      {/* Overdue deadlines */}
      {overdueDl.length > 0 && (<>
        {dlSectionLabel('Overdue', '#E24B4A', '#E24B4A')}
        {overdueDl.map((dl) => renderDlItem(dl))}
        {divider()}
      </>)}

      {/* Due today deadlines */}
      {dueTodayDl.length > 0 && (<>
        {dlSectionLabel('Due today', theme.textTertiary, theme.accent)}
        {dueTodayDl.map((dl) => renderDlItem(dl))}
        {divider()}
      </>)}

      {/* Deadline tasks scheduled today (not due today) */}
      {scheduledOnlyDl.length > 0 && (<>
        {dlSectionLabel('Deadline tasks scheduled today', theme.textTertiary, theme.accentBorder)}
        {scheduledOnlyDl.map((dl) => renderDlItem(dl, dayTasks.filter((task) => (task.deadlineId || task.deadline_id) === dl.id && task.slot != null)))}
        {divider()}
      </>)}

      {/* Empty / All scheduled */}
      {dayTasks.length === 0 && (
        <div style={{ fontSize: 12, color: theme.textTertiary, padding: '4px 0', marginBottom: 6 }}>
          Add a task above to get started.
        </div>
      )}
      {unsch.length === 0 && dayTasks.length > 0 && (
        <div style={{ fontSize: 12, color: theme.textTertiary, padding: '4px 0', marginBottom: 6 }}>
          All tasks scheduled!
        </div>
      )}

      {/* Unscheduled tasks */}
      {unsch.length > 0 && (<>
        {sectionLabel(`Unscheduled \u00B7 ${unsch.length}`)}
        {unsch.map((t) => <TaskItem key={t.id} task={t} {...itemProps} />)}
      </>)}

      {/* Scheduled tasks */}
      {sched.length > 0 && (
        <div>
          {divider()}
          {sectionLabel(`Scheduled \u00B7 ${sched.length}`)}
          {sched.map((t) => <TaskItem key={t.id} task={t} {...itemProps} />)}
        </div>
      )}
    </div>
  );
}
