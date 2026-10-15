// ============================================================================
// GRIND FACTORS
// The grind is assembled from several independent influences. This locks in the
// direction and independence of each one, so changing a factor can't silently
// break another. Directions follow established extraction science.
// ============================================================================
const H = require("./harness"); H.load();
const R = H.Reporter("07 GRIND FACTORS");

// Use a click-dial grinder with fine resolution so small effects are visible.
const G = "opus";
function grind(o) { return H.buildRecipe(H.base(Object.assign({ grinder: G }, o))).grindNumeric; }
function expect(name, cond, detail) { R.count(); if (!cond) R.flag("wrong", name + " [" + detail + "]"); }

// --- ROAST: lighter roasts are denser and extract slower, so they grind finer.
const byRoast = H.ROASTS.map(r => grind({ roast: r.id, days: 7 }));
expect("roast ladder runs finer to coarser",
  byRoast.every((v, i) => i === 0 || v >= byRoast[i - 1]), byRoast.join(" -> "));
expect("roast spans a meaningful range",
  (byRoast[byRoast.length - 1] - byRoast[0]) >= 1.0,
  "span " + (byRoast[byRoast.length - 1] - byRoast[0]).toFixed(2) + " numbers");

// --- FRESHNESS: coffee degasses as it ages and extracts faster, so it grinds finer.
const fresh = grind({ days: 7 }), aging = grind({ days: 30 }), stale = grind({ days: 90 });
expect("older coffee grinds finer", stale <= aging && aging <= fresh,
  "fresh " + fresh + " / aging " + aging + " / stale " + stale);

// --- DOSE: a bigger dose means a deeper bed and more flow resistance (Darcy's
// law), so the grind goes slightly coarser - and it must move gently.
const d15 = grind({ dose: 15 }), d50 = grind({ dose: 50 });
expect("bigger dose grinds coarser", d50 > d15, d15 + " -> " + d50);
expect("dose effect stays gentle", (d50 - d15) <= 1.5,
  "moved " + (d50 - d15).toFixed(2) + " numbers across 15-50g");

// --- MANUAL DIAL-IN: the user's own adjustment, in whole grinder steps.
expect("dial-in coarser raises the setting", grind({ grindAdj: 2 }) > grind({ grindAdj: 0 }), "");
expect("dial-in finer lowers the setting", grind({ grindAdj: -2 }) < grind({ grindAdj: 0 }), "");

// --- ORIGIN: dark, low-acid and robusta-leaning origins want a coarser grind.
const colombia = grind({ origin: "colombia" });
["indonesia", "vietnam"].forEach(o => {
  expect(o + " grinds coarser than Colombia", grind({ origin: o }) > colombia,
    grind({ origin: o }) + " vs " + colombia);
});

// --- INDEPENDENCE: changing one factor must not cancel out another.
R.count();
const baseG = grind({ roast: "medium", dose: 20, days: 7 });
const roastOnly = grind({ roast: "dark", dose: 20, days: 7 });
const doseOnly = grind({ roast: "medium", dose: 45, days: 7 });
const both = grind({ roast: "dark", dose: 45, days: 7 });
if (!(both > roastOnly && both > doseOnly))
  R.flag("independence", "combined factors did not stack (base " + baseG + ", roast " + roastOnly + ", dose " + doseOnly + ", both " + both + ")");

// --- ICED: brewed onto ice, so it needs a finer grind than the same hot recipe.
expect("iced grinds finer than hot", grind({ serve: "iced" }) <= grind({ serve: "hot" }), "");

// --- TEXTURE LABEL: dial-in on a click grinder makes the notch fractional, which
// once broke the texture lookup and printed "undefined undefined" on the card.
[0, 0.5, 1, 1.5, -0.5, -2.5, 3.334].forEach(adj => {
  R.count();
  const gs = H.buildRecipe(H.base({ grinder: G, grindAdj: adj })).grindSize;
  if (!gs || !gs.label || !gs.ref)
    R.flag("texture", "grindAdj " + adj + " gave " + JSON.stringify(gs));
});

// --- TIMER POUR WINDOW: how long "POUR" shows must follow the pour volume, not a
// fixed number of seconds, and must never run past the step it belongs to.
const FAST = ["classic", "osamah"];
H.GOALS.forEach(g => {
  [15, 30, 50].forEach(dose => {
    R.count();
    const r = H.buildRecipe(H.base({ goal: g.id, dose }));
    const ps = r.pours.filter(x => !x.noAmt);
    const rate = FAST.indexOf(g.id) >= 0 ? 7.5 : 5.5;
    ps.forEach((cur, i) => {
      const segEnd = ps[i + 1] ? ps[i + 1].t : r.finishHi;
      const segLen = Math.max(1, segEnd - cur.t);
      const dur = cur.pour > 0 ? Math.max(5, Math.min(segLen - 3, Math.ceil(cur.pour / rate))) : 0;
      if (dur > segLen) R.flag("pour-window", g.id + " " + dose + "g: " + cur.label + " window " + dur + "s exceeds its " + segLen + "s step");
      // The window must not imply a faster pour than anyone can actually manage.
      if (dur > 0 && cur.pour / dur > 8.5) R.flag("pour-window", g.id + " " + dose + "g: " + cur.pour + "ml in " + dur + "s = " + (cur.pour / dur).toFixed(1) + " ml/s");
    });
  });
});

// --- BREW STYLE x BREWER: the styles were written for a cone, so check that each
// combination still lands somewhere a filter grinder can actually reach, and that
// a steeping brewer does not inherit a pour pattern's grind.
H.GOALS.forEach(g => {
  H.BREWERS.forEach(b => {
    H.ROASTS.forEach(ro => {
      R.count();
      const r = H.buildRecipe(H.base({ goal: g.id, brewer: b.id, roast: ro.id, grinder: "comandante", dose: 20, days: 7 }));
      const n = parseFloat(r.grindNumber);
      if (n > 38 || n < 8) R.flag("grind-out-of-range", g.id + "/" + b.id + "/" + ro.id + " = " + n + " clicks");
    });
    // A steeping brewer performs no pour pattern, so the style must not move its grind.
    if (b.kind === "immersion") {
      R.count();
      const a = H.buildRecipe(H.base({ goal: "everyday", brewer: b.id, grinder: "comandante", dose: 20, days: 7 })).grindNumeric;
      const c = H.buildRecipe(H.base({ goal: g.id, brewer: b.id, grinder: "comandante", dose: 20, days: 7 })).grindNumeric;
      if (a !== c) R.flag("style-moved-a-steeping-brewer", b.id + " " + g.id + ": " + a + " vs " + c);
    }
  });
});
// Steps that add no water must not display a volume.
H.BREWERS.forEach(b => {
  R.count();
  const r = H.buildRecipe(H.base({ brewer: b.id, dose: 20 }));
  r.pours.forEach(p => { if (!p.noAmt && p.pour === 0) R.flag("zero-volume-step", b.id + ": " + p.label + " shows 0ml"); });
});

process.exit(R.done());
