// Shared framer-motion variants. Importing from here keeps timing/easing
// consistent across pages and lets us tune the whole site in one file.
//
// Easing rationale: cubic-bezier(0.16, 1, 0.3, 1) is the "ease-out-expo"
// curve — fast in, gentle out. Reads as smooth and assertive, not bouncy.

export const EASE = [0.16, 1, 0.3, 1];
export const SPRING_SOFT = { type: 'spring', stiffness: 260, damping: 26 };
export const SPRING_PRESS = { type: 'spring', stiffness: 400, damping: 22 };

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: EASE } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: EASE } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15, ease: EASE } },
};

export const slideUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: EASE } },
};

export const slideRight = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } },
  exit: { opacity: 0, x: 24, transition: { duration: 0.2, ease: EASE } },
};

// Container variant for staggering children: place `<motion.div variants={stagger}>`
// over a list of `<motion.* variants={fadeUp}>` to get a cascade.
export const stagger = (delayChildren = 0.05, stagger = 0.06) => ({
  hidden: {},
  visible: {
    transition: { delayChildren, staggerChildren: stagger },
  },
});

// Page transition: short, no layout shift. Used by PageTransition wrapper.
export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
  exit:    { opacity: 0, y: -4, transition: { duration: 0.15, ease: EASE } },
};

// Tap/hover affordances for interactive surfaces. Apply via whileHover/whileTap.
export const cardHover = {
  rest:  { y: 0, boxShadow: '0px 4px 20px rgba(15, 23, 42, 0.05)' },
  hover: {
    y: -4,
    boxShadow: '0px 14px 40px rgba(15, 23, 42, 0.12)',
    transition: SPRING_SOFT,
  },
};

export const buttonPress = {
  whileTap: { scale: 0.97, transition: SPRING_PRESS },
};
