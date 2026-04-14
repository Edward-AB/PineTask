import { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme.js';

const COLOR_CHOICES = ['#3B6D11', '#8B4513', '#C8721A', '#3A7D44', '#5A3FAF', '#111111'];

export default function TeamInfoCard({ team, canEdit, onSave, onDelete }) {
  const { theme } = useTheme();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(team?.name || '');
  const [desc, setDesc] = useState(team?.description || '');
  const [color, setColor] = useState(team?.color || COLOR_CHOICES[0]);
  const [confirmName, setConfirmName] = useState('');
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    setName(team?.name || '');
    setDesc(team?.description || '');
    setColor(team?.color || COLOR_CHOICES[0]);
  }, [team]);

  const save = async () => {
    await onSave?.({ name: name.trim(), description: desc, color });
    setEditing(false);
  };

  const created = team?.created_at ? new Date(team.created_at).toLocaleDateString('en-GB') : '—';

  const inputStyle = {
    fontFamily: 'inherit', fontSize: 12,
    padding: '6px 9px', borderRadius: 7,
    border: `0.5px solid ${theme.border}`,
    background: theme.surface, color: theme.textPrimary,
    outline: 'none', width: '100%',
  };

  return (
    <div style={{
      background: theme.bgSecondary,
      border: `0.5px solid ${theme.border}`,
      borderRadius: 14, padding: 14, marginBottom: 12,
    }}>
      {editing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="Team name" />
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Description" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {COLOR_CHOICES.map((c) => (
              <button key={c} onClick={() => setColor(c)} style={{
                width: 20, height: 20, borderRadius: '50%',
                background: c, cursor: 'pointer',
                border: color === c ? `2px solid ${theme.textPrimary}` : `0.5px solid ${theme.border}`,
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={save} style={{
              background: theme.accentBtn, color: theme.accentBtnText,
              border: 'none', borderRadius: 8, padding: '6px 14px',
              fontSize: 12, fontWeight: 500, cursor: 'pointer',
            }}>Save</button>
            <button onClick={() => setEditing(false)} style={{
              background: 'none', border: `0.5px solid ${theme.border}`,
              borderRadius: 8, padding: '6px 14px',
              fontSize: 12, color: theme.textPrimary, cursor: 'pointer',
            }}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{
              width: 14, height: 14, borderRadius: '50%',
              background: team?.color || theme.accent, flexShrink: 0,
            }} />
            <span style={{ fontSize: 16, fontWeight: 600, color: theme.textPrimary, flex: 1 }}>
              {team?.name}
            </span>
            {canEdit && (
              <button onClick={() => setEditing(true)} style={{
                background: 'none', border: `0.5px solid ${theme.border}`,
                borderRadius: 6, padding: '3px 9px', fontSize: 10,
                color: theme.textSecondary, cursor: 'pointer', fontFamily: 'inherit',
              }}>Edit</button>
            )}
          </div>
          {team?.description && (
            <div style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 8, lineHeight: 1.5 }}>
              {team.description}
            </div>
          )}
          <div style={{ fontSize: 10, color: theme.textTertiary }}>
            Created {created}
          </div>

          {canEdit && team?.user_role === 'owner' && (
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: `0.5px solid ${theme.border}` }}>
              {confirming ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 11, color: theme.danger }}>
                    Type <b>{team.name}</b> to permanently delete this team:
                  </div>
                  <input value={confirmName} onChange={(e) => setConfirmName(e.target.value)} style={inputStyle} />
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      disabled={confirmName !== team.name}
                      onClick={() => onDelete?.(confirmName)}
                      style={{
                        background: theme.danger, color: '#fff',
                        border: 'none', borderRadius: 8, padding: '6px 14px',
                        fontSize: 12, fontWeight: 500,
                        cursor: confirmName === team.name ? 'pointer' : 'not-allowed',
                        opacity: confirmName === team.name ? 1 : 0.5,
                      }}
                    >Delete team</button>
                    <button onClick={() => { setConfirming(false); setConfirmName(''); }} style={{
                      background: 'none', border: `0.5px solid ${theme.border}`,
                      borderRadius: 8, padding: '6px 14px',
                      fontSize: 12, color: theme.textPrimary, cursor: 'pointer',
                    }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setConfirming(true)} style={{
                  background: 'none', border: `0.5px solid ${theme.danger}`,
                  color: theme.danger, borderRadius: 6, padding: '4px 10px',
                  fontSize: 10, cursor: 'pointer', fontFamily: 'inherit',
                }}>Delete team…</button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
