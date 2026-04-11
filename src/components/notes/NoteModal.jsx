import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme.js';

export default function NoteModal({ task, onSave, onClose }) {
  const { theme } = useTheme();
  const [val, setVal] = useState(task.note || '');

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.38)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} className="modal-backdrop-enter" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: theme.surface, border: `1px solid ${theme.border}`,
        borderRadius: theme.radius.xl, padding: 28, width: 520, maxWidth: '90vw',
        display: 'flex', flexDirection: 'column',
      }} className="modal-content-enter" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontWeight: 500, fontSize: 14, color: theme.textPrimary, flex: 1, marginRight: 12 }}>{task.text}</div>
          <button onClick={onClose} style={{ color: theme.textTertiary, fontSize: 20 }}>x</button>
        </div>
        <textarea value={val} onChange={e => setVal(e.target.value)} placeholder="Add notes..."
          style={{
            flex: 1, minHeight: 220, fontSize: theme.font.body, borderRadius: theme.radius.md,
            border: `1px solid ${theme.border}`, padding: '11px 13px', background: theme.bg,
            color: theme.textPrimary, resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: 1.7,
          }} />
        <div style={{ display: 'flex', gap: 10, marginTop: 14, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            fontSize: theme.font.body, padding: '8px 20px', borderRadius: theme.radius.md,
            border: `1px solid ${theme.border}`, color: theme.textSecondary,
          }}>Cancel</button>
          <button onClick={() => onSave(val)} style={{
            fontSize: theme.font.body, padding: '8px 20px', borderRadius: theme.radius.md,
            background: theme.accentBtn, color: theme.accentBtnText, fontWeight: 500,
          }}>Save note</button>
        </div>
      </div>
    </div>
  );
}
