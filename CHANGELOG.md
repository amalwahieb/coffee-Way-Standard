# Changelog

All notable changes to Coffee Way Standard are recorded here.
Newest version on top. Dates are the day the build was finalized.

The format is simple on purpose: each version lists what was **Added**, **Changed**, **Fixed**, or **Removed**, in plain language.

---

## v2.1.1 — 2026-08-27

### Fixed
- **Machine recipes were running too hot.** The temperature in a recipe is a kettle temperature, and a kettle never delivers it to the coffee — a gooseneck loses around 3°C in the first thirty seconds of a pour, and the brewer, filter and open air take more. This is why the industry standard for automatic brewers measures the temperature of the coffee slurry rather than the kettle. A machine like the xBloom pours straight onto the bed and loses almost none of that heat, so the same number brews noticeably hotter and the cup comes out harsh. The Machine page now shows temperatures 2°C below the recipe, and says why, so the two aren't mistaken for a mismatch.

---

## v2.1.0 — 2026-08-27

### Changed
- **The ratio now follows the size of the brew.** A single cup used the same ratio as a full Chemex, which made small brews both bigger and weaker than they should be — a 15g cup came out at 250ml. A deeper coffee bed extracts more efficiently, so the right ratio shifts with batch size: roughly 1:15 for a single cup, 1:16 for a double, and 1:16.7 for a batch. A 15g cup is now 230ml instead of 250ml, and tastes fuller for it. Larger brews are unchanged. Lighter, Balanced and Stronger still work exactly as before on top of this.

### Fixed
- **Thirty grinder notes had lost their Arabic.** Every grinder description rewritten during the recent accuracy work was left in English, so Arabic users saw an English sentence under their grinder. All 43 grinders now read correctly in both languages.

### Investigated, no change
- **Water temperature by origin.** Ethiopian coffee was checked against roaster guidance, and the finding went the other way from expectation: roast level drives temperature far more than origin, and dense high-altitude coffees like Ethiopian and Kenyan light roasts want *hotter* water, not cooler, because they resist extraction. The existing cooler settings for Brazil, Indonesia and Vietnam match the guidance for softer, low-acid and naturally processed beans. No temperature changes were made.

---

## v2.0.2 — 2026-08-27

### Fixed
- **The machine card rounded the ratio, so machines brewed the wrong amount of water.** It displayed the ratio as a whole number while showing the real water volume beside it — so a 15g recipe using 250ml was labelled "1:17", even though 250ml at 15g is 1:16.7. Entering 1:17 into a machine like the xBloom makes it work out 255ml instead of 250. The card now shows the ratio the water actually represents, and says to match the water volume if your machine calculates a different total from the ratio. The volume is the number the recipe is built on.

---

## v2.0.1 — 2026-08-27

### Fixed
- **The grind texture showed as "undefined undefined".** After tapping the dial-in button on a click grinder like the Opus, the line under the grind number — normally something like "Medium-fine, like fine sand" — broke. Moving by a single click puts the grind between two whole steps, and the texture description had no entry for an in-between position. It now rounds to the nearest texture.
- **The dial-in trail disagreed with the recipe card.** Each trail entry recorded the setting you had just brewed at, while the card showed the new one, so the two lists never matched and it wasn't clear which number to use. Every trail entry is now the setting the change moves you *to* — the one to brew with next, matching the card exactly.
- **The machine card had no reachable close button.** The card is tall, and the overlay centred it without scrolling, so the Close button underneath was pushed off the bottom of the screen with no way to get to it. There's now a close button pinned to the top corner, the card scrolls, and tapping the background dismisses it too. Both share cards get this.

---

## v2.0.0 — 2026-08-27

