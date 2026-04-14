import { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme.js';
import { apiGet, apiDelete } from '../../api/client.js';

export default function InviteSection({ teamId, onInvite, canInvite }) {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [lastInvite, setLastInvite] = useState(null);
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState(null);
  const [invites, setInvites] = useState([]);

  const load = async () => {
    try {
      const res = await apiGet(`/api/teams/${teamId}/invite`);
      setInvites(res?.data || []);
    } catch {}
  };

  useEffect(() => { if (teamId) load(); }, [teamId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      setSending(true);
      setErr(null);
      const result = await onInvite?.(email.trim());
      setLastInvite(result);
      setEmail('');
      load();
    } catch (e) {
      setErr(e.message || 'Failed to send invite');
    } finally { setSending(false); }
  };

  const handleCopy = async () => {
    if (!lastInvite?.inviteUrl) return;
    try {
      await navigator.clipboard.writeText(lastInvite.inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const revokeInvite = async (id) => {
    try {
      await apiDelete(`/api/teams/${teamId}/invitations/${id}`);
      load();
    } catch {}
  };

  const inputStyle = {
    flex: 1, fontFamily: 'inherit', fontSize: 12,
    padding: '7px 10px', borderRadius: 8,
    border: `0.5px solid ${theme.border}`,
    background: theme.surface, color: theme.textPrimary,
    outline: 'none',
  };

  return (
    <div style={{
      background: theme.bgSecondary,
      border: `0.5px solid ${theme.border}`,
      borderRadius: 14, padding: 14,
    }}>
      <div style={{
        fontSize: 10, fontWeight: 500, color: theme.textTertiary,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        marginBottom: 10,
      }}>Invite members</div>

      {canInvite && (
        <form onSubmit={handleSend} style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
          <button
            type="submit"
            disabled={sending || !email.trim()}
            style={{
              background: theme.accentBtn, color: theme.accentBtnText,
              border: 'none', borderRadius: 8,
              padding: '7px 14px', fontSize: 12, fontWeight: 500,
              cursor: sending ? 'not-allowed' : 'pointer',
              opacity: sending || !email.trim() ? 0.7 : 1,
            }}
          >{sending ? '…' : 'Send invite'}</button>
        </form>
      )}

      {err && <div style={{ fontSize: 11, color: theme.danger, marginBottom: 8 }}>{err}</div>}

      {lastInvite?.inviteUrl && (
        <div style={{
          background: theme.accentBg, border: `0.5px solid ${theme.accentBorder}`,
          borderRadius: 8, padding: '8px 10px', marginBottom: 10,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{ fontSize: 11, color: theme.accentText, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {lastInvite.inviteUrl}
          </div>
          <button onClick={handleCopy} style={{
            background: theme.accentBtn, color: theme.accentBtnText,
            border: 'none', borderRadius: 6, padding: '4px 10px',
            fontSize: 10, fontWeight: 500, cursor: 'pointer',
          }}>{copied ? 'Copied!' : 'Copy link'}</button>
        </div>
      )}

      {invites.length > 0 && (
        <>
          <div style={{
            fontSize: 10, fontWeight: 500, color: theme.textTertiary,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginTop: 8, marginBottom: 6,
          }}>Pending invitations</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {invites.map((inv) => (
              <div key={inv.id} className="trow" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 6px', borderRadius: 6,
                background: theme.surface,
                border: `0.5px solid ${theme.borderLight}`,
              }}>
                <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                  <div style={{ fontSize: 11, color: theme.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {inv.invitee_email}
                  </div>
                  <div style={{ fontSize: 9, color: theme.textTertiary }}>
                    {statusLabel(inv.status)}
                  </div>
                </div>
                {inv.status === 'pending' && canInvite && (
                  <button onClick={() => revokeInvite(inv.id)} className="ta" style={{
                    background: 'none', border: `0.5px solid ${theme.border}`,
                    color: theme.danger, borderRadius: 6,
                    padding: '2px 8px', fontSize: 9, cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}>Revoke</button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function statusLabel(s) {
  switch (s) {
    case 'pending': return 'Pending';
    case 'accepted': return 'Accepted';
    case 'declined': return 'Declined';
    case 'expired': return 'Expired';
    default: return s;
  }
}
