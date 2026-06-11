'use client';

import { useCallback } from 'react';
import { motion, useReducedMotion, type TargetAndTransition } from 'framer-motion';
import { NAV_LINKS, CONTACT_EMAIL, LOCATION, COMPANY_NAME, CALENDLY_URL } from '@/lib/constants';
import { springTransition, smoothScrollTo } from '@/lib/animations';

const liftHover = (reduced: boolean): TargetAndTransition =>
  reduced
    ? { color: 'var(--color-bg)' }
    : { y: -2, color: 'var(--color-bg)', transition: springTransition };

export default function Footer() {
  const prefersReducedMotion = useReducedMotion();

  const handleNavClick = useCallback((href: string) => {
    smoothScrollTo(href);
  }, []);

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4 }}
      className="py-14 px-5 md:px-12"
      style={{ backgroundColor: 'var(--color-footer)' }}
    >
      <div className="mx-auto max-w-[1200px]">

        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-10 mb-10">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div
              className="flex items-center gap-0"
              style={{ letterSpacing: '2px', fontSize: '16px', fontWeight: 500 }}
              aria-label="AZDEVS"
            >
              <span style={{ color: 'var(--color-bg)' }}>AZ</span>
              <motion.span
                whileHover={prefersReducedMotion ? {} : { filter: 'brightness(1.25)' }}
                transition={{ duration: 0.25 }}
                style={{ color: 'var(--color-accent)' }}
              >
                DEVS
              </motion.span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-faint)', lineHeight: 1.65, maxWidth: '240px' }}>
              Good software for small businesses and startups in the GTA.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <motion.button
                    onClick={() => handleNavClick(link.href)}
                    className="text-left text-[13px] cursor-pointer bg-transparent border-0 p-0 w-fit min-h-[44px] md:min-h-0"
                    style={{ color: 'var(--color-dim)' }}
                    whileHover={liftHover(!!prefersReducedMotion)}
                  >
                    {link.label}
                  </motion.button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <motion.a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[13px]"
              style={{ color: 'var(--color-dim)' }}
              whileHover={liftHover(!!prefersReducedMotion)}
            >
              {CONTACT_EMAIL}
            </motion.a>
            <p style={{ fontSize: '13px', color: 'var(--color-faint)' }}>{LOCATION}</p>
          </div>

        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderTop: '0.5px solid var(--color-border-dark)', paddingTop: '20px' }}
        >
          <p style={{ fontSize: '11px', color: 'var(--color-subtle)' }}>
            &copy; {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
          </p>
          <motion.a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px]"
            style={{ color: 'var(--color-accent-mid)' }}
            whileHover={
              prefersReducedMotion
                ? {}
                : { x: 3, transition: springTransition }
            }
          >
            Book a free call →
          </motion.a>
        </div>

      </div>
    </motion.footer>
  );
}
