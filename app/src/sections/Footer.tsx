/**
 * Footer — Tributos Brasil Ltda
 * ================================
 * Four-column footer with:
 *   - Brand + description + social links
 *   - Quick navigation links
 *   - Contact info
 *   - Newsletter sign-up
 *   - Compliance seals row (OAB, CRC, LGPD, SSL)
 *   - Bottom bar with copyright and legal links
 */

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import {
  MessageCircle,
  Send, ChevronRight, Shield, Award, Lock, FileCheck,
} from 'lucide-react';

// Brand icons removed from lucide-react — inline SVG replacements
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S.02 4.88.02 3.5 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.84v2.19h.05C12.92 8.72 14.64 8 16.56 8 20.64 8 21.5 10.52 21.5 14v10h-4v-8.88c0-2.12-.04-4.85-2.95-4.85-2.96 0-3.41 2.31-3.41 4.69V24H8V8z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.851s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

const FOOTER_LINKS = [
  { label: 'Home',        href: '#home'       },
  { label: 'Sobre Nós',   href: '#sobre'      },
  { label: 'Serviços',    href: '#servicos'   },
  { label: 'Clientes',    href: '#clientes'   },
  { label: 'Resultados',  href: '#resultados' },
  { label: 'Contato',     href: '#contato'    },
] as const;

const SOCIAL_LINKS = [
  { icon: LinkedinIcon,   href: '#', label: 'LinkedIn'   },
  { icon: InstagramIcon,  href: '#', label: 'Instagram'  },
  { icon: FacebookIcon,   href: '#', label: 'Facebook'   },
  { icon: MessageCircle,  href: '#', label: 'WhatsApp'   },
] as const;

const SEALS = [
  { icon: Award,     label: 'OAB/SP Registrado',   sub: 'Advogados'          },
  { icon: FileCheck, label: 'CRC Credenciado',      sub: 'Contadores'         },
  { icon: Shield,    label: 'LGPD Conforme',        sub: 'Privacidade de dados'},
  { icon: Lock,      label: 'SSL Certificado',      sub: 'Conexão segura'     },
] as const;

export default function Footer() {
  const footerRef   = useRef<HTMLElement>(null);
  const [email,     setEmail]     = useState('');
  const [subscribed,setSubscribed] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cols = footerRef.current?.querySelectorAll('.footer-column');
      if (cols?.length) {
        gsap.fromTo(cols,
          { opacity: 0, y: 36 },
          {
            opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'expo.out',
            scrollTrigger: { trigger: footerRef.current, start: 'top 90%', toggleActions: 'play none none none' },
          }
        );
      }
    }, footerRef);
    return () => ctx.revert();
  }, []);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    // Basic email format check
    if (!/^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{1,63}$/.test(trimmed)) return;
    setSubscribed(true);
    setTimeout(() => { setSubscribed(false); setEmail(''); }, 3500);
  };

  return (
    <footer
      ref={footerRef}
      className="bg-[#001a33] text-white relative overflow-hidden"
    >
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
        <span className="text-[18rem] font-black text-white/[0.018] font-heading">TB</span>
      </div>

      {/* ── Seals bar ── */}
      <div className="relative z-10 border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
            {SEALS.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-2.5 text-white/50">
                <Icon className="w-4 h-4 text-[#00A86B]" />
                <div>
                  <div className="text-xs font-bold text-white/70">{label}</div>
                  <div className="text-[10px] text-white/40">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main columns ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="footer-column">
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); scrollTo('#home'); }}
              className="flex items-center gap-3 mb-6 group"
              aria-label="Tributos Brasil — início"
            >
              <img
                src="/onlywhitelogo.png"
                alt="Logo Tributos Brasil"
                className="w-10 h-10 object-contain"
                loading="lazy"
              />
              <div className="leading-tight">
                <span className="block font-black text-base font-heading">Tributos Brasil</span>
                <span className="block text-[0.65rem] text-white/40 tracking-widest uppercase">Ltda.</span>
              </div>
            </a>
            <p className="text-white/55 text-sm leading-relaxed mb-6">
              Especialistas em recuperação tributária e planejamento fiscal. Transformando
              complexidade fiscal em valor real para empresas desde 2014.
            </p>
            <div className="flex gap-2.5">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-white/8 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-[#00A86B] hover:scale-110"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="footer-column">
            <h4 className="font-black text-sm font-heading mb-6 uppercase tracking-widest">Links Rápidos</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={(e) => { e.preventDefault(); scrollTo(href); }}
                    className="text-white/55 hover:text-[#00A86B] transition-colors duration-300 flex items-center gap-2 group text-sm"
                  >
                    <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-column">
            <h4 className="font-black text-sm font-heading mb-6 uppercase tracking-widest">Contato</h4>
            <ul className="space-y-4 text-white/55 text-sm">
              <li>
                <span className="block text-white/30 text-xs mb-1 uppercase tracking-widest">Endereço</span>
                Av. Paulista, 1000 — Sala 1501<br />
                São Paulo/SP · CEP 01310-100
              </li>
              <li>
                <span className="block text-white/30 text-xs mb-1 uppercase tracking-widest">Telefone</span>
                <a href="tel:+551130000000" className="hover:text-[#00A86B] transition-colors duration-300">
                  (11) 3000-0000
                </a>
              </li>
              <li>
                <span className="block text-white/30 text-xs mb-1 uppercase tracking-widest">Email</span>
                <a href="mailto:contato@tributosbrasil.com.br" className="hover:text-[#00A86B] transition-colors duration-300 break-all">
                  contato@tributosbrasil.com.br
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-column">
            <h4 className="font-black text-sm font-heading mb-6 uppercase tracking-widest">Receba Novidades</h4>
            <p className="text-white/55 text-sm leading-relaxed mb-5">
              Fique por dentro das mudanças na legislação tributária e novas oportunidades de recuperação.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-4 bg-[#00A86B]/15 rounded-xl text-[#00A86B] text-sm font-semibold">
                <MessageCircle className="w-4 h-4" />
                Inscrição confirmada!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2" noValidate>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu e-mail"
                  required
                  aria-label="Email para newsletter"
                  className="flex-1 px-4 py-3 bg-white/8 rounded-xl border border-white/10 text-white text-sm placeholder:text-white/35 focus:border-[#00A86B] focus:ring-2 focus:ring-[#00A86B]/20 outline-none transition-all duration-300"
                />
                <button
                  type="submit"
                  aria-label="Inscrever"
                  className="px-4 py-3 bg-[#00A86B] rounded-xl transition-all duration-300 hover:bg-[#003366] hover:scale-105 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-16 pt-8 border-t border-white/8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/35 text-xs text-center md:text-left">
              © {new Date().getFullYear()} Tributos Brasil Ltda. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-xs">
              <a href="#" className="text-white/35 hover:text-[#00A86B] transition-colors duration-300">
                Política de Privacidade
              </a>
              <a href="#" className="text-white/35 hover:text-[#00A86B] transition-colors duration-300">
                Termos de Uso
              </a>
              <a href="#" className="text-white/35 hover:text-[#00A86B] transition-colors duration-300">
                LGPD
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
