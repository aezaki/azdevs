'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CALENDLY_URL, NAV_LINKS } from '@/lib/constants';
import { tapPress, smoothScrollTo } from '@/lib/animations';

// ─── Sub-components ────────────────────────────────────────────────────────────

/** Three-line hamburger that morphs into an X via individual line transforms */
function HamburgerIcon({ open, scrolled }: { open: boolean; scrolled: boolean }) {
  const lineColor = scrolled ? 'var(--color-dark)' : 'var(--color-bg)';
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
          backgroundColor: lineColor,
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
          backgroundColor: lineColor,
        }}
      />
      <motion.span
        animate={open ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.22 }}
        style={{
          display: 'block',
          width: '18px',
          height: '1.5px',
          backgroundColor: lineColor,
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

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
    smoothScrollTo(href);
  }, []);

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'var(--color-nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(8px)' : 'none',
        boxShadow: scrolled ? '0 1px 0 var(--color-border)' : 'none',
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
          whileHover={{ opacity: 0.75 }}
          transition={{ duration: 0.2 }}
        >
          <span style={{ color: scrolled ? 'var(--color-dark)' : 'var(--color-bg)' }}>AZ</span>
          <span style={{ color: 'var(--color-accent)' }}>DEVS</span>
        </motion.a>

        {/* ── Desktop: nav links + CTA grouped on the right ── */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-7" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              const restColor = isActive
                ? (scrolled ? 'var(--color-dark)' : 'var(--color-bg)')
                : (scrolled ? 'var(--color-ink-light)' : 'rgba(247,246,242,0.65)');
              return (
                <motion.button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-[13px] cursor-pointer bg-transparent border-0 p-0"
                  style={{ color: restColor }}
                  whileHover={{ y: -1, transition: { duration: 0.15 } }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = scrolled ? 'var(--color-accent-text)' : 'var(--color-bg)')
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.color = restColor)}
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
              backgroundColor: scrolled ? 'var(--color-dark)' : 'transparent',
              color: 'var(--color-bg)',
              border: scrolled ? 'none' : '1px solid rgba(247,246,242,0.45)',
              padding: '9px 20px',
              borderRadius: '8px',
            }}
            whileTap={tapPress}
            onMouseEnter={(e) => {
              if (scrolled) {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-text)';
              } else {
                e.currentTarget.style.backgroundColor = 'rgba(247,246,242,0.10)';
              }
            }}
            onMouseLeave={(e) => {
              if (scrolled) {
                e.currentTarget.style.backgroundColor = 'var(--color-dark)';
              } else {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
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
              backgroundColor: scrolled ? 'var(--color-dark)' : 'transparent',
              color: 'var(--color-bg)',
              border: scrolled ? 'none' : '1px solid rgba(247,246,242,0.45)',
              padding: '8px 14px',
              borderRadius: '8px',
              minHeight: '44px',
            }}
            whileTap={tapPress}
            onMouseEnter={(e) => {
              if (scrolled) {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-text)';
              } else {
                e.currentTarget.style.backgroundColor = 'rgba(247,246,242,0.10)';
              }
            }}
            onMouseLeave={(e) => {
              if (scrolled) {
                e.currentTarget.style.backgroundColor = 'var(--color-dark)';
              } else {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
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
            <HamburgerIcon open={mobileOpen} scrolled={scrolled} />
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
              backgroundColor: 'var(--color-nav-bg-mobile)',
              borderColor: 'var(--color-border)',
            }}
          >
            <nav className="flex flex-col px-6 py-4 gap-1" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left text-[14px] py-3 border-b cursor-pointer bg-transparent border-x-0 border-t-0 w-full"
                  style={{ color: 'var(--color-ink-light)', borderBottomColor: 'var(--color-border-warm)' }}
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
