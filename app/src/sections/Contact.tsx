/**
 * Contact Section — Tributos Brasil Ltda
 * =========================================
 * Lead-capture form with:
 *   - Controlled form state (name, email, phone, company, segment, message)
 *   - Honeypot anti-spam field (_trap)
 *   - Client-side validation (name, email required; phone format; length limits)
 *   - POST to /api/contact serverless function
 *   - Success / error / loading states
 *   - Contact info cards (address, phone, email, hours)
 */

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ChevronDown, AlertCircle } from 'lucide-react';

const CONTACT_INFO = [
  {
    icon: MapPin,
    title: 'Endereço',
    lines: ['Av. Paulista, 1000 — Sala 1501', 'São Paulo/SP · CEP 01310-100'],
  },
  {
    icon: Phone,
    title: 'Telefone',
    lines: ['(11) 3000-0000', '(11) 95707-7345'],
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['contato@tributosbrasil.com.br'],
  },
  {
    icon: Clock,
    title: 'Horário',
    lines: ['Seg – Sex: 9h às 18h', 'Suporte 24h para clientes ativos'],
  },
] as const;

const SEGMENTS = [
  'Indústria', 'Comércio', 'Serviços', 'Tecnologia',
  'Saúde', 'Construção', 'Agronegócio', 'Outros',
] as const;

// ── Validation ────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{1,63}$/;
/** Accepts (XX) XXXX-XXXX and (XX) XXXXX-XXXX with optional formatting chars */
const PHONE_RE = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  segment: string;
  message: string;
}

const EMPTY: FormState = { name: '', email: '', phone: '', company: '', segment: '', message: '' };

type FormErrors = Partial<Record<keyof FormState, string>>;

