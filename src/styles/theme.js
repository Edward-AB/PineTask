/** @module theme - Complete design token system for PineTask */

const SHARED = {
  radius: { sm: '6px', md: '10px', lg: '16px', xl: '20px', full: '9999px' },
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', xxl: '48px' },
  font: {
    label: '10px', bodySmall: '12px', body: '13px', heading: '16px',
    headingLg: '20px', headingXl: '28px', hero: '48px',
  },
  transition: '200ms ease',
  shadow: {
    sm: '0 1px 3px rgba(0,0,0,0.08)',
    md: '0 4px 12px rgba(0,0,0,0.1)',
    lg: '0 8px 24px rgba(0,0,0,0.12)',
    xl: '0 16px 48px rgba(0,0,0,0.18)',
  },
};

export const forest = {
  ...SHARED,
  name: 'forest',
  // Backgrounds
  bg: '#FFFFFF',
  bgSecondary: '#F7F5F1',
  bgTertiary: '#F5F3EE',
  // Header
  headerBg: '#DADCD0',
  headerBorder: '#C4C6BA',
  headerText: '#2C2C2A',
  // Surfaces
  surface: '#FFFFFF',
  surfaceAlt: '#FAFAF8',
  // Borders
  border: '#D3CFC0',
  borderLight: '#E8E5DE',
  borderFocus: '#97C459',
  // Text
  textPrimary: '#2C2C2A',
  textSecondary: '#5F5E5A',
  textTertiary: '#B4B2A9',
  // Accent
  accent: '#3B6D11',
  accentBg: '#EAF3DE',
  accentText: '#27500A',
  accentBorder: '#97C459',
  accentBtn: '#27500A',
  accentBtnText: '#EAF3DE',
  // Calendar
  calBg: '#FAFAF8',
  hourRule: '#E8E5DE',
  workingHoursBg: 'rgba(234,243,222,0.3)',
  nowLine: '#E24B4A',
  // Selection
  selectedDay: '#EAF3DE',
  selectedDayBorder: '#639922',
  selectedDayText: '#27500A',
  todayDayBg: '#F5F3EE',
  // Priority
  priority: {
    none: { bg: '#F1EFE8', border: '#C8C4B8', text: '#6A6860', dot: '#A8A49C' },
    high: { bg: '#EAF3DE', border: '#97C459', text: '#27500A', dot: '#639922' },
    medium: { bg: '#EAF2FC', border: '#88B8E8', text: '#1A4A7A', dot: '#5B9BD5' },
    low: { bg: '#F0EDF9', border: '#B0A4E0', text: '#3A2E70', dot: '#9B89CC' },
  },
  // Deadline colours (6 presets)
  deadline: [
    { bg: '#FAEEDA', border: '#EF9F27', text: '#633806', dot: '#BA7517' },
    { bg: '#FBEAF0', border: '#ED93B1', text: '#72243E', dot: '#D4537E' },
    { bg: '#E1F5EE', border: '#5DCAA5', text: '#085041', dot: '#1D9E75' },
    { bg: '#FCEBEB', border: '#F09595', text: '#791F1F', dot: '#E24B4A' },
    { bg: '#F1EFE8', border: '#B4B2A9', text: '#2C2C2A', dot: '#888780' },
    { bg: '#EAF3DE', border: '#97C459', text: '#27500A', dot: '#639922' },
  ],
  // Task colours
  taskColor: [
    { id: 'white', bg: '#F5F3EE', border: '#C8C4B8', text: '#2C2C2A', dot: '#A8A49C' },
    { id: 'brown', bg: '#EDD5C0', border: '#8B4513', text: '#3A1200', dot: '#7A3010' },
    { id: 'orange', bg: '#FDEBD0', border: '#C8721A', text: '#5C2E00', dot: '#C8721A' },
    { id: 'green', bg: '#D4EDD9', border: '#3A7D44', text: '#0F3318', dot: '#3A7D44' },
    { id: 'purple', bg: '#D8D0F5', border: '#5A3FAF', text: '#1E0E55', dot: '#3B1F8E' },
    { id: 'black', bg: '#B8B8B8', border: '#111111', text: '#000000', dot: '#000000' },
  ],
  // Charts
  chartDone: '#2D9B6F',
  chartHigh: '#639922',
  chartMedium: '#5B9BD5',
  chartLow: '#9B89CC',
  chartNone: '#C8C4B8',
  // Misc
  danger: '#E24B4A',
  dangerBg: '#FCEBEB',
  success: '#2D9B6F',
  successBg: '#E1F5EE',
  warning: '#EF9F27',
  warningBg: '#FAEEDA',
};