### Changed
- **The most coffee you can use is now set by your brewer.** It used to be a flat 100g for everything, which is meaningless — an AeroPress physically cannot hold 100g of coffee. Each brewer now carries its real capacity: 60g for a V60, 45g for a Kalita Wave, 90g for a Chemex, 42g for an AeroPress (the practical limit of its chamber) and 30g for a Switch. Moving to a smaller brewer brings the dose down with it, so switching from a Chemex at 90g to an AeroPress lands at 42g instead of leaving a recipe that could never be brewed.
- **Brewing machines set their own limit.** If you're using the Machine page, the machine decides how much coffee fits rather than the dripper picked on the Build page. The xBloom Studio has a stated maximum of 25g — well below every manual brewer, so the app could previously have suggested a dose that physically cannot be loaded. The Fellow Aiden goes the other way at 88g, the most its 1.5-litre tank can take, making it the only thing in the app that holds more coffee than a Chemex.

- **The xBloom now uses its own grinder.** The xBloom has a grinder built in, but the app was still showing the grind for whichever grinder you picked on the Build page — so an xBloom user could be told "23 clicks", a number that means nothing on that machine. Selecting the xBloom now shows the setting on its own 1–80 scale, and puts your own grinder back when you leave. The Fellow Aiden has no grinder of its own, so it correctly keeps using yours.
- **The xBloom grinder's range was wrong.** It was listed as 5–75 while its own description said 80 levels. The real scale is 1 to 80, and filter brewing sits around 30–45, which is where the app now starts.

### Fixed
- **Typing a dose could bypass the limit.** The +/− buttons respected it, but a typed value went straight into the recipe and was only corrected when the field lost focus — which on a phone often never happens. Typing 500 produced a 2.5-litre recipe. The upper limit now applies as you type, while the lower one is still applied when you finish, so entering "45" doesn't jump to 8 halfway through. The same fix covers the days-since-roast field.

---

## v1.9.9 — 2026-08-27

### Fixed
- **The clicks-between-numbers question skipped values.** It offered 1, 2, 3 and 9 clicks, which covered only the grinders already built into the app. Real grinders sit in the gaps — the 1Zpresso X-Pro has 5 clicks between numbers and the Baratza Sette has 8 — so those owners had no correct answer. It now runs 1 through 9 with nothing missing.
- **The lowest and highest settings had no limits at all**, so a typo could create a grinder with a range of 0 to 5000 and a nonsensical recipe. The range is now checked against what real grinders actually have, based on the widest models in each style: up to 600 clicks (the widest is the 1Zpresso J-Ultra at 500), up to 100 numbers (the widest numbered dial is the Breville Smart Grinder Pro at 60), and up to 15 turns (no hand grinder exceeds about 5 rotations). Each leaves room for grinders that don't exist yet, and you're told plainly if a number is out of range.

---

## v1.9.8 — 2026-08-27

### Fixed
- **Adding your own grinder couldn't handle a dial with clicks between the numbers.** If you added a grinder like the Fellow Opus yourself, the app could only ever show whole numbers — there was no way to express "6 and 2 clicks". That's the same fault that affected the built-in Fellow Ode, sitting inside the one place that's meant to cover every grinder. Setup now asks how many clicks sit between each number — anything from 1 to 9 — and a grinder added this way behaves exactly like a built-in one: adding an Opus by hand now produces the identical settings to the built-in entry, stepping one click at a time.

### Added
- **"Turns" as a third way to measure a grinder**, for the ones with no numbers on the dial at all (DF64, Kinu, Eureka and similar). Close the burrs until they just touch — that's zero — then count turns as you open back out. Setup explains this when you pick it. Those grinders now give a real number you can set and repeat, like "1.8 turns", instead of a description you have to interpret.

---

## v1.9.7 — 2026-08-27

### Fixed
Every remaining grinder was checked for the same fault that affected the Fellow Ode — a dial with clicks between its numbers being treated as plain numbers, which is invisible in use because the app still shows a believable setting. Two were wrong.

- **Timemore Chestnut X** was modelled as a count of around 60 clicks. The grinder is actually read on a macro dial numbered 1–23, with a separate micro ring for fine tuning, and pour-over sits at 15–19 on that dial. It now shows the number you'd actually set.
- **Timemore Sculptor 064 and 078 were listed together with the 064S and 078S**, but Timemore's own documentation says the plain models are stepped (you feel the dial click) while the S models are stepless (no clicks at all). They are different machines. The stepped models now have their own settings, and the stepless S models have their own entry.

