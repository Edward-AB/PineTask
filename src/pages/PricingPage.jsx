import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme.js';

const tiers = [
  {
    name: 'Free',
    price: '£0',
    period: 'forever',
    highlight: false,
    features: [
      'Up to 3 projects',
      '50 tasks per day',
      'Basic analytics',
      'Single user',
      'Forest & dark themes',
      'Focus timer',
    ],
    cta: 'Get started',
  },
  {
    name: 'Plus',
    price: '£4.99',
    period: '/month',
    highlight: true,
    badge: 'Most popular',
    features: [
      'Unlimited projects',
      'Unlimited tasks',
      'Full analytics & streaks',
      'Priority support',
      'Custom themes',
      'Day notes & events',
      'Profile picture',
    ],
    cta: 'Coming soon',
  },
  {
    name: 'Pro + Team',
    price: '£9.99',
    period: '/month',
    highlight: false,
    features: [
      'Everything in Plus',
      'Team workspaces',
      'Shared projects',
      'Meetings & scheduling',
      'Admin controls',
      'API access',
      'Priority onboarding',
    ],
    cta: 'Coming soon',
  },
];

export default function PricingPage() {
  const { theme } = useTheme();

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 24px 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 style={{ fontSize: theme.font.headingXl, fontWeight: 700, color: theme.textPrimary, marginBottom: 8 }}>
          Simple, transparent pricing
        </h1>
        <p style={{ fontSize: theme.font.body, color: theme.textSecondary, maxWidth: 480, margin: '0 auto' }}>
          Start free. Upgrade when you need more.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, alignItems: 'start' }}>
        {tiers.map((tier) => (
          <div key={tier.name} style={{
            padding: 24, borderRadius: theme.radius.md,
            border: tier.highlight ? `2px solid ${theme.accent}` : `0.5px solid ${theme.border}`,
            background: theme.bgSecondary, position: 'relative',
            boxShadow: tier.highlight ? theme.shadow.md : 'none',
          }}>
            {tier.badge && (
              <div style={{
                position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                padding: '2px 12px', borderRadius: theme.radius.full,
                background: theme.accent, color: theme.accentBtnText,
                fontSize: theme.font.label, fontWeight: 600, whiteSpace: 'nowrap',
              }}>{tier.badge}</div>
            )}
            <div style={{ fontSize: theme.font.heading, fontWeight: 600, color: theme.textPrimary, marginBottom: 4 }}>
              {tier.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 16 }}>
              <span style={{ fontSize: '28px', fontWeight: 700, color: theme.textPrimary }}>{tier.price}</span>
              <span style={{ fontSize: theme.font.bodySmall, color: theme.textTertiary }}>{tier.period}</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tier.features.map((f) => (
                <li key={f} style={{ fontSize: theme.font.bodySmall, color: theme.textSecondary, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width={12} height={12} viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke={theme.accent} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button disabled={tier.cta === 'Coming soon'} style={{
              width: '100%', padding: '8px 16px', borderRadius: theme.radius.sm,
              background: tier.highlight ? theme.accentBtn : 'transparent',
              color: tier.highlight ? theme.accentBtnText : theme.textSecondary,
              border: tier.highlight ? 'none' : `1px solid ${theme.border}`,
              fontWeight: 600, fontSize: theme.font.bodySmall, cursor: tier.cta === 'Coming soon' ? 'default' : 'pointer',
              opacity: tier.cta === 'Coming soon' ? 0.6 : 1, fontFamily: 'inherit',
            }}>
              {tier.cta}
            </button>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 40, fontSize: theme.font.bodySmall, color: theme.textTertiary }}>
        <Link to="/" style={{ color: theme.accent }}>{'\u2190'} Back to home</Link>
      </div>
    </div>
  );
}