export const dark = {
  ...SHARED,
  name: 'dark',
  bg: '#151718',
  bgSecondary: '#1E2225',
  bgTertiary: '#252A2D',
  headerBg: '#1A2420',
  headerBorder: '#2A3530',
  headerText: '#E8E0D0',
  surface: '#1E2225',
  surfaceAlt: '#1A1E20',
  border: '#2E3438',
  borderLight: '#2A3035',
  borderFocus: '#5DCAA5',
  textPrimary: '#E8EAEB',
  textSecondary: '#9AA3A8',
  textTertiary: '#4A5558',
  accent: '#5DCAA5',
  accentBg: '#1A3530',
  accentText: '#5DCAA5',
  accentBorder: '#2D6B5A',
  accentBtn: '#2D6B5A',
  accentBtnText: '#C0F0E0',
  calBg: '#1A1E20',
  hourRule: '#2A3035',
  workingHoursBg: 'rgba(26,53,48,0.3)',
  nowLine: '#FF6B6B',
  selectedDay: '#1A3530',
  selectedDayBorder: '#5DCAA5',
  selectedDayText: '#5DCAA5',
  todayDayBg: '#1E2428',
  priority: {
    none: { bg: '#222628', border: '#4A5558', text: '#9AA3A8', dot: '#6A7880' },
    high: { bg: '#1C2E14', border: '#4A7A25', text: '#8FD44A', dot: '#6DB830' },
    medium: { bg: '#131E2A', border: '#7AAAD4', text: '#A8C8F0', dot: '#A8C8F0' },
    low: { bg: '#1A1830', border: '#9A90D4', text: '#C5B8F0', dot: '#C5B8F0' },
  },
  deadline: [
    { bg: '#2A1F08', border: '#A07820', text: '#F5C87A', dot: '#C49A30' },
    { bg: '#2A1020', border: '#9A4570', text: '#E890B8', dot: '#C05080' },
    { bg: '#0A2218', border: '#2A7048', text: '#60C0A0', dot: '#1D9E75' },
    { bg: '#2A0F0F', border: '#8A3030', text: '#E08080', dot: '#C05050' },
    { bg: '#1A1E20', border: '#4A5558', text: '#9AA3A8', dot: '#6A7880' },
    { bg: '#152210', border: '#3A6020', text: '#90C870', dot: '#4A8830' },
  ],
  taskColor: [
    { id: 'white', bg: '#2A2A28', border: '#6A6860', text: '#C8C4BC', dot: '#888480' },
    { id: 'brown', bg: '#2A1A0C', border: '#7A3A10', text: '#C89070', dot: '#9A5030' },
    { id: 'orange', bg: '#2A1E08', border: '#8A5010', text: '#C88840', dot: '#A86820' },
    { id: 'green', bg: '#0E1F10', border: '#2A5A2A', text: '#70A870', dot: '#3A7A3A' },
    { id: 'purple', bg: '#1A1228', border: '#4A3488', text: '#9080C8', dot: '#6050A8' },
    { id: 'black', bg: '#181818', border: '#404040', text: '#B0B0B0', dot: '#707070' },
  ],
  chartDone: '#2D9B6F',
  chartHigh: '#6DB830',
  chartMedium: '#A8C8F0',
  chartLow: '#C5B8F0',
  chartNone: '#4A5558',
  danger: '#FF6B6B',
  dangerBg: '#2A0F0F',
  success: '#5DCAA5',
  successBg: '#0A2218',
  warning: '#F5C87A',
  warningBg: '#2A1F08',
};

export const themes = { forest, dark };
