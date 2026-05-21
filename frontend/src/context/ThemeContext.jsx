import { useCallback, useEffect, useMemo, useState } from 'react';
import { ThemeContext } from './themeContext';

const STORAGE_KEY = 'theme';

/**
 * Three settings the user can choose between:
 *
 *  - 'light'   force light
 *  - 'dark'    force dark
 *  - 'system'  follow the OS via prefers-color-scheme (default)
 *
 * The actual class we put on <html> is just `dark` or nothing — Tailwind
 * resolves the rest via the CSS variables defined in index.css.
 */
const VALID_CHOICES = ['light', 'dark', 'system'];

const readStored = () => {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return VALID_CHOICES.includes(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
};

const systemPrefersDark = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const resolveEffective = (choice) => {
  if (choice === 'dark') return 'dark';
  if (choice === 'light') return 'light';
  return systemPrefersDark() ? 'dark' : 'light';
};

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

  // If the user is on 'system', listen for OS-level changes so we follow them
  // live without a page reload.
  useEffect(() => {
    if (choice !== 'system' || typeof window === 'undefined' || !window.matchMedia) {
      return undefined;
    }
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setEffective(systemPrefersDark() ? 'dark' : 'light');

    // Older Safari: addListener. Modern: addEventListener.
    if (media.addEventListener) {
      media.addEventListener('change', handler);
      return () => media.removeEventListener('change', handler);
    }
    media.addListener(handler);
    return () => media.removeListener(handler);
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
    // Cycle: light → dark → system → light. Lets users get back to the
    // OS-tracking mode without digging into settings.
    setTheme(choice === 'light' ? 'dark' : choice === 'dark' ? 'system' : 'light');
  }, [choice, setTheme]);

  const value = useMemo(
    () => ({ theme: choice, effective, setTheme, toggleTheme }),
    [choice, effective, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
