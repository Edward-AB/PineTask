import { useTheme } from '../hooks/useTheme.js';

export default function ChangelogPage() {
  const { theme } = useTheme();

  return (
    <div style={{ padding: 32, maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontSize: theme.font.headingXl, fontWeight: 600, color: theme.textPrimary, marginBottom: 28 }}>Changelog</h1>

      <div style={{
        padding: 24, borderRadius: theme.radius.lg, border: `0.5px solid ${theme.border}`,
        background: theme.bgSecondary,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{
            padding: '4px 12px', borderRadius: theme.radius.full, background: theme.accentBg,
            color: theme.accentText, fontSize: theme.font.bodySmall, fontWeight: 600,
          }}>v2.0.0</span>
          <span style={{ fontSize: theme.font.bodySmall, color: theme.textTertiary }}>April 2026</span>
        </div>

        <h3 style={{ fontSize: theme.font.body, fontWeight: 600, color: theme.success, marginBottom: 8 }}>Added</h3>
        <ul style={{ paddingLeft: 20, fontSize: theme.font.body, color: theme.textSecondary, lineHeight: 1.8, marginBottom: 16 }}>
          <li>Complete ground-up redesign with professional UI</li>
          <li>Multi-page routing with React Router</li>
          <li>Relational database schema (projects, deadlines, tasks, events)</li>
          <li>Project management with colour coding and progress tracking</li>
          <li>Events system (calendar items, not tasks)</li>
          <li>Onboarding wizard for new users</li>
          <li>Analytics dashboard with productivity charts</li>
          <li>Account management and settings</li>
          <li>Admin panel for platform management</li>
          <li>Dark mode with smooth transitions</li>
          <li>Fireworks celebration on daily completion</li>
          <li>Focus timer with alarm sounds</li>
          <li>Keyboard shortcuts</li>
          <li>Loading skeletons and empty states</li>
          <li>PWA support</li>
        </ul>

        <h3 style={{ fontSize: theme.font.body, fontWeight: 600, color: theme.accent, marginBottom: 8 }}>Changed</h3>
        <ul style={{ paddingLeft: 20, fontSize: theme.font.body, color: theme.textSecondary, lineHeight: 1.8, marginBottom: 16 }}>
          <li>Migrated from single JSON blob to relational D1 tables</li>
          <li>Proper RESTful API with 25+ endpoints</li>
          <li>Separated components into clean file structure</li>
        </ul>

        <h3 style={{ fontSize: theme.font.body, fontWeight: 600, color: theme.warning, marginBottom: 8 }}>Fixed</h3>
        <ul style={{ paddingLeft: 20, fontSize: theme.font.body, color: theme.textSecondary, lineHeight: 1.8 }}>
          <li>Pie chart artifact at 12 o'clock position</li>
          <li>Calendar task pills overflowing bounds</li>
          <li>Overlapping tasks column layout</li>
          <li>Now-line updating correctly</li>
          <li>Colour picker layout shifting</li>
          <li>Priority tag capitalisation</li>
        </ul>
      </div>
    </div>
  );
}
