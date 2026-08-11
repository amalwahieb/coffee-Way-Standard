# Changelog

All notable changes to Coffee Way Standard are recorded here.
Newest version on top. Dates are the day the build was finalized.

The format is simple on purpose: each version lists what was **Added**, **Changed**, **Fixed**, or **Removed**, in plain language.

---

## v1.4 — 2026-08-11

The grinder-confidence release — concrete help for knowing your grind is right.

### Added
- **Grind fingerprint:** the app now learns your proven grind numbers per grinder. After two or more great brews on the same grinder, the recipe card shows your calibrated range (e.g. "Your Fellow Opus fingerprint: great brews landed around 8-8.5") and tells you to trust it over the book number — because worn or different burrs need different settings.
- **Grind reference strip in Learn:** a clear coarse-to-fine visual of what each grind should look like, from cold brew down to espresso, with micron sizes — so you can see what you're aiming for.

### Changed
- The drawdown-time verdict is now prescriptive: instead of just "faster than the window," it tells you what to do — "grind is too coarse, try 1-2 steps finer" (or coarser). Your brew time now points you straight at the grind fix.

### Fixed
- (none)

---

## v1.3 — 2026-08-08

The redesign release — a full visual overhaul plus timer and accuracy fixes.

### Added
- **Full visual redesign** across every screen: lifted warm palette, ember-lit cards, New York system serif for hero numbers and titles, rounded controls with active-state glow.
- **Redesigned pour timer** built around a circular progress ring with clear POUR / WAIT / DRAWING states, so you always know whether to pour or wait.
- **Automatic brew-time recording:** tap Done when the cup finishes and your real pour time is captured straight into the finish field, feeding the coaching and calibration.
- **Reworked Learn page** with serif headers, italic pull-quotes, and warmer, more readable layout.

### Changed
- Machine sheets (Aiden / xBloom) now compute from a neutral pour-over baseline, so the hand-brewer picked on the Build screen no longer alters them.
- Language button now reads the full word rather than a single letter.
- Timer "coming up" line rewritten and recoloured so it reads as a preview, not a pour-now instruction.
- Clarified the Hoffmann pour wording: the first pour is now described as “quick but steady” with a note that a fast first pour is normal, so new users don’t feel they’re doing it wrong.

### Fixed
- Finish time is no longer capped at the recipe's expected time — the timer keeps counting past it and records your true finish when you tap Done.
- Verified the Hoffmann timing against his published method — the schedule (60% by 1:15, 100% by 1:45, freshness-scaled bloom) is accurate and unchanged; only the wording was adjusted.

---

## v1.2 — 2026-07-25

The transparency-and-calibration release.

### Added
- **Self-calibration (⚑):** after 3 great brews on one bag with logged finish times, the card shows a finish window calibrated to your own results, replacing the book estimate.
- **Live freshness on the home-screen widget:** day counter with four colour-coded stages, following your iPhone's system language.
- **Live freshness in the library:** every saved bag shows where it sits on its rest curve, recomputed each time you open the app.
- **Temperature profiling** on the machine sheets — flat, descending (hot → cooler), or ascending (cool → hotter) — with an explanation of what each does and when to use it.
- **Age-adjustment disclosure:** "Why this recipe?" now states the exact grind and temperature changes the app applied for the bag's age, and each logged brew records the freshness stage it was brewed at.
- **Two new origins:** Tanzania/Uganda and Mexico (plus Thailand, below) — 19 origins total.
- **Two new processes:** Wet-hulled (Sumatra) and Decaf — 7 processes total.
- **Two Scriptable helper agents:** Origin Scout (on-demand origin/process lookup) and Trend Scout (monthly specialty-coffee trend scan with app suggestions).
- **Learn section:** "Origin, roast, and the date — one chain," explaining how the three connect.

### Changed
- **Hoffmann bloom corrected to his real 2× ratio** (was an unsourced 2.7×). Medium roast now pours his exact numbers — 60g bloom for 30g coffee — with only a small, defensible nudge for lighter roasts.
- **Osamah method finalized from two stopwatch anchors** (20g → 2:35, 40g → 3:05): the pour rhythm stays fixed at every dose, only the finish time scales. The shown range is his time plus a 15-second beginner's grace.
- **Kasuya 4:6 strength now sets the pour count** (light = 3 pours, balanced = 4, strong = 5), matching his published method.
- **Origins sorted alphabetically**, per display language, with the catch-all pinned last.
- **Finish-time field is digit-friendly:** type 425 and it becomes 4:25 — no colon needed on the number pad.
- **Thailand** added as an origin.

### Fixed
- Widget now shows all text in the system language instead of mixing English and Arabic.

### Removed
- **Custom grinder feature** — it caused lag and unresponsive controls on-device that testing could not reproduce, so it was removed in favour of adding more real grinder entries. Saved states that referenced it fall back safely.

---

<!--
TEMPLATE FOR THE NEXT VERSION — copy this block above, fill it in, delete the arrows.

## v1.4 — YYYY-MM-DD

### Added
- ←

### Changed
- ←

### Fixed
- ←

### Removed
- ←
-->
