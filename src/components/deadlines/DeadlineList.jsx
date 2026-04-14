import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme.js';
import { dateKey } from '../../utils/dates.js';
import DeadlineItem from './DeadlineItem.jsx';
import DeadlineForm from './DeadlineForm.jsx';

/* ── DlColorPicker (inline form version) — from v1 lines 327-329 ── */
function DlColorPicker({ DLC, value, onChange, theme }) {
  const c = DLC[value];
  const NAMES = ["Amber", "Rose", "Teal", "Coral", "Stone", "Sage"];
  return (
    <div style={{ position: "relative", marginBottom: 8 }}>
      <select value={value} onChange={e => onChange(Number(e.target.value))} style={{ width: "100%", fontSize: 12, borderRadius: 7, border: `1.5px solid ${c.border}`, padding: "5px 8px", background: c.bg, color: c.text, cursor: "pointer", outline: "none", appearance: "none" }}>
        {DLC.map((dc, i) => <option key={i} value={i}>{NAMES[i]}</option>)}
      </select>
      <div style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", fontSize: 10, color: c.text }}>▾</div>
    </div>
  );
}

export default function DeadlineList({ deadlines, tasks, projects, onAdd, onDelete, onEdit, embedded }) {
  const { theme } = useTheme();
  const [expDl, setExpDl] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState(null);

  // Inline form state (for embedded mode — always-visible form from v1 lines 606-612)
  const today = dateKey(new Date());
  const [dlTitle, setDlTitle] = useState('');
  const [dlDesc, setDlDesc] = useState('');
  const [dlStartDate, setDlStartDate] = useState('');
  const [dlDate, setDlDate] = useState('');
  const [dlColorIdx, setDlColorIdx] = useState(0);

  const DLC = theme.deadline;

  // Get all tasks for a given deadline
  const allTasksForDl = (dlId) => (tasks || []).filter(t => (t.deadline_id || t.deadlineId) === dlId);

  // Handle inline save-edit from DeadlineItem
  const saveDlEdit = (updated) => {
    if (onEdit) {
      onEdit(updated.id, {
        title: updated.title,
        due_date: updated.due_date,
        color_idx: updated.color_idx,
      });
    }
  };

  // Handle add from inline form
  const addDl = () => {
    if (!dlTitle.trim() || !dlDate) return;
    onAdd({
      title: dlTitle.trim(),
      description: dlDesc,
      start_date: dlStartDate || null,
      due_date: dlDate,
      color_idx: dlColorIdx,
      project_id: null,
    });
    setDlTitle('');
    setDlDesc('');
    setDlStartDate('');
    setDlDate('');
    setDlColorIdx(0);
  };

  // Handle non-embedded edit flow
  const handleEdit = (dl) => {
    setEditingDeadline(dl);
    setShowForm(true);
  };

  const handleSubmit = (data) => {
    if (editingDeadline && onEdit) {
      onEdit(editingDeadline.id, data);
    } else {
      onAdd(data);
    }
    setShowForm(false);
    setEditingDeadline(null);
  };

  const t = theme; // shorthand for inline styles matching v1

  /* ── Embedded mode: v1 layout with SL label, scrollable list, always-visible inline form ── */
  if (embedded) {
    return (
      <>
        {/* SL label */}
        <div style={{ fontSize: 10, fontWeight: 500, color: t.textTertiary, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Deadlines</div>

        {/* Scrollable deadline list */}
        <div style={{ overflowY: "auto", maxHeight: 280, scrollbarWidth: "none" }}>
          {(deadlines || []).map(dl => (
            <DeadlineItem
              key={dl.id}
              deadline={dl}
              color={DLC[(dl.color_idx ?? dl.colorIdx ?? 0) % DLC.length]}
              allTasks={allTasksForDl(dl.id)}
              theme={t}
              expanded={expDl === dl.id}
              onToggle={() => setExpDl(expDl === dl.id ? null : dl.id)}
              onRemove={() => onDelete && onDelete(dl.id)}
              onSaveEdit={saveDlEdit}
              showRemove={true}
            />
          ))}
        </div>

        {/* Always-visible inline form — v1 lines 606-612 */}
        <div style={{ borderTop: `0.5px solid ${t.borderLight}`, paddingTop: 12, marginTop: 4 }}>
          <input value={dlTitle} onChange={e => setDlTitle(e.target.value)} placeholder="Deadline title" style={{ width: "100%", fontSize: 12, borderRadius: 7, border: `0.5px solid ${t.border}`, padding: "6px 9px", background: t.surface, color: t.textPrimary, marginBottom: 6, boxSizing: "border-box", outline: "none" }}/>
          <input value={dlDesc} onChange={e => setDlDesc(e.target.value)} placeholder="Description (optional)" style={{ width: "100%", fontSize: 12, borderRadius: 7, border: `0.5px solid ${t.border}`, padding: "6px 9px", background: t.surface, color: t.textPrimary, marginBottom: 6, boxSizing: "border-box", outline: "none" }}/>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: t.textTertiary, marginBottom: 4 }}>Start (optional)</div>
              <input type="date" value={dlStartDate} onChange={e => setDlStartDate(e.target.value)} style={{ width: "100%", fontSize: 12, borderRadius: 7, border: `0.5px solid ${t.border}`, padding: "6px 9px", background: t.surface, color: t.textPrimary, boxSizing: "border-box", outline: "none" }}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: t.textTertiary, marginBottom: 4 }}>Due date</div>
              <input type="date" value={dlDate} onChange={e => setDlDate(e.target.value)} style={{ width: "100%", fontSize: 12, borderRadius: 7, border: `0.5px solid ${t.border}`, padding: "6px 9px", background: t.surface, color: t.textPrimary, boxSizing: "border-box", outline: "none" }}/>
            </div>
          </div>
          <DlColorPicker DLC={DLC} value={dlColorIdx} onChange={setDlColorIdx} theme={t}/>
          <button onClick={addDl} style={{ width: "100%", background: t.accentBtn, border: "none", borderRadius: 8, padding: "7px 0", cursor: "pointer", color: t.accentBtnText, fontSize: 12, fontWeight: 500, marginTop: 4 }}>Add deadline</button>
        </div>
      </>
    );
  }

  /* ── Non-embedded (standalone) mode — card wrapper with +/- toggle ── */
  return (
    <div style={{
      padding: 14, borderRadius: theme.radius.md, border: `0.5px solid ${theme.border}`,
      background: theme.bgSecondary,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{
          fontSize: 10, fontWeight: 500, color: theme.textTertiary,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>DEADLINES</div>
        <button onClick={() => setShowForm(!showForm)} style={{
          fontSize: 16, width: 24, height: 24, borderRadius: theme.radius.sm,
          border: `1px solid ${theme.border}`, color: theme.textTertiary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{showForm ? '−' : '+'}</button>
      </div>

      {showForm && (
        <div style={{ marginBottom: 12 }}>
          <DeadlineForm projects={projects} deadline={editingDeadline} onSubmit={handleSubmit} onCancel={() => { setShowForm(false); setEditingDeadline(null); }} />
        </div>
      )}

      {(!deadlines || deadlines.length === 0) ? (
        <div style={{ textAlign: 'center', padding: '16px 0', color: theme.textTertiary, fontSize: 12 }}>
          No upcoming deadlines
        </div>
      ) : (
        <div style={{ overflowY: "auto", maxHeight: 280, scrollbarWidth: "none" }}>
          {(deadlines || []).map(dl => (
            <DeadlineItem
              key={dl.id}
              deadline={dl}
              color={DLC[(dl.color_idx ?? dl.colorIdx ?? 0) % DLC.length]}
              allTasks={allTasksForDl(dl.id)}
              theme={theme}
              expanded={expDl === dl.id}
              onToggle={() => setExpDl(expDl === dl.id ? null : dl.id)}
              onRemove={() => onDelete && onDelete(dl.id)}
              onSaveEdit={saveDlEdit}
              showRemove={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
