// Reopening the app must start a fresh brew. Saved bags are where work persists;
// the builder is a scratchpad. Only your EQUIPMENT carries over (grinder, brewer,
// machine) - resetting the grinder would silently show the wrong grind numbers.
//
// Regression for a half-restore: settings came back, the link to the bag did not,
// and a hidden dial-in trail came back and leaked into the next new bag saved.
const fs = require("fs"), path = require("path"), vm = require("vm");
const R = require("./harness").Reporter("10 RELAUNCH");

const raw = fs.readFileSync(path.join(__dirname, "..", "brew.html"), "utf8");
const page = eval("`" + raw + "`");
const code = page.substring(page.indexOf("<script>") + 8, page.lastIndexOf("</script>"))
  .replace(/\bconst (?=[A-Za-z_$])/g, "var ").replace(/\blet (?=[A-Za-z_$][\w$]*\s*[=,;])/g, "var ");

// Boot a completely fresh copy of the app, optionally with saved data.
function boot(saved) {
  function El(id) {
    const el = { id: id || "", style: {}, value: "", dataset: {}, classList: { add() {}, remove() {}, toggle() {} },
      addEventListener() {}, focus() {}, querySelectorAll() { return []; } };
    Object.defineProperty(el, "innerHTML", { set(v) { el._h = v; }, get() { return el._h || ""; } });
    return el;
  }
  const els = {};
  const win = { SAVED: saved || null, addEventListener() {}, localStorage: { getItem() { return null; }, setItem() {} } };
  const ctx = {
    window: win, navigator: {}, localStorage: win.localStorage, console,
    setInterval: () => 0, clearInterval() {}, setTimeout: () => 0, clearTimeout() {},
    document: { body: El(), head: El(), getElementById(id) { return els[id] || (els[id] = El(id)); },
      querySelector() { return null; }, querySelectorAll() { return []; }, createElement() { return El(); }, addEventListener() {} },
    location: { protocol: "file:" }, fetch: () => ({ then() { return { catch() {} }; } }),
    btoa: (s) => Buffer.from(s, "binary").toString("base64"), atob: (s) => Buffer.from(s, "base64").toString("binary"),
    escape, unescape, encodeURIComponent, decodeURIComponent, JSON, Math, Date, Object, Array, String, Number
  };
  ctx.SAVED = win.SAVED;
  vm.createContext(ctx);
  vm.runInContext(code + "\n;this.__api={state:state,defaults:STATE_DEFAULTS,lib:function(){return LIBRARY},journey:function(){return JOURNEY},active:function(){return activeBagId},saveNew:saveNew,persist:persist,save:function(){return window.SAVE_DATA}};", ctx);
  return ctx.__api;
}

// Session 1: set up equipment, a dialled-in brew, a saved bag, keep tinkering.
const s1 = boot(null);
Object.assign(s1.state, { grinder: "ode2", brewer: "kalita", origin: "kenya", roast: "light", dose: 22, grindAdj: 2 });
s1.journey().push({ ts: 1, date: "2026-10-15", taste: "sour", grind: "5", temp: 94, action: "→ finer" });
s1.saveNew("Kenya bag", "");
Object.assign(s1.state, { origin: "brazil", dose: 28, tempAdj: -2 });
s1.persist();
const saved = JSON.parse(s1.save());

// Session 2: reopen. It must look exactly like a first-ever launch, except for
// the equipment. (Compare against a real first launch rather than STATE_DEFAULTS:
// the app derives some fields at start-up, e.g. roastDate from the default 14 days.)
const s2 = boot(saved);
const first = boot(null).state;
const EQUIPMENT = ["grinder", "brewer", "machine", "machineOn", "tempProfile"];
Object.keys(first).forEach(k => {
  if (EQUIPMENT.indexOf(k) >= 0) return;
  R.count();
  if (JSON.stringify(s2.state[k]) !== JSON.stringify(first[k]))
    R.flag("not-fresh", k + ' came back as "' + s2.state[k] + '" - a reopened app must start a fresh brew (first launch: "' + first[k] + '")');
});
[["grinder", "ode2"], ["brewer", "kalita"]].forEach(([k, v]) => {
  R.count();
  if (s2.state[k] !== v) R.flag("equipment-lost", k + ' reset to "' + s2.state[k] + '" - your ' + k + " must survive a relaunch");
});
R.count(); if (s2.active() !== null) R.flag("attached", "reopened app is still attached to a bag");
R.count(); if (s2.journey().length !== 0) R.flag("orphan-trail", "reopened app carries " + s2.journey().length + " dial-in rows with no bag");
R.count(); if (s2.lib().length !== 1) R.flag("bags-lost", "saved bags not kept across relaunch");

// A brand-new bag after relaunch must not inherit the old trail.
s2.state.origin = "peru";
s2.saveNew("Peru", "");
R.count();
const nb = s2.lib()[0];
if ((nb.journey || []).length !== 0) R.flag("trail-leak", "new bag inherited " + nb.journey.length + " dial-in rows from a previous session");

// Someone stuck on the old version (Build grinder swapped to "xbloom") reopens the app.
const stuck = boot({ library: [], current: { grinder: "xbloom", grinderPrev: "ode2", machine: "xbloom", machineOn: true, brewer: "v60" } });
R.count();
if (stuck.state.grinder !== "ode2")
  R.flag("stuck-grinder", 'reopened with grinder "' + stuck.state.grinder + '" - the old xBloom swap was not repaired');

process.exit(R.done());
