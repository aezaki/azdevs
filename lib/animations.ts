import type { Transition, MotionProps } from 'framer-motion';

export const ease: Transition['ease'] = 'easeOut';

export const scrollReveal = (delay = 0): Pick<MotionProps, 'initial' | 'whileInView' | 'viewport' | 'transition'> => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.08 },
  transition: { duration: 0.55, ease, delay },
});

export const fadeIn = (delay = 0): Pick<MotionProps, 'initial' | 'animate' | 'transition'> => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease, delay },
});
