'use client';

import { NAV_LINKS, CONTACT_EMAIL, LOCATION, COMPANY_NAME } from '@/lib/constants';

export default function Footer() {
  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      className="py-14 px-5 md:px-12"
      style={{ backgroundColor: '#111111' }}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Three-column grid on md+, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-10 mb-10">
          {/* Left */}
          <div className="flex flex-col gap-3">
            <div
              className="flex items-center gap-0"
              style={{ letterSpacing: '2px', fontSize: '16px', fontWeight: 500 }}
              aria-label="AZDEVS"
            >
              <span style={{ color: '#F7F6F2' }}>AZ</span>
              <span style={{ color: '#C85A1E' }}>DEVS</span>
            </div>
            <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.6, maxWidth: '240px' }}>
              Good software for small businesses and startups in the GTA.
            </p>
          </div>

          {/* Centre */}
          <div className="flex flex-col gap-3">
            <p
              className="uppercase"
              style={{ fontSize: '11px', letterSpacing: '2px', color: '#444', marginBottom: '4px' }}
            >
              Navigation
            </p>
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-left text-[13px] transition-colors duration-200 cursor-pointer bg-transparent border-0 p-0 w-fit min-h-[44px] md:min-h-0"
                style={{ color: '#555' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#C85A1E')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#555')}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right */}
          <div className="flex flex-col gap-3">
            <p
              className="uppercase"
              style={{ fontSize: '11px', letterSpacing: '2px', color: '#444', marginBottom: '4px' }}
            >
              Contact
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[13px] transition-colors duration-200"
              style={{ color: '#555' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#C85A1E')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#555')}
            >
              {CONTACT_EMAIL}
            </a>
            <p style={{ fontSize: '13px', color: '#555' }}>{LOCATION}</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '0.5px solid #222', paddingTop: '20px' }}>
          <p style={{ fontSize: '12px', color: '#444' }}>
            &copy; 2026 {COMPANY_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