The other 27 were confirmed correct: Comandante, Kingrinder, MHW-3Bomber, Timemore C2/C3, Porlex and the 1Zpresso range all count clicks from burr contact with no numbered sub-dial, and Baratza, Breville, Wilfa, OXO and the budget electrics have discrete numbered steps with nothing between them.

---

## v1.9.6 — 2026-08-27

### Fixed
- **The finish-time adjustment could be applied over and over.** After entering a slow finish time, the "go 1 step coarser" button stayed tappable — so tapping it three times moved the grind three steps and wrote three entries, all from a single measurement. Tapping it now applies the change once and replaces the button with a confirmation. It becomes available again when you enter a finish time from your next brew, so each adjustment is tied to the brew that justified it.

---

## v1.9.5 — 2026-08-27

### Fixed
- **The update instructions were unreadable.** Words like "Open the file", "⋯" and "Download" were being pushed onto their own lines in the middle of sentences, so the steps ran together and were hard to follow. The banner was laid out as a single row, which made every emphasised word break away on its own. The steps now render as a proper numbered list.
- **Rewritten as four clear steps**, matching what you actually see on GitHub: tap Open the file, tap the ⋯ at the top right corner, press Download and save the file, then open it in Scriptable to save the new version and delete the old one.

Both languages verified.

---

## v1.9.4 — 2026-08-26

### Added
- **"I don't see my grinder" is now an option in the grinder list itself** — right at the bottom, where you land after scanning for yours. It opens the setup directly. The button underneath now reads "Set up or add a grinder", so it's clear it does both jobs.
- **You can add a grinder in seconds and start brewing.** Adding a grinder previously required completing a taste test before it would save — which meant you couldn't get a recipe until you'd already brewed a cup, and you couldn't brew a cup without a grind setting. There's now a "Just add it — I'll dial it in later" option: give it a name and its range, and you get a working starting point immediately. The taste test is still there for anyone who wants a more precise result, and the normal "go 1 step coarser/finer" buttons refine it from your first brew onward.

Both are fully bilingual.

---

## v1.9.3 — 2026-08-26

### Fixed — grinder settings overhaul
Twenty-two grinders were re-checked against manufacturer documentation and corrected. Each now starts at the published V60 setting for a medium roast.

- **Fellow Ode Gen 1 and Gen 2 had no click system at all.** Fellow's dial has 11 numbers with two clicks between each (31 steps, read as 5, 5·1, 5·2, then 6). The app modelled it as plain half-number steps, so it could never show a setting your dial actually sits on. Both now read like the real grinder.
- **Timemore Chestnut X** started at 24 when the documented pour-over setting is around 60 — less than half the right grind.
- **1Zpresso J-Max / J-Ultra** started at 90 clicks when the documented setting is around 210.
- **Baratza Encore and Virtuoso+** started 5–7 numbers too coarse. Baratza's own table puts V60 at 15; the app said 20 and 22. The roast ladder now reads 13 / 15 / 17, matching Baratza's guidance.
- **1Zpresso JX-Pro, X-Pro/X-Ultra and J-Max** had the wrong number of clicks per number, so one adjustment step moved the wrong distance on the dial.
- **Niche Zero** started at 25 when owners put pour-over at 35–45.
- **Baratza Sette 270** gained its real two-part dial (30 macro settings with 9 micro positions between each).

Fellow Opus was checked and was already correct.

### Added
- `GRINDERS.md` — every grinder documented with its real adjustment system and the source it was checked against, so a setting never has to be guessed at again.

---

## v1.9.2 — 2026-08-20

