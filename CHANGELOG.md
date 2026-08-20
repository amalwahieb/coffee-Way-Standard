# Changelog

All notable changes to Coffee Way Standard are recorded here.
Newest version on top. Dates are the day the build was finalized.

The format is simple on purpose: each version lists what was **Added**, **Changed**, **Fixed**, or **Removed**, in plain language.

---

## v1.8.3 — 2026-08-20

### Added
- **Vietnam as a coffee origin.** Vietnam is the world's #2 coffee producer and its beans (mostly robusta) are widely sold, but the app didn't cover it. Vietnam now appears in the origin list with robusta-aware guidance: because robusta is bold, very low in acidity, and turns bitter easily, the recipe leans **cooler and coarser with gentle pours** (the same proven calibration as Indonesia/Sumatra). The tasting notes reflect its real character — dark chocolate, roasted nut, cocoa bitterness, heavy body. The tip also points specialty Vietnamese arabica drinkers (from Da Lat) to treat it more like a regular origin. Fully bilingual (English / العربية).

---

## v1.8.2 — 2026-08-19

### Changed
- **The Scriptable app now handles updates gracefully.** When a new version is out, it shows an "update available — Get it" notice that opens the GitHub repo in Safari, where you download the new `.scriptable` file and re-import it. (Scriptable can't replace its own code, so this is the honest path.) The web version still reloads in place. This replaces the earlier behaviour where tapping the update blanked the screen.

---

## v1.8.1 — 2026-08-19

### Fixed
- **White screen when tapping the update banner in the Scriptable app.** The update banner was appearing inside Scriptable (its network check runs there), but tapping Reload tried to navigate a page that was loaded from local code rather than a URL, blanking the screen. The update check and reload are now correctly limited to the web version, where they belong. The Scriptable version updates by re-importing the file, as before.

---

## v1.8.0 — 2026-08-19

### Fixed
- **Fellow Opus corrected to its real dial.** The Opus has *three* clicks between each number (position, then click 1, 2, 3, then the next number) — the app had it as two. Now 9·1, 9·2, and 9·3 are all valid settings, and calibrating to "9.3" correctly shows "9 · 3 clicks" instead of rolling over to 10. Only 9.4 and up advance to the next number, which is physically correct.

---

## v1.7.9 — 2026-08-18

### Added
- **The app can now be added to your home screen.** On the GitHub Pages link, "Add to Home Screen" (Safari, on iPhone) installs Coffee Way Standard with its own coffee icon and opens it full-screen, like a native app — no browser address bar. This activates the existing manifest and icons, which now need to be in the repo root alongside index.html.

---

## v1.7.8 — 2026-08-18

### Fixed
- **Fellow Opus now uses its real third-marks.** Each number on the Opus dial has two intermediate ticks (three positions per number), and the app now lands on them — 6, 6·1, 6·2, 7, and so on — instead of snapping to whole numbers only. Grind adjustments for roast and dose now use the full precision the grinder actually has.
- **Opus calibration accepts click positions.** When telling the app what you dial, you can enter a click past a number as 9.1 or 9.2 (nine plus one or two clicks), and it round-trips exactly.

### Changed
- **The consistency agent now runs 11,000+ checks across 17 categories** (was 260): a full no-crash sweep, bloom scaling, drain timing, grind-calibration round-trips including micro-click grinders, micro-display integrity, in-range grinds, pour-volume math, temperature science, roast/iced/strength relationships, persistence, and data integrity. Run it after any change with `node consistency-agent.js` — it exits with an error if anything is inconsistent.

---

## v1.7.7 — 2026-08-18

### Fixed
- **Fellow Opus grind now snaps to clean settings.** Its dial was misaligned to a half-step grid that clashed with the grinder's real thirds, so calibrating to a whole number like 9 got stuck on fractional values (9.2, 9.1). The Opus now sits on whole numbers, and calibration round-trips exactly — dial 9, it shows 9.
- **The drain step now starts when pouring ends** (right after the last pour), not 30 seconds later — the finish window is when the draining *completes*, which is the correct relationship.
- **The drain step no longer shows a water amount** — it's a "stop pouring and wait" marker, not a pour.

### Added
- **A consistency agent** (`consistency-agent.js`) that runs 260 physical-sanity checks after any change: bloom scales with dose, drain timing is correct, grind calibration round-trips (including micro-click grinders), pour volumes are monotonic and hit total water, and temperatures stay in range. Run it with `node consistency-agent.js`.

---

## v1.7.6 — 2026-08-16

Full consistency audit pass.

### Fixed
- The machine-view temperature label "Mixed" (shown when a machine varies temperature per pour) was not translated — it now reads "متغيّرة" in Arabic.

### Verified (no changes needed)
- Engine swept across 10,500 combinations (every grinder × roast × style × brewer × hot/iced): zero errors, all grind/temp/water/pour invariants hold.
- Both languages checked across every brew style, iced mode, taste-advice screen, and view — no English leaking into Arabic or vice versa.
- Persistence, update checker, offset clamping, blend mode, and extreme inputs all pass.
- Brewing science re-verified: roast, dose, strength, freshness, and brewer relationships all correct.

---

## v1.7.5 — 2026-08-16

### Changed
- **Everyday Balanced is now a genuinely distinct method** — a bloom plus three small, even, evenly-spaced pours (little-and-often, keep-the-bed-wet). Previously it shared Hoffmann's 60/40 two-pour split with only a slower time; now the pour structure and rhythm are their own, with a realistic 2:40–3:10 drawdown.

### Fixed
- Removed the redundant coffee-name header at the top of the recipe card (above "Why this recipe?"). The same detail already shows right above the Temp/Water metrics.
- The Brew Time value no longer overflows its card on narrow screens.

---

## v1.7.4 — 2026-08-16

### Changed
- **New default brew: "Everyday Balanced"** — a bloom and two calm, even pours. It's the most forgiving way to a clean, balanced cup, designed so a newcomer can't easily get it wrong (no fast first pour, no five-pulse sequencing, no stirring).
- **Removed the duplicate "Balanced · Kasuya 4:6"** style, which produced the same brew as the sweeter variant. Kasuya now appears only as its two genuinely distinct flavour-steering options — Fruity (bigger first pour) and Sweeter (smaller first pour).

Brew styles are now: Everyday Balanced (default), Fruity · Kasuya 4:6, Sweeter · Kasuya 4:6, Classic · Hoffmann, and Osamah Alawwam.

---

## v1.7.3 — 2026-08-16

Beginner onramp and brew-detail visibility.

### Changed
- **The default brew is now the forgiving Kasuya 4:6**, not Hoffmann. The 4:6's small, evenly spaced pours are much easier for newcomers to execute well. Hoffmann is still available as "Classic · Hoffmann" for when you want it.
- **Freshness reads realistically.** Coffee now stays "aging" (still good, just softening) for about six weeks past peak instead of three, and the past-peak message is gentler — faded coffee is still good coffee, not a write-off.

### Added
- **The coffee you're brewing now shows right above the Temp/Water cards** — origin (or saved-bag name), brewer, style, and dose — so every detail is visible where the numbers are.
- **A final "Drain" step in the pour timeline** for pour-over brewers: it tells you to stop pouring and let the bed draw down, with the target finish time. Immersion brewers keep their own press/release step.

---

## v1.7.2 — 2026-08-16

### Added
- **Dose now shows in the recipe readout cards** (right after Water), so you can see grams without scrolling back up.

### Fixed
- The dial-in trail no longer appears when no coffee is loaded — it only shows once you've loaded a saved bag, since a trail belongs to a specific coffee.

---

## v1.7.1 — 2026-08-16

Accuracy and dial-in polish.

### Added
- **Update checker (web version).** When a newer version is published, the app shows a "reload for update" banner — it never interrupts a running brew timer, and it holds the notice until the brew finishes. The running version now shows in the header.
- **Undo a dial-in step.** An "undo last" control in the dial-in trail removes the most recent entry, one at a time, in case a step was logged by mistake.
- **Finish-time advice can be logged as a step.** When the drawdown verdict suggests a grind change, an Apply button records it into the dial-in trail like a taste entry.

### Fixed
- **Fellow Opus grind now reads in its real format.** The Opus adjusts in thirds (each number has three micro-clicks), so it now shows values like "6" or "6 +2" instead of a "6.5" that doesn't exist on the dial. All 42 grinders were re-checked; the Opus was the one that needed correcting.
- Temperature and calibration Save controls no longer slide out of frame on narrow screens.

---

## v1.7 — 2026-08-12

Grinder setup, corrected and hardened.

### Added
- **Favourite grinders.** Pin any grinder with the star next to the picker; pinned ones appear in a Favourites group at the top of the list.
- **Remove a custom grinder** with the x beside the picker (tap once to arm, once to confirm).

### Changed
- The grinder builder now uses two units — clicks (mostly manual grinders) and numbers (mostly electric) — instead of three.
- A single-brew correction now moves a smaller, range-scaled step, and says plainly that you should confirm it on the next brew.
- Wizard wording reworked in both languages.

### Fixed
- **The two-brew test now respects extraction physics.** A coarser grind always extracts less than a finer one, so a coarser cup cannot taste more extracted than a finer one. Impossible combinations are detected and explained instead of producing a made-up number.
- Setup no longer returns NaN: name and grinder range are required, and typed settings are clamped to the range you declared.
- The remove-grinder control no longer overflows its container.

---

## v1.6 — 2026-08-12

Build any grinder — the app no longer needs to know yours.

### Added
- **Custom grinder builder.** Pick "Set up my grinder," enter its name, units (clicks / numbers / rotations), and range, then run a guided taste test — and the app creates a working, calibrated profile for a grinder it has never heard of. It's saved by name and selectable forever. This makes the app grinder-agnostic: it doesn't need a catalog of every grinder, it helps you map your own.
- **Guided dial-in test (quick or thorough).** Thorough brews two cups (one coarse, one fine); you taste each and the app pinpoints your setting from the two results. Quick uses a single brew and points you the right way. The same test works for grinders already in the app, to nail down your accurate number.

### Changed
- (none)

### Fixed
- (none)

---

## v1.5 — 2026-08-11

Tune the app to your grinder.

### Added
- **Per-grinder calibration.** Tap "Not your number?" under any grind reading, enter the setting you actually dial, and the app learns the difference as an offset for that grinder. From then on every recipe on that grinder — hot, iced, any dose, any method — shifts by your offset, so the number shown is *your* number, not the book's. This is the direct fix for worn or non-standard burrs: tell it once, and it carries through everything.
- Each grinder keeps its own offset, so switching between grinders shows the right calibrated number for each — and a grinder you haven't tuned still shows the book value.

### Changed
- (none)

### Fixed
- Timer "tap Done" prompt no longer overflows outside the ring during the drawdown phase.
- Grind reference strip redrawn to match the intended design (finer, more natural scatter) and moved to the end of the Learn page.
- Brew-method descriptions (Hoffmann, Kasuya, Osamah, AeroPress, Switch) were showing in English while the app was set to Arabic — they are now fully translated.
- Humanized the Arabic throughout: natural, spoken phrasing rather than stiff literal translation, across method notes, coaching, and the new calibration feature.

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
