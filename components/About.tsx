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
 *        The eyebrow decorative rule animates scaleX from 0→1 with transformOrigin
 *        'left' so it draws left-to-right — uses scaleX (GPU-composited) not width.
 *
 *        useReducedMotion: all spatial animations (scale, y) disabled.
 */

'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { IconBrandLinkedin, IconBrandGithub, IconWorld } from '@tabler/icons-react';
import { FOUNDER_NAME, LINKEDIN_URL, GITHUB_URL, PORTFOLIO_URL } from '@/lib/constants';
import { scrollReveal, ease } from '@/lib/animations';

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
        border: '0.5px solid #f0c4a8',
        color: '#C85A1E',
        padding: '5px 12px',
        borderRadius: '20px',
        backgroundColor: hovered ? '#FDF0E8' : 'transparent',
        transition: 'background-color 0.15s',
      }}
      whileHover={prefersReducedMotion ? undefined : { y: -2, transition: { duration: 0.15, type: 'spring', stiffness: 300, damping: 25 } }}
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
      style={{ backgroundColor: '#F7F6F2' }}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Both columns wrapped in a single motion.div so they enter simultaneously */}
        <motion.div
          {...scrollReveal()}
          className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-10 md:gap-16 items-start"
        >
          {/* ── Left column: avatar + social links ── */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              {/* Avatar — springs in from scale:0.85 so it materialises with weight */}
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
                className="flex items-center justify-center flex-shrink-0 cursor-default"
                style={{
                  width: '72px',
                  height: '72px',
                  backgroundColor: '#1a1a1a',
                  borderRadius: '50%',
                  fontSize: '20px',
                  fontWeight: 500,
                  color: '#F7F6F2',
                  letterSpacing: '1px',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.boxShadow =
                    '0 8px 24px rgba(0,0,0,0.18)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.boxShadow = 'none')
                }
                aria-hidden="true"
              >
                AZ
              </motion.div>

              <div>
                <p style={{ fontSize: '15px', fontWeight: 500, color: '#1a1a1a' }}>
                  {FOUNDER_NAME}
                </p>
                <p style={{ fontSize: '13px', color: '#888' }}>Founder, AZDEVS</p>
              </div>
            </div>

            {/* Social link chips — each lifts y:-2 on hover */}
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <SocialPill key={link.label} {...link} />
              ))}
            </div>
          </div>

          {/* ── Right column: founder story ── */}
          <div className="flex flex-col gap-5">
            <div>
              {/* Decorative rule draws left-to-right using scaleX (GPU-composited) */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, ease, delay: 0.1 }}
                style={{
                  width: '40px',
                  height: '1px',
                  backgroundColor: '#dedad2',
                  transformOrigin: 'left',
                  marginBottom: '12px',
                }}
              />
              <p
                className="uppercase mb-3"
                style={{ fontSize: '11px', letterSpacing: '2.5px', color: '#aaaaaa' }}
              >
                About us
              </p>
              <h2
                style={{
                  fontSize: 'clamp(28px, 3vw, 38px)',
                  fontWeight: 500,
                  letterSpacing: '-1.5px',
                  lineHeight: 1.1,
                  color: '#1a1a1a',
                }}
              >
                Built by a developer who got tired of watching small businesses get overcharged.
              </h2>
            </div>
            <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.8 }}>
              Most agencies quote $15,000 for a website that should cost $2,000. We started AZDEVS
              because good software shouldn&apos;t be out of reach for a small business or a
              first-time founder.
            </p>
            <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.8 }}>
              We&apos;re a small, focused team based in Toronto. We work with a limited number of
              clients at a time so every project gets the attention it deserves.
            </p>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
