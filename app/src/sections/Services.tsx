/**
 * Services Section — Tributos Brasil Ltda
 * ==========================================
 * Premium editorial layout showcasing the 5 core service offerings.
 *
 * Layout strategy:
 *   - Featured first card spans full width (editorial hero style)
 *   - Remaining 4 cards fill a 2×2 grid
 *   - Each card has: icon, title, description, feature pills and a CTA link
 *   - Hover state lifts the card and reveals a colored top border accent
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RefreshCw, Target, ClipboardCheck, TrendingDown, Search, ArrowRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/** 'navy' | 'green' maps to CSS utility classes defined in index.css */
type AccentVariant = 'navy' | 'green';

interface Service {
  icon:        React.ElementType;
  title:       string;
  description: string;
  features:    string[];
  accent:      AccentVariant;
  featured?:   boolean;
}

const SERVICES: Service[] = [
  {
    icon:        RefreshCw,
    title:       'Recuperação Tributária',
    description: 'Identificamos e recuperamos créditos tributários pagos indevidamente através de análise minuciosa de todas as operações e pagamentos realizados nos últimos cinco anos. Nossa metodologia proprietária cobre todos os regimes tributários e tipos de tributo.',
    features:    ['Análise retroativa 5 anos', 'Todos os tributos federais', 'Honorários só no êxito', 'PIS/COFINS, ICMS, ISS, IRPJ'],
    accent:      'navy',
    featured:    true,
  },
  {
    icon:        Target,
    title:       'Planejamento Fiscal',
    description: 'Estratégias personalizadas para otimização da carga tributária dentro da legalidade, maximizando resultados e garantindo compliance total.',
    features:    ['Estratégia customizada', 'Compliance 100%', 'Redução de custos'],
    accent:      'green',
  },
  {
    icon:        ClipboardCheck,
    title:       'Consultoria Tributária',
    description: 'Assessoria especializada para decisões estratégicas, interpretação de normas e resolução de questões tributárias complexas.',
    features:    ['Suporte contínuo', 'Equipe especializada', 'Respostas em 24h'],
    accent:      'navy',
  },
  {
    icon:        TrendingDown,
    title:       'Redução de Impostos',
    description: 'Identificamos oportunidades legais de redução da carga tributária sem comprometer a segurança jurídica da empresa.',
    features:    ['Oportunidades legais', 'Segurança jurídica', 'Economia real'],
    accent:      'green',
  },
  {
    icon:        Search,
    title:       'Revisão Fiscal',
    description: 'Auditoria completa de obrigações fiscais para identificar inconsistências e oportunidades de melhoria contínua.',
    features:    ['Auditoria completa', 'Relatório executivo', 'Ações corretivas'],
    accent:      'navy',
  },
];

/** Maps AccentVariant to Tailwind-safe class strings (avoids dynamic class purging) */
const ACCENT_CLASSES: Record<AccentVariant, {
  iconBg:    string;
  iconColor: string;
  borderFg:  string;
  borderBg:  string;
  dot:       string;
  link:      string;
}> = {
  navy: {
    iconBg:    'bg-[#003366]/10',
    iconColor: 'text-[#003366]',
    borderFg:  'bg-[#003366]',
    borderBg:  'bg-[#003366]/20',
    dot:       'bg-[#003366]',
    link:      'text-[#003366]',
  },
  green: {
    iconBg:    'bg-[#00A86B]/10',
    iconColor: 'text-[#00A86B]',
    borderFg:  'bg-[#00A86B]',
    borderBg:  'bg-[#00A86B]/20',
    dot:       'bg-[#00A86B]',
    link:      'text-[#00A86B]',
  },
};

