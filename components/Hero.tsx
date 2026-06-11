'use client';

import { useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CALENDLY_URL, LOCATION } from '@/lib/constants';
import { ease, tapPress, smoothScrollTo } from '@/lib/animations';

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
    smoothScrollTo('#services');
  }, []);

  return (
    <section
      className="relative pt-[100px] pb-12 md:pt-[120px] md:pb-[72px]"
      style={{ backgroundColor: 'var(--color-dark)' }}
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
              style={{ fontSize: '12px', color: 'rgba(247,246,242,0.55)' }}
            >
              <motion.span
                initial={{ scale: prefersReducedMotion ? 1 : 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0 }}
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: 'var(--color-accent-mid)', display: 'inline-block' }}
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
                fontSize: 'clamp(36px, 5vw, 58px)',
                fontWeight: 600,
                letterSpacing: '-0.04em',
                lineHeight: 1.05,
                color: 'var(--color-bg)',
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
              <div style={{ overflow: 'hidden', paddingBottom: '4px' }}>
                <motion.span
                  style={{ display: 'block' }}
                  initial={{ y: prefersReducedMotion ? 0 : 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, ease, delay: 0.18 }}
                >
                  {/* Terracotta stamp — bg pulse fires after the line lands */}
                  <motion.span
                    animate={
                      prefersReducedMotion
                        ? { backgroundColor: '#C85A1E' }
                        : { backgroundColor: ['#C85A1E', '#e8813a', '#C85A1E'] }
                    }
                    transition={{ delay: 0.9, duration: 0.6, ease: 'easeInOut', times: [0, 0.5, 1] }}
                    style={{
                      backgroundColor: 'var(--color-accent)',
                      color: 'var(--color-bg)',
                      padding: '0 8px 3px',
                      borderRadius: '4px',
                    }}
                  >
                    business run better.
                  </motion.span>
                </motion.span>
              </div>
            </h1>

            {/* Subtitle — enters after headline line 1 is mostly done */}
            <motion.p
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.5 }}
              style={{ fontSize: '16px', color: 'rgba(247,246,242,0.65)', lineHeight: 1.8, maxWidth: '480px' }}
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
                className="inline-flex items-center font-semibold transition-colors duration-200"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: '#fff',
                  padding: '13px 26px',
                  borderRadius: 'var(--radius-btn)',
                  fontSize: '14px',
                  minHeight: '44px',
                }}
                whileTap={tapPress}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent-text)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent)')}
              >
                Book a free call
              </motion.a>

              <motion.button
                onClick={scrollToServices}
                className="inline-flex items-center font-medium transition-all duration-200 cursor-pointer bg-transparent"
                style={{
                  color: 'rgba(247,246,242,0.80)',
                  padding: '13px 26px',
                  borderRadius: 'var(--radius-btn)',
                  fontSize: '14px',
                  border: '0.5px solid rgba(247,246,242,0.25)',
                  minHeight: '44px',
                }}
                whileTap={tapPress}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(247,246,242,0.70)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(247,246,242,0.25)')}
              >
                See our services
              </motion.button>
            </motion.div>

            {/* Trust signals — mobile only; desktop gets the full fact card in the right column */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="lg:hidden grid grid-cols-2 gap-x-4 gap-y-3"
              aria-label="At a glance"
            >
              {factRows.map((row) => (
                <div key={row.label} className="flex flex-col gap-1">
                  <span
                    className="inline-flex items-center font-medium self-start"
                    style={{
                      backgroundColor: 'var(--color-accent-light)',
                      color: 'var(--color-accent-text)',
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '20px',
                    }}
                  >
                    {row.tag}
                  </span>
                  <span style={{ fontSize: '11px', color: 'rgba(247,246,242,0.55)' }}>
                    {row.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right column: fact card — slides in from x:20 ── */}
          <motion.div
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.3 }}
            className="hidden lg:block"
            style={{
              backgroundColor: 'var(--color-dark-card)',
              borderRadius: 'var(--radius-hero-card)',
              border: '0.5px solid var(--color-border-dark)',
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
                  borderBottom: i < factRows.length - 1 ? '0.5px solid var(--color-border-dark)' : 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-dark-card-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span style={{ fontSize: '13px', color: 'rgba(247,246,242,0.50)' }}>{row.label}</span>
                <span
                  className="inline-flex items-center font-medium"
                  style={{
                    backgroundColor: 'var(--color-accent-light)',
                    color: 'var(--color-accent-text)',
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
