import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme.js';

export default function NoteModal({ task, onSave, onClose }) {
  const { theme } = useTheme();
  const [val, setVal] = useState(task.note || '');

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.38)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: theme.bgSecondary, border: `0.5px solid ${theme.border}`,
        borderRadius: 16, padding: 28, width: 620, maxWidth: '90vw', maxHeight: '80vh',
        display: 'flex', flexDirection: 'column',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontWeight: 500, fontSize: 14, color: theme.textPrimary, flex: 1, marginRight: 12 }}>{task.text}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textTertiary, fontSize: 20 }}>{'\u00d7'}</button>
        </div>
        <textarea value={val} onChange={e => setVal(e.target.value)} placeholder="Add notes\u2026"
          style={{
            flex: 1, minHeight: 280, fontSize: 13, borderRadius: 10,
            border: `0.5px solid ${theme.border}`, padding: '11px 13px', background: theme.bg,
            color: theme.textPrimary, resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: 1.7,
          }} />
        <div style={{ display: 'flex', gap: 10, marginTop: 14, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            fontSize: 13, padding: '8px 20px', borderRadius: 8,
            border: `0.5px solid ${theme.border}`, background: 'transparent', color: theme.textSecondary, cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={() => onSave(val)} style={{
            fontSize: 13, padding: '8px 20px', borderRadius: 8,
            border: 'none', background: theme.accentBtn, color: theme.accentBtnText, cursor: 'pointer', fontWeight: 500,
          }}>Save note</button>
        </div>
      </div>
    </div>
  );
}
