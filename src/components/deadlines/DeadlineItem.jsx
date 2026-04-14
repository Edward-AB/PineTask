import { useState } from 'react';
import { daysUntil, formatShortDate } from '../../utils/dates.js';

/* ── MiniPie — exact port from v1 lines 96-102 ── */
function MiniPie({ pct, color, size = 26 }) {
  const r = 11, cx = 14, cy = 14;
  if (pct >= 100) return <svg width={size} height={size} viewBox="0 0 28 28"><circle cx={cx} cy={cy} r={r} fill={color} opacity={0.25}/><circle cx={cx} cy={cy} r={r} fill={color}/><path d="M9 14l3 3 7-7" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>;
  if (pct <= 0) return <svg width={size} height={size} viewBox="0 0 28 28"><circle cx={cx} cy={cy} r={r} fill={color} opacity={0.2}/></svg>;
  const sw = (pct / 100) * 2 * Math.PI, x1 = cx + r * Math.cos(-Math.PI / 2), y1 = cy + r * Math.sin(-Math.PI / 2), x2 = cx + r * Math.cos(-Math.PI / 2 + sw), y2 = cy + r * Math.sin(-Math.PI / 2 + sw);
  return <svg width={size} height={size} viewBox="0 0 28 28"><circle cx={cx} cy={cy} r={r} fill={color} opacity={0.2}/><path d={`M${cx},${cy} L${x1},${y1} A${r},${r},0,${sw > Math.PI ? 1 : 0},1,${x2},${y2} Z`} fill={color}/></svg>;
}

/* ── DlColorPicker — exact port from v1 lines 327-329 ── */
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

/* ── DeadlineItem — exact port from v1 lines 331-358 ──
   Props:
     deadline  — deadline object (id, title, due_date, start_date, color_idx, description)
     color     — the deadline color object: theme.deadline[dl.color_idx % 6]
     allTasks  — tasks linked to this deadline (already filtered by parent)
     expanded  — boolean, controlled by parent
     onToggle  — () => void, toggle expand
     onRemove  — () => void, remove deadline
     onSaveEdit — (updatedDeadline) => void
     showRemove — boolean
     theme     — full theme object
*/
export default function DeadlineItem({ deadline, color, allTasks, expanded, onToggle, onRemove, onSaveEdit, showRemove, theme }) {
  const c = color;
  const P = theme.priority;
  const DLC = theme.deadline;
  const ddn = allTasks.filter(x => x.done).length, dtt = allTasks.length, pct = dtt > 0 ? Math.round(ddn / dtt * 100) : 0;
  const days = daysUntil(deadline.due_date), ov = days !== null && days < 0, urg = days !== null && days <= 3 && days >= 0;
  const [editing, setEditing] = useState(false);
  const [eTitle, setETitle] = useState(deadline.title);
  const [eDate, setEDate] = useState(deadline.due_date);
  const [eColor, setEColor] = useState(deadline.color_idx ?? 0);
  return (
    <div style={{ borderRadius: 10, border: `0.5px solid ${c.border}`, background: c.bg + "99", marginBottom: 8, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", cursor: "pointer" }} onClick={onToggle}>
        <MiniPie pct={pct} color={c.dot} size={26}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: c.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{deadline.title}</div>
          <div style={{ fontSize: 10, color: ov ? "#E24B4A" : urg ? "#C07010" : c.dot, marginTop: 1 }}>
            {ov ? `${Math.abs(days)}d overdue` : days === 0 ? "Due today" : days === 1 ? "Due tomorrow" : `${days}d left`}
          </div>
        </div>
        <span style={{ fontSize: 11, color: c.dot, flexShrink: 0 }}>{expanded ? "▴" : "▾"}</span>
      </div>
      {expanded && (<div style={{ borderTop: `0.5px solid ${c.border}`, padding: "10px" }}>
        {editing ? (<div>
          <input value={eTitle} onChange={e => setETitle(e.target.value)} style={{ width: "100%", fontSize: 12, borderRadius: 7, border: `0.5px solid ${c.border}`, padding: "5px 8px", background: "transparent", color: c.text, marginBottom: 5, boxSizing: "border-box", outline: "none" }}/>
          <input type="date" value={eDate} onChange={e => setEDate(e.target.value)} style={{ width: "100%", fontSize: 11, borderRadius: 7, border: `0.5px solid ${c.border}`, padding: "5px 6px", background: "transparent", color: c.text, boxSizing: "border-box", outline: "none", marginBottom: 5 }}/>
          <DlColorPicker DLC={DLC} value={eColor} onChange={setEColor} theme={theme}/>
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            <button onClick={() => { onSaveEdit({ ...deadline, title: eTitle, due_date: eDate, color_idx: eColor }); setEditing(false); }} style={{ flex: 1, fontSize: 11, padding: "5px 0", borderRadius: 7, border: "none", background: c.dot, color: "#fff", cursor: "pointer" }}>Save</button>
            <button onClick={() => setEditing(false)} style={{ flex: 1, fontSize: 11, padding: "5px 0", borderRadius: 7, border: `0.5px solid ${c.border}`, background: "transparent", color: c.text, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>) : (<>
          <div style={{ fontSize: 11, color: c.text, marginBottom: 6 }}>Due: {formatShortDate(deadline.due_date)}</div>
          <div style={{ fontSize: 11, color: c.text, marginBottom: 6 }}>{ddn}/{dtt} tasks complete</div>
          <div style={{ height: 5, borderRadius: 4, background: c.border + "44", overflow: "hidden", marginBottom: 8 }}>
            <div style={{ height: "100%", width: `${pct}%`, background: c.dot, borderRadius: 4 }}/>
          </div>
          {allTasks.map(x => (<div key={x.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, padding: "3px 0" }}>
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: P[x.priority || "none"].dot, flexShrink: 0 }}/>
            <span style={{ flex: 1, color: x.done ? theme.textTertiary : c.text, textDecoration: x.done ? "line-through" : "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{x.text}</span>
          </div>))}
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            <button onClick={() => setEditing(true)} style={{ fontSize: 10, color: c.text, background: "none", border: `0.5px solid ${c.border}`, borderRadius: 5, padding: "2px 8px", cursor: "pointer" }}>Edit</button>
            {showRemove && <button onClick={onRemove} style={{ fontSize: 10, color: "#E24B4A", background: "none", border: "0.5px solid #E24B4A", borderRadius: 5, padding: "2px 8px", cursor: "pointer" }}>Remove</button>}
          </div>
        </>)}
      </div>)}
    </div>
  );
}
