/**
 * @file components/Problems.tsx
 * @description "Three problems we fix every week" section. Presents an
 *              asymmetric two-column card grid that surfaces the pain points
 *              AZDEVS solves, validating the visitor's situation before the
 *              services pitch.
 *
 * @section Problems (id="problems")
 * @dependencies framer-motion, @tabler/icons-react, lib/animations
 *
 * @notes ProblemCard tracks hover state locally so it can drive the icon
 *        rotation (2deg), CTA arrow slide (4px), and CTA opacity — all of
 *        which require JS state rather than CSS group-hover because inline
 *        `style` props have higher specificity than Tailwind utilities.
 *
 *        Card entrance is asymmetric: card 01 slides in from x:-20 (left),
 *        cards 02/03 slide in from x:20 (right), matching the two-column grid.
 *
 *        useReducedMotion: spatial animations collapse to opacity-only.
 */

'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { IconDeviceLaptop, IconRefresh, IconBulb } from '@tabler/icons-react';
import { scrollReveal, ease } from '@/lib/animations';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ProblemCardProps {
  icon: React.ComponentType<{ size?: number }>;
  headline: string;
  body: string;
  bodyExtra?: string;
  featured?: boolean;
  cta?: string;
  delay: number;
  xEntrance?: number;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function ProblemCard({
  icon: Icon,
  headline,
  body,
  bodyExtra,
  featured,
  cta,
  delay,
  xEntrance = 0,
}: ProblemCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: prefersReducedMotion ? 0 : xEntrance }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease, delay }}
      whileHover={
        prefersReducedMotion
          ? undefined
          : { y: -3, scale: 1.01, transition: { duration: 0.2, ease: 'easeOut' } }
      }
      className="flex flex-col gap-5 cursor-default h-full"
      style={{
        backgroundColor: '#F7F6F2',
        border: '0.5px solid #eae7e0',
        borderRadius: '12px',
        padding: '32px 28px',
        transition: 'background-color 0.2s, border-color 0.2s',
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = '#fff';
        (e.currentTarget as HTMLElement).style.borderColor = '#C85A1E';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = '#F7F6F2';
        (e.currentTarget as HTMLElement).style.borderColor = '#eae7e0';
      }}
    >
      {/*
       * Icon container: bg-[#1a1a1a] in Tailwind so group-hover can override.
       * The outer motion.div rotates 2deg on card hover — barely perceptible
       * but gives the icon a sense of presence responding to attention.
       */}
      <motion.div
        animate={prefersReducedMotion ? {} : { rotate: hovered ? 2 : 0 }}
        transition={{ duration: 0.15 }}
        style={{ display: 'inline-flex' }}
      >
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white transition-colors duration-200"
          style={{ backgroundColor: hovered ? '#C85A1E' : '#1a1a1a' }}
        >
          <Icon size={20} />
        </div>
      </motion.div>

      <div className="flex flex-col gap-2 flex-1">
        <h3
          style={{
            fontSize: featured ? '22px' : '17px',
            fontWeight: 500,
            letterSpacing: featured ? '-0.4px' : '-0.2px',
            lineHeight: 1.3,
            color: '#1a1a1a',
          }}
        >
          {headline}
        </h3>
        <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.8 }}>{body}</p>
        {bodyExtra && (
          <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.8 }}>{bodyExtra}</p>
        )}
      </div>

      {/* CTA hint — opacity driven by hover state (inline style > Tailwind specificity) */}
      {cta && (
        <div className="flex items-center gap-1 mt-auto">
          <p
            className="text-sm transition-opacity duration-200"
            style={{
              color: '#C85A1E',
              opacity: hovered ? 1 : 0.45,
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            {cta.replace(/\s*→$/, '')}
          </p>
          <motion.span
            animate={prefersReducedMotion ? {} : { x: hovered ? 4 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              color: '#C85A1E',
              opacity: hovered ? 1 : 0.45,
              fontSize: '14px',
              fontWeight: 500,
              transition: 'opacity 0.2s',
            }}
          >
            →
          </motion.span>
        </div>
      )}
    </motion.div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────────

export default function Problems() {
  return (
    <section
      className="py-12 md:py-[72px] px-5 md:px-12"
      style={{ backgroundColor: '#FFFFFF' }}
      id="problems"
    >
      <div className="mx-auto max-w-[1200px]">

        {/* Section header — y:24 reveal, fires first */}
        <motion.div
          {...scrollReveal()}
          className="mb-10 md:mb-12"
          style={{ maxWidth: '560px' }}
        >
          <p
            className="uppercase mb-3"
            style={{ fontSize: '11px', letterSpacing: '2.5px', color: '#aaaaaa' }}
          >
            Sound familiar?
          </p>
          <h2
            className="mb-3"
            style={{
              fontSize: 'clamp(28px, 3vw, 38px)',
              fontWeight: 500,
              letterSpacing: '-1.2px',
              lineHeight: 1.2,
              color: '#1a1a1a',
            }}
          >
            Three problems we fix every week.
          </h2>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.8 }}>
            These are the situations we hear most from businesses that reach out to us.
          </p>
        </motion.div>

        {/*
         * Asymmetric grid: Card 01 spans both rows on desktop and enters from
         * the left; cards 02/03 enter from the right with a stagger.
         */}
        <div
          className="grid gap-4 grid-cols-1 md:grid-cols-[1fr_1fr]"
          style={{ gridTemplateRows: 'auto auto' }}
        >
          {/* Card 01 — featured, left-column entrance */}
          <div className="md:[grid-row:1/3]">
            <ProblemCard
              icon={IconDeviceLaptop}
              headline="Your website is embarrassing you"
              body="It was built years ago, looks rough on mobile, and you cringe a little every time you hand out your business card. A bad website doesn't just look unprofessional — it's actively costing you customers."
              bodyExtra="Whether you need a full redesign or just want something that actually works on mobile — we scope it to what makes sense for your budget and get it done."
              featured
              cta="We can fix this →"
              delay={0.1}
              xEntrance={-20}
            />
          </div>

          {/* Card 02 — right-column entrance */}
          <ProblemCard
            icon={IconRefresh}
            headline="You're doing things manually that should be automatic"
            body="Copying data, chasing leads, answering the same questions every week. Hours you don't have."
            delay={0.2}
            xEntrance={20}
          />

          {/* Card 03 — right-column entrance, later stagger */}
          <ProblemCard
            icon={IconBulb}
            headline="You have a software idea and no one to build it"
            body="The concept is solid. You just need a developer who gets it and can ship something real without blowing your budget."
            delay={0.3}
            xEntrance={20}
          />
        </div>

      </div>
    </section>
  );
}
