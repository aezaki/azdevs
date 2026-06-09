'use client';

import { motion } from 'framer-motion';
import { CALENDLY_URL, LOCATION } from '@/lib/constants';
import { fadeIn, ease } from '@/lib/animations';

const factRows = [
  { label: 'Avg. project turnaround', tag: '2 to 4 weeks' },
  { label: 'Discovery call', tag: 'Free, no pitch' },
  { label: 'Billing model', tag: 'Fixed rate' },
  { label: 'Code ownership', tag: '100% yours' },
];

export default function Hero() {
  const scrollToServices = () => {
    const el = document.querySelector('#services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative pt-[100px] pb-12 md:pt-[120px] md:pb-[72px]"
      style={{ backgroundColor: '#F7F6F2' }}
    >
      <div className="mx-auto max-w-[1200px] px-5 md:px-12">
        {/* Two-column on lg, single column on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            {/* Pill tag */}
            <motion.div
              {...fadeIn(0)}
              className="flex items-center gap-2"
              style={{ fontSize: '12px', color: '#888' }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: '#EF9F27' }}
              />
              {LOCATION}
            </motion.div>

            {/* H1 */}
            <motion.h1
              {...fadeIn(0.1)}
              style={{
                fontSize: 'clamp(34px, 4.5vw, 50px)',
                fontWeight: 500,
                letterSpacing: '-2px',
                lineHeight: 1.07,
                color: '#1a1a1a',
              }}
            >
              We build software that makes your{' '}
              <em className="not-italic" style={{ color: '#C85A1E' }}>
                business run better.
              </em>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              {...fadeIn(0.2)}
              style={{ fontSize: '16px', color: '#666666', lineHeight: 1.75, maxWidth: '480px' }}
            >
              Websites, apps, automations, and AI tools for small businesses and startups in the
              GTA. No fluff, no bloated agencies. Just good work at a fair price.
            </motion.p>

            {/* Buttons */}
            <motion.div {...fadeIn(0.3)} className="flex flex-wrap gap-3">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center font-medium transition-colors duration-200"
                style={{
                  backgroundColor: '#1a1a1a',
                  color: '#F7F6F2',
                  padding: '13px 26px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  minHeight: '44px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C85A1E')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1a1a1a')}
              >
                Book a free call
              </a>
              <button
                onClick={scrollToServices}
                className="inline-flex items-center font-medium transition-all duration-200 cursor-pointer bg-transparent"
                style={{
                  color: '#1a1a1a',
                  padding: '13px 26px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  border: '0.5px solid #ccc',
                  minHeight: '44px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#1a1a1a')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#ccc')}
              >
                See our services
              </button>
            </motion.div>
          </div>

          {/* Right column — fact card (hidden on mobile, visible lg+) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.25 }}
            className="hidden lg:block"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '0.5px solid #dedad2',
              overflow: 'hidden',
            }}
          >
            {factRows.map((row, i) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-6 py-4 transition-colors duration-150"
                style={{
                  borderBottom: i < factRows.length - 1 ? '0.5px solid #dedad2' : 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fafaf8')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span style={{ fontSize: '13px', color: '#666' }}>{row.label}</span>
                <span
                  className="inline-flex items-center font-medium"
                  style={{
                    backgroundColor: '#FDF0E8',
                    color: '#C85A1E',
                    fontSize: '11px',
                    padding: '3px 10px',
                    borderRadius: '20px',
                  }}
                >
                  {row.tag}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
