import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme.js';
import { useAuth } from '../hooks/useAuth.js';
import { apiGet, apiPost } from '../api/client.js';

export default function InviteAcceptPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [done, setDone] = useState(null); // 'accepted' | 'declined'

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await apiGet(`/api/invite/${token}`);
        setInvite(res?.data || null);
      } catch (e) {
        setError(e?.message || 'Invalid or expired invitation');
      } finally { setLoading(false); }
    })();
  }, [token]);

  const handleAccept = async () => {
    if (!user) {
      // Preserve the invite token through sign-in/up
      navigate(`/login?invite=${token}`);
      return;
    }
    try {
      setAccepting(true);
      const res = await apiPost(`/api/invite/${token}/accept`);
      setDone('accepted');
      const teamId = res?.data?.teamId;
      setTimeout(() => {
        if (teamId) navigate(`/teams?id=${teamId}`);
        else navigate('/teams');
      }, 1200);
    } catch (e) {
      setError(e?.message || 'Failed to accept invite');
    } finally { setAccepting(false); }
  };

  const handleDecline = async () => {
    try {
      setDeclining(true);
      await apiPost(`/api/invite/${token}/decline`);
      setDone('declined');
    } catch (e) {
      setError(e?.message || 'Failed to decline invite');
    } finally { setDeclining(false); }
  };

  const shell = {
    minHeight: '100vh', background: theme.bg,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 20,
  };

  const card = {
    width: '100%', maxWidth: 440,
    background: theme.bgSecondary,
    border: `0.5px solid ${theme.border}`,
    borderRadius: 14, padding: 28,
  };

  if (loading) {
    return (
      <div style={shell}>
        <div style={card}>
          <div style={{ color: theme.textTertiary, fontSize: 13, textAlign: 'center' }}>
            Looking up invitation…
          </div>
        </div>
      </div>
    );
  }

  if (error || !invite) {
    return (
      <div style={shell}>
        <div style={card}>
          <div style={{
            fontSize: 16, fontWeight: 600, color: theme.textPrimary,
            marginBottom: 8, textAlign: 'center',
          }}>Invitation unavailable</div>
          <div style={{ fontSize: 12, color: theme.textSecondary, textAlign: 'center', marginBottom: 20 }}>
            {error || 'This invite may have expired or already been used.'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/" style={{
              fontSize: 12, color: theme.accent, textDecoration: 'none',
            }}>Go to home</Link>
          </div>
        </div>
      </div>
    );
  }

  if (done === 'accepted') {
    return (
      <div style={shell}>
        <div style={card}>
          <div style={{
            fontSize: 16, fontWeight: 600, color: theme.textPrimary,
            marginBottom: 6, textAlign: 'center',
          }}>Welcome to {invite.team?.name}!</div>
          <div style={{ fontSize: 12, color: theme.textSecondary, textAlign: 'center' }}>
            Redirecting to the team page…
          </div>
        </div>
      </div>
    );
  }

  if (done === 'declined') {
    return (
      <div style={shell}>
        <div style={card}>
          <div style={{
            fontSize: 16, fontWeight: 600, color: theme.textPrimary,
            marginBottom: 8, textAlign: 'center',
          }}>Invitation declined</div>
          <div style={{ fontSize: 12, color: theme.textSecondary, textAlign: 'center', marginBottom: 16 }}>
            No worries — {invite.inviter?.username} can always invite you again later.
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/" style={{ fontSize: 12, color: theme.accent, textDecoration: 'none' }}>Go to home</Link>
          </div>
        </div>
      </div>
    );
  }

  const daysLeft = invite.expires_at ? Math.ceil((new Date(invite.expires_at).getTime() - Date.now()) / 86400000) : null;

  return (
    <div style={shell}>
      <div style={card}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 14,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: invite.team?.color || theme.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 600, fontSize: 14,
          }}>
            {(invite.team?.name || '?')[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 10, color: theme.textTertiary,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>You're invited to join</div>
            <div style={{
              fontSize: 18, fontWeight: 600, color: theme.textPrimary,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{invite.team?.name}</div>
          </div>
        </div>

        {invite.team?.description && (
          <div style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 14, lineHeight: 1.5 }}>
            {invite.team.description}
          </div>
        )}

        <div style={{
          background: theme.surface,
          border: `0.5px solid ${theme.borderLight}`,
          borderRadius: 10, padding: 12, marginBottom: 18,
          fontSize: 12, color: theme.textSecondary,
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <div>
            <span style={{ color: theme.textTertiary }}>Invited by</span>{' '}
            <span style={{ color: theme.textPrimary, fontWeight: 500 }}>
              @{invite.inviter?.username}
            </span>
          </div>
          {invite.team?.member_count != null && (
            <div>
              <span style={{ color: theme.textTertiary }}>Team size</span>{' '}
              <span style={{ color: theme.textPrimary }}>{invite.team.member_count} members</span>
            </div>
          )}
          {daysLeft !== null && (
            <div>
              <span style={{ color: theme.textTertiary }}>Expires in</span>{' '}
              <span style={{ color: daysLeft <= 1 ? theme.danger : theme.textPrimary }}>
                {daysLeft <= 0 ? 'less than a day' : `${daysLeft} day${daysLeft === 1 ? '' : 's'}`}
              </span>
            </div>
          )}
        </div>

        {!user && (
          <div style={{
            fontSize: 11, marginBottom: 14,
            background: theme.accentBg, border: `0.5px solid ${theme.accentBorder}`,
            borderRadius: 10, padding: 10, color: theme.accentText,
          }}>
            You need to sign in or sign up to accept this invitation.
          </div>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleAccept}
            disabled={accepting || declining}
            style={{
              flex: 1,
              background: theme.accentBtn, color: theme.accentBtnText,
              border: 'none', borderRadius: 8,
              padding: '10px 14px', fontSize: 13, fontWeight: 500,
              cursor: accepting ? 'not-allowed' : 'pointer',
              opacity: accepting ? 0.7 : 1,
            }}
          >
            {accepting ? 'Accepting…' : (user ? 'Accept invitation' : 'Sign in to accept')}
          </button>
          <button
            onClick={handleDecline}
            disabled={accepting || declining}
            style={{
              background: 'none', color: theme.textSecondary,
              border: `0.5px solid ${theme.border}`,
              borderRadius: 8, padding: '10px 14px',
              fontSize: 13, fontWeight: 500,
              cursor: declining ? 'not-allowed' : 'pointer',
            }}
          >
            {declining ? 'Declining…' : 'Decline'}
          </button>
        </div>
      </div>
    </div>
  );
}
