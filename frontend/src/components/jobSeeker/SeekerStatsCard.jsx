import { motion, useReducedMotion } from 'framer-motion';
import AnimatedCounter from '../../motion/AnimatedCounter';
import { EASE, SPRING_PRESS } from '../../motion/variants';

export default function SeekerStatsCard({ title, value, icon, description, onClick }) {
  const reduce = useReducedMotion();
  const isInteractive = Boolean(onClick);
  const numericValue = Number(value);
  const renderValue = Number.isFinite(numericValue)
    ? <AnimatedCounter value={numericValue} />
    : value;

  const Component = isInteractive ? motion.button : motion.div;

  return (
    <Component
      onClick={onClick}
      type={isInteractive ? 'button' : undefined}
      whileHover={reduce || !isInteractive ? undefined : { y: -4, transition: { duration: 0.2, ease: EASE } }}
      whileTap={reduce || !isInteractive ? undefined : { scale: 0.98, transition: SPRING_PRESS }}
      className={`w-full bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant shadow-ambient text-left transition-all ${
        isInteractive ? 'hover:border-secondary hover:shadow-hover cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="material-symbols-outlined text-secondary" aria-hidden="true">{icon}</span>
        <span className="font-display text-[34px] leading-none text-primary">{renderValue}</span>
      </div>
      <p className="font-body-md text-body-md text-on-surface-variant mt-stack-md">{title}</p>
      {description && <p className="font-body-sm text-body-sm text-on-surface-variant mt-unit">{description}</p>}
    </Component>
  );
}