### Changed
- **The grind engine was rebuilt around a clearer structure.** Every influence on the grind — roast, origin, brewer, brew style, freshness, dose and your own dial-in — is now assembled in one explicit place instead of a single dense expression, and each can be adjusted independently. Results are unchanged: the rebuilt engine was compared against the previous one across 50,460 combinations and produces identical settings. This removes the fragility behind several recent grind bugs.
- **Drain timing now matches how fast each method actually pours.** Gentler methods (Kasuya 4:6, the everyday recipe) pour slower than Hoffmann's deliberately quick pours, so the drain no longer appears a few seconds too early on the gentler recipes.

### Added
- **A full test suite now ships with the app** (`tests/`). One command checks that every brew style, origin, roast, brewer and all 42 grinders produce valid recipes; that the pour schedule is physically possible; that changing the dose never jumps the grind; and that outdated saved data can't break anything. Run it with `node tests/run-all.js`.

### Verified
Tests are now tuned to the real brewing range of 15–50g rather than an unrealistic 1–100g, so the thresholds reflect how the app is actually used. Full suite passes, plus a first-run check (no saved data), all brew styles in both languages with no untranslated text, smooth dose stepping from 15g to 50g, and correct large-dose pour schedules.

---

## v1.9.1 — 2026-08-20

### Fixed
- **Large doses now produce pourable recipes.** For big brews (roughly 30g and up), a single pour could call for far more water than you can physically pour at once — e.g. a 40g Hoffmann asked for a 320ml pour, and a 100g brew asked for nearly 500ml in one go. Those pours are now automatically split into pourable amounts (around 160–200ml each), spaced with enough time to actually pour them, so the timeline stays realistic all the way up to 100g. Normal single-cup doses (about 15–25g) are completely unchanged.

### Verified — full 1g-to-100g sweep
Ran a comprehensive agent across every dose from 1g to 100g combined with every brew style, brewer, strength, and hot/iced — 5,000 recipes — checking each one for physically valid pours: no unpourable volumes, realistic pour timing, correct water ratios, proper bloom, and sensible drain and finish. All pass. The agent also confirms bigger dose always drains later (Darcy's law) and that no combination crashes or produces invalid output.

---

## v1.9.0 — 2026-08-20

### Fixed (this corrects a real bug I previously called "working as designed")
- **Changing the dose now nudges the grind smoothly instead of jumping.** On click-dial grinders like the Fellow Opus, increasing the dose by a gram or two used to make the shown grind leap by two clicks at once — and skip the click positions in between (e.g. jump from "8 and 2 clicks" straight to "9", never showing "8 and 3 clicks"). That was wrong: the real dial can sit at every click, and a one-gram change shouldn't move the grind that far. The dose effect is now continuous and gentle — it moves at most one click per step, in order, and shifts the grind by only about one number across the whole 15–40g range, which matches how dose actually affects a pour-over (a bigger dose means a deeper bed, so a slightly coarser grind — Darcy's law).

### Why this is a proper fix, not another patch
The underlying cause was that one setting ("step") was doing two jobs at once: controlling how far a *roast* change moves the grind **and** how far a *dose* change moves it. Those need to behave differently — roast should span a couple of numbers across light-to-dark, while dose should barely move. They're now separate: roast, origin and freshness still move the grind in the grinder's real steps, while dose applies a small continuous adjustment on top. Roast still spans its full range (light to dark), dose now moves in single clicks, and every one of the 42 supported grinders was re-checked.

### Verified
Added a permanent test that steps the dose one gram at a time across every click-dial grinder and every calibration, confirming the grind never jumps more than one click and always moves the correct direction (bigger dose = coarser). All pass, alongside the full grinder, error-injection, and engine sweeps.

---

## v1.8.9 — 2026-08-20