export default function Services() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headerRef   = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const gridRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const baseOpts = { start: 'top 82%', toggleActions: 'play none none none' };

      // Header
      const headerItems = headerRef.current?.children;
      if (headerItems?.length) {
        gsap.fromTo(headerItems,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.12, ease: 'expo.out',
            scrollTrigger: { trigger: headerRef.current, ...baseOpts } }
        );
      }

      // Featured card
      gsap.fromTo(featuredRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out',
          scrollTrigger: { trigger: featuredRef.current, ...baseOpts } }
      );

      // Secondary cards — 3D flip entrance
      const cards = gridRef.current?.querySelectorAll('.service-card');
      if (cards?.length) {
        gsap.fromTo(cards,
          { opacity: 0, rotateY: -80, transformOrigin: 'left center' },
          {
            opacity: 1, rotateY: 0,
            duration: 0.65, stagger: 0.1, ease: 'expo.out',
            scrollTrigger: { trigger: gridRef.current, ...baseOpts },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth' });
  };

  const [featured, ...secondary] = SERVICES;

  return (
    <section
      id="servicos"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-[#f4f6f9]"
      aria-label="Nossos serviços"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div ref={headerRef} className="text-center mb-14">
          <span className="section-label justify-center">NOSSOS SERVIÇOS</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#003366] mt-2 font-heading">
            Soluções completas para sua saúde fiscal
          </h2>
          <p className="text-lg text-[#666] mt-4 max-w-2xl mx-auto">
            Da recuperação de créditos ao planejamento estratégico — cobrimos todo o espectro
            tributário com precisão técnica e foco em resultados.
          </p>
        </div>

        {/* ── Featured card (full-width editorial) ── */}
        <div
          ref={featuredRef}
          className="group relative bg-gradient-to-br from-[#003366] to-[#001a33] rounded-3xl p-8 lg:p-12 mb-6 overflow-hidden transition-all duration-500 hover:shadow-navy-lg hover:-translate-y-1 [perspective:1000px]"
        >
          {/* Background dot pattern */}
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none featured-dot-bg" aria-hidden="true" />

          <div className="relative z-10 grid lg:grid-cols-[auto_1fr_auto] gap-8 lg:gap-12 items-start">
            {/* Icon */}
            <div className="w-20 h-20 bg-[#00A86B]/20 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-[#00A86B] group-hover:scale-110">
              <featured.icon className="w-10 h-10 text-[#00A86B] transition-colors duration-300 group-hover:text-white" />
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="badge-green">
                  <Sparkles className="w-3 h-3" />
                  Principal serviço
                </span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-black text-white mb-4 font-heading">
                {featured.title}
              </h3>
              <p className="text-white/75 leading-relaxed text-lg max-w-2xl">
                {featured.description}
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 mt-6">
                {featured.features.map((f) => (
                  <span
                    key={f}
                    className="px-3 py-1.5 bg-white/10 text-white/80 text-xs font-semibold rounded-full border border-white/15"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex-shrink-0">
              <a
                href="#contato"
                onClick={scrollToContact}
                className="group/btn inline-flex items-center gap-2 px-7 py-4 bg-[#00A86B] text-white font-bold rounded-xl transition-all duration-300 hover:bg-white hover:text-[#003366] hover:shadow-green-md hover:-translate-y-0.5 text-sm whitespace-nowrap"
              >
                Saiba mais
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </a>
            </div>
          </div>
        </div>

        {/* ── Secondary cards 2×2 grid ── */}
        <div
          ref={gridRef}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 [perspective:1200px]"
        >
          {secondary.map((service, index) => {
            const ac = ACCENT_CLASSES[service.accent];
            return (
              <div
                key={service.title}
                className="service-card group relative bg-white rounded-2xl p-7 shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-2 overflow-hidden"
              >
                {/* Top accent border — bg track + animated fill */}
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${ac.borderBg}`} />
                <div className={`absolute top-0 left-0 h-1 rounded-tl-2xl transition-all duration-500 w-0 group-hover:w-full ${ac.borderFg}`} />

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-400 group-hover:scale-110 group-hover:rotate-[360deg] ${ac.iconBg}`}>
                  <service.icon className={`w-7 h-7 transition-colors duration-300 ${ac.iconColor}`} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-black text-[#003366] mb-3 font-heading transition-colors duration-300 group-hover:text-[#00A86B]">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#666] leading-relaxed mb-5">
                  {service.description}
                </p>

                {/* Feature list */}
                <ul className="space-y-1.5 mb-7">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-[#555]">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${ac.dot}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#contato"
                  onClick={scrollToContact}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all duration-300 group-hover:gap-3 ${ac.link}`}
                >
                  Saiba mais
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>

                {/* Index watermark */}
                <div className="absolute bottom-3 right-3 text-5xl font-black text-gray-100 select-none leading-none font-heading">
                  0{index + 2}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom note ── */}
        <div className="mt-14 text-center">
          <p className="text-[#666] mb-4 text-sm">
            Precisa de uma solução personalizada para o seu segmento?
          </p>
          <a
            href="#contato"
            onClick={scrollToContact}
            className="inline-flex items-center gap-2 text-[#003366] font-bold hover:text-[#00A86B] transition-colors duration-300 text-sm underline-animate"
          >
            Fale com nossos especialistas
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
