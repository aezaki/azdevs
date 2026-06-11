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
 *
 *        `scrollRevealReduced` and `fadeInReduced` are opacity-only variants for
 *        when `useReducedMotion()` returns true. Components should pick between
 *        the standard and reduced variant based on that hook's return value.
 */

import type { Transition, MotionProps, TargetAndTransition } from 'framer-motion';

// ─── Shared Easing ──────────────────────────────────────────────────────────────

/** Custom cubic bezier — starts fast, settles with physical weight */
export const ease: Transition['ease'] = [0.21, 0.47, 0.32, 0.98];

// ─── Shared Interaction Presets ────────────────────────────────────────────────

/** Spring config for y:-2 hover lifts (Footer links, social pills, etc.) */
export const springTransition: Transition = {
  duration: 0.15,
  type: 'spring' as const,
  stiffness: 300,
  damping: 25,
};

/** whileTap press-down used on all primary and secondary buttons */
export const tapPress: TargetAndTransition = {
  scale: 0.97,
  transition: { duration: 0.1 },
};

// ─── Animation Presets ─────────────────────────────────────────────────────────

/**
 * Scroll-triggered reveal: fades in and slides up from y+24 when the element
 * enters the viewport. Triggers early (amount: 0.1) and plays only once.
 *
 * @param delay - Optional stagger delay in seconds (default 0)
 */
export const scrollReveal = (
  delay = 0
): Pick<MotionProps, 'initial' | 'whileInView' | 'viewport' | 'transition'> => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease, delay },
});

/**
 * Reduced-motion variant of scrollReveal — opacity only, no spatial movement.
 * Use when `useReducedMotion()` returns true.
 */
export const scrollRevealReduced = (
  delay = 0
): Pick<MotionProps, 'initial' | 'whileInView' | 'viewport' | 'transition'> => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.4, delay },
});

/**
 * Opacity-only scroll reveal — no spatial movement. Use for sections where
 * content should materialize rather than rise: full-bleed color sections,
 * emotional peaks, or any surface where Y travel would break the composition.
 */
export const scrollRevealFade = (
  delay = 0
): Pick<MotionProps, 'initial' | 'whileInView' | 'viewport' | 'transition'> => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.75, ease: 'easeOut', delay },
});

/**
 * Entrance animation: fades in and slides up from y+24 on mount.
 * Used for above-the-fold elements in the Hero that should animate immediately
 * rather than waiting for a scroll trigger.
 *
 * @param delay - Optional stagger delay in seconds (default 0)
 */
export const fadeIn = (
  delay = 0
): Pick<MotionProps, 'initial' | 'animate' | 'transition'> => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease, delay },
});

/**
 * Reduced-motion variant of fadeIn — opacity only.
 * Use when `useReducedMotion()` returns true.
 */
export const fadeInReduced = (
  delay = 0
): Pick<MotionProps, 'initial' | 'animate' | 'transition'> => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4, delay },
});

/** scrollIntoView respecting prefers-reduced-motion */
export function smoothScrollTo(selector: string): void {
  const el = document.querySelector(selector);
  if (!el) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
}
