import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme.js';
import { useAuth } from '../hooks/useAuth.js';
import { apiPost, setToken } from '../api/client.js';

export default function SignupPage() {
  const { theme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const usernameValid = /^[a-z0-9_]{2,24}$/.test(username.toLowerCase());
  const passwordStrength = password.length >= 12 ? 'strong' : password.length >= 8 ? 'medium' : password.length > 0 ? 'weak' : null;
  const strengthColors = { weak: theme.danger, medium: theme.warning, strong: theme.success };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!usernameValid) { setError('Username must be 2-24 characters (letters, numbers, underscore)'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      const data = await apiPost('/api/auth/signup', { username, email, password });
      login(data.token);
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Signup failed');
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: theme.radius.md,
    border: `1px solid ${theme.border}`, background: theme.surface,
    color: theme.textPrimary, fontSize: theme.font.body, outline: 'none',
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: '0 24px' }}>
      <div style={{
        padding: 32, borderRadius: theme.radius.xl, border: `1px solid ${theme.border}`,
        background: theme.surface, boxShadow: theme.shadow.md,
      }}>
        <h1 style={{ fontSize: theme.font.headingLg, fontWeight: 600, color: theme.textPrimary, marginBottom: 8, textAlign: 'center' }}>
          Create your account
        </h1>
        <p style={{ fontSize: theme.font.body, color: theme.textSecondary, textAlign: 'center', marginBottom: 28 }}>
          Start planning smarter today
        </p>

        {error && (
          <div style={{
            padding: '10px 14px', borderRadius: theme.radius.md, background: theme.dangerBg,
            color: theme.danger, fontSize: theme.font.bodySmall, marginBottom: 16,
            border: `1px solid ${theme.danger}30`,
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: theme.font.bodySmall, color: theme.textSecondary, display: 'block', marginBottom: 6, fontWeight: 500 }}>Username</label>
            <div style={{ position: 'relative' }}>
              <input value={username} onChange={e => setUsername(e.target.value)} required
                style={inputStyle} placeholder="your_username" />
              {username && (
                <span style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  color: usernameValid ? theme.success : theme.danger, fontSize: 16,
                }}>{usernameValid ? '✓' : '✗'}</span>
              )}
            </div>
          </div>
          <div>
            <label style={{ fontSize: theme.font.bodySmall, color: theme.textSecondary, display: 'block', marginBottom: 6, fontWeight: 500 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={inputStyle} placeholder="you@example.com" />
          </div>
          <div>
            <label style={{ fontSize: theme.font.bodySmall, color: theme.textSecondary, display: 'block', marginBottom: 6, fontWeight: 500 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={inputStyle} placeholder="At least 6 characters" />
            {passwordStrength && (
              <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  height: 4, flex: 1, borderRadius: 2, background: theme.border, overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', borderRadius: 2,
                    width: passwordStrength === 'strong' ? '100%' : passwordStrength === 'medium' ? '60%' : '30%',
                    background: strengthColors[passwordStrength],
                    transition: 'width 300ms, background 300ms',
                  }} />
                </div>
                <span style={{ fontSize: theme.font.label, color: strengthColors[passwordStrength], textTransform: 'capitalize' }}>
                  {passwordStrength}
                </span>
              </div>
            )}
          </div>
          <div>
            <label style={{ fontSize: theme.font.bodySmall, color: theme.textSecondary, display: 'block', marginBottom: 6, fontWeight: 500 }}>Confirm password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
              style={inputStyle} placeholder="Repeat your password" />
          </div>
          <button type="submit" disabled={loading} style={{
            padding: '12px', borderRadius: theme.radius.md, background: theme.accentBtn,
            color: theme.accentBtnText, fontWeight: 600, fontSize: theme.font.body,
            border: 'none', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1,
            marginTop: 4,
          }}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
      <p style={{ textAlign: 'center', marginTop: 20, fontSize: theme.font.bodySmall, color: theme.textTertiary }}>
        Already have an account? <Link to="/login" style={{ color: theme.accent, fontWeight: 500 }}>Sign in</Link>
      </p>
    </div>
  );
}
