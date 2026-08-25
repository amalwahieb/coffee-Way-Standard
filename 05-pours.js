// ============================================================================
// POUR SCHEDULE AGENT
// Sweeps every brew style x brewer x strength x hot/iced across the dose range
// and checks each recipe's pour schedule against physical brewing reality.
//
// STRICT band  (15-50g): the real-world envelope. Full pour physics enforced.
// FRINGE band  (8-14g, 51-100g): must not crash or produce nonsense, but does
//              not drive threshold tuning - almost nobody brews here.
// ============================================================================
const H = require("./harness"); H.load();
const R = H.Reporter("05 POUR SCHEDULES");

// Kasuya 4:6 folds the bloom into a deliberately large first pour, so it gets a
// higher bloom ceiling. Immersion brewers fill-and-steep rather than pour.
const KASUYA = ["brighter", "sweeter"];
const MAX_SINGLE_POUR = 260;   // ml - beyond this a single pour isn't controllable

function check(dose, goalId, brewerId, strengthId, serve, strict) {
  R.count();
  let r;
  try {
    r = H.buildRecipe(H.base({ dose, goal: goalId, brewer: brewerId, strength: strengthId, serve }));
  } catch (e) {
    R.flag("crash", dose + "g " + goalId + "/" + brewerId + "/" + serve + ": " + e.message);
    return;
  }
  const tag = dose + "g " + goalId + "/" + brewerId + "/" + serve;
  const { pours, drain } = H.splitPours(r);
  const immersion = H.brewerKind(brewerId) === "immersion";

  // --- always enforced, every dose ---
  for (let i = 1; i < pours.length; i++) {
    if (pours[i].cum < pours[i - 1].cum) R.flag("water-decreased", tag + " at step " + i);
    if (pours[i].pour < 0) R.flag("negative-pour", tag + " pour " + i + " = " + pours[i].pour);
  }
  if (r.temp < 80 || r.temp > 101) R.flag("temp-out-of-range", tag + ": " + r.temp + "C");
  if (drain && pours.length && drain.t < pours[pours.length - 1].t) R.flag("drain-before-pour", tag);
  if (r.finishHi && pours.length && r.finishHi < pours[pours.length - 1].t) R.flag("finish-before-pour", tag);

  if (!strict) return;

  // --- pour physics, real-world dose band only ---
  const ratio = r.totalWater / dose;
  if (ratio < 9.5 || ratio > 20.5) R.flag("ratio-off", tag + ": 1:" + ratio.toFixed(1));

  if (pours.length) {
    const bloomX = pours[0].pour / dose;
    const ceiling = (immersion || KASUYA.indexOf(goalId) >= 0) ? 4.6 : 3.6;
    if (bloomX < 1.4 || bloomX > ceiling) R.flag("bloom-off", tag + ": " + bloomX.toFixed(1) + "x dose");
  }

  if (immersion) return;   // fill-and-steep: continuous-pour rules don't apply

  const rate = H.pourRateFor(goalId);
  for (let i = 1; i < pours.length; i++) {
    const window = pours[i].t - pours[i - 1].t;
    const vol = pours[i].pour;
    const needed = vol / rate;
    if (window > 0 && needed > window + 3)
      R.flag("pour-too-fast", tag + ": pour " + i + " is " + vol + "ml in " + window + "s (needs ~" + Math.round(needed) + "s)");
    if (vol > MAX_SINGLE_POUR)
      R.flag("pour-unpourable", tag + ": single pour of " + vol + "ml");
  }
  if (drain && pours.length) {
    const lp = pours[pours.length - 1];
    const gap = drain.t - lp.t, needed = lp.pour / rate;
    if (gap < needed - 3 && lp.pour > 25)
      R.flag("drain-too-soon", tag + ": drain " + gap + "s after a " + lp.pour + "ml pour (needs ~" + Math.round(needed) + "s)");
  }
}

const goals = H.GOALS.map(x => x.id);
const brewers = H.BREWERS.map(x => x.id);
const strengths = H.STRENGTHS.map(x => x.id);

// Strict sweep across the real envelope, every gram.
for (let dose = H.DOSE_MIN; dose <= H.DOSE_MAX; dose++)
  goals.forEach(g => brewers.forEach(b => strengths.forEach(s =>
    ["hot", "iced"].forEach(sv => check(dose, g, b, s, sv, true)))));

// Fringe sweep: sanity only, sampled.
for (let dose = H.DOSE_FRINGE_MIN; dose < H.DOSE_MIN; dose++)
  goals.forEach(g => brewers.forEach(b => ["hot", "iced"].forEach(sv => check(dose, g, b, "balanced", sv, false))));
for (let dose = H.DOSE_MAX + 1; dose <= H.DOSE_FRINGE_MAX; dose += 5)
  goals.forEach(g => brewers.forEach(b => ["hot", "iced"].forEach(sv => check(dose, g, b, "balanced", sv, false))));

process.exit(R.done("strict " + H.DOSE_MIN + "-" + H.DOSE_MAX + "g (full pour physics), fringe " +
  H.DOSE_FRINGE_MIN + "-" + H.DOSE_FRINGE_MAX + "g (sanity only)"));
