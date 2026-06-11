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
import { scrollReveal, scrollRevealReduced, ease, smoothScrollTo } from '@/lib/animations';

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

  // Featured card uses dark (hero-matching) treatment so it reads as weighted, not just wide
  const cardBg = featured
    ? (hovered ? 'var(--color-dark-card-hover)' : 'var(--color-dark)')
    : (hovered ? 'var(--color-surface)' : 'var(--color-bg)');
  const cardBorder = hovered
    ? 'var(--color-accent)'
    : (featured ? 'var(--color-border-dark)' : 'var(--color-border-warm)');
  const iconBg = featured ? 'var(--color-accent)' : (hovered ? 'var(--color-accent)' : 'var(--color-dark)');
  const headlineColor = featured ? 'var(--color-bg)' : 'var(--color-dark)';
  const bodyColor = featured ? 'rgba(247,246,242,0.65)' : 'var(--color-muted)';
  const ctaColor = featured ? 'rgba(247,246,242,0.80)' : 'var(--color-accent-text)';
  // Featured dark card: raise rest opacity to 0.75 so effective contrast (0.80*0.75=0.60 alpha) = 6.58:1
  const ctaRestOpacity = featured ? 0.75 : 0.55;

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
        backgroundColor: cardBg,
        border: `0.5px solid ${cardBorder}`,
        borderRadius: 'var(--radius-card)',
        padding: '32px 28px',
        transition: 'background-color 0.2s, border-color 0.2s',
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/*
       * Icon container rotates 2deg on hover — barely perceptible but gives the
       * icon a sense of presence. Featured card: icon is always terracotta (dark
       * bg makes the dark default invisible), non-featured: terracotta on hover only.
       */}
      <motion.div
        animate={prefersReducedMotion ? {} : { rotate: hovered ? 2 : 0 }}
        transition={{ duration: 0.15 }}
        style={{ display: 'inline-flex' }}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white transition-colors duration-200"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={20} />
        </div>
      </motion.div>

      <div className="flex flex-col gap-2 flex-1">
        <h3
          style={{
            fontSize: featured ? '22px' : '17px',
            fontWeight: 600,
            letterSpacing: featured ? '-0.02em' : '-0.015em',
            lineHeight: 1.3,
            color: headlineColor,
          }}
        >
          {headline}
        </h3>
        <p style={{ fontSize: '15px', color: bodyColor, lineHeight: 1.8 }}>{body}</p>
        {bodyExtra && (
          <p style={{ fontSize: '15px', color: bodyColor, lineHeight: 1.8 }}>{bodyExtra}</p>
        )}
      </div>

      {/* CTA hint — scrolls to contact; opacity driven by hover state */}
      {cta && (
        <button
          onClick={() => smoothScrollTo('#contact')}
          className="flex items-center gap-1 mt-auto bg-transparent border-0 p-0 cursor-pointer"
          aria-label="Get in touch about this"
        >
          <span
            className="transition-opacity duration-200"
            style={{
              color: ctaColor,
              opacity: hovered ? 1 : ctaRestOpacity,
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            {cta.replace(/\s*→$/, '')}
          </span>
          <motion.span
            animate={prefersReducedMotion ? {} : { x: hovered ? 4 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              color: ctaColor,
              opacity: hovered ? 1 : ctaRestOpacity,
              fontSize: '14px',
              fontWeight: 500,
              transition: 'opacity 0.2s',
            }}
          >
            →
          </motion.span>
        </button>
      )}
    </motion.div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────────

export default function Problems() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="py-12 md:py-[72px] px-5 md:px-12"
      style={{ backgroundColor: 'var(--color-surface)' }}
      id="problems"
    >
      <div className="mx-auto max-w-[1200px]">

        {/* Section header — y:24 reveal, fires first */}
        <motion.div
          {...(prefersReducedMotion ? scrollRevealReduced() : scrollReveal())}
          className="mb-10 md:mb-12"
          style={{ maxWidth: '560px' }}
        >
          <h2
            className="mb-3"
            style={{
              fontSize: 'var(--type-section-heading)',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              color: 'var(--color-dark)',
            }}
          >
            Three problems we fix every week.
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--color-muted)', lineHeight: 1.8 }}>
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
              body="It was built years ago, looks rough on mobile, and you cringe a little every time you hand out your business card. A bad website doesn't just look unprofessional: it's actively costing you customers."
              bodyExtra="Whether you need a full redesign or just want something that actually works on mobile, we scope it to what makes sense for your budget and get it done."
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
