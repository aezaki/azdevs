/**
 * @file app/page.tsx
 * @description Root page — assembles all marketing sections in order.
 *              Nav and Footer are rendered outside <main> so screen readers and
 *              crawlers correctly distinguish navigation from page content.
 *
 * @notes All section components are 'use client' due to Framer Motion. This
 *        server component acts as a thin shell that lets Next.js optimise the
 *        initial HTML payload before hydration.
 */

import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Problems from '@/components/Problems';
import Services from '@/components/Services';
import About from '@/components/About';
import HowItWorks from '@/components/HowItWorks';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problems />
        <Services />
        <About />
        <HowItWorks />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
