'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { scrollRevealFade, scrollRevealReduced } from '@/lib/animations';

export default function Testimonial() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="py-12 md:py-[72px] px-5 md:px-12"
      style={{ backgroundColor: 'var(--color-accent)' }}
    >
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          {...(prefersReducedMotion ? scrollRevealReduced() : scrollRevealFade())}
          className="flex flex-col gap-6"
          style={{ maxWidth: '720px' }}
        >
          <blockquote style={{ margin: 0, padding: 0 }}>
            <p
              style={{
                fontSize: 'clamp(1.125rem, 2.5vw, 1.35rem)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--color-surface)',
                letterSpacing: '-0.01em',
                margin: 0,
              }}
            >
              &ldquo;We were running a convention and needed a way to manage attendance without the chaos. Andrew built the whole system: QR code check-in and check-out, staff accounts, invite tracking. It was flawless on the day. He delivered fast and gave us everything we needed and then some.&rdquo;
            </p>
          </blockquote>

          <div className="flex items-center gap-3">
            <div
              style={{
                width: '1px',
                height: '28px',
                backgroundColor: 'rgba(255,255,255,0.4)',
                flexShrink: 0,
              }}
              aria-hidden="true"
            />
            <cite style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.85)', fontStyle: 'normal' }}>
              Tony, Church Convention Organizer, Mississauga ON
            </cite>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
