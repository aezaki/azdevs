---
target: entire project
total_score: 33
p0_count: 1
p1_count: 2
timestamp: 2026-06-11T15-14-03Z
slug: entire-project
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Location pill, form validation, loading spinner present. No "skip to contact" visible on load; no scroll-progress cue |
| 2 | Match System / Real World | 4 | Language is direct and plain ("no fluff", "fixed rate"). Pricing shows real ranges. Matches non-technical user vocabulary throughout |
| 3 | User Control and Freedom | 3 | Escape closes mobile menu, reduced-motion respected. Gaps: service dropdown has no clear/deselect; form errors don't auto-focus; FAQ forces one-at-a-time |
| 4 | Consistency and Standards | 4 | Typography scale, button styles, hover interactions cohesive. Minor gap: contact labels use small uppercase while hero uses sentence case |
| 5 | Error Prevention | 3 | Client-side validation before submit, rate-limit error handled, maxLength constraints on inputs. Gap: textarea character counter only appears after typing begins |
| 6 | Recognition Rather Than Recall | 4 | Active nav highlights, CTA always visible in fixed nav, FAQ headers match user questions verbatim |
| 7 | Flexibility and Efficiency | 3 | Keyboard navigation works (Enter/Space on service rows, Esc closes menu). No shortcut to jump to contact form; no "skip to action" link for ready-to-commit visitors |
| 8 | Aesthetic and Minimalist Design | 4 | Generous whitespace, clean hierarchy, no decorative clutter. Gap: hero fact card is visually busy on mobile; About section carries two competing h2-level elements |
| 9 | Error Recovery | 3 | Form success state is clear; rate-limit message is user-facing. Gap: success message doesn't recap what was submitted; "try again later" offers no next step |
| 10 | Help and Documentation | 2 | FAQ helpful but not contextual. Form fields have no placeholder hints. Service dropdown has no descriptions. No sample call preview or case study to orient first-timers |
| **Total** | | **33/40** | **Good — address weak areas, solid foundation** |

---

## Anti-Patterns Verdict

**LLM assessment**: Not AI-generated. Intentional design with three specific exceptions. The motion design (custom spring physics, per-card asymmetric entrance directions, snapping ease curves) signals hand-tuned judgment. The color palette tests to 5.65:1 contrast and is structurally derived — not "warm cream + terracotta by default." Copy uses specific language ("~$800 and up", "you own the code", "no hourly billing") that avoids the marketing buzzword trap. The Problems section's asymmetric card entrance (odd cards from left, even from right) specifically breaks the identical-card-grid ban.

Three moments do drift toward template territory:
1. **Numbered badges (1/2/3) in How It Works** — the execution is polished (rotation on hover, spring entrance) but the pattern itself reads as default scaffolding. The numbers carry no information the visitor doesn't already have from reading the steps.
2. **Hero fact card** — a row of aligned tags (Fixed rate · You own the code · Local, Toronto) adjacent to the hero text approaches the hero-metric template. The tags are conceptually strong but visually lean SaaS-dashboard.
3. **Services section uppercase labels** — four rows of ALL CAPS service names with right-aligned price. The uppercase reads as a visual tic borrowed from template patterns, not a deliberate brand voice choice.

**Deterministic scan**: 1 finding — `flat-type-hierarchy` warning flagged at `app/api/contact/route.ts:217` with sizes 12px, 13px, 14px, 16px, 18px. **This is a false positive**: the flagged file is a backend API route handler, not a UI component. No genuine UI typography findings from the automated scan.

**Browser visualization**: Not available in this run. No overlay evidence.

---

## Overall Impression

The site is technically excellent and strategically sound — it avoids almost every trap AZDEVS's brief invites, from agency posturing to portfolio-portfolio clichés. Copy is specific and honest. Motion is purposeful. Accessibility is structural, not theater. The 20% gap is emotional, not technical: the site builds trust methodically but never delivers the gut-punch moment where a burned, budget-conscious owner thinks "Andrew gets it — I'm calling right now." That moment is missing because there's no social proof, the success state is hollow, and the pricing section still reads like a menu rather than a commitment. Those gaps are fixable in a focused pass.

---

## What's Working

**1. Copy that kills skepticism**: "No fluff, no bloated agencies. Just good work at a fair price." Pricing shows ranges, not false precision. FAQ answers educate ("show up with your problem, not the solution") rather than pitch. For a user who has been burned and arrives guarded, this copy is doing real heavy lifting — it's the right voice for the right audience.

**2. Motion design that proves craft**: Spring stiffness and damping values are explicitly tuned (300/20 for the avatar, snapping ease `[0.04, 0.62, 0.23, 0.98]` for FAQ toggle). Scroll reveals are y:24 fade-ins that guide the eye without gating content. The hamburger morph takes 0.22s at a custom ease. None of this is visible to the user consciously — but it's precisely the kind of subconscious quality signal that makes a site feel like it was made by someone who cares about the small things.

**3. Accessibility embedded structurally**: Reduced-motion respected via `useReducedMotion()` throughout, not as an afterthought. Form fields have proper labels and aria attributes. Skip-nav link present. Touch targets at 44px. 4.5:1 contrast verified. This is the kind of baseline the target audience (non-technical, accessibility-unaware) will never notice — but it proves Andrew is thinking past the happy path.

---

## Priority Issues

**[P0] Services section doesn't map to the user's problem**
- **Why it matters**: The visitor just read the Problems section and thought "yes, that's me." Then they hit Services and see four ALL CAPS labels with price ranges. They must now reverse-engineer which service solves their problem — and do it with no context. If they can't figure it out in 5 seconds, they either bounce or select "Not sure yet," sending a weak inquiry that's harder to convert.
- **Fix**: Add a "Typical for:" line to each service row (e.g., "Web and app development — Typical for: restaurant sites, booking systems, e-commerce rebuilds"). Replace "~$800 and up" with a tighter range per service ("$3,500–$5,500" not a blanket floor). Show service descriptions on mobile — currently they're hidden, which strips the only scannability aid a first-timer has.
- **Suggested command**: `/impeccable clarify`

