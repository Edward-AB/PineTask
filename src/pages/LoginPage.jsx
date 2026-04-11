import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme.js';
import { useAuth } from '../hooks/useAuth.js';
import { apiPost, setToken } from '../api/client.js';

export default function LoginPage() {
  const { theme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiPost('/api/auth/login', { email, password });
      login(data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    }
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
        background: theme.bgSecondary, boxShadow: theme.shadow.md,
      }}>
        <h1 style={{ fontSize: theme.font.headingLg, fontWeight: 600, color: theme.textPrimary, marginBottom: 8, textAlign: 'center' }}>
          Welcome back
        </h1>
        <p style={{ fontSize: theme.font.body, color: theme.textSecondary, textAlign: 'center', marginBottom: 28 }}>
          Sign in to your PineTask account
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
            <label style={{ fontSize: theme.font.bodySmall, color: theme.textSecondary, display: 'block', marginBottom: 6, fontWeight: 500 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={inputStyle} placeholder="you@example.com" />
          </div>
          <div>
            <label style={{ fontSize: theme.font.bodySmall, color: theme.textSecondary, display: 'block', marginBottom: 6, fontWeight: 500 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={inputStyle} placeholder="Your password" />
          </div>
          <button type="submit" disabled={loading} style={{
            padding: '12px', borderRadius: theme.radius.md, background: theme.accentBtn,
            color: theme.accentBtnText, fontWeight: 600, fontSize: theme.font.body,
            border: 'none', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1,
            marginTop: 4,
          }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: theme.font.bodySmall }}>
          <Link to="/reset-password" style={{ color: theme.textTertiary }}>Forgot password?</Link>
        </div>
      </div>
      <p style={{ textAlign: 'center', marginTop: 20, fontSize: theme.font.bodySmall, color: theme.textTertiary }}>
        Don't have an account? <Link to="/signup" style={{ color: theme.accent, fontWeight: 500 }}>Sign up</Link>
      </p>
    </div>
  );
}
