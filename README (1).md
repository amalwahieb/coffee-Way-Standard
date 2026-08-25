# Coffee Way Standard — test suite

Automated checks that run against `brew.html` (the source of truth). They load the
app's brewing engine directly and verify it produces correct, physically possible
recipes across every combination of options.

## Running

From the repo root:

```
node tests/run-all.js
```

Or a single file:

```
node tests/05-pours.js
```

Every test exits non-zero on failure, so `run-all.js` can gate a release.
No dependencies — plain Node.

## What each file covers

| File | Covers |
|---|---|
| `01-parse.js` | `brew.html` parses cleanly and contains no backslash (a backslash breaks the Scriptable build) |
| `02-functional.js` | Every brew style, origin, roast, brewer and grinder produces a valid recipe |
| `03-grinders.js` | All 42 grinders: dial-in moves the right way, settings stay inside the real dial range, calibration round-trips |
| `04-dose-grind.js` | Changing the dose never jumps the grind more than one click, and always in the right direction |
| `05-pours.js` | The pour schedule is physically possible — pourable volumes, realistic timing, sane ratios, bloom, drain and finish |
| `06-bad-input.js` | Garbage or outdated saved data can't crash the app or produce nonsense |
| `07-grind-factors.js` | Roast, freshness, dose, origin and manual dial-in each affect the grind correctly and independently |

`harness.js` loads the engine and holds the shared constants; it isn't a test itself.

## Dose range

Tests treat **15–50g** as the real-world envelope and enforce full pour physics
there. Doses outside it (8–14g and 51–100g) only have to avoid crashing — almost
nobody brews there, and letting extreme doses drive the tuning distorts the
settings that matter.

## The numbers behind the checks

These aren't arbitrary thresholds:

- **Pour rate 4–6 ml/s.** 2025 World Brewers Cup finalists poured in this range on
  the main pour. Gentle even-pour methods are checked at 5.5 ml/s; deliberately
  fast pours (Hoffmann, the Osamah strength pours) at 7.5 ml/s.
- **Bloom 1.5–3.5× the dose**, allowing up to 4.6× for immersion brewers and for
  Kasuya 4:6, which folds the bloom into a deliberately large first pour.
- **Ratio 1:10–1:20**, covering everything from a strong brew to a light one.
- **Bigger dose drains slower** (Darcy's law — a deeper bed resists flow), so the
  grind goes slightly coarser and the finish window moves later.
- **Lighter roasts grind finer**; coffee grinds finer as it ages and degasses.

## Adding a test

Copy the shape of an existing file:

```js
const H = require("./harness"); H.load();
const R = H.Reporter("08 MY CHECK");
R.count();
if (somethingWrong) R.flag("category", "what and where");
process.exit(R.done());
```

`H.base({...})` gives a known-good recipe state to override. `H.splitPours(recipe)`
separates real pours from the drain marker. `H.DOSE_MIN` / `H.DOSE_MAX` are the
real-world bounds.

## After changing brew.html

Always regenerate the derived files (`index.html`, `brew.js`,
`Coffee Way Standard.scriptable`) and re-run the suite before pushing.
`index.html` must stay byte-identical to `brew.html`.
