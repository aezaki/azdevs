/**
 * @file app/layout.tsx
 * @description Root layout for the AZDEVS Next.js App Router application.
 *              Sets global metadata, loads the Geist font, and injects
 *              JSON-LD LocalBusiness structured data for Google rich results.
 *
 * @dependencies next/font/google (Geist), next/metadata
 *
 * @notes JSON-LD is injected via a <script> tag with dangerouslySetInnerHTML.
 *        This is the Next.js-recommended pattern for structured data and is safe
 *        here because the content is a static, hardcoded object (not user input).
 */

import type { Metadata } from 'next';
import { Geist, Bricolage_Grotesque } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { SITE_URL, COMPANY_NAME, LOCATION } from '@/lib/constants';

// ─── Fonts ──────────────────────────────────────────────────────────────────────

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

// Display typeface for h1 / h2 only; variable grotesque with constructed personality
const bricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
  display: 'swap',
});

// ─── Metadata ───────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  // metadataBase is required for Next.js to resolve relative OG image URLs
  metadataBase: new URL(SITE_URL),
  title: `${COMPANY_NAME}: Web, App and AI Development for Toronto Small Businesses`,
  description:
    'AZDEVS builds websites, web apps, and AI automation tools for small businesses and startups in the GTA. Fixed pricing, fast turnaround, full ownership.',
  keywords: [
    'web development Toronto',
    'app development GTA',
    'AI automation Toronto',
    'small business website Toronto',
    'MVP development Toronto',
  ],
  openGraph: {
    title: `${COMPANY_NAME}: Web, App and AI Development for Toronto Small Businesses`,
    description:
      'Websites, apps, and AI tools for GTA small businesses. No fluff, fair pricing, you own everything.',
    url: SITE_URL,
    siteName: COMPANY_NAME,
    images: [{ url: '/og-image.svg', width: 1200, height: 630 }],
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${COMPANY_NAME}: Web, App and AI Development for Toronto Small Businesses`,
    description: 'Websites, apps, and AI tools for GTA small businesses.',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

// ─── JSON-LD Structured Data ────────────────────────────────────────────────────

// LocalBusiness schema: helps Google surface the business in local search results
// and knowledge panels. See: https://schema.org/LocalBusiness
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: COMPANY_NAME,
  description:
    'Web, app, and AI development for small businesses and startups in Toronto, Ontario.',
  url: SITE_URL,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Toronto',
    addressRegion: 'ON',
    addressCountry: 'CA',
  },
  areaServed: LOCATION.split(',')[0].trim() === 'Toronto' ? 'Greater Toronto Area' : LOCATION,
  serviceType: ['Web Development', 'App Development', 'AI Automation', 'MVP Development'],
};

// ─── Layout ─────────────────────────────────────────────────────────────────────

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${bricolage.variable}`}>
      <body>
        {children}
        {/*
         * JSON-LD structured data: dangerouslySetInnerHTML is intentional here.
         * This is the standard Next.js App Router pattern for injecting static
         * structured data; the content is a fully controlled object, not user input.
         */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
