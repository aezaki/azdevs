/**
 * @file components/Hero.tsx
 * @description Above-the-fold hero section. Presents the primary value
 *              proposition, two CTAs (Calendly booking + scroll-to-services),
 *              and a fact card that reinforces trust signals on desktop.
 *
 * @section Hero (first section below nav)
 * @dependencies framer-motion, lib/animations (fadeIn, ease)
 *
 * @notes factRows is defined at module scope (outside the component) because it
 *        is a static data array — hoisting it avoids re-creation on every render.
 *        scrollToServices is memoised with useCallback for the same reason.
 *
 *        The headline uses a per-line mask reveal: each line sits inside an
 *        overflow:hidden wrapper and slides up from y:40. The location pill
 *        animates the dot (scale spring) before the text (opacity fade) to give
 *        the entrance a feeling of sequence.
 *
 *        useReducedMotion: when the OS accessibility setting is on, all spatial
 *        animations are replaced with simple opacity fades.
 */

'use client';

import { useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CALENDLY_URL, LOCATION } from '@/lib/constants';
import { ease } from '@/lib/animations';

// ─── Static Data ───────────────────────────────────────────────────────────────

const factRows = [
  { label: 'Avg. project turnaround', tag: '2 to 4 weeks' },
  { label: 'Discovery call', tag: 'Free, no pitch' },
  { label: 'Billing model', tag: 'Fixed rate' },
  { label: 'Code ownership', tag: '100% yours' },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const scrollToServices = useCallback(() => {
    const el = document.querySelector('#services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section
      className="relative pt-[100px] pb-12 md:pt-[120px] md:pb-[72px]"
      style={{ backgroundColor: '#F7F6F2' }}
    >
      <div className="mx-auto max-w-[1200px] px-5 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center">

          {/* ── Left column: copy + CTAs ── */}
          <div className="flex flex-col gap-6">

            {/* Location pill — dot springs in first, text fades 100ms later */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0 }}
              className="flex items-center gap-2"
              style={{ fontSize: '12px', color: '#888' }}
            >
              <motion.span
                initial={{ scale: prefersReducedMotion ? 1 : 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0 }}
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: '#EF9F27', display: 'inline-block' }}
                aria-hidden="true"
              />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {LOCATION}
              </motion.span>
            </motion.div>

            {/* Headline — each line mask-reveals from below (overflow:hidden clips the travel) */}
            <h1
              style={{
                fontSize: 'clamp(34px, 4.5vw, 50px)',
                fontWeight: 500,
                letterSpacing: '-2.5px',
                lineHeight: 1.07,
                color: '#1a1a1a',
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <motion.span
                  style={{ display: 'block' }}
                  initial={{ y: prefersReducedMotion ? 0 : 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, ease, delay: 0.1 }}
                >
                  We build software that makes your
                </motion.span>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <motion.span
                  style={{ display: 'block' }}
                  initial={{ y: prefersReducedMotion ? 0 : 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, ease, delay: 0.18 }}
                >
                  {/* One-time brightness pulse fires after the line lands */}
                  <motion.em
                    className="not-italic"
                    animate={
                      prefersReducedMotion
                        ? { color: '#C85A1E' }
                        : { color: ['#C85A1E', '#e8813a', '#C85A1E'] }
                    }
                    transition={{ delay: 0.9, duration: 0.6, ease: 'easeInOut', times: [0, 0.5, 1] }}
                    style={{ color: '#C85A1E' }}
                  >
                    business run better.
                  </motion.em>
                </motion.span>
              </div>
            </h1>

            {/* Subtitle — enters after headline line 1 is mostly done */}
            <motion.p
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.5 }}
              style={{ fontSize: '16px', color: '#666666', lineHeight: 1.8, maxWidth: '480px' }}
            >
              Websites, apps, automations, and AI tools for small businesses and startups in the
              GTA. No fluff, no bloated agencies. Just good work at a fair price.
            </motion.p>

            {/* CTAs — staggered 0.15s after subtitle */}
            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.65 }}
              className="flex flex-wrap gap-3"
            >
              <motion.a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center font-medium transition-colors duration-200"
                style={{
                  backgroundColor: '#1a1a1a',
                  color: '#F7F6F2',
                  padding: '13px 26px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  minHeight: '44px',
                }}
                whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C85A1E')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1a1a1a')}
              >
                Book a free call
              </motion.a>

              <motion.button
                onClick={scrollToServices}
                className="inline-flex items-center font-medium transition-all duration-200 cursor-pointer bg-transparent"
                style={{
                  color: '#1a1a1a',
                  padding: '13px 26px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  border: '0.5px solid #ccc',
                  minHeight: '44px',
                }}
                whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#1a1a1a')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#ccc')}
              >
                See our services
              </motion.button>
            </motion.div>
          </div>

          {/* ── Right column: fact card — slides in from x:20 ── */}
          <motion.div
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.3 }}
            className="hidden lg:block"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '0.5px solid #dedad2',
              overflow: 'hidden',
            }}
            aria-label="At a glance"
          >
            {factRows.map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.35 + i * 0.06 }}
                className="flex items-center justify-between px-6 py-4 transition-colors duration-150"
                style={{
                  borderBottom: i < factRows.length - 1 ? '0.5px solid #dedad2' : 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fafaf8')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span style={{ fontSize: '13px', color: '#666' }}>{row.label}</span>
                <span
                  className="inline-flex items-center font-medium"
                  style={{
                    backgroundColor: '#FDF0E8',
                    color: '#C85A1E',
                    fontSize: '11px',
                    padding: '3px 10px',
                    borderRadius: '20px',
                  }}
                >
                  {row.tag}
                </span>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
