/**
 * @file next.config.ts
 * @description Next.js configuration for the AZDEVS marketing site.
 *              Sets security response headers applied to every route.
 *
 * @notes CSP keeps 'unsafe-eval' and 'unsafe-inline' in script-src because
 *        Next.js / Turbopack injects inline scripts during development and the
 *        framework itself requires eval for hot-module replacement. These
 *        directives have no meaningful attack surface on a static marketing site
 *        with no user-generated content rendered server-side.
 */

import type { NextConfig } from 'next';

// ─── Security Headers ───────────────────────────────────────────────────────────

const securityHeaders = [
  // Prevent the page from being loaded inside an iframe on any origin
  { key: 'X-Frame-Options', value: 'DENY' },

  // Stop browsers from MIME-sniffing the declared content type
  { key: 'X-Content-Type-Options', value: 'nosniff' },

  // Send the full origin on same-origin requests; only the origin on cross-origin
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

  // Disable browser features that are never used on this site
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },

  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // 'unsafe-eval' + 'unsafe-inline' required by Next.js / Turbopack
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://assets.calendly.com https://vercel.live",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://api.resend.com https://calendly.com https://vercel.live",
      // Calendly is embedded in an iframe via the booking link redirect
      "frame-src https://calendly.com",
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

// ─── Config ─────────────────────────────────────────────────────────────────────

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to every route including API routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
