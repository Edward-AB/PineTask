import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme.js';
import { apiPost } from '../api/client.js';

export default function ResetPasswordPage() {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await apiPost('/api/auth/reset-password', { email }); } catch {}
    setSent(true);
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: theme.radius.md,
    border: `1px solid ${theme.border}`, background: theme.bgSecondary,
    color: theme.textPrimary, fontSize: theme.font.body, outline: 'none',
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 24px' }}>
      <div style={{
        padding: 32, borderRadius: theme.radius.xl, border: `0.5px solid ${theme.border}`,
        background: theme.bgSecondary, boxShadow: theme.shadow.md, textAlign: 'center',
      }}>
        <h1 style={{ fontSize: theme.font.headingLg, fontWeight: 600, color: theme.textPrimary, marginBottom: 12 }}>
          Reset your password
        </h1>
        {sent ? (
          <p style={{ color: theme.textSecondary, fontSize: theme.font.body, lineHeight: 1.6 }}>
            If an account exists with that email, we've sent a reset link. Check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={inputStyle} placeholder="Enter your email" />
            <button type="submit" disabled={loading} style={{
              padding: '12px', borderRadius: theme.radius.md, background: theme.accentBtn,
              color: theme.accentBtnText, fontWeight: 600, border: 'none', cursor: 'pointer',
            }}>{loading ? 'Sending...' : 'Send reset link'}</button>
          </form>
        )}
        <div style={{ marginTop: 20 }}>
          <Link to="/login" style={{ fontSize: theme.font.bodySmall, color: theme.textTertiary }}>Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}
