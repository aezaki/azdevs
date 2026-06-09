/**
 * @file components/HowItWorks.tsx
 * @description Three-step process section that explains the AZDEVS engagement
 *              model: call → scoping → delivery. Each card stagger-reveals on
 *              scroll and shows a numbered badge, headline, body, and value-prop tag.
 *
 * @section How it works (id="how-it-works")
 * @dependencies framer-motion, lib/animations, lib/constants
 *
 * @notes The step-number badge uses Tailwind bg classes (not inline backgroundColor)
 *        so that group-hover:bg-[#C85A1E] can override it — inline styles have
 *        higher specificity than Tailwind utilities and would prevent the hover
 *        colour from applying.
 */

'use client';

import { motion } from 'framer-motion';
import { HOW_IT_WORKS_STEPS } from '@/lib/constants';
import { scrollReveal } from '@/lib/animations';

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-12 md:py-[72px] px-5 md:px-12"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <div className="mx-auto max-w-[1200px]">

        {/* Section header */}
        <motion.div
          {...scrollReveal()}
          className="mb-10 md:mb-12"
          style={{ maxWidth: '480px' }}
        >
          <p
            className="uppercase mb-3"
            style={{ fontSize: '11px', letterSpacing: '2px', color: '#aaaaaa' }}
          >
            How it works
          </p>
          <h2
            style={{
              fontSize: 'clamp(28px, 3vw, 38px)',
              fontWeight: 500,
              letterSpacing: '-1px',
              lineHeight: 1.2,
              color: '#1a1a1a',
            }}
          >
            Simple from start to finish.
          </h2>
        </motion.div>

        {/* Steps — stagger each card's reveal by 100ms */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              {...scrollReveal(i * 0.1)}
              className="flex flex-col gap-4 group cursor-default"
              style={{
                backgroundColor: '#F7F6F2',
                border: '0.5px solid #dedad2',
                borderRadius: '12px',
                padding: '28px',
                transition: 'border-color 0.2s, background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = '#C85A1E';
                (e.currentTarget as HTMLElement).style.backgroundColor = '#fff';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = '#dedad2';
                (e.currentTarget as HTMLElement).style.backgroundColor = '#F7F6F2';
              }}
            >
              {/*
               * Step number badge — bg is set via Tailwind (bg-[#1a1a1a]) so
               * group-hover:bg-[#C85A1E] can override it on card hover.
               * Do NOT add a backgroundColor inline style here.
               */}
              <div
                className="flex items-center justify-center flex-shrink-0 bg-[#1a1a1a] group-hover:bg-[#C85A1E] transition-colors duration-200"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#F7F6F2',
                }}
                aria-hidden="true"
              >
                {step.step}
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <h3
                  style={{
                    fontSize: '17px',
                    fontWeight: 500,
                    letterSpacing: '-0.2px',
                    lineHeight: 1.3,
                    color: '#1a1a1a',
                  }}
                >
                  {step.headline}
                </h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7 }}>{step.body}</p>
              </div>

              {/* Value-prop callout tag (e.g. "No commitment required") */}
              <p style={{ fontSize: '12px', color: '#C85A1E', fontWeight: 500 }}>{step.tag}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