function validateForm(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim())
    errors.name = 'Nome é obrigatório.';
  else if (form.name.trim().length > 120)
    errors.name = 'Nome muito longo (máx. 120 caracteres).';

  if (!form.email.trim())
    errors.email = 'Email é obrigatório.';
  else if (!EMAIL_RE.test(form.email.trim()))
    errors.email = 'Informe um email válido.';

  if (form.phone.trim() && !PHONE_RE.test(form.phone.trim()))
    errors.phone = 'Formato inválido. Ex: (11) 99999-9999';

  if (form.company.trim().length > 150)
    errors.company = 'Razão social muito longa (máx. 150 caracteres).';

  if (form.message.trim().length > 2000)
    errors.message = 'Mensagem muito longa (máx. 2 000 caracteres).';

  return errors;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const base = { start: 'top 82%', toggleActions: 'play none none none' };

      const headerChildren = headerRef.current?.children;
      if (headerChildren?.length) {
        gsap.fromTo(headerChildren,
          { opacity: 0, y: 28 },
          {
            opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'expo.out',
            scrollTrigger: { trigger: headerRef.current, ...base }
          }
        );
      }

      gsap.fromTo(formRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1, x: 0, duration: 0.7, ease: 'expo.out',
          scrollTrigger: { trigger: formRef.current, ...base }
        }
      );

      const cards = infoRef.current?.querySelectorAll('.info-card');
      if (cards?.length) {
        gsap.fromTo(cards,
          { opacity: 0, x: 50 },
          {
            opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'expo.out',
            scrollTrigger: { trigger: infoRef.current, ...base }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setApiError(null);
    if (errors[name as keyof FormState]) {
      setErrors((prev) => { const next = { ...prev }; delete next[name as keyof FormState]; return next; });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fieldErrors = validateForm(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setApiError(null);
    setSubmitting(true);

    // Read honeypot value from the hidden input
    const trapValue = (e.currentTarget.elements.namedItem('_trap') as HTMLInputElement | null)?.value ?? '';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, _trap: trapValue }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setApiError(data?.error ?? 'Erro ao enviar mensagem. Tente novamente.');
        return;
      }

      setSubmitted(true);
      setForm(EMPTY);
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setApiError('Sem conexão. Verifique sua internet e tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[#333] placeholder:text-[#aaa] text-sm ' +
    'focus:border-[#00A86B] focus:ring-2 focus:ring-[#00A86B]/20 outline-none transition-all duration-300';

  const errorInputClass = 'border-red-400 focus:border-red-400 focus:ring-red-200';

  return (
    <section
      id="contato"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-white"
      aria-label="Entre em contato"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div ref={headerRef} className="text-center mb-14">
          <span className="section-label justify-center">CONTATO</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#003366] font-heading mt-2">
            Fale com nossos especialistas
          </h2>
          <p className="text-lg text-[#666] mt-4 max-w-xl mx-auto">
            Preencha o formulário ou entre em contato diretamente.
            Retornaremos em até 24 horas.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 xl:gap-16">

          {/* ── Form ── */}
          <div className="lg:col-span-3">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="bg-[#f4f6f9] rounded-3xl p-8 lg:p-10"
              noValidate
            >
              {/* Honeypot — hidden from real users, bots will fill it */}
              <input
                type="text"
                name="_trap"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute w-0 h-0 opacity-0 pointer-events-none overflow-hidden"
              />

              {submitted ? (
                /* Success state */
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="w-20 h-20 bg-[#00A86B]/12 rounded-full flex items-center justify-center mb-6 animate-scale-in">
                    <CheckCircle2 className="w-10 h-10 text-[#00A86B]" />
                  </div>
                  <h3 className="text-2xl font-black text-[#003366] font-heading mb-2">
                    Mensagem enviada!
                  </h3>
                  <p className="text-[#666]">
                    Nosso time entrará em contato em breve.
                  </p>
                </div>
              ) : (
                <>
                  {/* API error banner */}
                  {apiError && (
                    <div role="alert" className="flex items-start gap-3 mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{apiError}</span>
                    </div>
                  )}

                  {/* Row 1: name + email */}
                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-[#003366] mb-2 uppercase tracking-wide">
                        Nome completo *
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Seu nome"
                        maxLength={120}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        className={`${inputClass} ${errors.name ? errorInputClass : ''}`}
                      />
                      {errors.name && <p id="name-error" role="alert" className="mt-1.5 text-xs text-red-500 font-medium">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-[#003366] mb-2 uppercase tracking-wide">
                        Email *
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        maxLength={254}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        className={`${inputClass} ${errors.email ? errorInputClass : ''}`}
                      />
                      {errors.email && <p id="email-error" role="alert" className="mt-1.5 text-xs text-red-500 font-medium">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Row 2: phone + company */}
                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold text-[#003366] mb-2 uppercase tracking-wide">
                        Telefone / WhatsApp
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="(11) 99999-9999"
                        maxLength={20}
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                        className={`${inputClass} ${errors.phone ? errorInputClass : ''}`}
                      />
                      {errors.phone && <p id="phone-error" role="alert" className="mt-1.5 text-xs text-red-500 font-medium">{errors.phone}</p>}
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-xs font-bold text-[#003366] mb-2 uppercase tracking-wide">
                        Empresa
                      </label>
                      <input
                        id="company"
                        type="text"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Razão social"
                        maxLength={150}
                        aria-invalid={!!errors.company}
                        aria-describedby={errors.company ? 'company-error' : undefined}
                        className={`${inputClass} ${errors.company ? errorInputClass : ''}`}
                      />
                      {errors.company && <p id="company-error" role="alert" className="mt-1.5 text-xs text-red-500 font-medium">{errors.company}</p>}
                    </div>
                  </div>

                  {/* Row 3: segment */}
                  <div className="mb-5">
                    <label htmlFor="segment" className="block text-xs font-bold text-[#003366] mb-2 uppercase tracking-wide">
                      Segmento de atuação
                    </label>
                    <div className="relative">
                      <select
                        id="segment"
                        name="segment"
                        value={form.segment}
                        onChange={handleChange}
                        className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                      >
                        <option value="">Selecione seu segmento</option>
                        {SEGMENTS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999] pointer-events-none" />
                    </div>
                  </div>

                  {/* Row 4: message */}
                  <div className="mb-7">
                    <label htmlFor="message" className="block text-xs font-bold text-[#003366] mb-2 uppercase tracking-wide">
                      Como podemos ajudar?
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      maxLength={2000}
                      placeholder="Descreva brevemente sua situação fiscal..."
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      className={`${inputClass} resize-none ${errors.message ? errorInputClass : ''}`}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.message
                        ? <p id="message-error" role="alert" className="text-xs text-red-500 font-medium">{errors.message}</p>
                        : <span />
                      }
                      <span className="text-xs text-[#aaa]">{form.message.length}/2000</span>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#003366] text-white font-bold rounded-xl transition-all duration-300 hover:bg-[#00A86B] hover:shadow-green-md hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Enviar mensagem
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-[#aaa] mt-4">
                    Seus dados são tratados com total confidencialidade.
                  </p>
                </>
              )}
            </form>
          </div>

          {/* ── Contact info ── */}
          <div ref={infoRef} className="lg:col-span-2 flex flex-col gap-4">
            {CONTACT_INFO.map((info) => (
              <div
                key={info.title}
                className="info-card group flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-card hover:border-[#00A86B]/20 hover:-translate-y-0.5"
              >
                <div className="w-11 h-11 bg-[#003366]/8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-[#00A86B]">
                  <info.icon className="w-5 h-5 text-[#003366] transition-colors duration-300 group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-[#003366] text-sm mb-1">{info.title}</h4>
                  {info.lines.map((line, i) => (
                    <p key={i} className="text-sm text-[#666]">{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-44 bg-[#f4f6f9] flex flex-col items-center justify-center gap-2 text-[#aaa]">
              <MapPin className="w-7 h-7" />
              <p className="text-sm font-medium text-[#777]">Av. Paulista, 1000 — São Paulo/SP</p>
              <a
                href="https://maps.google.com/?q=Av+Paulista+1000+São+Paulo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#00A86B] font-bold hover:underline"
              >
                Ver no Google Maps →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
