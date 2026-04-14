/**
 * About Section — Tributos Brasil Ltda
 * =======================================
 * Company story, mission, vision and values.
 *
 * Bug fix from previous version:
 *   The floating info-cards used `absolute -left-8` which caused overflow/clipping
 *   on screens narrower than ~900px. Replaced with an inline-flow layout that
 *   remains accessible at all breakpoints.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Eye, Award, Shield, Lightbulb, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
  { icon: Award,     title: 'Excelência Técnica',          description: 'Compromisso com a mais alta qualidade em cada análise e parecer.' },
  { icon: Shield,    title: 'Ética e Transparência',        description: 'Conduta íntegra, sem atalhos — segurança jurídica em tudo.' },
  { icon: Target,    title: 'Foco em Resultados',           description: 'Cada ação é orientada a entregar valor real e mensurável.' },
  { icon: Lightbulb, title: 'Inovação Constante',           description: 'Metodologias atualizadas alinhadas às mudanças da legislação.' },
] as const;

const DIFFERENTIALS = [
  'Equipe multidisciplinar: advogados, contadores e especialistas fiscais',
  'Análise retroativa de até 5 anos de obrigações tributárias',
  'Honorários vinculados ao êxito — zero risco para o cliente',
  'Mais de 98% de aprovação nos processos administrativos',
] as const;

export default function About() {
  const sectionRef  = useRef<HTMLElement>(null);
  const labelRef    = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const textRef     = useRef<HTMLDivElement>(null);
  const imageRef    = useRef<HTMLDivElement>(null);
  const mvcRef      = useRef<HTMLDivElement>(null);
  const valuesRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = (el: Element | null, opts = {}) =>
        ({ trigger: el, start: 'top 82%', toggleActions: 'play none none none', ...opts });

      // Label
      gsap.fromTo(labelRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out',
          scrollTrigger: trigger(sectionRef.current) }
      );

      // Headline words
      const words = headlineRef.current?.querySelectorAll('.word');
      if (words?.length) {
        gsap.fromTo(words,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.045, ease: 'expo.out',
            scrollTrigger: trigger(headlineRef.current) }
        );
      }

      // Body paragraphs
      const paras = textRef.current?.children;
      if (paras?.length) {
        gsap.fromTo(paras,
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.18, ease: 'expo.out',
            scrollTrigger: trigger(textRef.current) }
        );
      }

      // Image reveal (clip-path wipe)
      gsap.fromTo(imageRef.current,
        { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)', opacity: 0 },
        { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', opacity: 1,
          duration: 0.9, ease: 'expo.out', scrollTrigger: trigger(imageRef.current) }
      );

      // Mission / Vision / differentials cards
      const mvcCards = mvcRef.current?.querySelectorAll('.mvc-card');
      if (mvcCards?.length) {
        gsap.fromTo(mvcCards,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'expo.out',
            scrollTrigger: trigger(mvcRef.current) }
        );
      }

      // Values grid
      const valueItems = valuesRef.current?.querySelectorAll('.value-item');
      if (valueItems?.length) {
        gsap.fromTo(valueItems,
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 0.4, stagger: 0.09, ease: 'back.out(1.5)',
            scrollTrigger: trigger(valuesRef.current) }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="sobre"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-white overflow-hidden"
      aria-label="Sobre a Tributos Brasil"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <div className="mb-14">
          <span ref={labelRef} className="section-label">SOBRE NÓS</span>
          <h2
            ref={headlineRef}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#003366] max-w-3xl font-heading mt-2"
          >
            {'Há uma década transformando o cenário tributário brasileiro'.split(' ').map((word, i) => (
              <span key={i} className="word inline-block mr-2">{word}</span>
            ))}
          </h2>
        </div>

        {/* ── Main grid ── */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-20">

          {/* Left — text + differentials */}
          <div ref={textRef} className="space-y-5">
            <p className="text-lg text-[#555] leading-relaxed">
              A Tributos Brasil nasceu da visão de especialistas em direito tributário que
              identificaram uma necessidade crucial: empresas pagando mais impostos do que
              deveriam, sem ter o conhecimento técnico para identificar oportunidades de
              recuperação.
            </p>
            <p className="text-lg text-[#555] leading-relaxed">
              Desde 2014, consolidamos uma equipe multidisciplinar de advogados, contadores
              e especialistas fiscais dedicados exclusivamente à recuperação de créditos
              tributários e ao planejamento fiscal estratégico.
            </p>

            {/* Differentials list */}
            <ul className="space-y-3 pt-2">
              {DIFFERENTIALS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[#444]">
                  <CheckCircle2 className="w-5 h-5 text-[#00A86B] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — image */}
          <div
            ref={imageRef}
            className="relative rounded-2xl overflow-hidden shadow-navy-lg"
          >
            <img
              src="/about-team.jpg"
              alt="Equipe Tributos Brasil em reunião"
              className="w-full h-[480px] object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/40 via-transparent to-transparent" />

            {/* Experience badge — always visible, no overflow */}
            <div className="absolute bottom-6 left-6 bg-white rounded-xl px-5 py-4 shadow-xl">
              <div className="text-4xl font-black text-[#003366] font-heading leading-none">10+</div>
              <div className="text-sm font-semibold text-[#555] mt-0.5">Anos de experiência</div>
            </div>
          </div>
        </div>

        {/* ── Mission / Vision / Differentials ── */}
        <div ref={mvcRef} className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-20">
          {/* Mission */}
          <div className="mvc-card flex items-start gap-5 p-7 bg-[#f4f6f9] rounded-2xl border-l-4 border-[#00A86B] hover:shadow-card transition-shadow duration-300">
            <div className="w-12 h-12 bg-[#00A86B]/15 rounded-xl flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-[#00A86B]" />
            </div>
            <div>
              <h3 className="font-bold text-[#003366] text-lg mb-2">Nossa Missão</h3>
              <p className="text-sm text-[#666] leading-relaxed">
                Maximizar a eficiência tributária das empresas através de soluções jurídicas
                robustas, éticas e orientadas a resultados concretos.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="mvc-card flex items-start gap-5 p-7 bg-[#f4f6f9] rounded-2xl border-l-4 border-[#003366] hover:shadow-card transition-shadow duration-300">
            <div className="w-12 h-12 bg-[#003366]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Eye className="w-6 h-6 text-[#003366]" />
            </div>
            <div>
              <h3 className="font-bold text-[#003366] text-lg mb-2">Nossa Visão</h3>
              <p className="text-sm text-[#666] leading-relaxed">
                Ser referência nacional em consultoria tributária, reconhecida pela excelência
                técnica e pelos resultados extraordinários que entrega.
              </p>
            </div>
          </div>
        </div>

        {/* ── Values grid ── */}
        <div>
          <h3 className="text-2xl font-black text-[#003366] mb-8 text-center font-heading">
            Nossos Valores
          </h3>
          <div ref={valuesRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="value-item group p-6 bg-[#f4f6f9] rounded-2xl transition-all duration-400 hover:bg-[#003366] hover:shadow-navy-md hover:-translate-y-2 cursor-default"
              >
                <div className="w-14 h-14 bg-[#003366] rounded-xl flex items-center justify-center mb-4 transition-all duration-400 group-hover:bg-[#00A86B]">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-[#003366] mb-2 transition-colors duration-300 group-hover:text-white font-heading">
                  {title}
                </h4>
                <p className="text-sm text-[#777] leading-relaxed transition-colors duration-300 group-hover:text-white/80">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
