/**
 * CTA Section — Tributos Brasil Ltda
 * =====================================
 * Full-bleed conversion section with:
 *   - Ken-Burns background image + deep gradient overlay
 *   - Character-by-character headline animation
 *   - Animated gradient-border CTA button
 *   - Three trust-signal badges
 *   - Decorative geometric rings
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Clock, Gift, Shield, Phone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TRUST_ITEMS = [
  { icon: Clock,  text: 'Retorno em até 24h'          },
  { icon: Gift,   text: 'Consultoria inicial gratuita' },
  { icon: Shield, text: '100% confidencial'            },
] as const;

const HEADLINE = 'Pronto para recuperar o que é seu?';

export default function CTA() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const btnRef      = useRef<HTMLAnchorElement>(null);
  const trustRef    = useRef<HTMLDivElement>(null);
  const bgRef       = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const base = { start: 'top 80%', toggleActions: 'play none none none' };

      // Background zoom-in
      gsap.fromTo(bgRef.current,
        { scale: 1.08, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, ...base } }
      );

      // Character-by-character headline
      const chars = headlineRef.current?.querySelectorAll('.char');
      if (chars?.length) {
        gsap.fromTo(chars,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 0.04, stagger: 0.025, ease: 'expo.out',
            scrollTrigger: { trigger: headlineRef.current, ...base },
          }
        );
      }

      // Subheadline
      gsap.fromTo(subRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: subRef.current, ...base } }
      );

      // Button scale-in
      gsap.fromTo(btnRef.current,
        { opacity: 0, scale: 0.88 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: btnRef.current, start: 'top 90%', toggleActions: 'play none none none' } }
      );

      // Trust badges
      const badges = trustRef.current?.children;
      if (badges?.length) {
        gsap.fromTo(badges,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'expo.out',
            scrollTrigger: { trigger: trustRef.current, start: 'top 90%', toggleActions: 'play none none none' } }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-32 lg:py-44 overflow-hidden"
      aria-label="Fale com nossos especialistas"
    >
      {/* ── Background ── */}
      <div ref={bgRef} className="absolute inset-0 z-0 will-change-transform gpu-layer">
        <img
          src="/cta-bg.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover animate-ken-burns"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#003366]/97 via-[#003366]/93 to-[#001a33]/97" />
      </div>

      {/* ── Decorative rings ── */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/[0.03]" />
        <div className="absolute top-1/4 left-12 w-28 h-28 rounded-full border border-white/10 animate-pulse" />
        <div className="absolute bottom-1/4 right-12 w-20 h-20 rounded-full border border-[#00A86B]/20 animate-pulse delay-700" />
        {/* Accent orbs */}
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#00A86B]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-[#003366]/30 rounded-full blur-3xl" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Section label */}
        <span className="section-label justify-center text-[#00A86B] mb-6 inline-flex">
          FALE COM UM ESPECIALISTA
        </span>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-heading mb-6 leading-tight"
          aria-label={HEADLINE}
        >
          {HEADLINE.split('').map((char, i) => (
            <span
              key={i}
              className="char inline-block"
              aria-hidden="true"
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h2>

        {/* Subheadline */}
        <p ref={subRef} className="text-xl text-white/75 mb-12 max-w-2xl mx-auto leading-relaxed">
          Fale com nossos especialistas e descubra quanto sua empresa pode recuperar.
          <strong className="text-white"> A primeira consulta é gratuita</strong> e sem compromisso.
        </p>

        {/* CTA Button — animated gradient border */}
        <div className="mb-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            ref={btnRef}
            href="#contato"
            onClick={scrollToContact}
            className="group relative inline-flex items-center gap-3 px-10 py-5 text-base font-black text-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-green-lg"
          >
            <span className="absolute inset-0 animate-gradient-border rounded-xl" aria-hidden="true" />
            <span className="absolute inset-[2px] bg-[#003366] rounded-[10px]" aria-hidden="true" />
            <span className="relative z-10 flex items-center gap-3">
              Fale com um Especialista
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </a>

          <a
            href="tel:+551130000000"
            className="inline-flex items-center gap-2 px-8 py-5 text-base font-bold text-white/80 border-2 border-white/20 rounded-xl transition-all duration-300 hover:text-white hover:border-white/50 hover:bg-white/5"
          >
            <Phone className="w-4 h-4" />
            (11) 3000-0000
          </a>
        </div>

        {/* Trust badges */}
        <div ref={trustRef} className="flex flex-wrap justify-center gap-6 lg:gap-10">
          {TRUST_ITEMS.map((item) => (
            <div key={item.text} className="flex items-center gap-3 text-white/70">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <item.icon className="w-4 h-4 text-[#00A86B]" />
              </div>
              <span className="font-medium text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
