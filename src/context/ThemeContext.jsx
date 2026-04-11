import { createContext, useState, useEffect, useCallback } from 'react';
import { forest, dark } from '../styles/theme.js';
import { THEME_KEY } from '../constants';

export const ThemeContext = createContext();

/** Inject theme tokens as CSS custom properties on <html> */
function applyThemeVars(theme) {
  const root = document.documentElement;
  root.style.setProperty('--bg', theme.bg);
  root.style.setProperty('--bg-secondary', theme.bgSecondary);
  root.style.setProperty('--bg-tertiary', theme.bgTertiary);
  root.style.setProperty('--surface', theme.surface);
  root.style.setProperty('--surface-alt', theme.surfaceAlt);
  root.style.setProperty('--border', theme.border);
  root.style.setProperty('--border-light', theme.borderLight);
  root.style.setProperty('--border-focus', theme.borderFocus);
  root.style.setProperty('--text-primary', theme.textPrimary);
  root.style.setProperty('--text-secondary', theme.textSecondary);
  root.style.setProperty('--text-tertiary', theme.textTertiary);
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--accent-bg', theme.accentBg);
  root.style.setProperty('--accent-text', theme.accentText);
  root.style.setProperty('--accent-border', theme.accentBorder);
  root.style.setProperty('--accent-btn', theme.accentBtn);
  root.style.setProperty('--accent-btn-text', theme.accentBtnText);
  root.style.setProperty('--header-bg', theme.headerBg);
  root.style.setProperty('--header-border', theme.headerBorder);
  root.style.setProperty('--header-text', theme.headerText);
  root.style.setProperty('--danger', theme.danger);
  root.style.setProperty('--success', theme.success);
}

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'forest';
  });

  const theme = themeMode === 'dark' ? dark : forest;

  useEffect(() => {
    applyThemeVars(theme);
    localStorage.setItem(THEME_KEY, themeMode);
  }, [themeMode, theme]);

  const toggleTheme = useCallback(() => {
    setThemeMode(m => m === 'forest' ? 'dark' : 'forest');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
