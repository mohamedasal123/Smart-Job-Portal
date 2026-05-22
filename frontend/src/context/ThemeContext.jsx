import { useCallback, useEffect, useMemo, useState } from 'react';
import { ThemeContext } from './themeContext';

const STORAGE_KEY = 'theme';

/**
 * Two explicit settings the user can choose between:
 *
 *  - 'light'   force light
 *  - 'dark'    force dark
 *
 * The actual class we put on <html> is just `dark` or nothing — Tailwind
 * resolves the rest via the CSS variables defined in index.css.
 */
const VALID_CHOICES = ['light', 'dark'];

const readStored = () => {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return VALID_CHOICES.includes(stored) ? stored : 'light';
  } catch {
    return 'light';
  }
};

const resolveEffective = (choice) => (choice === 'dark' ? 'dark' : 'light');

const applyClass = (effective) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (effective === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export function ThemeProvider({ children }) {
  const [choice, setChoice] = useState(readStored);
  const [effective, setEffective] = useState(() => resolveEffective(readStored()));

  // Keep <html> class in sync whenever the effective theme changes.
  useEffect(() => {
    applyClass(effective);
  }, [effective]);

  // Re-resolve when the user's choice changes.
  useEffect(() => {
    setEffective(resolveEffective(choice));
  }, [choice]);

  const setTheme = useCallback((next) => {
    if (!VALID_CHOICES.includes(next)) return;
    setChoice(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable — selection lives only in memory this session.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(choice === 'dark' ? 'light' : 'dark');
  }, [choice, setTheme]);

  const value = useMemo(
    () => ({ theme: choice, effective, setTheme, toggleTheme }),
    [choice, effective, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
