import { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';

/**
 * AnimatedCounter — counts up to a number when it mounts (or when `value`
 * changes). Used for dashboard stat cards.
 *
 * Props
 *  - value: target number (integer recommended)
 *  - duration: seconds (default 1.2)
 *  - format: optional formatter (n => string), defaults to integer.toLocaleString()
 */
export default function AnimatedCounter({ value = 0, duration = 1.2, format, className }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (latest) =>
    format ? format(latest) : Math.round(latest).toLocaleString()
  );

  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return undefined;
    }
    const controls = animate(mv, value, { duration, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
  }, [value, duration, reduce, mv]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
