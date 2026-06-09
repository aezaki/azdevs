export const CALENDLY_URL = 'https://calendly.com/andrew-azdevs/30min';
export const CONTACT_EMAIL = 'hello@azdevs.ca';
export const SITE_URL = 'https://azdevs.ca';
export const FOUNDER_NAME = 'Andrew Zaki';
export const COMPANY_NAME = 'AZDEVS';
export const LOCATION = 'Toronto, Ontario';
export const LINKEDIN_URL = 'https://linkedin.com/in/andrewzaki';
export const GITHUB_URL = 'https://github.com/andrewzaki';
export const PORTFOLIO_URL = 'https://andrewzaki.ca';

export const COLORS = {
  background: '#F7F6F2',
  dark: '#1a1a1a',
  accent: '#C85A1E',
  accentLight: '#FDF0E8',
  accentMid: '#EF9F27',
  white: '#FFFFFF',
  border: '#dedad2',
  borderDark: '#2e2e2e',
  textMuted: '#666666',
  textSubtle: '#888888',
  textFaint: '#aaaaaa',
  darkSectionBg: '#1a1a1a',
  darkCardBg: '#222222',
} as const;

export const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Contact', href: '#contact' },
] as const;

export const SERVICES = [
  {
    name: 'Web and app development',
    price: '~ $800 and up',
    description:
      'Clean, fast sites and web apps that reflect how good your business is. Booking flows, client portals, whatever you need built.',
  },
  {
    name: 'AI and automation',
    price: '~ $800 and up',
    description:
      "We find what's eating your time and build something that handles it automatically. Runs quietly in the background.",
  },
  {
    name: 'MVP development',
    price: '~ $3,000 and up',
    description:
      "Tight scope, fast build, something real you can put in front of users or investors. No unnecessary complexity.",
  },
  {
    name: 'Ongoing support',
    price: '~ $200/mo and up',
    description:
      "Monthly plans so your site or app stays up to date, secure, and working the way it should. We don't disappear after launch.",
  },
] as const;

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
    body: "You get a clear proposal — what we're building, what it costs, and how long it takes. No surprises after you say yes.",
    tag: 'Fixed price, no hourly billing',
  },
  {
    step: 3,
    headline: 'We build it, you keep it',
    body: "You're in the loop the whole way through. When we're done, the code, the accounts, and everything else is fully yours.",
    tag: 'Full ownership, no lock-in',
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "I don't have a big budget. Is that okay?",
    answer:
      "Yes. We work with small businesses and early-stage founders, so we scope projects to fit what's realistic. Our starting point is $800 and we're always upfront about cost before anything moves forward.",
  },
  {
    question: "I'm not sure exactly what I need yet. Should I still reach out?",
    answer:
      "Absolutely. Most people who contact us don't have it fully figured out — that's what the first call is for. Come with the problem, not the solution. We'll work out the rest together.",
  },
] as const;

export const SERVICE_OPTIONS = [
  'Web and app development',
  'AI and automation',
  'MVP development',
  'Ongoing support',
  'Not sure yet',
] as const;
