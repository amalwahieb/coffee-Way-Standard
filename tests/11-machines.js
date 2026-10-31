// Machine cards must only ever show numbers the machine can actually accept.
//
// Regression: the xBloom dose box allowed 25g while the card printed "max ~16g",
// so a user saw 25g volumes next to a 16g warning. The real limit is 18g
// (xbloom.com: Omni Dripper 2 "Recommended coffee dose: 5-18 grams"), and the
// card's warning must read the same constant as the dose box.
// xBloom app recipes accept up to 95C (Whole Latte Love, Nucleus Coffee), confirmed on a
// real xBloom app in Oct 2026: the highest number is 95, and the only setting above it is BP.
const H = require("./harness"); H.load();
const R = H.Reporter("11 MACHINE CARDS");
const st = H.state;
const keep = JSON.parse(JSON.stringify(st));

// --- the Machine page READS the Build recipe; it must never change it ---
// Regression: selecting the xBloom swapped the Build grinder to "xbloom" and capped
// the Build dose at 18g, and neither was undone on returning to Build.
st.machine = "xbloom"; st.machineOn = true; st.grinder = "ode2"; st.brewer = "v60"; st.dose = 25;
R.count();
if (H.MACHINE_MAXDOSE.xbloom !== 18) R.flag("xbloom-dose", "xBloom limit is " + H.MACHINE_MAXDOSE.xbloom + "g, manufacturer says 18g");
R.count();
if (H.doseLimit() !== 60) R.flag("build-capped", "Build dose box capped at " + H.doseLimit() + "g by a machine - V60 allows 60g");
const html = H.machinePanel();
R.count();
if (st.grinder !== "ode2") R.flag("grinder-hijack", 'viewing the xBloom card changed the Build grinder to "' + st.grinder + '"');
R.count();
if (st.dose !== 25) R.flag("dose-hijack", "viewing the xBloom card changed the Build dose to " + st.dose + "g");

// the card itself uses the machine's limit and explains it
const txt = html.replace(/<[^>]+>/g, " ");
const doseRow = (txt.match(/Dose\s+([^%]{0,90})/) || ["", ""])[1];
R.count();
if (!/^18g/.test(doseRow.trim())) R.flag("card-dose", "xBloom card dose is not 18g for a 25g Build dose: " + doseRow.trim().slice(0, 60));
R.count();
if (!/up to 18g/.test(doseRow)) R.flag("no-warning", "card does not explain the 18g limit");
R.count();
if (/16\s*g/.test(doseRow)) R.flag("stale-16", 'card still mentions 16g');

// within the limit: no warning
st.dose = 18;
R.count();
if (/up to/.test((H.machinePanel().replace(/<[^>]+>/g, " ").match(/Dose\s+([^%]{0,90})/) || ["", ""])[1]))
  R.flag("false-warning", "18g on the xBloom shows a limit warning");

// grind: the real xBloom setting for this recipe on its 1-80 scale, not a fixed number
st.dose = 18; st.roast = "medium";
const expect = H.buildRecipe(Object.assign({}, st, { brewer: "v60", grinder: "xbloom" })).grindNumber;
const gm = H.machinePanel().replace(/<[^>]+>/g, " ").match(/Grind Size\s+start ~(\d+)/);
R.count();
if (!gm) R.flag("grind", "no xBloom grind number on the card");
else {
  if (+gm[1] !== +expect) R.flag("grind", "card shows ~" + gm[1] + ", xBloom scale gives " + expect);
  if (+gm[1] < 1 || +gm[1] > 80) R.flag("grind", "~" + gm[1] + " is off the xBloom 1-80 scale");
}

// --- temperatures never exceed what an xBloom recipe accepts ---
let worst = 0, where = "";
H.ORIGINS.forEach(o => H.ROASTS.forEach(ro => [10, 40, 90].forEach(days =>
  ["flat", "desc", "asc"].forEach(tp => {
    Object.assign(st, { origin: o.id, roast: ro.id, days, dose: 18, tempProfile: tp, machine: "xbloom", machineOn: true });
    R.count();
    const temps = (H.machinePanel().match(/([\d.]+) °C/g) || []).map(x => parseFloat(x));
    temps.forEach(t => { if (t > worst) { worst = t; where = o.id + "/" + ro.id + "/" + days + "d/" + tp; } });
  }))));
// Fellow Aiden card: never 100C either.
H.ORIGINS.forEach(o => H.ROASTS.forEach(ro => [10, 40, 90].forEach(days => ["flat", "desc", "asc"].forEach(tp => {
  Object.assign(st, { origin: o.id, roast: ro.id, days, dose: 18, tempProfile: tp, machine: "aiden", machineOn: true });
  R.count();
  (H.machinePanel().match(/([\d.]+) °C/g) || []).map(x => parseFloat(x)).forEach(t => { if (t >= 100) R.flag("aiden-100", "Aiden card asks for " + t + "C"); });
}))));
if (worst > 95) R.flag("xbloom-too-hot", "xBloom card asks for " + worst + "C at " + where + " - its recipes accept up to 95C");

// --- Arabic: no English words on the machine card rows we control ---
st.machine = "xbloom"; st.dose = 18; st.tempProfile = "flat";
H.setLang("ar");
R.count();
if (/OFF|ON\b/.test(H.machinePanel().replace(/<[^>]+>/g, " ").replace(/RPM|Omni|ml\/s|°C/g, "")))
  R.flag("arabic", "machine card shows ON/OFF in English");
H.setLang("en");

Object.keys(st).forEach(k => delete st[k]); Object.assign(st, keep);
process.exit(R.done("xBloom: dose 5-18g, recipes up to 95C"));
