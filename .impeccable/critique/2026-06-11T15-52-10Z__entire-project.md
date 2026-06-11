---
target: entire project
total_score: 34
p0_count: 0
p1_count: 1
timestamp: 2026-06-11T15-52-10Z
slug: entire-project
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Contact form success/error/loading states are textbook. Nav scroll state communicates clearly. |
| 2 | Match System / Real World | 4 | Copy speaks the target audience's language throughout. Pricing is direct. "MVP development" has `typicalFor` clarifying the jargon inline. |
| 3 | User Control and Freedom | 3 | Mobile Escape dismiss works. No form reset or "clear" on the contact form. |
| 4 | Consistency and Standards | 3 | Nav scroll links are `<button>` elements — breaks right-click "open in tab" and semantic conventions. Otherwise consistent. |
| 5 | Error Prevention | 4 | Field-level validation, aria-invalid wired, server-side rate limiting, form doesn't clear on error. Solid. |
| 6 | Recognition Rather Than Recall | 4 | Everything labeled and visible. Service names in the contact form match what's shown in the services section. No memory bridges. |
| 7 | Flexibility and Efficiency | 4 | Calendly reachable from Nav, Hero, Contact sidebar, success state. Multiple paths to conversion; nobody gets trapped. |
| 8 | Aesthetic and Minimalist Design | 2 | HowItWorks is a three-column identical card grid (absolute ban). Uniform scroll-reveal on every section (motion monoculture). Warm cream + terracotta is explicitly flagged as the AI anti-reference in PRODUCT.md. Section rhythm is mechanically alternating. |
| 9 | Error Recovery | 3 | Specific field-level errors, actionable language, rate-limit message is human-readable. |
| 10 | Help and Documentation | 3 | FAQ handles newcomer anxiety well. Response-time reassurance appears before submission. |
| **Total** | | **34/40** | **Good — infrastructure is excellent; H8 drags the score** |

---

## Anti-Patterns Verdict

**LLM assessment**: This is a technically accomplished site that's been iterated on — and it shows. The contact form is production-grade. The copy is good. The motion architecture has reduced-motion support throughout, spring curves are intentional, the Problems section uses an asymmetric grid. None of that is accidental.

The problem is H8: the aesthetic decisions are pulling toward the exact reference point the brand was designed to avoid. Three things converge:

1. **Body background `#F7F6F2` + accent `#C85A1E`**: This is warm cream + terracotta. PRODUCT.md's anti-reference section names it explicitly: "AI-generated warm cream + orange scaffold ... the warm-tinted beige body with terracotta accent combination." The dark hero and services sections provide relief, but the combination still anchors the site in that territory.

2. **HowItWorks**: Three equal-width cards with icon + heading + body + tag in `grid-cols-3`. This is the identical card grid pattern — one of the absolute bans. Problems uses an asymmetric grid (good), but HowItWorks defaults to the template.

3. **`scrollReveal()` on every section header**: All eight section reveals use the same `{ opacity: 0, y: 24 }` → `{ opacity: 1, y: 0 }` with the same duration and ease. One shared preset, applied uniformly. The motion guide calls this the "uniform reflex" — a tell that the animation system was bolted on rather than choreographed.

Someone sharp would likely clock all three.

**Deterministic scan (detect.mjs)**: One finding — "flat type hierarchy" flagged in `app/api/contact/route.ts`. This is a false positive: the detector picked up on pixel values in a comment or string inside the API route, not a rendered UI file. No real finding.

---

## Overall Impression

The bones are good. The copy is genuinely above-average for this type of site. The engineering quality (form validation, a11y, animation architecture) is solid. The thing holding this back is a color + aesthetic system that quietly reads as the AI default, which is a problem when the site's entire argument is "this person does better work than the generic option." The site IS the proof of work — and right now the aesthetic layer partially undermines that claim.

---

## What's Working

**1. The copy earns trust through specificity.** "Your website is embarrassing you." "Most agencies quote $15,000 for a website that should cost $2,000." Pricing upfront. Real testimonial with named project details. This is exactly the voice the brand calls for.

**2. The contact form is production-grade.** State machine (idle → loading → success | error), inline field-level errors, reduced-motion support, aria-invalid, rate limiting, success state personalized with service and name. Few landing pages nail the form this well.