**[P1] No social proof anywhere on the page**
- **Why it matters**: The target user has been burned by agencies. Andrew's founder story ("got tired of watching small businesses get overcharged") is motive, not evidence. For a user who's skeptical, motive reads as "another person claiming to be different." A single testimonial with a real business owner name, business type, and a concrete result ("$4,200 fixed — hit the deadline, no surprises") would do more for conversion than any copy rewrite.
- **Fix**: Add one testimonial block between the About and Contact sections. Name + business type + one-sentence result (not a paragraph). If real client testimonials aren't available, add a specific case study outcome: "Salon booking app — launched in 3 weeks, +40% new client bookings in first month."
- **Suggested command**: `/impeccable shape`

**[P1] About section hierarchy is competing with itself**
- **Why it matters**: Andrew is the proof of work. The brand principle "Human first, studio second" requires Andrew's face and name to be the dominant element. Currently the section has a small avatar, a compact name/title block, and a full h2 ("Built by a developer who got tired…") on the right — which means the heading describes Andrew without naming him, and the visual weight is split. A first-time visitor scans the h2, misses the avatar, and doesn't connect "this is one real person."
- **Fix**: Restructure the About section so the h2 sits above the grid as a section anchor, the left column is the avatar at a larger size (150–180px) with name at 18px bold and title as subtext, and the right column is only body copy. The founder's face should be the strongest visual element in the section.
- **Suggested command**: `/impeccable layout`

**[P2] Contact form success state is a dead end**
- **Why it matters**: The peak-end rule: users remember the most emotional moment and the last moment. The success state is the last moment. "Thanks for reaching out. We'll get back to you within one business day." is polite but hollow — it doesn't recap what was submitted, doesn't set a specific expectation ("Andrew will call by end of day tomorrow"), and doesn't give a burned-before user any reassurance that this form didn't vanish into a void.
- **Fix**: Recap the submission ("Got your message about [service]. Andrew reviews every inquiry personally."), set a specific expectation ("Expect a reply within 1 business day — usually same day."), and add one trust line ("We don't book calls we can't keep.").
- **Suggested command**: `/impeccable clarify`

**[P3] How It Works numbered badges are the weakest section**
- **Why it matters**: The 1/2/3 numbered badges are the one place on the site that reads as scaffolding rather than voice. The steps themselves are strong (Call with no pitch → Fixed-price scope → You own the code) — but the numbers add no information; the visual order already communicates sequence. The badge rotation on hover is polished but doesn't earn the element.
- **Fix**: Remove the numbered badges. Let the step copy stand on its own with spacing and visual weight. Or replace the numbers with a small icon per step (calendar, document, check) that adds meaning rather than just ordinal position.
- **Suggested command**: `/impeccable distill`

---

## Persona Red Flags

**Jordan (Confused First-Timer)**
- Lands on the Services section and sees "MVP development" — doesn't know if that's for them. No description visible on mobile.
- Sees a contact form with a "Select a service" dropdown. Must scroll back up to choose. May pick "Not sure yet" and send a weak inquiry.
- No past work visible anywhere. Jordan relies entirely on belief, not proof. A portfolio section with 3–4 screenshots and one-line outcomes would anchor trust.
- After submitting the form, the generic success message gives no signal that anything actually happened. Jordan may resubmit.

**Casey (Distracted Mobile User)**
- Service descriptions are hidden on mobile — Casey sees only service name and price, no context for which applies.
- FAQ accordion requires a tap to see each answer. On a slow scroll-through, Casey skips this section entirely.
- Contact form spans multiple viewports on mobile: by the time Casey reaches Submit, she's forgotten which service she selected. No sticky recap of choices.
- "Book a free call →" in the footer requires scrolling past the entire page. Primary conversion path should be reachable from mid-page without scrolling back to nav.

**"Maria" (Budget-conscious small business owner, burned by agencies)**
- "Fixed rate" is mentioned in the hero fact card, but Services section still shows ranges ("~$800 and up"). This signals scope creep is possible. Maria needs to see a specific price per project type, not a floor.
- Founder story is strong on motive but thin on track record. "Got tired of watching small businesses get overcharged" is sympathetic; "50 projects, zero disputes, every deadline hit" is proof. The latter is absent.
- No contract language or satisfaction guarantee. Maria has been handed surprise invoices before. A one-line "Fixed price, agreed in writing before any work starts — no exceptions" would close this gap faster than any copywriting.

---

## Minor Observations

- **Mobile nav height**: 5 links in a fixed overlay cover ~30% of short viewports. Consider a slide-in drawer from bottom, which keeps the content partially visible beneath.
- **Hero fact card position**: Right-aligned on desktop makes the left text column feel narrowed. Moving it below the CTA buttons would balance the hero composition.
- **FAQ auto-expand**: On mobile, consider auto-expanding the most common question ("I don't have a big budget. Is that okay?") so users see an answer without requiring a tap.
- **Service row loading feedback**: Clicking a service row scrolls to the contact form but doesn't highlight which service was selected in the form. User lands on the form cold with no visual confirmation of their choice.
- **Footer CTA placement**: "Book a free call →" is placed after the copyright line. Most users won't reach it. Move it above the copyright line and give it more visual weight.
- **Problem card arrow CTA**: "We can fix this →" uses ~14px arrow on mobile. Consider a larger icon or a styled underline animation to improve tap clarity.
