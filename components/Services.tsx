'use client';

import { motion } from 'framer-motion';
import { IconArrowRight } from '@tabler/icons-react';
import { SERVICES } from '@/lib/constants';
import { scrollReveal } from '@/lib/animations';

export default function Services() {
  return (
    <section
      id="services"
      className="py-12 md:py-[72px] px-5 md:px-12"
      style={{ backgroundColor: '#1a1a1a' }}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <motion.div {...scrollReveal()} className="mb-8 md:mb-10">
          <p
            className="uppercase mb-3"
            style={{ fontSize: '11px', letterSpacing: '2px', color: '#555' }}
          >
            What we do
          </p>
          <h2
            style={{
              fontSize: 'clamp(28px, 3vw, 38px)',
              fontWeight: 500,
              letterSpacing: '-1px',
              lineHeight: 1.2,
              color: '#F7F6F2',
            }}
          >
            Four ways we can help.
          </h2>
        </motion.div>

        {/* Services list */}
        <motion.div
          {...scrollReveal(0.1)}
          style={{
            border: '0.5px solid #2e2e2e',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {SERVICES.map((service, i) => (
            <div
              key={service.name}
              className="group"
              style={{
                backgroundColor: '#222222',
                borderBottom: i < SERVICES.length - 1 ? '0.5px solid #2e2e2e' : 'none',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = '#2a2a2a')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = '#222222')
              }
            >
              {/* Mobile: name + price + arrow; Desktop: add description */}
              <div
                className="grid items-center gap-3 px-5 md:px-7 py-4 md:py-5"
                style={{ gridTemplateColumns: '1fr auto' }}
              >
                {/* Name + price */}
                <div className="flex flex-col gap-1 min-w-0">
                  <span
                    className="uppercase font-medium"
                    style={{ fontSize: '13px', letterSpacing: '0.5px', color: '#C85A1E' }}
                  >
                    {service.name}
                  </span>
                  <span style={{ fontSize: '12px', color: '#555' }}>{service.price}</span>
                  {/* Description visible md+ */}
                  <p
                    className="hidden md:block mt-1"
                    style={{ fontSize: '14px', color: '#999', lineHeight: 1.6 }}
                  >
                    {service.description}
                  </p>
                </div>

                {/* Arrow */}
                <motion.div
                  className="flex items-center justify-center flex-shrink-0"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <IconArrowRight
                    size={18}
                    className="group-hover:[color:#C85A1E] transition-colors duration-200"
                    style={{ color: '#444' }}
                  />
                </motion.div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
