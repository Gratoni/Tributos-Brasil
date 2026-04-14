/**
 * Stats Section — Tributos Brasil Ltda
 * =======================================
 * Animated KPI counters on a deep-navy background.
 *
 * Implementation notes:
 *   - AnimatedCounter uses a GSAP tween on a plain object ref to avoid
 *     re-render churn from setInterval approaches.
 *   - isVisible gate ensures the counter only runs once when the section
 *     enters the viewport (no replay on scroll-back).
 *   - Each card has a decorative corner accent and an index watermark.
 */

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Coins, Users, ShieldCheck, Calendar } from 'lucide-react';

interface StatItem {
  value:  number;
  prefix: string;
  suffix: string;
  label:  string;
  icon:   React.ElementType;
  color:  string;   // accent used for the icon hover background
}

const STATS: StatItem[] = [
  { value: 5,   prefix: '+R$ ', suffix: ' milhões', label: 'recuperados',          icon: Coins,       color: '#00A86B' },
  { value: 100, prefix: '+',    suffix: '',          label: 'Clientes atendidos',   icon: Users,       color: '#00A86B' },
  { value: 98,  prefix: '',     suffix: '%',         label: 'Taxa de sucesso',       icon: ShieldCheck, color: '#00A86B' },
  { value: 10,  prefix: '+',    suffix: '',          label: 'Anos de experiência',   icon: Calendar,    color: '#00A86B' },
];

// ── Animated counter sub-component ──────────────────────────────────────────
function AnimatedCounter({
  value, prefix, suffix, isVisible,
}: {
  value: number; prefix: string; suffix: string; isVisible: boolean;
}) {
  const [count, setCount]   = useState(0);
  const counterRef          = useRef({ current: 0 });

  useEffect(() => {
    if (!isVisible) return;
    gsap.to(counterRef.current, {
      current: value,
      duration: 1.8,
      ease: 'expo.out',
      onUpdate() { setCount(Math.floor(counterRef.current.current)); },
    });
  }, [isVisible, value]);

  return (
    <span className="counter-animate">
      {prefix}{count}{suffix}
    </span>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef   = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Trigger counter once the section crosses 60% of the viewport
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 62%',
        onEnter: () => setIsVisible(true),
      });

      // Staggered card entrance
      const cards = cardsRef.current?.querySelectorAll('.stat-card');
      if (cards?.length) {
        gsap.fromTo(cards,
          { opacity: 0, y: 50, scale: 0.92 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.65, stagger: 0.14, ease: 'expo.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32 bg-[#001a33] relative overflow-hidden"
      aria-label="Nossos números"
    >
      {/* ── Grid pattern ── */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none stats-grid-bg" aria-hidden="true" />

      {/* ── Radial glow orbs ── */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#003366]/50 rounded-full blur-3xl pointer-events-none animate-pulse" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#00A86B]/15 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Header ── */}
        <div className="text-center mb-16">
          <span className="section-label justify-center text-[#00A86B]">RESULTADOS</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-heading mt-2">
            Números que comprovam<br className="hidden sm:block" /> nossa excelência
          </h2>
        </div>

        {/* ── Cards grid ── */}
        <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className="stat-card group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 transition-all duration-500 hover:bg-white/10 hover:border-[#00A86B]/40 hover:shadow-green-sm hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="w-14 h-14 bg-[#00A86B]/20 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#00A86B] group-hover:scale-110">
                <stat.icon className="w-7 h-7 text-[#00A86B] transition-colors duration-300 group-hover:text-white" />
              </div>

              {/* Value */}
              <div className="text-4xl sm:text-5xl font-black text-white mb-1 font-heading transition-colors duration-300 group-hover:text-[#00A86B]">
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  isVisible={isVisible}
                />
              </div>

              {/* Label */}
              <div className="text-white/55 font-medium text-sm">{stat.label}</div>

              {/* Top-right corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl pointer-events-none" aria-hidden="true">
                <div className="absolute top-0 right-0 w-px h-10 bg-gradient-to-b from-[#00A86B]/50 to-transparent" />
                <div className="absolute top-0 right-0 h-px w-10 bg-gradient-to-l from-[#00A86B]/50 to-transparent" />
              </div>

              {/* Index watermark */}
              <div className="absolute bottom-3 right-4 text-[4rem] font-black text-white/[0.04] leading-none select-none font-heading">
                0{index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-16 text-center">
          <p className="text-white/50 text-base mb-6">
            Junte-se às empresas que já recuperaram seus créditos tributários
          </p>
          <a
            href="#contato"
            onClick={(e) => { e.preventDefault(); document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#00A86B] text-white font-bold rounded-xl transition-all duration-300 hover:bg-white hover:text-[#003366] hover:shadow-green-lg hover:-translate-y-1 text-sm"
          >
            Comece sua recuperação hoje
          </a>
        </div>
      </div>
    </section>
  );
}
