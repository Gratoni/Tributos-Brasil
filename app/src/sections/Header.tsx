/**
 * Header — Tributos Brasil Ltda
 * ================================
 * Fixed navigation with:
 *   - Top bar: phone, hours and social quick links
 *   - Logo + brand name
 *   - Desktop navigation with active-section tracking via IntersectionObserver
 *   - Animated "Fale Conosco" CTA button
 *   - Mobile slide-down menu
 *   - Glass-morphism on scroll
 */

import { useState, useEffect, useCallback } from 'react';
import { Menu, X, Phone, Clock, ChevronDown, Linkedin, Instagram } from 'lucide-react';

/** Navigation items — label maps to the matching section id */
const NAV_ITEMS = [
  { label: 'Home',       href: '#home' },
  { label: 'Sobre',      href: '#sobre' },
  { label: 'Serviços',   href: '#servicos' },
  { label: 'Clientes',   href: '#clientes' },
  { label: 'Resultados', href: '#resultados' },
  { label: 'Contato',    href: '#contato' },
] as const;

export default function Header() {
  const [isScrolled,        setIsScrolled       ] = useState(false);
  const [isMobileMenuOpen,  setIsMobileMenuOpen  ] = useState(false);
  const [activeSection,     setActiveSection     ] = useState('home');
  const [isTopBarVisible,   setIsTopBarVisible   ] = useState(true);

  // ── Scroll & intersection logic ──────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 80);
      setIsTopBarVisible(scrollY < 40);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    NAV_ITEMS.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  // ── Close mobile menu on resize to desktop ────────────────────────────────
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Smooth scroll helper ──────────────────────────────────────────────────
  const scrollTo = useCallback((href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  }, []);

  const isLight = isScrolled || isMobileMenuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isLight ? 'glass-effect shadow-navy-sm py-3' : 'bg-transparent py-4'
      }`}
    >
      {/* ── Top bar ── */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          isTopBarVisible && !isMobileMenuOpen ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={isTopBarVisible && !isMobileMenuOpen ? 'false' : 'true'}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-1.5 text-xs border-b border-white/15">
            <div className="flex items-center gap-6 text-white/80">
              <span className="hidden sm:flex items-center gap-1.5">
                <Phone className="w-3 h-3" />
                (11) 3000-0000
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                Seg – Sex: 9h às 18h
              </span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-white/70 hover:text-[#00A86B] transition-colors duration-200"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-white/70 hover:text-[#00A86B] transition-colors duration-200"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <span className="w-px h-3 bg-white/20" />
              <a
                href="#contato"
                onClick={(e) => { e.preventDefault(); scrollTo('#contato'); }}
                className="text-white/80 hover:text-[#00A86B] transition-colors duration-200 font-medium"
              >
                Consultoria gratuita →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* ── Logo ── */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollTo('#home'); }}
            className="flex items-center gap-3 group flex-shrink-0"
            aria-label="Tributos Brasil — página inicial"
          >
            <div className="relative w-10 h-10 flex-shrink-0">
              <img
                src="/onlywhitelogo.png"
                alt="Tributos Brasil logo"
                className={`w-full h-full object-contain transition-all duration-300 ${
                  isLight ? 'logo-scrolled' : ''
                }`}
              />
            </div>
            <div className="hidden sm:block leading-tight">
              <span
                className={`block font-bold text-[1.05rem] tracking-tight transition-colors duration-300 font-heading ${
                  isLight ? 'text-[#003366]' : 'text-white'
                }`}
              >
                Tributos Brasil
              </span>
              <span
                className={`block text-[0.65rem] tracking-[0.18em] uppercase font-medium transition-colors duration-300 ${
                  isLight ? 'text-[#00A86B]' : 'text-white/60'
                }`}
              >
                Recuperação Tributária
              </span>
            </div>
          </a>

          {/* ── Desktop nav ── */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Menu principal">
            {NAV_ITEMS.map(({ label, href }) => {
              const sectionId = href.slice(1);
              const isActive  = activeSection === sectionId;
              return (
                <a
                  key={label}
                  href={href}
                  onClick={(e) => { e.preventDefault(); scrollTo(href); }}
                  className={`relative text-sm font-semibold tracking-wide transition-colors duration-300 py-1 group ${
                    isLight
                      ? isActive
                        ? 'text-[#00A86B]'
                        : 'text-[#333] hover:text-[#003366]'
                      : isActive
                        ? 'text-[#00A86B]'
                        : 'text-white/85 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                  {/* Active indicator */}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-[2px] bg-[#00A86B] rounded-full transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* ── Desktop CTA ── */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+551130000000"
              className={`hidden xl:flex items-center gap-2 text-sm font-semibold transition-colors duration-300 ${
                isLight ? 'text-[#003366] hover:text-[#00A86B]' : 'text-white/80 hover:text-white'
              }`}
              aria-label="Ligar agora"
            >
              <Phone className="w-4 h-4" />
              <span>(11) 3000-0000</span>
            </a>
            <span className={`hidden xl:block w-px h-5 ${isLight ? 'bg-gray-200' : 'bg-white/20'}`} />
            <a
              href="#contato"
              onClick={(e) => { e.preventDefault(); scrollTo('#contato'); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#00A86B] text-white text-sm font-bold rounded-lg transition-all duration-300 hover:bg-[#003366] hover:shadow-green-sm hover:-translate-y-0.5 select-none"
            >
              <Phone className="w-3.5 h-3.5" />
              Fale Conosco
            </a>
          </div>

          {/* ── Mobile toggle ── */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${
              isLight ? 'text-[#003366] hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
            type="button"
            aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* ── Mobile menu ── */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMobileMenuOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0'
          }`}
          aria-hidden={isMobileMenuOpen ? 'false' : 'true'}
        >
          <nav
            className="flex flex-col gap-1 py-4 border-t border-gray-200/30"
            aria-label="Menu mobile"
          >
            {NAV_ITEMS.map(({ label, href }) => {
              const isActive = activeSection === href.slice(1);
              return (
                <a
                  key={label}
                  href={href}
                  onClick={(e) => { e.preventDefault(); scrollTo(href); }}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-[#003366]/10 text-[#003366]'
                      : 'text-[#444] hover:bg-[#003366]/5 hover:text-[#003366]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                  {isActive && <ChevronDown className="w-4 h-4 text-[#00A86B] -rotate-90" />}
                </a>
              );
            })}

            {/* Mobile CTA */}
            <div className="pt-3 px-4 flex flex-col gap-2">
              <a
                href="tel:+551130000000"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-[#003366] text-[#003366] font-bold text-sm transition-all duration-200 hover:bg-[#003366] hover:text-white"
              >
                <Phone className="w-4 h-4" />
                (11) 3000-0000
              </a>
              <a
                href="#contato"
                onClick={(e) => { e.preventDefault(); scrollTo('#contato'); }}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#00A86B] text-white font-bold text-sm transition-all duration-200 hover:bg-[#003366]"
              >
                Fale com um Especialista
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
