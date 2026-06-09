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
