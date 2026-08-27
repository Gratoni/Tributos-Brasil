import { z } from 'zod';

// Shared validation + sanitization helpers used by both frontend and server

export const SEGMENTS = new Set([
  'Indústria', 'Comércio', 'Serviços', 'Tecnologia',
  'Saúde', 'Construção', 'Agronegócio', 'Outros', '',
]);

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  segment?: string;
  message?: string;
  honeypot?: string;
};

// HTML entity escape for safe rendering in emails
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#47;',
};

export function htmlEscape(value: string) {
  return String(value).replace(/[&<>"'\/]/g, (ch) => HTML_ENTITIES[ch]);
}

// Strip Unicode control chars (C0/C1)
const CONTROL_RE_GLOBAL = /\p{Cc}/gu;

export function stripControlChars(value: string) {
  return String(value).replace(CONTROL_RE_GLOBAL, ' ');
}

export function sanitizeField(value: unknown) {
  if (typeof value !== 'string') return '';
  return stripControlChars(value).replace(/\s+/g, ' ').trim();
}

export function sanitizeMessage(value: unknown) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(CONTROL_RE_GLOBAL, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

export function isValidEmailFormat(email: string) {
  return /^[^\s@]{1,64}@[^{\s@]{1,255}\.\w{1,63}$/.test(email) || /^[^\s@]{1,64}@[^{\s@]{1,255}\.[^\s@]{1,63}$/.test(email) || /^[^\s@]{1,64}@[\w.-]{1,255}\.[A-Za-z]{1,63}$/.test(email);
}

// Simpler, safe email pattern used in the original implementation
export function isValidEmail(email: string) {
  return /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{1,63}$/.test(email);
}

export function isValidPhone(phone?: string) {
  if (!phone) return true;
  return /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/.test(phone);
}

export function redact(p: Partial<ContactPayload>) {
  return {
    name:    p.name    ? `${p.name.slice(0, 2)}***` : '',
    email:   p.email   ? p.email.replace(/(.{1}).*(@.*)/, '$1***$2') : '',
    phone:   p.phone   ? '***' : '',
    company: p.company ? `${p.company.slice(0, 3)}***` : '',
    segment: p.segment || '',
    msgLen:  p.message?.length ?? 0,
  };
}

// Zod schema for client/server validation (does not perform MX checks)
export const ContactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().min(1).max(254).regex(/^[^\s@]{1,64}@[^^\s@]{1,255}\.[^\s@]{1,63}$/),
  phone: z.string().optional(),
  company: z.string().optional(),
  segment: z.string().optional(),
  message: z.string().max(2000).optional(),
  honeypot: z.string().optional(),
});
