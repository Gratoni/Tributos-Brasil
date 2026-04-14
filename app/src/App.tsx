/**
 * App — Tributos Brasil Ltda
 * ============================
 * Root component. Composes all page sections in order and mounts the
 * floating WhatsApp button that is always visible for lead generation.
 *
 * Section render order:
 *   Header → Hero → About → Stats → Services → Clients →
 *   Results → Gallery → CTA → Contact → Footer
 *
 * Global GSAP ScrollTrigger initialisation lives here so it runs once
 * after the full DOM is available, rather than duplicating it across sections.
 */

import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, X } from 'lucide-react';

import Header   from './sections/Header';
import Hero     from './sections/Hero';
import About    from './sections/About';
import Stats    from './sections/Stats';
import Services from './sections/Services';
import Clients  from './sections/Clients';
import Results  from './sections/Results';
import Gallery  from './sections/Gallery';
import CTA      from './sections/CTA';
import Contact  from './sections/Contact';
import Footer   from './sections/Footer';

import './App.css';

// Register GSAP plugins once at module level
gsap.registerPlugin(ScrollTrigger);

// ── WhatsApp floating button ──────────────────────────────────────────────────
const WA_NUMBER  = '5511999999999';
const WA_MESSAGE = encodeURIComponent(
  'Olá! Vim pelo site da Tributos Brasil e gostaria de saber mais sobre recuperação tributária.'
);
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState(true);

  // Fade in after 2 s
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Auto-hide tooltip after 5 s
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setTooltip(false), 5000);
    return () => clearTimeout(t);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
      {/* Tooltip */}
      {tooltip && (
        <div className="relative mb-1 bg-white text-[#003366] text-sm font-semibold px-4 py-3 rounded-2xl shadow-navy-md max-w-[200px] leading-snug">
          Fale conosco pelo WhatsApp!
          <button
            type="button"
            onClick={() => setTooltip(false)}
            className="absolute -top-2 -right-2 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200"
            aria-label="Fechar aviso"
          >
            <X className="w-3 h-3 text-gray-600" />
          </button>
          {/* Arrow */}
          <span className="absolute right-4 -bottom-1.5 w-3 h-3 bg-white rotate-45 shadow-sm" aria-hidden="true" />
        </div>
      )}

      {/* Button */}
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar no WhatsApp"
        className="group w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-green-lg transition-all duration-300 hover:scale-110 hover:shadow-green-lg animate-pulse-glow"
      >
        <MessageCircle className="w-7 h-7 text-white transition-transform duration-300 group-hover:scale-110" />
      </a>
    </div>
  );
}

// ── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => {
    // Generic .reveal scroll animation (fallback for any section that uses the class)
    const revealEls = document.querySelectorAll('.reveal');
    revealEls.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    ScrollTrigger.refresh();
    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <Hero />
        <About />
        <Stats />
        <Services />
        <Clients />
        <Results />
        <Gallery />
        <CTA />
        <Contact />
      </main>

      <Footer />

      {/* Floating WhatsApp CTA — always rendered last so it sits on top */}
      <WhatsAppButton />
    </div>
  );
}
