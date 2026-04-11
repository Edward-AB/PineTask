import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme.js';
import { useAuth } from '../hooks/useAuth.js';

const features = [
  { icon: '📅', title: 'Smart Scheduling', desc: 'Drag tasks onto a 24-hour timeline. Resize, reorder, and plan your day visually.' },
  { icon: '🎯', title: 'Deadlines & Projects', desc: 'Track deadlines with progress pies. Organise work into colour-coded projects.' },
  { icon: '⏱️', title: 'Focus Timer', desc: 'Built-in countdown timer with alarm. Stay focused on what matters.' },
  { icon: '📊', title: 'Analytics & Streaks', desc: 'Track your productivity over time. Build streaks and see your progress.' },
  { icon: '🌙', title: 'Dark Mode', desc: 'Easy on the eyes. Switch between forest light and dark themes.' },
  { icon: '🎉', title: 'Celebrations', desc: 'Fireworks and sounds when you complete all tasks. Because you earned it.' },
];

const personas = [
  { icon: '🎓', title: 'Student', desc: 'Track assignments, revision sessions, and deadlines across all your modules.' },
  { icon: '💼', title: 'Professional', desc: 'Own your workday. Schedule meetings, deep work, and personal tasks.' },
  { icon: '👥', title: 'Team Lead', desc: 'Manage project timelines and keep every deliverable on track.' },
];

export default function LandingPage() {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '80px 0 60px' }}>
        <h1 style={{
          fontSize: theme.font.hero, fontWeight: 700, color: theme.textPrimary,
          lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1px',
        }}>
          Plan your day.<br />
          <span style={{ color: theme.accent }}>Own your time.</span>
        </h1>
        <p style={{
          fontSize: '18px', color: theme.textSecondary, maxWidth: 520,
          margin: '0 auto 36px', lineHeight: 1.6,
        }}>
          A beautiful task manager with smart scheduling, visual timelines,
          and celebrations when you finish your day.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {user ? (
            <Link to="/dashboard" style={{
              padding: '14px 36px', borderRadius: theme.radius.lg, background: theme.accentBtn,
              color: theme.accentBtnText, fontWeight: 600, fontSize: '16px', textDecoration: 'none',
            }}>Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/signup" style={{
                padding: '14px 36px', borderRadius: theme.radius.lg, background: theme.accentBtn,
                color: theme.accentBtnText, fontWeight: 600, fontSize: '16px', textDecoration: 'none',
              }}>Get started free</Link>
              <Link to="/login" style={{
                padding: '14px 36px', borderRadius: theme.radius.lg, background: 'transparent',
                color: theme.textSecondary, fontWeight: 500, fontSize: '16px', textDecoration: 'none',
                border: `1px solid ${theme.border}`,
              }}>Sign in</Link>
            </>
          )}
        </div>
      </section>

      {/* Features grid */}
      <section style={{ padding: '60px 0' }}>
        <h2 style={{
          fontSize: theme.font.headingXl, fontWeight: 600, color: theme.textPrimary,
          textAlign: 'center', marginBottom: 48,
        }}>Everything you need to own your day</h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20,
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              padding: 28, borderRadius: theme.radius.lg, border: `1px solid ${theme.border}`,
              background: theme.surface, transition: 'transform 200ms, box-shadow 200ms',
              cursor: 'default',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = theme.shadow.md; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: '28px', marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: theme.font.heading, fontWeight: 600, color: theme.textPrimary, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: theme.font.body, color: theme.textSecondary, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust section */}
      <section style={{ padding: '60px 0' }}>
        <h2 style={{
          fontSize: theme.font.headingXl, fontWeight: 600, color: theme.textPrimary,
          textAlign: 'center', marginBottom: 16,
        }}>Built for students, professionals, and teams</h2>
        <p style={{ textAlign: 'center', color: theme.textSecondary, marginBottom: 48, fontSize: '15px' }}>
          Whatever your workflow, PineTask adapts to you.
        </p>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {personas.map((p, i) => (
            <div key={i} style={{
              padding: 32, borderRadius: theme.radius.lg, background: theme.accentBg,
              border: `1px solid ${theme.accentBorder}`, textAlign: 'center',
            }}>
              <div style={{ fontSize: '36px', marginBottom: 12 }}>{p.icon}</div>
              <h3 style={{ fontSize: theme.font.heading, fontWeight: 600, color: theme.textPrimary, marginBottom: 8 }}>{p.title}</h3>
              <p style={{ fontSize: theme.font.body, color: theme.textSecondary, lineHeight: 1.5 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section style={{
          padding: '60px 0', textAlign: 'center', margin: '20px 0 60px',
          borderRadius: theme.radius.xl, background: theme.accentBg,
          border: `1px solid ${theme.accentBorder}`,
        }}>
          <h2 style={{ fontSize: theme.font.headingXl, fontWeight: 600, color: theme.textPrimary, marginBottom: 16 }}>
            Start planning smarter today
          </h2>
          <p style={{ color: theme.textSecondary, marginBottom: 28, fontSize: '15px' }}>
            Free forever. No credit card required.
          </p>
          <Link to="/signup" style={{
            padding: '14px 40px', borderRadius: theme.radius.lg, background: theme.accentBtn,
            color: theme.accentBtnText, fontWeight: 600, fontSize: '16px', textDecoration: 'none',
            display: 'inline-block',
          }}>Create your free account</Link>
        </section>
      )}

      {/* Footer */}
      <footer style={{
        padding: '32px 0', borderTop: `1px solid ${theme.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16, marginBottom: 20,
      }}>
        <div style={{ fontSize: theme.font.bodySmall, color: theme.textTertiary }}>
          PineTask &copy; 2026. Made with 🌲 in London
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link to="/help" style={{ fontSize: theme.font.bodySmall, color: theme.textTertiary, textDecoration: 'none' }}>Help</Link>
          <Link to="/changelog" style={{ fontSize: theme.font.bodySmall, color: theme.textTertiary, textDecoration: 'none' }}>Changelog</Link>
        </div>
      </footer>
    </div>
  );
}
