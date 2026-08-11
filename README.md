# Coffee Way Standard (CWS)

**A deterministic pour-over recipe app — you enter your bag and grinder, it gives you one exact recipe.**
Bilingual (English / العربية). Runs on iPhone via Scriptable, and in any web browser.

By **Abdulmajeed Mohammed Alwahieb** · إعداد **عبدالمجيد محمد الوهيب**

---

## What it does

Coffee Way Standard turns what you know about a coffee bag — origin, process, roast, roast date, dose — plus your grinder into a single, specific recipe: grind setting, water temperature, ratio, a timed pour schedule, and an expected finish-time window. No guessing, no vague "medium grind." Every number is either sourced from a named method or openly disclosed.

Core ideas:

- **One bag in, one recipe out.** The engine reads your inputs and computes grind, temperature, ratio, and a pour-by-pour timeline for your exact setup.
- **Freshness is live.** Enter the roast date once; the app tracks where the bag sits on its rest curve and adjusts grind and temperature as it ages — and tells you exactly what it changed.
- **It explains itself.** A "Why this recipe?" panel states the reasoning behind every choice, including any age adjustments.
- **It learns your cups.** Log finish times and verdicts; after a few great brews on one bag, the app calibrates that bag's finish window to *your* results instead of the book estimate.
- **It's tuned to your grinder.** Calibrate once — tell it the setting you actually dial — and every recipe on that grinder shifts to *your* numbers, not the book's. It also keeps learning from your great brews. A worn or non-standard burr set stops being a problem.

---

## Dialing in your grind

The grind number is the least portable thing in coffee — the same "6" means different things on different grinders, and burrs drift as they wear. Coffee Way Standard attacks this from three sides:

- **A grind reference in Learn.** A clear coarse-to-fine strip showing what each grind should look like, from cold brew down to espresso, with micron sizes — so you have a visual target, not just a number.
- **Your brew time tells you the fix.** When a brew runs faster or slower than its window, the app doesn't just flag it — it prescribes the grind move: "grind is too coarse, try 1–2 steps finer" (or coarser).
- **Calibrate to your grinder, once.** Tell the app what you actually dial ("it shows 6, I use 8.2 on my Opus") and it learns the difference as an offset. Every recipe on that grinder — hot, iced, any dose, any method — then shifts by your offset, so you always see *your* number. Each grinder keeps its own calibration, so switching between them just works.
- **Your grinder fingerprint.** On top of that, every great brew you log reinforces what setting works on *your* grinder — a running record of your proven range, so your own results keep the calibration honest as burrs wear.

Together these move grind confidence away from "stare at the grounds and guess" toward "your brew and your history tell you."

---

## Coverage

- **19 origins** — Ethiopia, Kenya, Colombia, Peru, Brazil, Guatemala, Costa Rica, Rwanda/Burundi, Panama Gesha, Yemen, Saudi Arabia (Khawlani), Indonesia/Sumatra, Honduras, El Salvador, India, Tanzania/Uganda, Mexico, Thailand, and an "other / unsure" catch-all.
- **7 processes** — Washed, Honey, Natural, Anaerobic, Co-fermented/Infused, Wet-hulled (Sumatra), Decaf.
- **43 grinders** — hand and electric, including the Saudi market (Comandante, 1Zpresso, Timemore hand + Sculptor, Kingrinder K0–K6, MHW-3Bomber, Fellow, Baratza, DF64, Varia, MIBRU), plus "other / by feel."
- **5 brewers** — V60, Kalita Wave, Chemex, AeroPress, Switch.
- **Methods** — Hoffmann Ultimate V60, Tetsu Kasuya 4:6 (strength sets the pour count), a locally-calibrated Osamah method, and 50/50; hot and iced (flash).
- **Machine sheets** — Fellow Aiden and xBloom, with per-pour temperature profiling.

---

## Files in this repository

| File | What it is |
|---|---|
| `brew.html` | The complete app — self-contained, runs in any browser. |
| `brew.js` | The Scriptable wrapper — same app plus iPhone saving and the home-screen widget. |
| `Coffee Way Standard.scriptable` | The installable Scriptable package (import this on iPhone). |
| `CWS Origin Scout.scriptable` | Helper agent: look up any origin or process on demand. |
| `CWS Trend Scout.scriptable` | Helper agent: monthly scan of specialty-coffee trends with suggestions. |
| `scout-origin.js`, `scout-trends.js` | Plain-text source of the two agents. |

---

## How to run it

**On iPhone (best experience — saving + widget):**
1. Install **Scriptable** from the App Store (free).
2. Open `Coffee Way Standard.scriptable` and tap **Add to My Scripts**. *(This step matters — importing to preview does not install it.)*
3. Run it from Scriptable, or add the Scriptable widget to your home screen and point it at Coffee Way Standard.

**In a browser (any phone or computer):**
- Open `brew.html`. It works fully offline and remembers your bags on that one device.

---

## The freshness → recipe chain

The app treats origin, roast, and roast date as one connected system, not three separate facts:

- **Origin** sets the bean's density and character, which is why roasters pick a roast level to match it.
- **Roast** sets the clock — darker roasts degas faster and fade sooner; lighter roasts rest longer and last longer.
- **Roast date** only means something combined with the other two: the same day count is "at its peak" for one coffee and "past it" for another.

Enter the roast date once and the chain runs itself — rest window, freshness stage, grind and temperature nudges, and the widget's day counter.

---

## Language

Everything is bilingual. The app has its own English / العربية toggle; the home-screen widget follows your iPhone's system language. Units localize both ways (°C ↔ °م, g ↔ غ, ml ↔ مل, clicks ↔ نقرة).

---

## A note on sourcing

Every precise number in this app is either cited to a named method (Hoffmann, Kasuya) or openly disclosed as a local calibration (the Osamah method, tuned from real stopwatch readings). Where a value is an interpolation between measured points, the app says so. Nothing is invented precision.

---

*Coffee Way Standard is a personal project, shared for anyone who wants a repeatable, honest pour-over.*
