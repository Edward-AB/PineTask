import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme.js';

export default function VerifyEmailPage() {
  const { theme } = useTheme();
  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <div style={{
        padding: 32, borderRadius: theme.radius.xl, border: `1px solid ${theme.border}`,
        background: theme.surface,
      }}>
        <h1 style={{ fontSize: theme.font.headingLg, fontWeight: 600, color: theme.textPrimary, marginBottom: 12 }}>
          Email Verification
        </h1>
        <p style={{ color: theme.textSecondary, marginBottom: 20 }}>
          Email verification will be available soon.
        </p>
        <Link to="/login" style={{ color: theme.accent }}>Back to sign in</Link>
      </div>
    </div>
  );
}
