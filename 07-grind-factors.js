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

process.exit(R.done());
