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
      className={`w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-6 text-left transition-shadow ${
        isInteractive ? 'hover:border-secondary hover:shadow-hover cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary' : ''
      }`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-[24px]" aria-hidden="true">{icon}</span>
        </div>
        <div>
          <h3 className="font-h1 text-h1 text-primary">{renderValue}</h3>
          <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{title}</p>
        </div>
      </div>
      {description && <p className="font-body-sm text-body-sm text-on-surface-variant">{description}</p>}
    </Component>
  );
}