**3. The asymmetric Problems grid.** One wide featured card + two stacked smaller cards. Not three equal columns. This shows the asymmetry principle being applied correctly — then abandoned in HowItWorks.

---

## Priority Issues

**[P1] `--color-subtle` (#888888) fails WCAG AA as text on light backgrounds**
- **What**: `#888888` on white (#FFFFFF) = 3.54:1. Fails the 4.5:1 minimum for body text. Affected: "You'll hear back within one business day, usually the same day." in Contact (12px, non-bold), resting-state CTA text in ProblemCard, and arrow icons in Contact.
- **Why it matters**: PRODUCT.md commits to WCAG 2.1 AA. The "one business day" text is a conversion-supporting reassurance — it needs to be readable, not nearly invisible.
- **Fix**: Replace `--color-subtle` (#888) with `--color-ink-light` (#444) for body-size text. Keep it for decorative icons. The simplest change: update the three `var(--color-subtle)` text uses in Contact.tsx and Problems.tsx to use `var(--color-muted)` (#666), which passes at 5.68:1.
- **Suggested command**: `/impeccable audit`

**[P2] Color system exhibits the project's own stated anti-reference**
- **What**: `--color-bg: #F7F6F2` (warm cream) + `--color-accent: #C85A1E` (terracotta) is the exact combination PRODUCT.md names as an AI tell. Even with dark hero and services sections, this combination anchors the site in the "warm cream + orange scaffold" aesthetic lane.
- **Why it matters**: The site's value proposition is partly demonstrated through its own quality. A visitor who recognizes the AI color tell will unconsciously question whether the work is as considered as the copy claims.
- **Fix**: Shift the `--color-bg` to true white or a slightly blue-tinted cool neutral (removing the warm cast). Move brand warmth into typography, the accent color, and the terracotta testimonial section — not the page ground. Alternatively, commit harder: go Drenched dark on body, use cream as a light accent. The middle path (warmish cream as body) is the one to escape.
- **Suggested command**: `/impeccable colorize`

**[P2] HowItWorks is an identical card grid — absolute ban**
- **What**: Three equal `grid-cols-3` cards, each with an icon, heading, body paragraph, and a small value-prop tag. Same structure, same size, same spacing. This is the "identical card grid" absolute ban.
- **Why it matters**: Process sections are one of the highest-risk AI scaffolding areas. "Three steps, each in a card" with icons is the template move. The Problems section already proves this team can do asymmetric layouts.
- **Fix**: Break the symmetry. Options: step 1 as a wide banner spanning the full width with the most important content ("Book a free 30-min call" — the only actual action the user needs to take); steps 2 and 3 as side-by-side narrower columns. Or: drop the card borders entirely and use a horizontal timeline with large numerals, letting whitespace do the work. Or: numbered list with generous leading instead of cards.
- **Suggested command**: `/impeccable layout`

**[P2] Uniform `scrollReveal()` applied to every section**
- **What**: All eight section headers and their sub-elements use the same `{ opacity: 0, y: 24 }` entrance with the same duration (0.6s) and ease. `lib/animations.ts` exports a single preset and it's used everywhere.
- **Why it matters**: Motion should differentiate, not uniformize. When every section arrives the same way, the animation system reads as applied-after-the-fact rather than choreographed to content. The motion guide explicitly names this the "uniform reflex" — the tell.
- **Fix**: Keep `scrollReveal()` for most sections but differentiate 2-3. The Testimonial section (different background, emotional peak) could use a crossfade only, no Y movement. The Contact section could bring the two columns in from opposite sides (already done — but the header above still uses the generic reveal). Consider a stagger on the Services rows that diverges from the standard ease.
- **Suggested command**: `/impeccable animate`

**[P3] Services description hidden on mobile — pricing too small**
- **What**: The service description (`hidden md:block`) is completely invisible on mobile. `typicalFor` (12px) and `price` (12px) are the only descriptive content left. For a user arriving via mobile to check pricing before booking, this is the most persuasive content and it's either hidden or tiny.
- **Why it matters**: Casey (the distracted mobile user) is a core persona. The services section is where pricing anxiety gets resolved. Hiding descriptions forces mobile users to book a call before they know what things cost — the opposite of the trust-building the copy aims for.
- **Fix**: Show a truncated version of the description on mobile (2 lines max) or move price to be more visually prominent (currently it's the same 12px as `typicalFor`). At minimum, make the price text 14px on mobile.
- **Suggested command**: `/impeccable adapt`

---

## Persona Red Flags

**Jordan (Confused First-Timer)** — primary persona for a landing page like this
- First action is clear within seconds: "Book a free call." This works.
- "MVP development" could confuse a first-timer who doesn't know the term — but `typicalFor: 'First apps, startup prototypes, investor demos'` is visible on desktop. On mobile it's 12px. Jordan on mobile may miss this clarification.
- Contact form: 5 FAQs are excellent — directly addresses "I don't have a big budget" and "I'm not sure what I need." This is Jordan's primary anxiety addressed in-page before the ask. Good.
- No confirmation that scrolling to a section worked (no active state animation on the section arriving). Minor.

**Casey (Distracted Mobile User)**
- Hero CTAs in thumb zone: yes, "Book a free call" and "See our services" are mid-screen. Accessible.
- Trust strip "Free 30-min call · Fixed-rate pricing · You own the code" at 12px/rgba(0.55): nearly invisible on mobile. This is the only trust signal visible above the fold on small screens (the fact card is desktop-only). High abandonment risk for skeptical first-time visitors who scroll past the hero quickly.
- Services on mobile: description hidden, price at 12px. The most persuasive content requires squinting.
- Contact form requires 4 fields of text input on mobile. No auto-complete risk (name and email have `autoComplete` set correctly; good). But the service select forces the native picker — acceptable on mobile.

**Tony (Skeptical Small Business Owner)** — project-specific persona from PRODUCT.md audience
- Profile: Non-technical, budget-conscious, previously burned by an agency or developer who disappeared.
- Behaviors: Scans for price first, looks for a real person not a faceless brand, wants to know what happens after they click.
- Red flags:
  - Services list CTA behavior is invisible: Tony doesn't know clicking a row scrolls to the contact form. The arrow indicator is there but gives no hint of what happens. An inline label like "Get a quote" would make the interaction obvious.
  - HowItWorks step 1 says "Book a free 30-min call" with tag "No commitment required." This is Tony's anxiety handled correctly. But step 3 "We build it, you keep it" / "Full ownership, no lock-in" is more reassuring to a technical client. Tony may not know what "lock-in" means in this context. Rephrase to: "The code, the accounts, everything is yours after we're done."
  - The About section photo and founder story creates the "trusted friend" feeling well. The social pills (LinkedIn, GitHub, portfolio) are visible. Good.

---

## Minor Observations

- Testimonial quote is in a `<p>` rather than a `<blockquote>` element — semantic gap.
- The hero's right-column fact card is `hidden lg:block` with no mobile equivalent beyond the 12px trust strip. The four specifics (turnaround, billing model, code ownership, discovery call) are high-signal; they deserve mobile presence.
- `scrollReveal()` uses `viewport: { once: true, amount: 0.1 }` — the `amount: 0.1` threshold triggers very early, so elements reveal before they're meaningfully visible. This creates a slightly rushed feel. `amount: 0.15` or `0.2` would feel more controlled.
- Footer nav links use `<button>` elements with `onClick` for scroll navigation — right-click to "open in new tab" doesn't work. Low impact on a single-page site but semantically wrong.
- The HowItWorks step `step: 1, 2, 3` data is defined in constants but never rendered — the component uses icons only. The field is dead weight in the data shape.
- `--color-faint` (#aaaaaa) is used for the footer tagline copy ("Good software for small businesses...") — this is the lowest-contrast text on the site, but on the `--color-footer` (#111111) dark background it passes at 7.9:1. Fine.

---

## Questions to Consider

- The site hero is dark and the Problems section is white — but what if the hero extended into Problems? Removing the background-color cut there and letting the dark narrative continue through "three problems" before the terracotta services break might feel like one sustained argument rather than alternating sections.
- The Problems cards are asymmetric and good. HowItWorks cards are symmetric and banned. What would HowItWorks look like if it adopted the Problems card logic — one dominant "book a call" block, two smaller sequential details?
- What would the site look like if the warm cream was replaced with a cool near-white or even a very light slate? The terracotta accent would pop harder against cool neutrals than it does against warm ones.
