/**
 * Gallery Section — Tributos Brasil Ltda
 * =========================================
 * Premium corporate image gallery in an asymmetric masonry grid.
 *
 * Images sourced from Unsplash (free to use, no attribution required for
 * the Unsplash License). Each photo id maps to a stable, publicly available URL.
 *
 * Grid layout (desktop):
 *   ┌───────────┬──────┬──────┐
 *   │           │  B   │  C   │
 *   │     A     ├──────┴──────┤
 *   │  (tall)   │     D       │
 *   ├──────┬────┴──────┬──────┤
 *   │  E   │     F     │  G   │
 *   └──────┴───────────┴──────┘
 *
 * Accessibility: each img has a descriptive alt text; section has aria-label.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GalleryImage {
  id:      string;
  src:     string;
  alt:     string;
  /** Tailwind grid span classes (col/row) */
  span:    string;
}

/**
 * Curated corporate / finance / office photos from Unsplash.
 * Format: https://images.unsplash.com/photo-{id}?auto=format&fit=crop&w={w}&q=80
 */
const IMAGES: GalleryImage[] = [
  {
    id:   'corporate-meeting',
    src:  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80',
    alt:  'Reunião de equipe corporativa em escritório moderno',
    span: 'row-span-2',   // A — tall left
  },
  {
    id:   'finance-charts',
    src:  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80',
    alt:  'Análise de dados financeiros e gráficos tributários',
    span: '',
  },
  {
    id:   'modern-office',
    src:  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    alt:  'Escritório corporativo moderno e sofisticado',
    span: '',
  },
  {
    id:   'business-handshake',
    src:  'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=80',
    alt:  'Aperto de mãos simbolizando parceria de negócios',
    span: 'col-span-2',   // D — wide bottom of right section
  },
  {
    id:   'documents',
    src:  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=500&q=80',
    alt:  'Revisão de documentos e contratos fiscais',
    span: '',
  },
  {
    id:   'city-skyline',
    src:  'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=700&q=80',
    alt:  'Skyline corporativo de São Paulo',
    span: '',
  },
  {
    id:   'strategy',
    src:  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80',
    alt:  'Especialista em planejamento fiscal estratégico',
    span: '',
  },
];

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const base = { start: 'top 82%', toggleActions: 'play none none none' };

      const headerChildren = headerRef.current?.children;
      if (headerChildren?.length) {
        gsap.fromTo(headerChildren,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'expo.out',
            scrollTrigger: { trigger: headerRef.current, ...base } }
        );
      }

      const items = gridRef.current?.querySelectorAll('.gallery-item');
      if (items?.length) {
        gsap.fromTo(items,
          { opacity: 0, scale: 0.92, y: 30 },
          {
            opacity: 1, scale: 1, y: 0,
            duration: 0.6, stagger: 0.08, ease: 'expo.out',
            scrollTrigger: { trigger: gridRef.current, ...base },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32 bg-white"
      aria-label="Galeria corporativa"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div ref={headerRef} className="text-center mb-14">
          <span className="section-label justify-center">NOSSA EMPRESA</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#003366] font-heading mt-2">
            Profissionalismo em cada detalhe
          </h2>
          <p className="text-lg text-[#666] mt-4 max-w-xl mx-auto">
            Conheça o ambiente, a equipe e a cultura que sustentam nossa excelência tributária.
          </p>
        </div>

        {/* ── Masonry grid ── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[220px]"
        >
          {IMAGES.map((img) => (
            <div
              key={img.id}
              className={`gallery-item group relative overflow-hidden rounded-2xl bg-[#f4f6f9] ${img.span}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Hover overlay with caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#001a33]/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-5">
                <p className="text-white text-sm font-semibold translate-y-4 group-hover:translate-y-0 transition-transform duration-400">
                  {img.alt}
                </p>
              </div>

              {/* Subtle border on hover */}
              <div className="absolute inset-0 rounded-2xl ring-2 ring-[#00A86B]/0 group-hover:ring-[#00A86B]/30 transition-all duration-400 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* ── Bottom tagline ── */}
        <p className="text-center text-sm text-[#aaa] mt-8 tracking-wide">
          Tributos Brasil Ltda — São Paulo, SP · Desde 2014
        </p>
      </div>
    </section>
  );
}
