import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp } from './variants';

/**
 * Reveal — wraps a block in a fade+lift on mount or when scrolled into view.
 *
 * Props
 *  - whenInView: if true, waits for the element to scroll into view (only fires once).
 *  - delay: seconds added to the underlying transition delay.
 *  - className / as / children: passthrough.
 *
 * Honors `prefers-reduced-motion` by short-circuiting to a no-op.
 */
export default function Reveal({
  children,
  whenInView = false,
  delay = 0,
  className,
  as = 'div',
  ...rest
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] || motion.div;

  if (reduce) {
    const Tag = as;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  const variants = {
    hidden: fadeUp.hidden,
    visible: {
      ...fadeUp.visible,
      transition: { ...fadeUp.visible.transition, delay },
    },
  };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      {...(whenInView
        ? { whileInView: 'visible', viewport: { once: true, margin: '-60px' } }
        : { animate: 'visible' })}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
