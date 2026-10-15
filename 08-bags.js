// Saved bags: a bag you have not brewed must not show a brew log, and deleting
// the active bag must reset the builder instead of leaving its settings loaded.
// Both were reported from the phone: a brand-new bag showed a "logged" row
// dated today, and a new bag inherited the deleted bag's settings.
const H = require("./harness"); H.load();
const R = H.Reporter("08 SAVED BAGS");

function fresh() { H.clearLibrary(); H.resetBuilder(); }

// --- saving a bag with no verdict must not seed a history row ---
R.count();
fresh();
Object.assign(H.state, { origin: "peru", dose: 25, roast: "light" });
H.saveNew("Peru", "");
let bag = H.getLibrary()[0];
if (!bag) R.flag("not-saved", "saveNew created no bag");
else if ((bag.history || []).length !== 0)
  R.flag("phantom-log", 'unbrewed bag has ' + bag.history.length + ' history row(s) - renders as "logged" with today\'s date');

// --- reporting a taste DOES log a brew ---
R.count();
H.logBrew("Peru", "great");
bag = H.getLibrary()[0];
if ((bag.history || []).length !== 1)
  R.flag("missing-log", 'a reported verdict produced ' + (bag.history || []).length + ' rows, expected 1');

// --- re-saving an existing bag without a verdict adds no row ---
R.count();
const before = (H.getLibrary()[0].history || []).length;
H.logBrew("Peru", "");
const after = (H.getLibrary()[0].history || []).length;
if (after !== before)
  R.flag("phantom-log", "re-saving with no verdict added a history row (" + before + " -> " + after + ")");

// --- deleting the active bag resets every builder field to its default ---
R.count();
fresh();
Object.assign(H.state, { origin: "kenya", dose: 30, roast: "dark", brewer: "chemex", grindAdj: 4, tempAdj: 2 });
H.saveNew("Kenya", "");
H.clearLibrary();          // stands in for the splice the click handler does
H.resetBuilder();          // what the handler now calls for the active bag
const d = H.defaults();
Object.keys(d).forEach(k => {
  R.count();
  if (JSON.stringify(H.state[k]) !== JSON.stringify(d[k]))
    R.flag("stale-state", k + ' stayed "' + H.state[k] + '" instead of resetting to "' + d[k] + '"');
});

// --- a bag created afterwards must carry defaults, not the deleted bag's values ---
R.count();
H.state.origin = "peru"; H.state.dose = 25;
H.saveNew("Peru again", "");
const ns = H.getLibrary()[0].state;
["roast", "brewer", "grindAdj", "tempAdj", "strength", "goal"].forEach(k => {
  R.count();
  if (JSON.stringify(ns[k]) !== JSON.stringify(d[k]))
    R.flag("inherited", "new bag inherited " + k + '="' + ns[k] + '" from the deleted bag (default "' + d[k] + '")');
});

process.exit(R.done());
