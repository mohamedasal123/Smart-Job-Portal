import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { pageTransition } from './variants';

/**
 * PageTransition — wrap the routed `<Outlet />` (or any leaf page tree) and
 * we fade+lift between routes. Keyed on pathname so AnimatePresence sees a
 * different child whenever the route changes.
 *
 * Falls back to a plain wrapper when the user prefers reduced motion.
 */
export default function PageTransition({ children, className }) {
  const reduce = useReducedMotion();
  const location = useLocation();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className={className}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
