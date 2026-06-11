/**
 * @file lib/constants.ts
 * @description Single source of truth for all project-wide strings, URLs, and
 *              data arrays. Import from here rather than hardcoding values in
 *              components so that copy changes propagate everywhere at once.
 *
 * @notes All exports are `as const` so TypeScript infers the narrowest possible
 *        literal types. This is required for SERVICE_OPTIONS to be usable as a
 *        type-safe allowlist in the API route validation.
 */

// ─── Site Metadata ──────────────────────────────────────────────────────────────

/** Calendly booking URL — used in Nav CTA, Hero primary button, and Contact section */
export const CALENDLY_URL = 'https://calendly.com/andrew-azdevs/30min';

/** Public contact email — used in Contact section and Footer */
export const CONTACT_EMAIL = 'hello@azdevs.ca';

/** Canonical production URL — used in metadata, sitemap, and JSON-LD */
export const SITE_URL = 'https://azdevs.ca';

/** Full name of the founder — used in About section */
export const FOUNDER_NAME = 'Andrew Zaki';

/** Legal / display company name — used in Footer copyright and page metadata */
export const COMPANY_NAME = 'AZDEVS';

/** City and province string — used in Hero location pill and Contact section */
export const LOCATION = 'Toronto, Ontario';

// ─── Social Links ───────────────────────────────────────────────────────────────

/** LinkedIn profile URL — used in About section social links */
export const LINKEDIN_URL = 'https://linkedin.com/in/andrewzaki';

/** GitHub profile URL — used in About section social links */
export const GITHUB_URL = 'https://github.com/andrewzaki';

/** Personal portfolio URL — used in About section social links */
export const PORTFOLIO_URL = 'https://andrewzaki.ca';

// ─── Navigation ─────────────────────────────────────────────────────────────────

/** Top-level nav links — used in Nav (desktop + mobile) and Footer navigation column */
export const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Contact', href: '#contact' },
] as const;

// ─── Services ───────────────────────────────────────────────────────────────────

/**
 * Service offerings displayed in the Services section list.
 * Each entry has a display name, indicative price, and short description.
 */
export const SERVICES = [
  {
    name: 'Web and app development',
    price: 'from $800',
    typicalFor: 'Restaurant sites, booking systems, client portals, e-commerce',
    description:
      'Clean, fast sites and web apps that reflect how good your business is. Booking flows, client portals, whatever you need built.',
  },
  {
    name: 'AI and automation',
    price: 'from $800',
    typicalFor: 'Replacing manual data entry, invoice processing, email workflows',
    description:
      "We find what's eating your time and build something that handles it automatically. Runs quietly in the background.",
  },
  {
    name: 'MVP development',
    price: 'from $3,000',
    typicalFor: 'First apps, startup prototypes, investor demos',
    description:
      "Tight scope, fast build, something real you can put in front of users or investors. No unnecessary complexity.",
  },
  {
    name: 'Ongoing support',
    price: 'from $200/mo',
    typicalFor: 'Sites or apps that need updates, security patches, or new features',
    description:
      "Monthly plans so your site or app stays up to date, secure, and working the way it should. We don't disappear after launch.",
  },
] as const;

// ─── How It Works ───────────────────────────────────────────────────────────────

/**
 * Three-step process displayed in the HowItWorks section.
 * `step` is the display number; `tag` is the short value-prop callout.
 */
export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    headline: 'Book a free 30-min call',
    body: "Tell us what you're dealing with. No pitch, no pressure. We just want to understand the problem before we talk solutions.",
    tag: 'No commitment required',
  },
  {
    step: 2,
    headline: 'We scope it out together',
    body: "You get a clear proposal: what we're building, what it costs, and how long it takes. No surprises after you say yes.",
    tag: 'Fixed price, no hourly billing',
  },
  {
    step: 3,
    headline: 'We build it, you keep it',
    body: "You're in the loop the whole way through. When we're done, the code, the accounts, and everything else is fully yours.",
    tag: 'Full ownership, no lock-in',
  },
] as const;

// ─── FAQ ────────────────────────────────────────────────────────────────────────

/** FAQ items displayed in the Contact section accordion */
export const FAQ_ITEMS = [
  {
    question: "I don't have a big budget. Is that okay?",
    answer:
      "Yes. We work with small businesses and early-stage founders, so we scope projects to fit what's realistic. Our starting point is $800 and we're always upfront about cost before anything moves forward.",
  },
  {
    question: "I'm not sure exactly what I need yet. Should I still reach out?",
    answer:
      "Absolutely. Most people who contact us don't have it fully figured out. That's what the first call is for. Come with the problem, not the solution. We'll work out the rest together.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Most web projects ship in 2 to 4 weeks. Automations and integrations typically take 3 to 6 weeks depending on scope. You get a timeline in your proposal before anything starts.",
  },
  {
    question: "What do I need to have ready before we talk?",
    answer:
      "Nothing. Show up with your problem. The more specific you can be about what you're trying to solve, the better, but we can start from scratch.",
  },
  {
    question: "Do you work with businesses outside Toronto?",
    answer:
      "Yes. Most of our work is done remotely. We're based in Toronto but work with clients across Canada.",
  },
] as const;

// ─── Form Options ───────────────────────────────────────────────────────────────

/**
 * Allowed values for the "Service" select in the contact form.
 * Also used as the server-side allowlist in app/api/contact/route.ts — keep
 * these values in sync with what Resend receives.
 */
export const SERVICE_OPTIONS = [
  'Web and app development',
  'AI and automation',
  'MVP development',
  'Ongoing support',
  'Not sure yet',
] as const;
