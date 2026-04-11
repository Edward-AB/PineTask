import { useTheme } from '../hooks/useTheme.js';

const shortcuts = [
  { key: 'N', desc: 'Add new task' },
  { key: 'T', desc: 'Open timer' },
  { key: 'D', desc: 'Toggle dark mode' },
  { key: '←', desc: 'Previous day' },
  { key: '→', desc: 'Next day' },
  { key: 'Esc', desc: 'Close modal / cancel' },
  { key: '?', desc: 'Show help' },
];

const faqs = [
  { q: 'How do I schedule a task?', a: 'Drag a task from your task list onto the day schedule timeline. You can also set a time slot when creating a task.' },
  { q: 'How do deadlines work?', a: 'Deadlines have a start date and due date. Tasks linked to a deadline appear on the dashboard and show progress.' },
  { q: 'Can I use PineTask on mobile?', a: 'Yes! PineTask is fully responsive. The layout adapts to single-column on narrow screens.' },
  { q: 'How do I change my work hours?', a: 'Go to Settings and update your work hours. The day schedule will highlight your working hours.' },
  { q: 'What happens when I complete all tasks?', a: 'You get a fireworks celebration! You can disable this in Settings.' },
];

export default function HelpPage() {
  const { theme } = useTheme();

  const sectionStyle = {
    padding: 24, borderRadius: theme.radius.lg, border: `1px solid ${theme.border}`,
    background: theme.surface, marginBottom: 20,
  };

  return (
    <div style={{ padding: 32, maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontSize: theme.font.headingXl, fontWeight: 600, color: theme.textPrimary, marginBottom: 28 }}>Help</h1>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: theme.font.heading, fontWeight: 500, color: theme.textPrimary, marginBottom: 16 }}>Getting Started</h2>
        <div style={{ fontSize: theme.font.body, color: theme.textSecondary, lineHeight: 1.8 }}>
          <p>PineTask is a visual task manager that helps you plan your day with a 24-hour timeline.</p>
          <ol style={{ paddingLeft: 20, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>Create tasks using the "Add task" form on your dashboard</li>
            <li>Set priorities, colours, and durations for each task</li>
            <li>Drag tasks onto the day schedule to plan your time</li>
            <li>Check off tasks as you complete them</li>
            <li>Track deadlines and projects to stay organised</li>
          </ol>
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: theme.font.heading, fontWeight: 500, color: theme.textPrimary, marginBottom: 16 }}>Keyboard Shortcuts</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {shortcuts.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <kbd style={{
                padding: '4px 10px', borderRadius: theme.radius.sm, background: theme.bgSecondary,
                border: `1px solid ${theme.border}`, fontFamily: 'monospace', fontSize: theme.font.bodySmall,
                color: theme.textPrimary, minWidth: 36, textAlign: 'center',
              }}>{s.key}</kbd>
              <span style={{ fontSize: theme.font.body, color: theme.textSecondary }}>{s.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: theme.font.heading, fontWeight: 500, color: theme.textPrimary, marginBottom: 16 }}>FAQ</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {faqs.map((f, i) => (
            <div key={i}>
              <h3 style={{ fontSize: theme.font.body, fontWeight: 600, color: theme.textPrimary, marginBottom: 4 }}>{f.q}</h3>
              <p style={{ fontSize: theme.font.body, color: theme.textSecondary, lineHeight: 1.6 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
