/**
 * @file components/Services.tsx
 * @description Dark-background services list section. Renders the four AZDEVS
 *              service offerings as a bordered, stacked list with name, price,
 *              and description (description hidden on mobile to keep rows scannable).
 *
 * @section Services (id="services")
 * @dependencies framer-motion, @tabler/icons-react, lib/animations, lib/constants
 *
 * @notes ServiceRow is extracted as a component so each row has its own hover
 *        state — this drives the x:4 content lean, service-name colour shift,
 *        and arrow x+scale. ServiceRow also tracks the parent's hoveredIndex
 *        to fade dividers when an adjacent row is active.
 *
 *        useReducedMotion: spatial hover animations are disabled; colour
 *        transitions still apply as they're handled by inline style state.
 */

'use client';

import { useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { IconArrowRight } from '@tabler/icons-react';
import { SERVICES } from '@/lib/constants';
import { ease, smoothScrollTo } from '@/lib/animations';

// ─── Sub-components ────────────────────────────────────────────────────────────

interface ServiceRowProps {
  service: (typeof SERVICES)[number];
  index: number;
  total: number;
  hoveredIndex: number | null;
  onHoverStart: (i: number) => void;
  onHoverEnd: () => void;
  delay: number;
  onClick: () => void;
}

function ServiceRow({
  service,
  index,
  total,
  hoveredIndex,
  onHoverStart,
  onHoverEnd,
  delay,
  onClick,
}: ServiceRowProps) {
  const prefersReducedMotion = useReducedMotion();
  const hovered = hoveredIndex === index;
  const [focused, setFocused] = useState(false);

  const dividerOpacity = hoveredIndex !== null && !hovered ? 0.15 : 0.4;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4, ease, delay }}
      className="relative"
      role="button"
      tabIndex={0}
      aria-label={`${service.name}: scroll to contact form`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        backgroundColor: hovered ? 'var(--color-dark-card-hover)' : 'var(--color-dark-card)',
        borderBottom:
          index < total - 1
            ? `0.5px solid rgba(46,46,46,${dividerOpacity})`
            : 'none',
        outline: focused ? '2px solid var(--color-accent-mid)' : 'none',
        outlineOffset: '-1px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
      }}
      onHoverStart={() => onHoverStart(index)}
      onHoverEnd={onHoverEnd}
    >
      {/* Row content leans forward x:4 on hover */}
      <motion.div
        animate={prefersReducedMotion ? {} : { x: hovered ? 4 : 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="grid items-center gap-3 px-5 md:px-7 py-4 md:py-5"
        style={{ gridTemplateColumns: '1fr auto' }}
      >
        {/* Name, typicalFor, price, and (desktop-only) description */}
        <div className="flex flex-col gap-1 min-w-0">
          <span
            className="font-medium transition-colors duration-200"
            style={{
              fontSize: '14px',
              letterSpacing: '-0.01em',
              color: 'var(--color-bg)',
            }}
          >
            {service.name}
          </span>
          <span
            className="transition-colors duration-200"
            style={{ fontSize: '12px', color: 'var(--color-dim)' }}
          >
            {service.typicalFor}
          </span>
          <span
            className="transition-colors duration-200"
            style={{ fontSize: '13px', color: 'var(--color-dim)', marginTop: '2px' }}
          >
            {service.price}
          </span>
          <p
            className="line-clamp-2 md:line-clamp-none mt-1"
            style={{ fontSize: '13px', color: 'var(--color-dim)', lineHeight: 1.6 }}
          >
            {service.description}
          </p>
        </div>

        {/* Arrow — nudges an extra 4px relative to the row (total x:8) and scales up */}
        <motion.div
          animate={
            prefersReducedMotion
              ? {}
              : {
                  x: hovered ? 4 : 0,
                  scale: hovered ? 1.2 : 1,
                }
          }
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex items-center justify-center flex-shrink-0"
          aria-hidden="true"
        >
          <IconArrowRight
            size={18}
            style={{ color: hovered ? 'var(--color-accent)' : 'var(--color-subtle)', transition: 'color 0.2s' }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────────

export default function Services() {
  const prefersReducedMotion = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const scrollToContact = useCallback(() => {
    smoothScrollTo('#contact');
  }, []);

  return (
    <section
      id="services"
      className="py-12 md:py-[72px] px-5 md:px-12"
      style={{ backgroundColor: 'var(--color-dark)' }}
    >
      <div className="mx-auto max-w-[1200px]">

        {/* Section header — faster, tighter rise to match the section's assertive character */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: prefersReducedMotion ? 0.4 : 0.45, ease }}
          className="mb-8 md:mb-10"
        >
          <h2
            style={{
              fontSize: 'var(--type-section-heading)',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              color: 'var(--color-bg)',
            }}
          >
            Four ways we can help.
          </h2>
        </motion.div>

        {/* Container animates in as a whole, then each row staggers */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: prefersReducedMotion ? 0.4 : 0.45, ease, delay: 0.1 }}
          style={{
            border: '0.5px solid var(--color-border-dark)',
            borderRadius: 'var(--radius-card)',
            overflow: 'hidden',
          }}
        >
          {SERVICES.map((service, i) => (
            <ServiceRow
              key={service.name}
              service={service}
              index={i}
              total={SERVICES.length}
              hoveredIndex={hoveredIndex}
              onHoverStart={(idx) => setHoveredIndex(idx)}
              onHoverEnd={() => setHoveredIndex(null)}
              delay={0.15 + i * 0.07}
              onClick={scrollToContact}
            />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
