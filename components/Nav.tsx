/**
 * @file components/Nav.tsx
 * @description Sticky top navigation bar with scroll-aware background, desktop
 *              link list, desktop CTA button, and animated mobile dropdown menu.
 *
 * @section Nav (fixed, z-50)
 * @dependencies framer-motion, @tabler/icons-react, next/link
 *
 * @notes The scroll listener uses `{ passive: true }` for performance and is
 *        cleaned up on unmount. handleNavClick is memoised with useCallback to
 *        avoid recreating the function on every render; NAV_LINKS is a static
 *        array so the dependency array is empty.
 *
 *        The hamburger icon is a custom three-line SVG: line 1 and 3 rotate to
 *        form an X, line 2 collapses — no icon swap needed.
 *
 *        IntersectionObserver tracks which section is active so the matching nav
 *        link shifts to #1a1a1a. #hero is observed so the indicator clears when
 *        the user scrolls back to the top (hero has no matching NAV_LINKS entry).
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CALENDLY_URL, NAV_LINKS } from '@/lib/constants';

// ─── Sub-components ────────────────────────────────────────────────────────────

/** Three-line hamburger that morphs into an X via individual line transforms */
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span
      className="flex flex-col justify-center items-center gap-[5px]"
      style={{ width: '18px' }}
      aria-hidden="true"
    >
      <motion.span
        animate={open ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.22 }}
        style={{
          display: 'block',
          width: '18px',
          height: '1.5px',
          backgroundColor: '#1a1a1a',
          transformOrigin: 'center',
        }}
      />
      <motion.span
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.18 }}
        style={{
          display: 'block',
          width: '18px',
          height: '1.5px',
          backgroundColor: '#1a1a1a',
        }}
      />
      <motion.span
        animate={open ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.22 }}
        style={{
          display: 'block',
          width: '18px',
          height: '1.5px',
          backgroundColor: '#1a1a1a',
          transformOrigin: 'center',
        }}
      />
    </span>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function Nav() {
  // ─── State ────────────────────────────────────────────────────────────────────

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // ID of the section currently in view (without leading #); empty string = none
  const [activeSection, setActiveSection] = useState('');

  // ─── Effects ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // #hero is included so the indicator clears when scrolled back to the top
  useEffect(() => {
    const sectionIds = ['hero', ...NAV_LINKS.map((l) => l.href.slice(1))];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { threshold: 0.4 },
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // ─── Handlers ─────────────────────────────────────────────────────────────────

  const handleNavClick = useCallback((href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(247,246,242,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(8px)' : 'none',
        boxShadow: scrolled ? '0 1px 0 #dedad2' : 'none',
      }}
    >
      <div
        style={{ maxWidth: '1200px' }}
        className="mx-auto px-6 flex items-center justify-between h-[60px]"
      >
        {/* ── Logo — letter-spacing expands on hover ── */}
        <motion.a
          href="/"
          className="flex items-center gap-0 font-medium"
          style={{ letterSpacing: '2px', fontSize: '16px', textDecoration: 'none' }}
          aria-label="AZDEVS home"
          whileHover={{ letterSpacing: '3.5px' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <span style={{ color: '#1a1a1a' }}>AZ</span>
          <span style={{ color: '#C85A1E' }}>DEVS</span>
        </motion.a>

        {/* ── Desktop: nav links + CTA grouped on the right ── */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-7" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <motion.button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-[13px] cursor-pointer bg-transparent border-0 p-0"
                  style={{ color: isActive ? '#1a1a1a' : '#444' }}
                  // whileHover handles only the spatial lift — color stays in native events
                  // so the isActive closure value is always fresh on mouseLeave
                  whileHover={{ y: -1, transition: { duration: 0.15 } }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#C85A1E')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = isActive ? '#1a1a1a' : '#444')
                  }
                >
                  {link.label}
                </motion.button>
              );
            })}
          </nav>

          <motion.a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-[14px] font-medium transition-colors duration-200"
            style={{
              backgroundColor: '#1a1a1a',
              color: '#F7F6F2',
              padding: '9px 20px',
              borderRadius: '8px',
            }}
            whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C85A1E')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1a1a1a')}
          >
            Book a call
          </motion.a>
        </div>

        {/* ── Mobile: compact CTA + hamburger toggle ── */}
        <div className="flex md:hidden items-center gap-3">
          <motion.a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-[13px] font-medium transition-colors duration-200"
            style={{
              backgroundColor: '#1a1a1a',
              color: '#F7F6F2',
              padding: '8px 14px',
              borderRadius: '8px',
            }}
            whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C85A1E')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1a1a1a')}
          >
            Book a call
          </motion.a>

          {/* 44×44 px touch target satisfies WCAG 2.5.5 */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex items-center justify-center w-[44px] h-[44px]"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t"
            style={{
              backgroundColor: 'rgba(247,246,242,0.98)',
              borderColor: '#dedad2',
            }}
          >
            <nav className="flex flex-col px-6 py-4 gap-1" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left text-[14px] py-3 border-b cursor-pointer bg-transparent border-x-0 border-t-0 w-full"
                  style={{ color: '#444', borderBottomColor: '#eae7e0' }}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
