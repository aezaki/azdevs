import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { SITE_URL } from '@/lib/constants';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'AZDEVS — Web, App and AI Development for Toronto Small Businesses',
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
    title: 'AZDEVS — Web, App and AI Development for Toronto Small Businesses',
    description:
      'Websites, apps, and AI tools for GTA small businesses. No fluff, fair pricing, you own everything.',
    url: SITE_URL,
    siteName: 'AZDEVS',
    images: [{ url: '/og-image.svg', width: 1200, height: 630 }],
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AZDEVS — Web, App and AI Development for Toronto Small Businesses',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
