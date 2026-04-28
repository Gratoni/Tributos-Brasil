/**
 * api/contact.js — Vercel Serverless Function
 * =============================================
 * Handles contact form submissions for tributosbrasil.com.br.
 *
 * Security layers applied (defense-in-depth):
 *   1. Method allow-list (POST only)
 *   2. Strict Origin allow-list (production rejects requests with no/foreign Origin)
 *   3. Content-Type allow-list (application/json only)
 *   4. Body size guard (16 KiB ceiling)
 *   5. Honeypot anti-spam field (silent 200 to bots)
 *   6. Per-IP rate limit (best-effort in-memory token bucket)
 *   7. Type-safe field validation (regex with bounded quantifiers — no ReDoS)
 *   8. Unicode-control-char stripping (defeats email-header injection / CRLF tricks)
 *   9. Proper HTML entity escaping in the rendered email body (defeats XSS,
 *      replaces the previous fragile single-pass tag-stripping regex)
 *  10. Allow-list of segments (not free-text)
 *  11. PII-redacted dev fallback logging
 *  12. No reflection of raw user input in API error responses
 *
 * Environment variables (set on Vercel > Settings > Environment Variables):
 *   RESEND_API_KEY     API key from resend.com
 *   CONTACT_TO         Recipient email
 *   CONTACT_FROM       Verified sender
 *   ALLOWED_ORIGIN     Production origin (default: https://tributosbrasil.com.br)
 *   RATE_LIMIT_MAX     Max requests per window per IP (default 5)
 *   RATE_LIMIT_WINDOW  Window size in seconds (default 60)
 */

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://tributosbrasil.com.br';
const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_MAX    = Number(process.env.RATE_LIMIT_MAX)    || 5;
const RATE_LIMIT_WINDOW = (Number(process.env.RATE_LIMIT_WINDOW) || 60) * 1000;

const SEGMENTS = new Set([
  'Indústria', 'Comércio', 'Serviços', 'Tecnologia',
  'Saúde', 'Construção', 'Agronegócio', 'Outros', '',
]);

// ── Rate limiting (best-effort in-memory) ─────────────────────────────────────
// Effective only within a single warm Lambda container. For production-grade
// distributed rate limiting, swap this for Vercel KV / Upstash Redis. The
// honeypot + Origin check + body validation already block the bulk of abuse.
const rlBuckets = new Map();

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

// ── Helpers ───────────────────────────────────────────────────────────────────

const HTML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#47;',
};

/** HTML-encode every char that could break out of a text node or attribute. */
function htmlEscape(value) {
  return String(value).replace(/[&<>"'/]/g, (ch) => HTML_ENTITIES[ch]);
}

// All Unicode "Other, Control" code points — covers C0 (0x00-0x1F), DEL,
// and C1 (0x80-0x9F) without writing fragile \x escape sequences.
const CONTROL_RE_GLOBAL = /\p{Cc}/gu;

/** Strip every control char (CR, LF, TAB, NUL, DEL, C1, …). */
function stripControlChars(value) {
  return String(value).replace(CONTROL_RE_GLOBAL, ' ');
}

/** Single-line field: strip control chars, collapse whitespace, trim. */
function sanitizeField(value) {
  if (typeof value !== 'string') return '';
  return stripControlChars(value).replace(/\s+/g, ' ').trim();
}

/** Multi-line message: keep newlines, drop other control chars, normalize CRLF. */
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

/** Email format with bounded quantifiers (no ReDoS). */
function isValidEmail(email) {
  return /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{1,63}$/.test(email);
}

/** Brazilian phone: (XX) XXXX-XXXX or (XX) XXXXX-XXXX. */
function isValidPhone(phone) {
  if (!phone) return true;
  return /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/.test(phone);
}

function jsonError(res, status, message) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).json({ ok: false, error: message });
}

/** Extract the first-hop client IP from Vercel forwarding headers. */
function clientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length > 0) return xff.split(',')[0].trim();
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || '';
}

/** Build a redacted projection of the payload for safe server-side logging. */
function redact(p) {
  return {
    name:    p.name    ? `${p.name.slice(0, 2)}***` : '',
    email:   p.email   ? p.email.replace(/(.{1}).*(@.*)/, '$1***$2') : '',
    phone:   p.phone   ? '***' : '',
    company: p.company ? `${p.company.slice(0, 3)}***` : '',
    segment: p.segment || '',
    msgLen:  p.message?.length ?? 0,
  };
}

