import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// In-memory rate limit store: ip -> [timestamps]
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  if (timestamps.length >= RATE_LIMIT_MAX) return true;
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim();
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

const VALID_SERVICES = [
  'Web and app development',
  'AI and automation',
  'MVP development',
  'Ongoing support',
  'Not sure yet',
];

export async function POST(req: NextRequest) {
  // Enforce JSON content type
  const contentType = req.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ error: 'Invalid content type.' }, { status: 400 });
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "You've sent too many messages recently. Please try again in an hour." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  const name = typeof raw.name === 'string' ? stripHtml(raw.name) : '';
  const email = typeof raw.email === 'string' ? stripHtml(raw.email) : '';
  const service = typeof raw.service === 'string' ? stripHtml(raw.service) : '';
  const message = typeof raw.message === 'string' ? stripHtml(raw.message) : '';

  // Server-side validation
  const errors: string[] = [];
  if (!name) errors.push('Name is required.');
  if (!email) {
    errors.push('Email is required.');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Invalid email address.');
  }
  if (!service || !VALID_SERVICES.includes(service)) errors.push('Invalid service selection.');
  if (!message) errors.push('Message is required.');
  if (name.length > 200) errors.push('Name is too long.');
  if (message.length > 5000) errors.push('Message is too long.');

  if (errors.length > 0) {
    return NextResponse.json({ error: errors[0] }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const contactEmail = process.env.CONTACT_EMAIL ?? 'hello@azdevs.ca';

  try {
    await resend.emails.send({
      from: 'AZDEVS Contact Form <onboarding@resend.dev>',
      to: contactEmail,
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
                    <td style="padding: 8px 0; border-bottom: 1px solid #f0ede6; font-size: 14px;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f0ede6; font-size: 13px; color: #888;">Email</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f0ede6; font-size: 14px;">
                      <a href="mailto:${email}" style="color: #C85A1E;">${email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f0ede6; font-size: 13px; color: #888;">Service</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #f0ede6; font-size: 14px;">${service}</td>
                  </tr>
                </table>
                <div style="margin-top: 20px;">
                  <p style="font-size: 13px; color: #888; margin: 0 0 8px;">Message</p>
                  <div style="background: #F7F6F2; border-radius: 6px; padding: 14px 16px; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${message}</div>
                </div>
              </div>
              <div style="background: #fafaf8; border-top: 1px solid #f0ede6; padding: 14px 24px;">
                <p style="margin: 0; font-size: 12px; color: #aaa;">Reply directly to this email to respond to ${name}.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
  }
}
