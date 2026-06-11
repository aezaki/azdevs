'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { CALENDLY_URL, HOW_IT_WORKS_STEPS } from '@/lib/constants';
import { scrollReveal, scrollRevealReduced, ease, tapPress } from '@/lib/animations';

const [step1, ...remainingSteps] = HOW_IT_WORKS_STEPS;

export default function HowItWorks() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="how-it-works"
      className="py-12 md:py-[72px] px-5 md:px-12"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      <div className="mx-auto max-w-[1200px]">

        {/* Section header */}
        <motion.div
          {...(prefersReducedMotion ? scrollRevealReduced() : scrollReveal())}
          className="mb-10 md:mb-12"
          style={{ maxWidth: '480px' }}
        >
          <h2
            style={{
              fontSize: 'var(--type-section-heading)',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              color: 'var(--color-dark)',
            }}
          >
            Simple from start to finish.
          </h2>
        </motion.div>

        <div className="flex flex-col gap-4 md:gap-5">

          {/* Step 1 — full-width dark card, the only step the user can act on */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease, delay: 0 }}
            style={{
              backgroundColor: 'var(--color-dark-card)',
              border: '0.5px solid var(--color-border-dark)',
              borderRadius: 'var(--radius-card)',
              padding: 'clamp(28px, 4vw, 44px)',
            }}
          >
            <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-12">

              {/* Content */}
              <div className="flex flex-col gap-4 flex-1">
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    color: 'rgba(247,246,242,0.30)',
                  }}
                  aria-hidden="true"
                >
                  01
                </span>
                <h3
                  style={{
                    fontSize: 'clamp(20px, 2.5vw, 26px)',
                    fontWeight: 600,
                    letterSpacing: '-0.025em',
                    lineHeight: 1.25,
                    color: 'var(--color-bg)',
                  }}
                >
                  {step1.headline}
                </h3>
                <p
                  style={{
                    fontSize: '15px',
                    color: 'rgba(247,246,242,0.65)',
                    lineHeight: 1.8,
                    maxWidth: '52ch',
                  }}
                >
                  {step1.body}
                </p>
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--color-accent-mid)',
                  }}
                >
                  {step1.tag}
                </p>
              </div>

              {/* CTA — anchored to bottom-right on desktop */}
              <div className="flex-shrink-0">
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
                    whiteSpace: 'nowrap',
                  }}
                  whileTap={tapPress}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = 'var(--color-accent-text)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'var(--color-accent)')
                  }
                >
                  Book a free call
                </motion.a>
              </div>

            </div>
          </motion.div>

          {/* Steps 2+3 — two borderless content blocks, outcomes that follow step 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {remainingSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.55, ease, delay: 0.1 + i * 0.08 }}
                className="flex flex-col gap-4"
                style={{
                  borderTop: '0.5px solid var(--color-border)',
                  paddingTop: '28px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    color: 'var(--color-dim)',
                  }}
                  aria-hidden="true"
                >
                  0{step.step}
                </span>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.3,
                    color: 'var(--color-dark)',
                  }}
                >
                  {step.headline}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--color-muted)',
                    lineHeight: 1.8,
                  }}
                >
                  {step.body}
                </p>
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--color-accent-text)',
                  }}
                >
                  {step.tag}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
