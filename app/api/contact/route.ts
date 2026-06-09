/**
 * @file app/api/contact/route.ts
 * @description Contact form API endpoint. Validates and sanitises all input,
 *              enforces per-IP rate limiting, then forwards the message to the
 *              site owner via Resend transactional email.
 *
 * @dependencies resend, next/server
 *
 * @notes
 *  - Resend is lazy-initialised inside the handler so this module can be
 *    imported at build time without RESEND_API_KEY being present.
 *  - Rate limiting uses an in-memory Map which resets on cold starts — this is
 *    acceptable for a low-traffic contact form.
 *  - VALID_SERVICES is imported from lib/constants so the allowlist stays in
 *    sync with the UI select dropdown automatically.
 *  - Set RESEND_API_KEY and CONTACT_EMAIL in .env.local (dev) and the Vercel
 *    Environment Variables dashboard (production).
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { SERVICE_OPTIONS } from '@/lib/constants';

// ─── Rate Limiting ──────────────────────────────────────────────────────────────

// IP address → array of request timestamps within the current window.
const rateLimitMap = new Map<string, number[]>();

/** Maximum submissions allowed per IP within the rolling window */
const RATE_LIMIT_MAX = 3;

/** Rolling window duration: 1 hour in milliseconds */
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

/**
 * Prune stale entries from the rate limit map when it exceeds this size.
 * Prevents unbounded memory growth if many unique IPs hit the endpoint.
 */
const RATE_LIMIT_PRUNE_THRESHOLD = 500;

/**
 * Check whether `ip` has exceeded the rate limit.
 *
 * Returns `true` (blocked) without recording the attempt if the limit is hit.
 * Returns `false` (allowed) and records the current timestamp if under the limit.
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Prune IPs whose entire timestamp history has expired.
  // O(n) but only triggered once the map grows large, so negligible overhead.
  if (rateLimitMap.size > RATE_LIMIT_PRUNE_THRESHOLD) {
    for (const [storedIp, timestamps] of rateLimitMap.entries()) {
      if (timestamps.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        rateLimitMap.delete(storedIp);
      }
    }
  }

  // Filter out timestamps that have fallen outside the rolling window
  const timestamps = (rateLimitMap.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (timestamps.length >= RATE_LIMIT_MAX) return true;

  // Record this request and persist the updated list
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Strip HTML tags and trim whitespace from an untrusted string field. */
function sanitizeInput(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim();
}

/**
 * Escape characters with special meaning in HTML before interpolating user
 * values into the email body. Guards against accidental HTML injection even
 * though the email is only delivered to the site owner.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Extract the real client IP from Vercel / reverse-proxy forwarding headers.
 * Falls back to 'unknown' if no header is present (e.g. direct server calls).
 */
function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

// ─── Route Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // ── Content-type guard ────────────────────────────────────────────────────────
  // Reject anything that isn't JSON before we attempt to parse the body
  const contentType = req.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ error: 'Invalid content type.' }, { status: 400 });
  }

  // ── Rate limiting ─────────────────────────────────────────────────────────────
  // Check BEFORE parsing the body to short-circuit as early as possible
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "You've sent too many messages recently. Please try again in an hour." },
      { status: 429 }
    );
  }

  // ── Body parsing ──────────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // ── Sanitisation ──────────────────────────────────────────────────────────────
  // Cast to Record first, then coerce each field — non-strings become empty string
  const raw = body as Record<string, unknown>;
  const name = typeof raw.name === 'string' ? sanitizeInput(raw.name) : '';
  const email = typeof raw.email === 'string' ? sanitizeInput(raw.email) : '';
  const service = typeof raw.service === 'string' ? sanitizeInput(raw.service) : '';
  const message = typeof raw.message === 'string' ? sanitizeInput(raw.message) : '';

  // ── Validation ────────────────────────────────────────────────────────────────
  const errors: string[] = [];

  // Name: required, max 200 chars
  if (!name) {
    errors.push('Name is required.');
  } else if (name.length > 200) {
    errors.push('Name is too long.');
  }

  // Email: required, basic format check
  if (!email) {
    errors.push('Email is required.');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Invalid email address.');
  }

  // Service: must be one of the exact values shown in the UI select
  if (!service || !(SERVICE_OPTIONS as readonly string[]).includes(service)) {
    errors.push('Invalid service selection.');
  }

  // Message: required, max 5000 chars
  if (!message) {
    errors.push('Message is required.');
  } else if (message.length > 5000) {
    errors.push('Message is too long.');
  }

  if (errors.length > 0) {
    // Return only the first error to keep the client response surface small
    return NextResponse.json({ error: errors[0] }, { status: 400 });
  }

  // ── Resend initialisation ─────────────────────────────────────────────────────
  // Must be inside the handler — instantiating at module level causes a build-time
  // crash when RESEND_API_KEY is not present in the build environment.
  // Set RESEND_API_KEY in .env.local (dev) and the Vercel dashboard (production).
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  // Set CONTACT_EMAIL in .env.local and the Vercel dashboard.
  const contactEmail = process.env.CONTACT_EMAIL ?? 'hello@azdevs.ca';

  // Escape values before HTML interpolation in the email body
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeService = escapeHtml(service);
  const safeMessage = escapeHtml(message);

  // ── Send email ────────────────────────────────────────────────────────────────
  try {
    await resend.emails.send({

      // (e.g. noreply@azdevs.ca) once the domain is verified in the Resend dashboard.
      from: 'AZDEVS Contact Form <hello@azdevs.ca>',
      to: contactEmail,
      // replyTo ensures clicking "Reply" in the inbox goes directly to the enquirer
      replyTo: email,
      subject: `New enquiry from ${name} — ${service}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8" /></head>
          <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
            <div style="border: 1px solid #dedad2; border-radius: 8px; overflow: hidden;">
              <div style="background: #1a1a1a; padding: 20px 24px;">
                <span style="color: #F7F6F2; font-size: 16px; font-weight: 500; letter-spacing: 2px;">
                  AZ<span style="color: #C85A1E;">DEVS</span>
                </span>
              </div>
              <div style="padding: 28px 24px;">
                <h2 style="margin: 0 0 20px; font-size: 18px; font-weight: 500;">New enquiry</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f0ede6; font-size: 13px; color: #888; width: 100px;">Name</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f0ede6; font-size: 14px;">${safeName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f0ede6; font-size: 13px; color: #888;">Email</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f0ede6; font-size: 14px;">
                      <a href="mailto:${safeEmail}" style="color: #C85A1E;">${safeEmail}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f0ede6; font-size: 13px; color: #888;">Service</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f0ede6; font-size: 14px;">${safeService}</td>
                  </tr>
                </table>
                <div style="margin-top: 20px;">
                  <p style="font-size: 13px; color: #888; margin: 0 0 8px;">Message</p>
                  <div style="background: #F7F6F2; border-radius: 6px; padding: 14px 16px; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${safeMessage}</div>
                </div>
              </div>
              <div style="background: #fafaf8; border-top: 1px solid #f0ede6; padding: 14px 24px;">
                <p style="margin: 0; font-size: 12px; color: #aaa;">Reply directly to this email to respond to ${safeName}.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    // Do not forward Resend error details to the client
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
