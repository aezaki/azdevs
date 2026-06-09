/**
 * @file lib/animations.ts
 * @description Shared Framer Motion animation helpers used across all section
 *              components. Centralising these avoids duplicating transition
 *              config and keeps the visual rhythm consistent site-wide.
 *
 * @dependencies framer-motion
 *
 * @notes The `ease` constant is typed as `Transition['ease']` (not plain string)
 *        because Framer Motion v12 enforces strict Easing types. Without this
 *        explicit annotation TypeScript infers `string`, which fails the
 *        `Transition` interface check.
 */

import type { Transition, MotionProps } from 'framer-motion';

// ─── Shared Easing ──────────────────────────────────────────────────────────────

/** Typed ease value — must be `Transition['ease']` to satisfy Framer Motion v12 */
export const ease: Transition['ease'] = 'easeOut';

// ─── Animation Presets ─────────────────────────────────────────────────────────

/**
 * Scroll-triggered reveal: fades in and slides up from y+20 when the element
 * enters the viewport. `once: true` ensures it only plays once — re-scrolling
 * back up will not replay the animation.
 *
 * @param delay - Optional stagger delay in seconds (default 0)
 */
export const scrollReveal = (
  delay = 0
): Pick<MotionProps, 'initial' | 'whileInView' | 'viewport' | 'transition'> => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.08 },
  transition: { duration: 0.55, ease, delay },
});

/**
 * Entrance animation: fades in and slides up from y+20 on mount.
 * Used for above-the-fold elements in the Hero that should animate immediately
 * rather than waiting for a scroll trigger.
 *
 * @param delay - Optional stagger delay in seconds (default 0)
 */
export const fadeIn = (
  delay = 0
): Pick<MotionProps, 'initial' | 'animate' | 'transition'> => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease, delay },
});
