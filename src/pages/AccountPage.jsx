import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme.js';
import { useAuth } from '../hooks/useAuth.js';
import { apiPost, apiDelete } from '../api/client.js';

export default function AccountPage() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [showDelete, setShowDelete] = useState(false);

  const handleChangePw = async (e) => {
    e.preventDefault();
    if (newPw !== confirmPw) { setPwMsg('Passwords do not match'); return; }
    try {
      await apiPost('/api/account/change-password', { currentPassword: currentPw, newPassword: newPw });
      setPwMsg('Password changed successfully');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } catch (err) { setPwMsg(err.message); }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== user?.username) return;
    try {
      await apiDelete('/api/account');
      logout();
      navigate('/');
    } catch {}
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: theme.radius.md,
    border: `1px solid ${theme.border}`, background: theme.bg,
    color: theme.textPrimary, fontSize: theme.font.body, outline: 'none',
  };

  return (
    <div style={{ padding: 32, maxWidth: 640, margin: '0 auto' }}>
      <h1 style={{ fontSize: theme.font.headingXl, fontWeight: 600, color: theme.textPrimary, marginBottom: 28 }}>Account</h1>

      {/* Profile */}
      <div style={{
        padding: 24, borderRadius: theme.radius.lg, border: `1px solid ${theme.border}`,
        background: theme.surface, marginBottom: 20,
      }}>
        <h2 style={{ fontSize: theme.font.heading, fontWeight: 500, color: theme.textPrimary, marginBottom: 16 }}>Profile</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: theme.font.body }}>
          <div><span style={{ color: theme.textTertiary }}>Username:</span> <span style={{ color: theme.textPrimary, fontWeight: 500 }}>@{user?.username}</span></div>
          <div><span style={{ color: theme.textTertiary }}>Email:</span> <span style={{ color: theme.textPrimary }}>{user?.email}</span></div>
          <div><span style={{ color: theme.textTertiary }}>Member since:</span> <span style={{ color: theme.textPrimary }}>
            {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
          </span></div>
        </div>
      </div>

      {/* Change password */}
      <div style={{
        padding: 24, borderRadius: theme.radius.lg, border: `1px solid ${theme.border}`,
        background: theme.surface, marginBottom: 20,
      }}>
        <h2 style={{ fontSize: theme.font.heading, fontWeight: 500, color: theme.textPrimary, marginBottom: 16 }}>Change password</h2>
        {pwMsg && <div style={{ fontSize: theme.font.bodySmall, color: pwMsg.includes('success') ? theme.success : theme.danger, marginBottom: 12 }}>{pwMsg}</div>}
        <form onSubmit={handleChangePw} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="Current password" style={inputStyle} />
          <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="New password" style={inputStyle} />
          <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Confirm new password" style={inputStyle} />
          <button type="submit" style={{
            padding: '10px 20px', borderRadius: theme.radius.md, background: theme.accentBtn,
            color: theme.accentBtnText, fontWeight: 500, alignSelf: 'flex-start',
          }}>Update password</button>
        </form>
      </div>

      {/* Danger zone */}
      <div style={{
        padding: 24, borderRadius: theme.radius.lg, border: `1px solid ${theme.danger}40`,
        background: theme.dangerBg,
      }}>
        <h2 style={{ fontSize: theme.font.heading, fontWeight: 500, color: theme.danger, marginBottom: 8 }}>Danger zone</h2>
        <p style={{ fontSize: theme.font.bodySmall, color: theme.textSecondary, marginBottom: 16 }}>
          Permanently delete your account and all data. This cannot be undone.
        </p>
        {!showDelete ? (
          <button onClick={() => setShowDelete(true)} style={{
            padding: '10px 20px', borderRadius: theme.radius.md, background: theme.danger,
            color: '#fff', fontWeight: 500,
          }}>Delete my account</button>
        ) : (
          <div>
            <p style={{ fontSize: theme.font.bodySmall, color: theme.textSecondary, marginBottom: 10 }}>
              Type <strong>{user?.username}</strong> to confirm:
            </p>
            <input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)}
              style={{ ...inputStyle, marginBottom: 12, borderColor: theme.danger + '60' }}
              placeholder={user?.username} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleDeleteAccount} disabled={deleteConfirm !== user?.username}
                style={{
                  padding: '10px 20px', borderRadius: theme.radius.md, background: theme.danger,
                  color: '#fff', fontWeight: 500, opacity: deleteConfirm !== user?.username ? 0.5 : 1,
                }}>Permanently delete</button>
              <button onClick={() => { setShowDelete(false); setDeleteConfirm(''); }}
                style={{
                  padding: '10px 20px', borderRadius: theme.radius.md, border: `1px solid ${theme.border}`,
                  color: theme.textSecondary,
                }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
