---
target: entire project
total_score: 30
p0_count: 0
p1_count: 2
timestamp: 2026-06-11T14-37-18Z
slug: entire-project
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Form states excellent; nav active-section indicator solid; no page-load skeleton |
| 2 | Match System / Real World | 4 | Copy speaks the target user's language throughout; zero jargon |
| 3 | User Control and Freedom | 3 | No traps; ESC closes mobile menu; success state has no "send another" path |
| 4 | Consistency and Standards | 2 | Four different CTA labels for the same action across nav/hero/contact/footer |
| 5 | Error Prevention | 4 | Inline validation, auto-focus to first invalid field, rate-limit handling |
| 6 | Recognition Rather Than Recall | 3 | All nav visible; social pills labeled; fact card hidden on mobile loses scannable trust signals |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcuts; Calendly and form are equally valid paths but neither is notably faster |
| 8 | Aesthetic and Minimalist Design | 3 | Trust strip below hero CTA redundantly restates the visible fact card on desktop |
| 9 | Error Recovery | 3 | Form errors clear and specific; success state replaces form with no way to re-submit |
| 10 | Help and Documentation | 3 | FAQ accordion handles the main blockers; not co-located with the moments that trigger them |
| **Total** | | **30/40** | **Good — solid foundation, two areas need structural work** |

## Anti-Patterns Verdict

**LLM assessment:** Yes, to an experienced eye. The site commits the exact combination the PRODUCT.md anti-references call out by name: warm cream background (#F7F6F2) + terracotta accent (#C85A1E) + dark-section alternation. This is the AI-generated warm cream + orange scaffold. The execution is clean but the palette reads immediately as trained on 2025 freelancer landing pages. Counter-signals: Bricolage Grotesque is a real choice, the motion craft is genuinely skilled, and the copy is specific and human.

**Deterministic scan:** 2 findings. (1) `em-dash-overuse` in `app/layout.tsx` — 3 uses of `—` in page title metadata. Borderline false positive (title separator convention). (2) `flat-type-hierarchy` in `app/api/contact/route.ts` — false positive (backend file, not UI).

## Overall Impression

The craft here is real. The motion work, accessibility, form validation, and copy quality are all above average. What's holding it back isn't execution quality; it's identity. The palette makes it look like the AI scaffold it's trying to distinguish itself from, which directly undercuts the brand promise. And despite all the trust-building language, there's nothing on the page that proves the work is real. One testimonial or one client screenshot would change the conversion math more than any animation refinement.

## What's Working

1. **Copy quality** — "Your website is embarrassing you. You cringe a little every time you hand out your business card." Specific, human, resonant.
2. **Motion craft** — Service row x-lean, hero headline mask-reveal, FAQ grid-template-rows animation, comprehensive reduced-motion support. Genuinely crafted, not scattered.
3. **Form and contact section** — Inline validation, auto-focus to first invalid field, specific error messages, rate limiting, dual submission paths (form + Calendly), ARIA wiring throughout.

## Priority Issues

### [P1] Warm cream + terracotta reads as AI-scaffolded

**What:** `--color-bg: #F7F6F2` (warm-tinted near-white) + `--color-accent: #C85A1E` (terracotta) is the defining AI landing page palette of 2025-2026. The PRODUCT.md anti-references explicitly ban it.

**Why it matters:** The brand premise is "The site IS the proof of work." A prospect who follows the space will clock the palette in under two seconds and wonder if the developer used AI to build their own site.

**Fix (3 options):** A) Change `--color-bg` to `oklch(0.975 0 0)` (chroma-zero neutral). B) Commit harder with the accent: use terracotta more aggressively on hero or a section. C) Full dark-mode site — extends the dark hero that's already the strongest-feeling section.

**Suggested command:** `/impeccable colorize`

### [P1] No social proof

**What:** No testimonials, no client logos, no work samples, no case studies. The About section describes why AZDEVS exists but provides no external verification.

**Why it matters:** The target user is "skeptical from being overcharged." Their decision to reach out is a trust call. The copy earns trust linguistically but provides no evidence. This is the single biggest conversion obstacle.

**Fix:** Minimum viable: one sentence testimonial with first name and business type. Better: a before/after screenshot or client logo strip after the Problems section.

**Suggested command:** `/impeccable shape`

### [P2] Trust strip contrast failure (WCAG AA)

**What:** Hero.tsx line 168: `rgba(247,246,242,0.32)` at 12px on `#1a1a1a`. Effective contrast: **2.81:1**. WCAG AA requires 4.5:1 for text this size.

**Fix:** Raise opacity to 0.55+ (matches the location pill's opacity), or remove on desktop where the fact card already shows this information.

**Suggested command:** `/impeccable audit`

### [P2] Founder visibility buried in section 4

**What:** The human element (founder portrait + origin story) comes after Problems, Services, and before HowItWorks. Visitors who bounce early never meet Andrew.

**Why it matters:** The brand differentiator is "a knowledgeable friend who happens to be a developer." The hero reads as a generic agency.

**Fix:** Pull the founder's face into the hero (replacing or alongside the fact card), or add a one-line human attribution to the hero subtitle.

**Suggested command:** `/impeccable shape hero`

### [P2] Four CTA labels for the same action

**What:** "Book a call" (nav) / "Book a free call" (hero) / "Schedule a free call" (contact) / "Book a free 30-min call →" (footer).

**Fix:** Standardize to "Book a free call" everywhere. Nav can use "Book a call" for space constraints. Hero and contact must match.

**Suggested command:** `/impeccable clarify`

## Persona Red Flags

**Jordan (Skeptical GTA small business owner):** Resonates with Problems section, reassured by visible pricing in Services, but reaches About with no external validation. Copy says "earned trust over stated authority" but only states it. No work samples. High bounce risk at the decision point.

**Casey (Distracted mobile user):** Fact card is `hidden lg:block` — mobile users miss those trust signals (the contrast-failing trust strip is the only substitute). On mobile, the contact form is below the entire FAQ accordion — buried. Form should come before FAQ in the mobile stacking order.

**Sam (Screen reader/keyboard user):** Service rows using `role="button"` navigate to contact section without warning — unexpected behavior for a user reading the services list. Trust strip contrast fails at 2.81:1. Otherwise well-wired: skip nav, ARIA labels, focus indicators, reduced motion all present.

## Minor Observations

- Problems section CTA ("We can fix this →") has rest opacity 0.55 — on mobile (no hover), it's permanently faint and likely missed
- Hero heading at `-0.04em` tracking is right at the documented floor; check at 375px viewport width for crowding
- Fact card trust signals (2-4 weeks, fixed rate, code ownership) need a mobile-visible equivalent with passing contrast
- Contact section header gap (`mb-12` + 2-line header) reads disconnected from the two-column content below; tighten to `mb-8`
- Em-dashes in `app/layout.tsx` page titles — replace `—` with `:` to satisfy copy rules
