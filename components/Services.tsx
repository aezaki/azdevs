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

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { IconArrowRight } from '@tabler/icons-react';
import { SERVICES } from '@/lib/constants';
import { scrollReveal, ease } from '@/lib/animations';

// ─── Sub-components ────────────────────────────────────────────────────────────

interface ServiceRowProps {
  service: (typeof SERVICES)[number];
  index: number;
  total: number;
  hoveredIndex: number | null;
  onHoverStart: (i: number) => void;
  onHoverEnd: () => void;
  delay: number;
}

function ServiceRow({
  service,
  index,
  total,
  hoveredIndex,
  onHoverStart,
  onHoverEnd,
  delay,
}: ServiceRowProps) {
  const prefersReducedMotion = useReducedMotion();
  const hovered = hoveredIndex === index;

  // Divider recedes when a different row is hovered
  const dividerOpacity =
    hoveredIndex !== null && !hovered ? 0.15 : 0.4;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4, ease, delay }}
      className="relative"
      style={{
        backgroundColor: hovered ? '#2a2a2a' : '#222222',
        borderBottom:
          index < total - 1
            ? `0.5px solid rgba(46,46,46,${dividerOpacity})`
            : 'none',
        // Left accent border — appears on hover
        borderLeft: `2px solid ${hovered ? '#C85A1E' : 'transparent'}`,
        transition: 'background-color 0.2s, border-color 0.15s',
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
        {/* Name, price, and (desktop-only) description */}
        <div className="flex flex-col gap-1 min-w-0">
          <span
            className="uppercase font-medium transition-colors duration-200"
            style={{
              fontSize: '13px',
              letterSpacing: '0.5px',
              color: hovered ? '#F7F6F2' : '#C85A1E',
            }}
          >
            {service.name}
          </span>
          <span
            className="transition-colors duration-200"
            style={{ fontSize: '12px', color: hovered ? '#aaaaaa' : '#555' }}
          >
            {service.price}
          </span>
          <p
            className="hidden md:block mt-1"
            style={{ fontSize: '14px', color: '#999', lineHeight: 1.6 }}
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
            style={{ color: hovered ? '#C85A1E' : '#666', transition: 'color 0.2s' }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────────

export default function Services() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      id="services"
      className="py-12 md:py-[72px] px-5 md:px-12"
      style={{ backgroundColor: '#1a1a1a' }}
    >
      <div className="mx-auto max-w-[1200px]">

        {/* Section header */}
        <motion.div {...scrollReveal()} className="mb-8 md:mb-10">
          <p
            className="uppercase mb-3"
            style={{ fontSize: '11px', letterSpacing: '2.5px', color: '#555' }}
          >
            What we do
          </p>
          <h2
            style={{
              fontSize: 'clamp(28px, 3vw, 38px)',
              fontWeight: 500,
              letterSpacing: '-1.2px',
              lineHeight: 1.2,
              color: '#F7F6F2',
            }}
          >
            Four ways we can help.
          </h2>
        </motion.div>

        {/* Container animates in as a whole, then each row staggers */}
        <motion.div
          {...scrollReveal(0.1)}
          style={{
            border: '0.5px solid #2e2e2e',
            borderRadius: '12px',
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
            />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
