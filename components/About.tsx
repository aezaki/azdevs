/**
 * @file components/About.tsx
 * @description Two-column founder bio section. Left column shows the founder's
 *              avatar, name, title, and social links. Right column carries the
 *              AZDEVS origin story.
 *
 * @section About (id="about")
 * @dependencies framer-motion, @tabler/icons-react, lib/animations, lib/constants
 *
 * @notes socialLinks is defined at module scope because it references only
 *        module-level constants — hoisting avoids re-creation on every render.
 *        min-h-[44px] on social link chips satisfies WCAG 2.5.5 minimum touch
 *        target size (44×44 CSS pixels).
 *
 *        The avatar entrance uses a spring (stiffness:200, damping:20) so it
 *        materialises with slight overshoot rather than a flat fade.
 *
 *        useReducedMotion: all spatial animations (scale, x, y) disabled.
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { IconBrandLinkedin, IconBrandGithub, IconWorld } from '@tabler/icons-react';
import { FOUNDER_NAME, LINKEDIN_URL, GITHUB_URL, PORTFOLIO_URL } from '@/lib/constants';
import { scrollReveal, scrollRevealReduced, springTransition, ease } from '@/lib/animations';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface SocialLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
}

// ─── Static Data ───────────────────────────────────────────────────────────────

const socialLinks: SocialLink[] = [
  { label: 'LinkedIn', href: LINKEDIN_URL, icon: IconBrandLinkedin },
  { label: 'GitHub', href: GITHUB_URL, icon: IconBrandGithub },
  { label: 'andrewzaki.ca', href: PORTFOLIO_URL, icon: IconWorld },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function SocialPill({ label, href, icon: Icon }: SocialLink) {
  const prefersReducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-[13px] min-h-[44px] transition-colors duration-200"
      style={{
        border: '0.5px solid var(--color-accent-border)',
        color: 'var(--color-accent-text)',
        padding: '5px 12px',
        borderRadius: '20px',
        backgroundColor: hovered ? 'var(--color-accent-light)' : 'transparent',
        transition: 'background-color 0.15s',
      }}
      whileHover={prefersReducedMotion ? undefined : { y: -2, transition: springTransition }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.span
        animate={prefersReducedMotion ? {} : { scale: hovered ? 1.1 : 1 }}
        transition={{ duration: 0.15 }}
        style={{ display: 'inline-flex' }}
      >
        <Icon size={14} />
      </motion.span>
      {label}
    </motion.a>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function About() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="about"
      className="py-12 md:py-[72px] px-5 md:px-12"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="mx-auto max-w-[1200px]">

        {/* Section heading — enters from the left: a personal statement, not a category label */}
        <motion.h2
          initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: prefersReducedMotion ? 0.4 : 0.65, ease }}
          style={{
            fontSize: 'var(--type-section-heading)',
            fontWeight: 600,
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            color: 'var(--color-dark)',
            maxWidth: '600px',
            marginBottom: '40px',
          }}
        >
          Built by a developer who got tired of watching small businesses get overcharged.
        </motion.h2>

        {/* Both columns wrapped in a single motion.div so they enter simultaneously */}
        <motion.div
          {...(prefersReducedMotion ? scrollRevealReduced(0.1) : scrollReveal(0.1))}
          className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-10 md:gap-16 items-start"
        >
          {/* ── Left column: avatar + name + social links ── */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              {/* Portrait — springs in from scale:0.85 so it materialises with weight */}
              <motion.div
                initial={{ scale: prefersReducedMotion ? 1 : 0.85, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : { scale: 1.03, transition: { duration: 0.2 } }
                }
                className="flex-shrink-0 cursor-default"
                style={{
                  width: '220px',
                  height: '220px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.boxShadow =
                    '0 12px 32px rgba(0,0,0,0.20)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.boxShadow = 'none')
                }
              >
                <Image
                  src="/andrew.png"
                  alt="Andrew Zaki, founder of AZDEVS"
                  width={220}
                  height={220}
                  style={{ objectFit: 'cover', display: 'block' }}
                />
              </motion.div>

              <div>
                <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-dark)', letterSpacing: '-0.02em' }}>
                  {FOUNDER_NAME}
                </p>
                <p style={{ fontSize: '14px', color: 'var(--color-muted)', marginTop: '2px' }}>Founder, AZDEVS</p>
              </div>
            </div>

            {/* Social link chips — each lifts y:-2 on hover */}
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <SocialPill key={link.label} {...link} />
              ))}
            </div>
          </div>

          {/* ── Right column: body copy only ── */}
          <div className="flex flex-col gap-5">
            <p style={{ fontSize: '16px', color: 'var(--color-muted)', lineHeight: 1.8, maxWidth: '65ch' }}>
              Most agencies quote $15,000 for a website that should cost $2,000. We started AZDEVS
              because good software shouldn&apos;t be out of reach for a small business or a
              first-time founder.
            </p>
            <p style={{ fontSize: '16px', color: 'var(--color-muted)', lineHeight: 1.8, maxWidth: '65ch' }}>
              We&apos;re a small, focused team based in Toronto. We work with a limited number of
              clients at a time so every project gets the attention it deserves.
            </p>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
