'use client';

import { motion } from 'framer-motion';
import { IconDeviceLaptop, IconRefresh, IconBulb } from '@tabler/icons-react';
import { scrollReveal } from '@/lib/animations';

function ProblemCard({
  icon: Icon,
  headline,
  body,
  featured,
  cta,
  delay,
}: {
  icon: React.ElementType;
  headline: string;
  body: string;
  featured?: boolean;
  cta?: string;
  delay: number;
}) {
  return (
    <motion.div
      {...scrollReveal(delay)}
      className="flex flex-col gap-5 group cursor-default h-full"
      style={{
        backgroundColor: '#F7F6F2',
        border: '0.5px solid #eae7e0',
        borderRadius: '12px',
        padding: '32px 28px',
        transition: 'background-color 0.2s, border-color 0.2s',
      }}
      whileHover={{ scale: 1.01 }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = '#fff';
        (e.currentTarget as HTMLElement).style.borderColor = '#C85A1E';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = '#F7F6F2';
        (e.currentTarget as HTMLElement).style.borderColor = '#eae7e0';
      }}
    >
      <div
        className="flex items-center justify-center flex-shrink-0 transition-colors duration-200 group-hover:[background-color:#C85A1E]"
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#1a1a1a',
          borderRadius: '10px',
        }}
      >
        <Icon size={20} color="#F7F6F2" />
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <h3
          style={{
            fontSize: featured ? '22px' : '17px',
            fontWeight: 500,
            letterSpacing: featured ? '-0.4px' : '-0.2px',
            lineHeight: 1.3,
            color: '#1a1a1a',
          }}
        >
          {headline}
        </h3>
        <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.7 }}>{body}</p>
      </div>
      {cta && (
        <p
          className="text-sm mt-auto transition-opacity duration-200 group-hover:opacity-100"
          style={{ color: '#C85A1E', opacity: 0.45, fontSize: '14px' }}
        >
          {cta}
        </p>
      )}
    </motion.div>
  );
}

export default function Problems() {
  return (
    <section
      className="py-12 md:py-[72px] px-5 md:px-12"
      style={{ backgroundColor: '#FFFFFF' }}
      id="problems"
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <motion.div
          {...scrollReveal()}
          className="mb-10 md:mb-12"
          style={{ maxWidth: '560px' }}
        >
          <p
            className="uppercase mb-3"
            style={{ fontSize: '11px', letterSpacing: '2px', color: '#aaaaaa' }}
          >
            Sound familiar?
          </p>
          <h2
            className="mb-3"
            style={{
              fontSize: 'clamp(28px, 3vw, 38px)',
              fontWeight: 500,
              letterSpacing: '-1px',
              lineHeight: 1.2,
              color: '#1a1a1a',
            }}
          >
            Three problems we fix every week.
          </h2>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.75 }}>
            These are the situations we hear most from businesses that reach out to us.
          </p>
        </motion.div>

        {/* Asymmetric grid: 2-col on md+, single-col on mobile */}
        <div
          className="grid gap-4 grid-cols-1 md:grid-cols-[1fr_1fr]"
          style={{ gridTemplateRows: 'auto auto' }}
        >
          {/* Card 01 — spans 2 rows on desktop */}
          <div className="md:[grid-row:1/3]">
            <ProblemCard
              icon={IconDeviceLaptop}
              headline="Your website is embarrassing you"
              body="It was built years ago, looks rough on mobile, and you cringe a little every time you hand out your business card. A bad website doesn't just look unprofessional — it's actively costing you customers."
              featured
              cta="We can fix this →"
              delay={0.1}
            />
          </div>

          {/* Card 02 */}
          <ProblemCard
            icon={IconRefresh}
            headline="You're doing things manually that should be automatic"
            body="Copying data, chasing leads, answering the same questions every week. Hours you don't have."
            delay={0.2}
          />

          {/* Card 03 */}
          <ProblemCard
            icon={IconBulb}
            headline="You have a software idea and no one to build it"
            body="The concept is solid. You just need a developer who gets it and can ship something real without blowing your budget."
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
}
