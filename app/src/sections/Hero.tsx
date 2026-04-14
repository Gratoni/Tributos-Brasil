/**
 * Hero Section — Tributos Brasil Ltda
 * ======================================
 * Full-screen cinematic hero with:
 *   - Ken-Burns background image with layered gradients
 *   - GSAP staggered entrance animation (headline, sub, CTAs, stats card)
 *   - Floating stat cards with staggered float animations
 *   - Diagonal bottom edge for flow into next section
 *   - Scroll-indicator button
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, ChevronDown, TrendingUp, Users, Award, ShieldCheck } from 'lucide-react';

/** Quick-stats displayed as floating cards on the right column */
const HERO_STATS = [
  { value: '+R$ 5M',  label: 'Recuperados',         icon: TrendingUp,  float: 'animate-float' },
  { value: '+100',    label: 'Clientes atendidos',   icon: Users,       float: 'animate-float-delayed' },
  { value: '10+ anos',label: 'de experiência',        icon: Award,       float: 'animate-float-slow' },
  { value: '98%',     label: 'Taxa de sucesso',       icon: ShieldCheck, float: 'animate-float' },
] as const;

export default function Hero() {
  const heroRef      = useRef<HTMLElement>(null);
  const headlineRef  = useRef<HTMLDivElement>(null);
  const subRef       = useRef<HTMLParagraphElement>(null);
  const ctaRef       = useRef<HTMLDivElement>(null);
  const statsRef     = useRef<HTMLDivElement>(null);
  const bgRef        = useRef<HTMLDivElement>(null);
  const badgeRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Background scale-in
      gsap.fromTo(bgRef.current,
        { scale: 1.08, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4, ease: 'power2.out' }
      );

      // 2. Badge
      gsap.fromTo(badgeRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out', delay: 0.3 }
      );

      // 3. Headline lines
      const lines = headlineRef.current?.querySelectorAll('.headline-line');
      if (lines?.length) {
        gsap.fromTo(lines,
          { opacity: 0, x: -60, clipPath: 'inset(0 100% 0 0)' },
          {
            opacity: 1, x: 0, clipPath: 'inset(0 0% 0 0)',
            duration: 0.75, stagger: 0.14, ease: 'expo.out', delay: 0.5,
          }
        );
      }

      // 4. Subheadline
      gsap.fromTo(subRef.current,
        { opacity: 0, filter: 'blur(8px)', y: 24 },
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.65, ease: 'power2.out', delay: 1.05 }
      );

      // 5. CTA buttons
      const ctaChildren = Array.from(ctaRef.current?.children ?? []);
      if (ctaChildren.length) {
        gsap.fromTo(ctaChildren,
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(1.7)', delay: 1.25 }
        );
      }

      // 6. Stat cards
      const cards = statsRef.current?.querySelectorAll('.stat-card');
      if (cards?.length) {
        gsap.fromTo(cards,
          { opacity: 0, x: 60, scale: 0.9 },
          {
            opacity: 1, x: 0, scale: 1,
            duration: 0.55, stagger: 0.12, ease: 'expo.out', delay: 1.45,
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Tributos Brasil — início"
    >
      {/* ── Background ── */}
      <div ref={bgRef} className="absolute inset-0 z-0 will-change-transform gpu-layer">
        <img
          src="/hero-bg.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover animate-ken-burns"
          loading="eager"
        />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001a33]/97 via-[#003366]/88 to-[#003366]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001a33]/90 via-transparent to-transparent" />
        {/* Subtle diagonal accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#00A86B]/8" />
      </div>

      {/* ── Decorative orbs ── */}
      <div className="absolute top-1/3 left-[-10%] w-[500px] h-[500px] bg-[#003366]/30 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-[-5%] w-[400px] h-[400px] bg-[#00A86B]/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      {/* ── Content ── */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-28">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 xl:gap-20 items-center">

          {/* ── Left: text ── */}
          <div className="text-white max-w-2xl">

            {/* Badge */}
            <div ref={badgeRef} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00A86B]/15 border border-[#00A86B]/30 text-[#00A86B] text-xs font-bold tracking-widest uppercase backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B] animate-pulse" />
                Especialistas em Tributação
              </span>
            </div>

            {/* Headline */}
            <div ref={headlineRef} className="mb-7 space-y-1">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] font-heading">
                <div className="headline-line overflow-hidden">
                  <span className="block">Recuperação</span>
                </div>
                <div className="headline-line overflow-hidden">
                  <span className="block text-gradient-green">Tributária</span>
                </div>
              </h1>
              <div className="headline-line overflow-hidden">
                <p className="text-2xl sm:text-3xl font-semibold text-white/80 mt-2">
                  para Empresas Brasileiras
                </p>
              </div>
            </div>

            {/* Subheadline */}
            <p ref={subRef} className="text-lg sm:text-xl text-white/75 mb-10 leading-relaxed max-w-lg">
              Transformamos complexidade fiscal em valor real. Mais de{' '}
              <strong className="text-[#00A86B] font-bold">R$ 5 milhões</strong>{' '}
              recuperados para nossos clientes com total segurança jurídica.
            </p>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => scrollTo('#contato')}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#00A86B] text-white font-bold rounded-xl transition-all duration-300 hover:bg-white hover:text-[#003366] hover:shadow-green-lg hover:-translate-y-1 text-sm"
              >
                Fale com um Especialista
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => scrollTo('#servicos')}
                className="group inline-flex items-center gap-3 px-8 py-4 border-2 border-white/40 text-white font-bold rounded-xl transition-all duration-300 hover:bg-white/10 hover:border-white text-sm"
              >
                Nossos Serviços
              </button>
            </div>

            {/* Trust bar */}
            <div className="mt-10 flex flex-wrap items-center gap-6 text-white/50 text-xs">
              {['Consultoria gratuita', 'Sem risco', 'Resultados em 30 dias'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#00A86B]" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: floating stat cards ── */}
          <div ref={statsRef} className="hidden lg:flex flex-col gap-5 w-64">
            {HERO_STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`stat-card ${stat.float} group relative bg-white/8 backdrop-blur-md rounded-2xl p-5 border border-white/15 transition-all duration-300 hover:bg-white/15 hover:border-[#00A86B]/40 cursor-default ${i % 2 !== 0 ? 'ml-8' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-[#00A86B]/20 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-[#00A86B]">
                    <stat.icon className="w-5 h-5 text-[#00A86B] transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white font-heading leading-none">{stat.value}</div>
                    <div className="text-xs text-white/60 mt-0.5">{stat.label}</div>
                  </div>
                </div>
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-6 h-6 overflow-hidden rounded-tr-2xl" aria-hidden="true">
                  <div className="absolute top-0 right-0 w-px h-4 bg-gradient-to-b from-[#00A86B]/60 to-transparent" />
                  <div className="absolute top-0 right-0 h-px w-4 bg-gradient-to-l from-[#00A86B]/60 to-transparent" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <button
          type="button"
          onClick={() => scrollTo('#sobre')}
          className="flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors duration-300 group"
          aria-label="Rolar para baixo"
        >
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </button>
      </div>

      {/* ── Diagonal bottom edge ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 z-10 pointer-events-none hero-diagonal-edge"
        aria-hidden="true"
      />
    </section>
  );
}
