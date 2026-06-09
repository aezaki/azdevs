/**
 * @file components/HowItWorks.tsx
 * @description Three-step process section that explains the AZDEVS engagement
 *              model: call → scoping → delivery. Each card stagger-reveals on
 *              scroll and shows a numbered badge, headline, body, and value-prop tag.
 *
 * @section How it works (id="how-it-works")
 * @dependencies framer-motion, lib/animations, lib/constants
 *
 * @notes StepCard is extracted so each card owns its hover state. whileHover
 *        handles the y:-4 lift (higher priority than whileInView, so it correctly
 *        overrides after scroll reveal completes). The badge rotation uses
 *        animate driven by hovered state — duration:0 on the return trip so it
 *        snaps back instantly rather than spinning the wrong direction.
 *
 *        Connecting lines between cards are 1px rules at md+ only — they sit at
 *        the vertical centre of the step badges (absolute positioned in the grid).
 *
 *        useReducedMotion: all spatial animations disabled.
 */

'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HOW_IT_WORKS_STEPS } from '@/lib/constants';
import { scrollReveal, ease } from '@/lib/animations';

// ─── Sub-components ────────────────────────────────────────────────────────────

interface StepCardProps {
  step: (typeof HOW_IT_WORKS_STEPS)[number];
  delay: number;
}

function StepCard({ step, delay }: StepCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease, delay }}
      // whileHover has higher priority than whileInView — correct lift behaviour
      whileHover={prefersReducedMotion ? undefined : { y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
      className="flex flex-col gap-4 cursor-default"
      style={{
        backgroundColor: hovered ? '#fff' : '#F7F6F2',
        border: `0.5px solid ${hovered ? '#C85A1E' : '#dedad2'}`,
        borderRadius: '12px',
        padding: '28px',
        transition: 'border-color 0.2s, background-color 0.2s',
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/*
       * Badge rotates 360deg on hover (300ms easeOut) then snaps back to 0
       * instantly on mouse leave (duration:0) — no backwards spin.
       */}
      <motion.div
        animate={{ rotate: hovered ? 360 : 0 }}
        transition={{ rotate: { duration: hovered ? 0.3 : 0, ease: 'easeOut' } }}
        style={{ display: 'inline-flex', alignSelf: 'flex-start' }}
      >
        <div
          className="flex items-center justify-center flex-shrink-0 transition-colors duration-200"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            fontSize: '12px',
            fontWeight: 500,
            color: '#F7F6F2',
            backgroundColor: hovered ? '#C85A1E' : '#1a1a1a',
          }}
          aria-hidden="true"
        >
          {step.step}
        </div>
      </motion.div>

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
        <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.8 }}>{step.body}</p>
      </div>

      {/* Value-prop tag slides right x:4 on hover */}
      <motion.p
        animate={prefersReducedMotion ? {} : { x: hovered ? 4 : 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{ fontSize: '12px', color: '#C85A1E', fontWeight: 500 }}
      >
        {step.tag}
      </motion.p>
    </motion.div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────────

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
            style={{ fontSize: '11px', letterSpacing: '2.5px', color: '#aaaaaa' }}
          >
            How it works
          </p>
          <h2
            style={{
              fontSize: 'clamp(28px, 3vw, 38px)',
              fontWeight: 500,
              letterSpacing: '-1.2px',
              lineHeight: 1.2,
              color: '#1a1a1a',
            }}
          >
            Simple from start to finish.
          </h2>
        </motion.div>

        {/* Cards — stagger 0.1s each, connecting lines between badges at md+ */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <StepCard key={step.step} step={step} delay={i * 0.1} />
          ))}

          {/* Subtle connector lines between step badges — desktop only, decorative */}
          <div
            className="hidden md:block absolute left-0 right-0 pointer-events-none"
            style={{ top: '42px' }}
            aria-hidden="true"
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 'calc(33.33% + 14px)',
                width: 'calc(33.33% - 28px)',
                height: '1px',
                backgroundColor: '#dedad2',
                opacity: 0.4,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 'calc(66.66% + 14px)',
                width: 'calc(33.33% - 28px)',
                height: '1px',
                backgroundColor: '#dedad2',
                opacity: 0.4,
              }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
