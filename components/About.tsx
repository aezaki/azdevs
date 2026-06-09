'use client';

import { motion } from 'framer-motion';
import { IconBrandLinkedin, IconBrandGithub, IconWorld } from '@tabler/icons-react';
import { FOUNDER_NAME, LINKEDIN_URL, GITHUB_URL, PORTFOLIO_URL } from '@/lib/constants';
import { scrollReveal } from '@/lib/animations';

const socialLinks = [
  { label: 'LinkedIn', href: LINKEDIN_URL, icon: IconBrandLinkedin },
  { label: 'GitHub', href: GITHUB_URL, icon: IconBrandGithub },
  { label: 'andrewzaki.ca', href: PORTFOLIO_URL, icon: IconWorld },
];

export default function About() {
  return (
    <section
      id="about"
      className="py-12 md:py-[72px] px-5 md:px-12"
      style={{ backgroundColor: '#F7F6F2' }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-10 md:gap-16 items-start">
          {/* Left column */}
          <motion.div
            {...scrollReveal()}
            className="flex flex-col gap-5 items-start"
          >
            {/* Avatar */}
            <div
              className="flex items-center justify-center flex-shrink-0"
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
              aria-hidden="true"
            >
              AZ
            </div>

            <div>
              <p style={{ fontSize: '15px', fontWeight: 500, color: '#1a1a1a' }}>
                {FOUNDER_NAME}
              </p>
              <p style={{ fontSize: '13px', color: '#888' }}>Founder, AZDEVS</p>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap gap-2">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] transition-colors duration-200"
                  style={{
                    border: '0.5px solid #f0c4a8',
                    color: '#C85A1E',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    backgroundColor: 'transparent',
                    minHeight: '44px',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#FDF0E8')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  <Icon size={14} />
                  {label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right column */}
          <motion.div
            {...scrollReveal(0.1)}
            className="flex flex-col gap-5"
          >
            <div>
              <p
                className="uppercase mb-3"
                style={{ fontSize: '11px', letterSpacing: '2px', color: '#aaaaaa' }}
              >
                About us
              </p>
              <h2
                style={{
                  fontSize: 'clamp(28px, 3vw, 38px)',
                  fontWeight: 500,
                  letterSpacing: '-1px',
                  lineHeight: 1.2,
                  color: '#1a1a1a',
                }}
              >
                Built by a developer who got tired of watching small businesses get overcharged.
              </h2>
            </div>
            <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.75 }}>
              Most agencies quote $15,000 for a website that should cost $2,000. We started AZDEVS
              because good software shouldn&apos;t be out of reach for a small business or a
              first-time founder.
            </p>
            <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.75 }}>
              We&apos;re a small, focused team based in Toronto. We work with a limited number of
              clients at a time so every project gets the attention it deserves.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
