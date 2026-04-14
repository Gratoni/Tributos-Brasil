/**
 * Clients Section — Tributos Brasil Ltda
 * =========================================
 * Showcases clients with:
 *   - Featured case-study card (Vivenda do Camarão)
 *   - Two-row infinite marquee of client name badges
 *
 * No inline styles used — all dynamic values are handled via
 * Tailwind utility classes or CSS variables.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Building2, Store, Factory, Briefcase,
  Landmark, Truck, ShoppingBag, Stethoscope,
  Plane, Utensils,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CLIENTS = [
  { name: 'Vivenda do Camarão',   icon: Store,        industry: 'Restaurantes'  },
  { name: 'TechSolutions Brasil', icon: Briefcase,    industry: 'Tecnologia'    },
  { name: 'Indústria Nacional',   icon: Factory,      industry: 'Indústria'     },
  { name: 'Construtora Horizonte',icon: Building2,    industry: 'Construção'    },
  { name: 'Banco Regional',       icon: Landmark,     industry: 'Financeiro'    },
  { name: 'Logística Total',      icon: Truck,        industry: 'Logística'     },
  { name: 'Moda Premium',         icon: ShoppingBag,  industry: 'Varejo'        },
  { name: 'Clínica Saúde+',       icon: Stethoscope,  industry: 'Saúde'         },
  { name: 'AeroFrete Cargo',      icon: Plane,        industry: 'Aviação'       },
  { name: 'Rede Gourmet SP',      icon: Utensils,     industry: 'Food Service'  },
] as const;

// Duplicate for seamless marquee loop
const ROW_A = [...CLIENTS, ...CLIENTS];
const ROW_B = [...[...CLIENTS].reverse(), ...[...CLIENTS].reverse()];

export default function Clients() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headerRef   = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const marqueeRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const base = { start: 'top 82%', toggleActions: 'play none none none' };

      // Header
      const headerChildren = headerRef.current?.children;
      if (headerChildren?.length) {
        gsap.fromTo(headerChildren,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'expo.out',
            scrollTrigger: { trigger: headerRef.current, ...base } }
        );
      }

      // Featured card
      gsap.fromTo(featuredRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out',
          scrollTrigger: { trigger: featuredRef.current, ...base } }
      );

      // Marquee fade-in
      gsap.fromTo(marqueeRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: marqueeRef.current, ...base } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="clientes"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-white overflow-hidden"
      aria-label="Nossos clientes"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div ref={headerRef} className="text-center mb-14">
          <span className="section-label justify-center">CLIENTES</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#003366] font-heading mt-2">
            Empresas que confiam em nosso trabalho
          </h2>
          <p className="text-lg text-[#666] mt-4 max-w-xl mx-auto">
            Atuamos em diversos segmentos da economia, sempre entregando resultados excepcionais.
          </p>
        </div>

        {/* ── Featured case-study ── */}
        <div ref={featuredRef} className="mb-16">
          <div className="relative bg-gradient-to-br from-[#003366] to-[#001a33] rounded-3xl p-8 lg:p-12 overflow-hidden">
            {/* Dot pattern */}
            <div className="absolute inset-0 opacity-[0.07] pointer-events-none featured-dot-bg" aria-hidden="true" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
              {/* Text */}
              <div>
                <span className="badge-green mb-4 inline-flex">Case de Sucesso</span>
                <h3 className="text-3xl lg:text-4xl font-black text-white font-heading mb-4">
                  Vivenda do Camarão
                </h3>
                <p className="text-white/75 text-lg leading-relaxed mb-8">
                  Uma das maiores redes de frutos do mar do Brasil. Através de nossa revisão
                  tributária completa, identificamos créditos não aproveitados em operações
                  de franquia e gestão de royalties.
                </p>
                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-4xl font-black text-[#00A86B] font-heading">R$ 847mil</div>
                    <div className="text-white/55 text-sm mt-0.5">recuperados</div>
                  </div>
                  <div className="h-10 w-px bg-white/20" />
                  <div>
                    <div className="text-4xl font-black text-[#00A86B] font-heading">23%</div>
                    <div className="text-white/55 text-sm mt-0.5">economia anual</div>
                  </div>
                  <div className="h-10 w-px bg-white/20" />
                  <div>
                    <div className="text-4xl font-black text-white font-heading">18 meses</div>
                    <div className="text-white/55 text-sm mt-0.5">de parceria</div>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl aspect-video">
                  <img
                    src="/case-vivenda.jpg"
                    alt="Case Vivenda do Camarão"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001a33]/40 to-transparent" />
                </div>

                {/* Segment badge */}
                <div className="absolute -bottom-4 left-6 bg-white rounded-xl px-5 py-3 shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#00A86B] rounded-lg flex items-center justify-center">
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-[#003366] text-sm">Restaurantes</div>
                    <div className="text-xs text-[#666]">Segmento</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Marquee ── */}
        <div ref={marqueeRef}>
          <p className="text-center text-sm font-bold text-[#003366] tracking-widest uppercase mb-8">
            Outras empresas que atendemos
          </p>

          {/* Row A — scrolls left */}
          <div className="relative mb-4 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            <div className="flex animate-marquee-left hover:[animation-play-state:paused]">
              {ROW_A.map((client, i) => (
                <ClientBadge key={`a-${i}`} client={client} variant="navy" />
              ))}
            </div>
          </div>

          {/* Row B — scrolls right */}
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            <div className="flex animate-marquee-right hover:[animation-play-state:paused]">
              {ROW_B.map((client, i) => (
                <ClientBadge key={`b-${i}`} client={client} variant="green" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Client badge sub-component ───────────────────────────────────────────────
function ClientBadge({
  client,
  variant,
}: {
  client: (typeof CLIENTS)[number];
  variant: 'navy' | 'green';
}) {
  const isNavy = variant === 'navy';

  return (
    <div className="flex-shrink-0 mx-3 group">
      <div
        className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 cursor-default ${
          isNavy
            ? 'bg-[#f4f6f9] hover:bg-[#003366] hover:shadow-navy-sm'
            : 'bg-[#f4f6f9] hover:bg-[#00A86B] hover:shadow-green-sm'
        }`}
      >
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
            isNavy
              ? 'bg-[#003366]/10 group-hover:bg-white/20'
              : 'bg-[#00A86B]/10 group-hover:bg-white/20'
          }`}
        >
          <client.icon
            className={`w-5 h-5 transition-colors duration-300 ${
              isNavy
                ? 'text-[#003366] group-hover:text-white'
                : 'text-[#00A86B] group-hover:text-white'
            }`}
          />
        </div>
        <div>
          <div className="font-semibold text-[#003366] text-sm transition-colors duration-300 group-hover:text-white whitespace-nowrap">
            {client.name}
          </div>
          <div className="text-xs text-[#777] transition-colors duration-300 group-hover:text-white/70">
            {client.industry}
          </div>
        </div>
      </div>
    </div>
  );
}
