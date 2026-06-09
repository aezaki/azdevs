'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { IconMenu2, IconX } from '@tabler/icons-react';
import { CALENDLY_URL, NAV_LINKS } from '@/lib/constants';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(247,246,242,0.97)' : 'transparent',
        boxShadow: scrolled ? '0 1px 0 #dedad2' : 'none',
      }}
    >
      <div
        style={{ maxWidth: '1200px' }}
        className="mx-auto px-6 flex items-center justify-between h-[60px]"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-0 font-medium"
          style={{ letterSpacing: '2px', fontSize: '16px', textDecoration: 'none' }}
          aria-label="AZDEVS home"
        >
          <span style={{ color: '#1a1a1a' }}>AZ</span>
          <span style={{ color: '#C85A1E' }}>DEVS</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-[13px] transition-colors duration-200 cursor-pointer bg-transparent border-0 p-0"
              style={{ color: '#444' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#C85A1E')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#444')}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center text-[14px] font-medium transition-colors duration-200"
          style={{
            backgroundColor: '#1a1a1a',
            color: '#F7F6F2',
            padding: '9px 20px',
            borderRadius: '8px',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = '#C85A1E')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = '#1a1a1a')
          }
        >
          Book a call
        </a>

        {/* Mobile: book + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <a
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
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#C85A1E')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = '#1a1a1a')
            }
          >
            Book a call
          </a>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex items-center justify-center w-[44px] h-[44px]"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <IconX size={20} style={{ color: '#1a1a1a' }} />
            ) : (
              <IconMenu2 size={20} style={{ color: '#1a1a1a' }} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
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
