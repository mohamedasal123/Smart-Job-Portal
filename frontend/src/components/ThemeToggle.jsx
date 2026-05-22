import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../context/useTheme';
import { SPRING_PRESS } from '../motion/variants';

const ICONS = {
  light:  { icon: 'light_mode',         label: 'Light mode' },
  dark:   { icon: 'dark_mode',          label: 'Dark mode' },
};

const NEXT_LABEL = {
  light:  'Switch to dark mode',
  dark:   'Switch to light mode',
};

/**
 * Icon button that toggles light ↔ dark. The icon crossfades on
 * change so the user gets a visual confirmation of what they switched to.
 * Pass `compact` for the smaller header variant.
 */
export default function ThemeToggle({ compact = false, className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const reduce = useReducedMotion();
  const { icon, label } = ICONS[theme] || ICONS.light;

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileTap={reduce ? undefined : { scale: 0.92, transition: SPRING_PRESS }}
      aria-label={NEXT_LABEL[theme] || 'Toggle theme'}
      title={NEXT_LABEL[theme] || 'Toggle theme'}
      className={[
        'relative inline-flex items-center justify-center rounded-full',
        'text-on-surface-variant hover:text-secondary hover:bg-surface-container-low',
        'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary',
        compact ? 'w-9 h-9' : 'w-10 h-10',
        className,
      ].join(' ')}
    >
      <span className="sr-only">{label}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          aria-hidden="true"
          className="material-symbols-outlined"
          style={{ fontSize: compact ? 20 : 22 }}
          initial={reduce ? false : { opacity: 0, rotate: -45, scale: 0.7 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, rotate: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, rotate: 45, scale: 0.7 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          {icon}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