### Fixed
- **1Zpresso K-Max and ZP6 now use their real "number + clicks" dials.** They were modelled as fractional rotation settings, which was both inaccurate and caused the shown setting to drift slightly past the dial's real limits. Both now read the way the physical grinders do — a number plus clicks (e.g. "5 and 2 clicks"), with 10 clicks between each number — matching 1Zpresso's own charts and champion recipes. Their pour-over starting points now land where they should (K-Max around 7, ZP6 around 5).
- **Grind settings no longer overshoot a grinder's min/max.** On grinders with fractional steps, an extreme dial-in could display a value just past the lowest or highest real setting (e.g. showing "0.9" on a grinder whose minimum is 1). Settings are now clamped to the true range after rounding.
- **The engine is now hardened against bad or outdated saved data.** If a saved bag ever referenced an option that was later renamed or removed, or held an out-of-range dose, the app now falls back to a sensible default instead of failing. This makes older saved bags safe to open across app updates.

### Verified
Comprehensive audit across all 42 supported grinders — every one checked for correct build, dial-in direction (finer/coarser), min/max clamping, and calibration round-trip — plus deliberate bad-input testing (garbage doses, extreme adjustments, stale values). All pass.

---

## v1.8.8 — 2026-08-20

### Fixed
- **The dial-in "go 1 step coarser/finer" button now actually moves the grind.** Before, it only logged your note but left the grind setting unchanged — so calibrating to 9 and tapping "coarser" still showed 9. It now shifts the recipe by exactly one click on a click-grinder like the Fellow Opus (9 → 9·1 → 9·2 …) and records the change.
- **The pour timeline no longer shows impossible drain windows.** On some recipes (e.g. Kasuya Sweeter) the last pour and the drain were only ~5 seconds apart even though the pour added ~90ml — which you can't physically pour that fast. The drain marker now accounts for how long the final pour actually takes (based on its volume), so the timing is realistic.
- **The Scriptable update instructions are clearer and land you on the right file.** The notice now spells out the fastest real path — tap the ⋯ (three dots) menu on the file, then Download — and the "Open the file" button links straight to the .scriptable file instead of the repo's front page.

### Note on the Fellow Opus
The Opus grind ladder (each roast/dose step moving in its real click positions) is working as designed. A one-gram dose change can occasionally cross a click boundary and shift the shown clicks — that reflects how the physical stepped dial actually behaves, not a rounding error.

---

## v1.8.7 — 2026-08-20

### Fixed
- **Drain and finish times now scale with your dose.** Previously the finish window and drain marker were the same regardless of whether you brewed 15g or 40g. But a bigger dose means a deeper coffee bed, which drains slower (Darcy's law — more grounds, more resistance). The finish window now stretches later as dose grows: an everyday brew finishes around 2:40–3:10 at 15g and 3:00–3:30 at 40g, matching the well-documented rule that a 15g V60 finishes near 2:30 and a 30g brew near 3:30.
- **The drain marker now sits where drawdown actually begins** — right after the last pour — instead of an arbitrary fixed offset. The finish window is when the dripping completes. This also fixes the Classic (Hoffmann) method, whose front-loaded pours finish early: its drain no longer appears with a confusing dead gap before the real finish.

The drawdown phase (last pour → cup done) now lands in the 30–90-second range the research describes, and grows with dose as it should.

---

## v1.8.6 — 2026-08-20

### Fixed
- **The finish-time "Log this — go 1 step coarser/finer" button now works.** When you entered a finish time outside the target window, the button appeared but tapping it did nothing — the entry wasn't recorded. The button's tap was being handled by the wrong part of the screen (it sits in the "after the brew" section, but its action was wired to the recipe card above it). It now logs the finish result to the bag's dial-in history as intended.

---

## v1.8.5 — 2026-08-20

### Changed
- **The Scriptable update notice now explains how to update.** Tapping "Get it" now shows three short steps (open the page → tap download → open the file in Scriptable) before opening the repo, so someone who doesn't know GitHub isn't left guessing. Fully bilingual. The web version is unchanged — it still reloads in place.

---

## v1.8.4 — 2026-08-20

### Fixed
- **"Everyday Balanced" now shows in Arabic** (يومي متوازن). The method name had no Arabic translation, so it stayed in English when the app was in Arabic — the only such label. All five brew styles now display correctly in both languages.

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
