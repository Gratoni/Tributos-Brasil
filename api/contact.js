/**
 * api/contact.js — Vercel Serverless Function
 */

import { resolveMx } from 'dns/promises';

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://tributosbrasil.com.br';
const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX) || 5;
const RATE_LIMIT_WINDOW = (Number(process.env.RATE_LIMIT_WINDOW) || 60) * 1000;

const SEGMENTS = new Set([
  'Indústria', 'Comércio', 'Serviços', 'Tecnologia',
  'Saúde', 'Construção', 'Agronegócio', 'Outros', '',
]);

const rlBuckets = new Map();
const HTML_ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#47;' };
const CONTROL_RE_GLOBAL = /\p{Cc}/gu;

function htmlEscape(value) {
  return String(value).replace(/[&<>"'/]/g, (ch) => HTML_ENTITIES[ch]);
}

function stripControlChars(value) {
  return String(value).replace(CONTROL_RE_GLOBAL, ' ');
}

function sanitizeField(value) {
  if (typeof value !== 'string') return '';
  return stripControlChars(value).replace(/\s+/g, ' ').trim();
}

function sanitizeMessage(value) {
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

function isValidEmail(email) {
  return /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{1,63}$/.test(email);
}

async function hasValidMxRecord(email) {
  try {
    const domain = email.split('@')[1];
    if (!domain) return false;
    const records = await resolveMx(domain);
    return records && records.length > 0;
  } catch {
    return false;
  }
}

function isValidPhone(phone) {
  if (!phone) return true;
  return /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/.test(phone);
}

function jsonError(res, status, message) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).json({ ok: false, error: message });
}

function clientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length > 0) return xff.split(',')[0].trim();
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || '';
}

function redact(p) {
  return {
    name: p.name ? `${p.name.slice(0, 2)}***` : '',
    email: p.email ? p.email.replace(/(.{1}).*(@.*)/, '$1***$2') : '',
    phone: p.phone ? '***' : '',
    company: p.company ? `${p.company.slice(0, 3)}***` : '',
    segment: p.segment || '',
    msgLen: p.message?.length ?? 0,
  };
}

function rateLimit(ip) {
  if (!ip) return false;
  const now = Date.now();
  const bucket = rlBuckets.get(ip);
  if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW) {
    rlBuckets.set(ip, { count: 1, windowStart: now });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

setInterval(() => {
  const cutoff = Date.now() - RATE_LIMIT_WINDOW * 4;
  for (const [ip, b] of rlBuckets) if (b.windowStart < cutoff) rlBuckets.delete(ip);
}, RATE_LIMIT_WINDOW * 4).unref?.();

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return jsonError(res, 405, 'Method not allowed');
  }

  const origin = req.headers['origin'] || '';
  const isLocalDev = origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1');
  if (process.env.NODE_ENV === 'production') {
    if (origin !== ALLOWED_ORIGIN) return jsonError(res, 403, 'Forbidden');
  } else if (!isLocalDev && origin && origin !== ALLOWED_ORIGIN) {
    return jsonError(res, 403, 'Forbidden');
  }

  const ctype = String(req.headers['content-type'] || '').toLowerCase();
  if (!ctype.startsWith('application/json')) return jsonError(res, 415, 'Unsupported Media Type');

  const contentLength = Number(req.headers['content-length'] || 0);
  if (contentLength > MAX_BODY_BYTES) return jsonError(res, 413, 'Payload too large');

  const ip = clientIp(req);
  if (rateLimit(ip)) {
    res.setHeader('Retry-After', String(Math.ceil(RATE_LIMIT_WINDOW / 1000)));
    return jsonError(res, 429, 'Muitas requisições. Tente novamente em instantes.');
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return jsonError(res, 400, 'Invalid JSON');
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return jsonError(res, 400, 'Invalid request body');
  }

  if (typeof body.honeypot === 'string' && body.honeypot.length > 0) {
    return res.status(200).json({ ok: true });
  }

  const name = sanitizeField(body.name ?? '');
  const email = sanitizeField(body.email ?? '').toLowerCase();
  const phone = sanitizeField(body.phone ?? '');
  const company = sanitizeField(body.company ?? '');
  const segment = sanitizeField(body.segment ?? '');
  const message = sanitizeMessage(body.message ?? '');

  if (!name) return jsonError(res, 422, 'Nome é obrigatório.');
  if (name.length > 120) return jsonError(res, 422, 'Nome muito longo.');
  if (!email) return jsonError(res, 422, 'Email é obrigatório.');
  if (email.length > 254) return jsonError(res, 422, 'Email muito longo.');
  if (!isValidEmail(email)) return jsonError(res, 422, 'Email inválido.');
  if (!(await hasValidMxRecord(email))) return jsonError(res, 422, 'Domínio de email inválido.');
  if (phone && !isValidPhone(phone)) return jsonError(res, 422, 'Telefone inválido.');
  if (company.length > 150) return jsonError(res, 422, 'Razão social muito longa.');
  if (!SEGMENTS.has(segment)) return jsonError(res, 422, 'Segmento inválido.');
  if (message.length > 2000) return jsonError(res, 422, 'Mensagem muito longa (máx. 2 000 caracteres).');

  const safe = {
    name: htmlEscape(name),
    email: htmlEscape(email),
    phone: htmlEscape(phone || '—'),
    company: htmlEscape(company || '—'),
    segment: htmlEscape(segment || '—'),
    message: htmlEscape(message || '(sem mensagem)'),
  };

  const textBody = `
Nova mensagem via formulário — Tributos Brasil

Nome:     ${name}
Email:    ${email}
Telefone: ${phone || '—'}
Empresa:  ${company || '—'}
Segmento: ${segment || '—'}

Mensagem:
${message || '(sem mensagem)'}
  `.trim();

  const htmlBody = `
<h2 style="color:#003366;">Nova mensagem — Tributos Brasil</h2>
<table cellpadding="6" style="font-family:sans-serif;font-size:14px;">
  <tr><td><strong>Nome</strong></td><td>${safe.name}</td></tr>
  <tr><td><strong>Email</strong></td><td>${safe.email}</td></tr>
  <tr><td><strong>Telefone</strong></td><td>${safe.phone}</td></tr>
  <tr><td><strong>Empresa</strong></td><td>${safe.company}</td></tr>
  <tr><td><strong>Segmento</strong></td><td>${safe.segment}</td></tr>
</table>
<h3 style="color:#003366;">Mensagem:</h3>
<p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap;">${safe.message}</p>
  `.trim();

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO || 'contato@tributosbrasil.com.br';
  const fromEmail = process.env.CONTACT_FROM || 'Tributos Brasil <no-reply@tributosbrasil.com.br>';

  if (!apiKey) {
    console.log('[contact] RESEND_API_KEY not set — accepted (redacted):', redact({ name, email, phone, company, segment, message }));
    return res.status(200).json({ ok: true, dev: true });
  }

  try {
    const sendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        replyTo: email,
        subject: `Contato: ${name} (${segment || 'sem segmento'})`,
        text: textBody,
        html: htmlBody,
      }),
    });

    if (!sendRes.ok) {
      const detail = await sendRes.text().catch(() => '');
      console.error('[contact] Resend error:', sendRes.status, detail.slice(0, 500));
      return jsonError(res, 502, 'Erro ao enviar mensagem. Tente novamente.');
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[contact] fetch error:', err?.message || err);
    return jsonError(res, 502, 'Erro de rede ao enviar mensagem.');
  }
}
