// ============================================================================
// CWS TEST HARNESS
// Loads the app's engine into Node so tests can call buildRecipe() directly.
// Every test file requires this instead of duplicating the setup.
//
// Usage:  const H = require("./harness");  H.load();  H.buildRecipe(H.base({dose:20}))
// ============================================================================
const fs = require("fs");
const path = require("path");

const APP_PATH = path.join(__dirname, "..", "brew.html");

// Real-world dose envelope. Most people brew 15-25g; 50g is a big Chemex batch.
// Tests validate STRICTLY inside this range and only check for crashes outside it.
const DOSE_MIN = 15;
const DOSE_MAX = 50;
// Doses that must not crash, but don't drive threshold tuning.
const DOSE_FRINGE_MIN = 8;
const DOSE_FRINGE_MAX = 100;

// Realistic controlled pour rate (ml/sec).
// 2025 World Brewers Cup finalists poured 4-6 ml/s on the main pour.
// Gentle even-pour methods sit at the low end; deliberately fast pours (Hoffmann,
// osamah strength pours) run higher.
const POUR_RATE_GENTLE = 5.5;
const POUR_RATE_FAST = 7.5;
const FAST_METHODS = ["classic", "osamah"];

let loaded = false;

function load() {
  if (loaded) return module.exports;
  const raw = fs.readFileSync(APP_PATH, "utf8");
  if (raw.indexOf("\\") >= 0) {
    throw new Error("brew.html contains a backslash - breaks the Scriptable device path");
  }
  const page = eval("`" + raw + "`");
  const a = page.indexOf("<script>") + 8;
  const b = page.lastIndexOf("</script>");
  const code = page.substring(a, b);

  // Minimal DOM/browser stubs so the engine can be evaluated headlessly.
  global.setInterval = () => 0;
  global.clearInterval = () => {};
  function El(id) {
    const el = {
      id: id || "", style: {}, value: "", dataset: {},
      addEventListener() {}, focus() {}, querySelectorAll() { return []; }
    };
    Object.defineProperty(el, "innerHTML", { set(v) { el._h = v; }, get() { return el._h || ""; } });
    return el;
  }
  const els = {};
  global.document = {
    body: El(),
    getElementById(id) { return els[id] || (els[id] = El(id)); },
    querySelector() { return null },
    querySelectorAll() { return [] },
    createElement() { return El() },
    addEventListener() {}
  };
  global.window = { SAVED: null, addEventListener() {}, localStorage: { getItem() { return null }, setItem() {} } };
  global.navigator = {};
  global.localStorage = global.window.localStorage;

  eval(code.replace(/\bconst /g, "var ").replace(/\blet /g, "var "));

  // Expose the engine internals the tests need.
  module.exports.buildRecipe   = buildRecipe;
  module.exports.grindSetting  = grindSetting;
  module.exports.grinderById   = grinderById;
  module.exports.allGrinders   = allGrinders;
  module.exports.ORIGINS       = ORIGINS;
  module.exports.ROASTS        = ROASTS;
  module.exports.GOALS         = GOALS;
  module.exports.BREWERS       = BREWERS;
  module.exports.STRENGTHS     = STRENGTHS;
  module.exports.GRINDOFF      = GRINDOFF;
  module.exports.state         = state;
  loaded = true;
  return module.exports;
}

// A known-good default state. Override any field via the argument.
function base(o) {
  return Object.assign({
    machine: "none", tempProfile: "flat", grinder: "comandante", brewer: "v60",
    kind: "single", roast: "medium", process: "washed", origin: "colombia",
    blendStyle: "filter", days: 14, dose: 20, strength: "balanced",
    goal: "everyday", serve: "hot", icedStyle: "hoffmann", roastDate: "",
    grindAdj: 0, tempAdj: 0
  }, o || {});
}

function fmt(sec) {
  return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0");
}

// Split a recipe's steps into real pours vs the drain marker.
function splitPours(recipe) {
  const pours = recipe.pours.filter(x => !x.noAmt);
  const drain = recipe.pours.filter(x => x.noAmt)[0] || null;
  return { pours, drain };
}

function pourRateFor(goalId) {
  return FAST_METHODS.indexOf(goalId) >= 0 ? POUR_RATE_FAST : POUR_RATE_GENTLE;
}

function brewerKind(id) {
  const b = module.exports.BREWERS.find(x => x.id === id);
  return b ? b.kind : "pour";
}

// Simple result collector so every test reports the same way.
function Reporter(title) {
  const issues = {};
  const counts = {};
  let checks = 0;
  return {
    count() { checks++; },
    flag(cat, msg) {
      if (!issues[cat]) issues[cat] = [];
      if (issues[cat].length < 5) issues[cat].push(msg);
      counts[cat] = (counts[cat] || 0) + 1;
    },
    done(note) {
      const cats = Object.keys(issues);
      console.log("=".repeat(52));
      console.log(title);
      if (note) console.log(note);
      if (checks) console.log("Checks: " + checks.toLocaleString());
      console.log("=".repeat(52));
      if (cats.length === 0) {
        console.log("PASS - no issues\n");
        return 0;
      }
      cats.forEach(c => {
        console.log("\nFAIL " + c + " (" + counts[c] + "):");
        issues[c].forEach(m => console.log("   " + m));
        if (counts[c] > issues[c].length) console.log("   ... +" + (counts[c] - issues[c].length) + " more");
      });
      console.log("");
      return 1;
    }
  };
}

module.exports = {
  load, base, fmt, splitPours, pourRateFor, brewerKind, Reporter,
  DOSE_MIN, DOSE_MAX, DOSE_FRINGE_MIN, DOSE_FRINGE_MAX,
  POUR_RATE_GENTLE, POUR_RATE_FAST, FAST_METHODS,
  APP_PATH
};
