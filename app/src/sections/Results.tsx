/**
 * Results Section — Tributos Brasil Ltda
 * =========================================
 * Case-study carousel with keyboard-accessible navigation and
 * three summary KPI cards below the slider.
 *
 * Accessibility:
 *   - Previous/Next buttons have descriptive aria-labels
 *   - Dot indicators announce slide position via aria-label
 *   - Active slide is aria-current="true"
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ChevronLeft, ChevronRight, TrendingUp, Building2, Cpu, CheckCircle } from 'lucide-react';

interface CaseStudy {
  id:          number;
  company:     string;
  industry:    string;
  result:      string;
  metric:      string;
  description: string;
  highlights:  string[];
  icon:        React.ElementType;
  accent:      'navy' | 'green';
  image:       string;
}

const CASES: CaseStudy[] = [
  {
    id:          1,
    company:     'Vivenda do Camarão',
    industry:    'Restaurantes / Franquias',
    result:      'R$ 847 mil',
    metric:      'recuperados',
    description: 'Revisão completa da cadeia tributária identificou créditos não aproveitados em operações de franquia, gestão de royalties e repasses intrafranquia.',
    highlights:  ['PIS/COFINS sobre royalties', 'ICMS em insumos', 'Redução ISS mensal'],
    icon:        Building2,
    accent:      'navy',
    image:       '/case-vivenda.jpg',
  },
  {
    id:          2,
    company:     'Indústria Metálica Nacional',
    industry:    'Indústria / Metalurgia',
    result:      'R$ 1,2 milhões',
    metric:      'economizados/ano',
    description: 'Planejamento fiscal estratégico reduziu a carga tributária em 23% ao ano através de reestruturação societária otimizada e aproveitamento de incentivos fiscais.',
    highlights:  ['Reestruturação societária', 'Incentivos fiscais estaduais', 'Regime tributário otimizado'],
    icon:        TrendingUp,
    accent:      'green',
    image:       '/hero-bg.jpg',
  },
  {
    id:          3,
    company:     'TechFlow Solutions',
    industry:    'Tecnologia / Software',
    result:      'R$ 560 mil',
    metric:      'recuperados',
    description: 'Recuperação de créditos de PIS/COFINS em operações de exportação de serviços de tecnologia e correção de classificação de software como serviço.',
    highlights:  ['Exportação de serviços TI', 'Não-incidência PIS/COFINS', 'Reclassificação de receitas'],
    icon:        Cpu,
    accent:      'navy',
    image:       '/about-team.jpg',
  },
];

const ACCENT = {
  navy:  { text: 'text-[#003366]', bg: 'bg-[#003366]', badge: 'bg-[#003366]' },
  green: { text: 'text-[#00A86B]', bg: 'bg-[#00A86B]', badge: 'bg-[#00A86B]' },
} as const;

export default function Results() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headerRef   = useRef<HTMLDivElement>(null);
  const sliderRef   = useRef<HTMLDivElement>(null);
  const kpiRef      = useRef<HTMLDivElement>(null);

  const [current, setCurrent] = useState(0);
  const total = CASES.length;

  const next = useCallback(() => setCurrent((p) => (p + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + total) % total), [total]);

  // Auto-advance every 6 s (pauses on interaction)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 6000);
  }, [next]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

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

      gsap.fromTo(sliderRef.current,
        { opacity: 0, x: 80 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'expo.out',
          scrollTrigger: { trigger: sliderRef.current, ...base } }
      );

      const kpiCards = kpiRef.current?.querySelectorAll('.kpi-card');
      if (kpiCards?.length) {
        gsap.fromTo(kpiCards,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.14, ease: 'expo.out',
            scrollTrigger: { trigger: kpiRef.current, ...base } }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth' });
  };

  const goTo = (idx: number) => { setCurrent(idx); resetTimer(); };

  return (
    <section
      id="resultados"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-[#f4f6f9]"
      aria-label="Cases de resultados"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div ref={headerRef} className="text-center mb-14">
          <span className="section-label justify-center">RESULTADOS</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#003366] font-heading mt-2">
            Cases de sucesso que comprovam nossa excelência
          </h2>
          <p className="text-lg text-[#666] mt-4 max-w-2xl mx-auto">
            Resultados reais de clientes que confiaram em nossa expertise tributária.
          </p>
        </div>

        {/* ── Slider ── */}
        <div ref={sliderRef} className="relative mb-10">
          {/* Prev */}
          <button
            type="button"
            onClick={() => { prev(); resetTimer(); }}
            aria-label="Case anterior"
            className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 sm:-translate-x-4 lg:-translate-x-6 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-card flex items-center justify-center text-[#003366] hover:bg-[#003366] hover:text-white transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={() => { next(); resetTimer(); }}
            aria-label="Próximo case"
            className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 sm:translate-x-4 lg:translate-x-6 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-card flex items-center justify-center text-[#003366] hover:bg-[#003366] hover:text-white transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Track */}
          <div className="overflow-hidden rounded-3xl shadow-navy-md">
            <div
              className="flex transition-transform duration-700 ease-dramatic results-slider-track"
              data-current={current}
            >
              {CASES.map((c) => {
                const ac = ACCENT[c.accent];
                return (
                  <div
                    key={c.id}
                    className="w-full flex-shrink-0"
                    aria-current={CASES[current].id === c.id ? 'true' : undefined}
                  >
                    <div className="bg-white grid lg:grid-cols-2">
                      {/* Image */}
                      <div className="relative h-56 lg:h-auto min-h-[300px]">
                        <img
                          src={c.image}
                          alt={c.company}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/20" />
                        <span className={`absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-bold ${ac.badge}`}>
                          <c.icon className="w-3.5 h-3.5" />
                          {c.industry}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <h3 className="text-2xl lg:text-3xl font-black text-[#003366] font-heading mb-2">
                          {c.company}
                        </h3>
                        <div className="mb-5">
                          <div className={`text-4xl lg:text-5xl font-black font-heading leading-none ${ac.text}`}>
                            {c.result}
                          </div>
                          <div className="text-[#777] text-sm mt-1">{c.metric}</div>
                        </div>
                        <p className="text-[#555] leading-relaxed mb-6 text-sm lg:text-base">
                          {c.description}
                        </p>

                        {/* Highlights */}
                        <ul className="space-y-2 mb-8">
                          {c.highlights.map((h) => (
                            <li key={h} className="flex items-center gap-2 text-sm text-[#444]">
                              <CheckCircle className="w-4 h-4 text-[#00A86B] flex-shrink-0" />
                              {h}
                            </li>
                          ))}
                        </ul>

                        <a
                          href="#contato"
                          onClick={scrollToContact}
                          className="inline-flex items-center gap-2 font-bold text-sm text-[#003366] hover:text-[#00A86B] transition-colors duration-300 underline-animate w-fit"
                        >
                          Quero resultados assim
                          <ChevronRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-6" aria-label="Navegação de slides">
            {CASES.map((c, i) => (
              <button
                key={c.id}
                type="button"
                aria-label={`Ir para slide ${i + 1}: ${c.company}`}
                aria-current={i === current ? 'true' : undefined}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'w-8 bg-[#003366]' : 'w-2 bg-[#003366]/25 hover:bg-[#003366]/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── KPI summary ── */}
        <div ref={kpiRef} className="grid sm:grid-cols-3 gap-6">
          {[
            { value: 'R$ 2,6M+', label: 'Total recuperado em cases',    color: 'text-[#00A86B]' },
            { value: '98%',       label: 'Taxa de sucesso comprovada',   color: 'text-[#003366]' },
            { value: '30 dias',   label: 'Tempo médio de primeira análise', color: 'text-[#00A86B]' },
          ].map((kpi) => (
            <div key={kpi.label} className="kpi-card text-center p-7 bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-300">
              <div className={`text-4xl font-black font-heading mb-2 ${kpi.color}`}>{kpi.value}</div>
              <div className="text-[#666] text-sm">{kpi.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
