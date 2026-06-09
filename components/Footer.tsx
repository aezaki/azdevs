/**
 * @file components/Footer.tsx
 * @description Site footer with a three-column grid: brand blurb, navigation
 *              links (smooth-scroll), and contact details. Bottom bar shows
 *              copyright.
 *
 * @section Footer (below main)
 * @dependencies framer-motion, lib/constants
 *
 * @notes handleNavClick is memoised with useCallback to avoid re-creation on
 *        every render. It mirrors the same scroll utility used in Nav.tsx; if
 *        this pattern is needed in more places, extract it to a shared hook.
 *
 *        Nav links lift y:-2 on hover using whileHover — spring physics so the
 *        lift feels snappy rather than linear.
 *
 *        The "DEVS" span in the footer logo briefly intensifies (brightness:1.2)
 *        on hover then settles — a subtle reward for noticing the brand mark.
 *
 *        The footer fades in as it enters the viewport (opacity only, no spatial
 *        movement — understated presence, not a performance).
 */

'use client';

import { useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { NAV_LINKS, CONTACT_EMAIL, LOCATION, COMPANY_NAME } from '@/lib/constants';

export default function Footer() {
  const prefersReducedMotion = useReducedMotion();
  const [logoHovered, setLogoHovered] = useState(false);

  const handleNavClick = useCallback((href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4 }}
      className="py-14 px-5 md:px-12"
      style={{ backgroundColor: '#111111' }}
    >
      <div className="mx-auto max-w-[1200px]">

        {/* Three-column grid on md+, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-10 mb-10">

          {/* ── Brand column ── */}
          <div className="flex flex-col gap-3">
            <div
              className="flex items-center gap-0 cursor-default"
              style={{ letterSpacing: '2px', fontSize: '16px', fontWeight: 500 }}
              aria-label="AZDEVS"
              onMouseEnter={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
            >
              <span style={{ color: '#F7F6F2' }}>AZ</span>
              <motion.span
                animate={
                  prefersReducedMotion
                    ? {}
                    : { filter: logoHovered ? 'brightness(1.2)' : 'brightness(1)' }
                }
                transition={{ duration: 0.3 }}
                style={{ color: '#C85A1E' }}
              >
                DEVS
              </motion.span>
            </div>
            <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.6, maxWidth: '240px' }}>
              Good software for small businesses and startups in the GTA.
            </p>
          </div>

          {/* ── Navigation column ── */}
          <div className="flex flex-col gap-3">
            <p
              className="uppercase"
              style={{ fontSize: '11px', letterSpacing: '2.5px', color: '#444', marginBottom: '4px' }}
            >
              Navigation
            </p>
            {NAV_LINKS.map((link) => (
              <motion.button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-left text-[13px] cursor-pointer bg-transparent border-0 p-0 w-fit min-h-[44px] md:min-h-0"
                style={{ color: '#555' }}
                whileHover={
                  prefersReducedMotion
                    ? { color: '#C85A1E' }
                    : { y: -2, color: '#C85A1E', transition: { duration: 0.15, type: 'spring', stiffness: 300, damping: 25 } }
                }
              >
                {link.label}
              </motion.button>
            ))}
          </div>

          {/* ── Contact column ── */}
          <div className="flex flex-col gap-3">
            <p
              className="uppercase"
              style={{ fontSize: '11px', letterSpacing: '2.5px', color: '#444', marginBottom: '4px' }}
            >
              Contact
            </p>
            <motion.a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[13px] transition-colors duration-200"
              style={{ color: '#555' }}
              whileHover={
                prefersReducedMotion
                  ? { color: '#C85A1E' }
                  : { y: -2, color: '#C85A1E', transition: { duration: 0.15, type: 'spring', stiffness: 300, damping: 25 } }
              }
            >
              {CONTACT_EMAIL}
            </motion.a>
            <p style={{ fontSize: '13px', color: '#555' }}>{LOCATION}</p>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '0.5px solid #2a2a2a', paddingTop: '20px' }}>
          <p style={{ fontSize: '11px', color: '#3a3a3a' }}>
            &copy; 2026 {COMPANY_NAME}. All rights reserved.
          </p>
        </div>

      </div>
    </motion.footer>
  );
}
