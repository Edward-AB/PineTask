import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme.js';

export default function NotFoundPage() {
  const { theme } = useTheme();
  return (
    <div style={{ textAlign: 'center', padding: '100px 24px' }}>
      <div style={{ fontSize: '64px', marginBottom: 16 }}>🌲</div>
      <h1 style={{ fontSize: theme.font.headingXl, fontWeight: 600, color: theme.textPrimary, marginBottom: 12 }}>
        Page not found
      </h1>
      <p style={{ color: theme.textSecondary, marginBottom: 28, fontSize: '15px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" style={{
        padding: '12px 28px', borderRadius: theme.radius.md, background: theme.accentBtn,
        color: theme.accentBtnText, fontWeight: 600, textDecoration: 'none', display: 'inline-block',
      }}>Go home</Link>
    </div>
  );
}