// ── Handler ───────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');

  // 1. Method
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return jsonError(res, 405, 'Method not allowed');
  }

  // 2. Origin
  const origin = req.headers['origin'] || '';
  const isLocalDev =
    origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1');
  if (process.env.NODE_ENV === 'production') {
    if (origin !== ALLOWED_ORIGIN) return jsonError(res, 403, 'Forbidden');
  } else if (!isLocalDev && origin && origin !== ALLOWED_ORIGIN) {
    return jsonError(res, 403, 'Forbidden');
  }

  // 3. Content-Type
  const ctype = String(req.headers['content-type'] || '').toLowerCase();
  if (!ctype.startsWith('application/json')) {
    return jsonError(res, 415, 'Unsupported Media Type');
  }

  // 4. Body size guard
  const contentLength = Number(req.headers['content-length'] || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return jsonError(res, 413, 'Payload too large');
  }

  // 5. Rate limit
  const ip = clientIp(req);
  if (rateLimit(ip)) {
    res.setHeader('Retry-After', String(Math.ceil(RATE_LIMIT_WINDOW / 1000)));
    return jsonError(res, 429, 'Muitas requisições. Tente novamente em instantes.');
  }

  // 6. Parse
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return jsonError(res, 400, 'Invalid JSON');
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return jsonError(res, 400, 'Invalid request body');
  }

  // 7. Honeypot
  if (typeof body._trap === 'string' && body._trap.length > 0) {
    return res.status(200).json({ ok: true });
  }

  // 8. Sanitize
  const name    = sanitizeField(body.name    ?? '');
  const email   = sanitizeField(body.email   ?? '').toLowerCase();
  const phone   = sanitizeField(body.phone   ?? '');
  const company = sanitizeField(body.company ?? '');
  const segment = sanitizeField(body.segment ?? '');
  const message = sanitizeMessage(body.message ?? '');

  // 9. Validate
  if (!name)                         return jsonError(res, 422, 'Nome é obrigatório.');
  if (name.length > 120)             return jsonError(res, 422, 'Nome muito longo.');
  if (!email)                        return jsonError(res, 422, 'Email é obrigatório.');
  if (email.length > 254)            return jsonError(res, 422, 'Email muito longo.');
  if (!isValidEmail(email))          return jsonError(res, 422, 'Email inválido.');
  if (phone && !isValidPhone(phone)) return jsonError(res, 422, 'Telefone inválido.');
  if (company.length > 150)          return jsonError(res, 422, 'Razão social muito longa.');
  if (!SEGMENTS.has(segment))        return jsonError(res, 422, 'Segmento inválido.');
  if (message.length > 2000)         return jsonError(res, 422, 'Mensagem muito longa (máx. 2 000 caracteres).');

  // 10. Compose: text body uses raw values; HTML body escapes them
  const safe = {
    name:    htmlEscape(name),
    email:   htmlEscape(email),
    phone:   htmlEscape(phone || '—'),
    company: htmlEscape(company || '—'),
    segment: htmlEscape(segment || '—'),
    message: htmlEscape(message || '(sem mensagem)'),
  };

  const textBody = `
Nova mensagem via formulário — Tributos Brasil

Nome:     ${name}
Email:    ${email}
Telefone: ${phone   || '—'}
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

  // 11. Send via Resend
  const apiKey    = process.env.RESEND_API_KEY;
  const toEmail   = process.env.CONTACT_TO   || 'contato@tributosbrasil.com.br';
  const fromEmail = process.env.CONTACT_FROM || 'Tributos Brasil <no-reply@tributosbrasil.com.br>';

  if (!apiKey) {
    console.log('[contact] RESEND_API_KEY not set — accepted (redacted):', redact({ name, email, phone, company, segment, message }));
    return res.status(200).json({ ok: true, dev: true });
  }

  try {
    const sendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from:    fromEmail,
        to:      [toEmail],
        replyTo: email,
        subject: `Contato: ${name} (${segment || 'sem segmento'})`,
        text:    textBody,
        html:    htmlBody,
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
