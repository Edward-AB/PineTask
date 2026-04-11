import { useTheme } from '../../hooks/useTheme.js';

export default function OnboardingProgress({ currentStep, totalSteps }) {
  const { theme } = useTheme();

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 0',
    gap: 0,
  };

  const dotSize = 28;
  const lineWidth = 48;

  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div style={containerStyle}>
      {steps.map((step, i) => {
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;
        const isUpcoming = step > currentStep;

        const dotStyle = {
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: theme.font.label,
          fontWeight: 600,
          flexShrink: 0,
          transition: 'all 300ms ease',
          border: isActive
            ? `2px solid ${theme.accent}`
            : isCompleted
              ? `2px solid ${theme.accent}`
              : `2px solid ${theme.border}`,
          background: isCompleted
            ? theme.accent
            : isActive
              ? theme.accentBg
              : 'transparent',
          color: isCompleted
            ? theme.accentText
            : isActive
              ? theme.accent
              : theme.textTertiary,
        };

        const lineStyle = {
          width: lineWidth,
          height: 2,
          background: step < currentStep ? theme.accent : theme.border,
          transition: 'background 300ms ease',
        };

        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={dotStyle}>
              {isCompleted ? (
                <svg width={12} height={12} viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                step
              )}
            </div>
            {i < steps.length - 1 && <div style={lineStyle} />}
          </div>
        );
      })}
    </div>
  );
}
