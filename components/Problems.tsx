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
 * @notes ProblemCard uses onMouseEnter/Leave on the motion.div to update inline
 *        styles because Tailwind group-hover utilities cannot override inline
 *        `style` props (inline styles have higher CSS specificity). The icon
 *        container uses `text-white` so Tabler icons inherit currentColor and
 *        render white — the group-hover bg change then shifts the container
 *        to accent orange while the icon colour stays inherited.
 */

'use client';

import { motion } from 'framer-motion';
import { IconDeviceLaptop, IconRefresh, IconBulb } from '@tabler/icons-react';
import { scrollReveal } from '@/lib/animations';

// ─── Types ─────────────────────────────────────────────────────────────────────

// Typed to the minimum interface AZDEVS icons satisfy, avoiding `React.ElementType`
// which is too broad (accepts strings like "div")
interface ProblemCardProps {
  icon: React.ComponentType<{ size?: number }>;
  headline: string;
  body: string;
  bodyExtra?: string;
  featured?: boolean;
  cta?: string;
  delay: number;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function ProblemCard({ icon: Icon, headline, body, bodyExtra, featured, cta, delay }: ProblemCardProps) {
  return (
    <motion.div
      {...scrollReveal(delay)}
      className="flex flex-col gap-5 group cursor-default h-full"
      style={{
        backgroundColor: '#F7F6F2',
        border: '0.5px solid #eae7e0',
        borderRadius: '12px',
        padding: '32px 28px',
        transition: 'background-color 0.2s, border-color 0.2s',
      }}
      whileHover={{ scale: 1.01 }}
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
       * Icon container: bg-[#1a1a1a] with text-white so the Tabler icon inherits
       * white via currentColor. group-hover:bg-[#C85A1E] shifts the container
       * to accent on card hover. Note: bg must be in Tailwind (not inline style)
       * so group-hover can override it — inline styles have higher specificity.
       */}
      <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-white group-hover:bg-[#C85A1E] transition-colors duration-200">
        <Icon size={20} />
      </div>

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
        <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.7 }}>{body}</p>
        {bodyExtra && (
          <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.7 }}>{bodyExtra}</p>
        )}
      </div>

      {/* Optional call-to-action hint text — appears at full opacity on hover */}
      {cta && (
        <p
          className="text-sm mt-auto transition-opacity duration-200 group-hover:opacity-100"
          style={{ color: '#C85A1E', opacity: 0.45, fontSize: '14px' }}
        >
          {cta}
        </p>
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

        {/* Section header */}
        <motion.div
          {...scrollReveal()}
          className="mb-10 md:mb-12"
          style={{ maxWidth: '560px' }}
        >
          <p
            className="uppercase mb-3"
            style={{ fontSize: '11px', letterSpacing: '2px', color: '#aaaaaa' }}
          >
            Sound familiar?
          </p>
          <h2
            className="mb-3"
            style={{
              fontSize: 'clamp(28px, 3vw, 38px)',
              fontWeight: 500,
              letterSpacing: '-1px',
              lineHeight: 1.2,
              color: '#1a1a1a',
            }}
          >
            Three problems we fix every week.
          </h2>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.75 }}>
            These are the situations we hear most from businesses that reach out to us.
          </p>
        </motion.div>

        {/*
         * Asymmetric grid: Card 01 spans both rows on desktop so it appears
         * taller/featured alongside the two smaller stacked cards.
         */}
        <div
          className="grid gap-4 grid-cols-1 md:grid-cols-[1fr_1fr]"
          style={{ gridTemplateRows: 'auto auto' }}
        >
          {/* Card 01 — featured, spans both rows on desktop */}
          <div className="md:[grid-row:1/3]">
            <ProblemCard
              icon={IconDeviceLaptop}
              headline="Your website is embarrassing you"
              body="It was built years ago, looks rough on mobile, and you cringe a little every time you hand out your business card. A bad website doesn't just look unprofessional — it's actively costing you customers."
              bodyExtra="Whether you need a full redesign or just want something that actually works on mobile — we scope it to what makes sense for your budget and get it done."
              featured
              cta="We can fix this →"
              delay={0.1}
            />
          </div>

          {/* Card 02 */}
          <ProblemCard
            icon={IconRefresh}
            headline="You're doing things manually that should be automatic"
            body="Copying data, chasing leads, answering the same questions every week. Hours you don't have."
            delay={0.2}
          />

          {/* Card 03 */}
          <ProblemCard
            icon={IconBulb}
            headline="You have a software idea and no one to build it"
            body="The concept is solid. You just need a developer who gets it and can ship something real without blowing your budget."
            delay={0.3}
          />
        </div>

      </div>
    </section>
  );
}
