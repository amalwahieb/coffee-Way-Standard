// The Pulsar adds valve steps to a brew style - it must not replace the style.
//
// Regression: every Pulsar pour had its note overwritten with the same generic
// "pour in short bursts" lines, so Everyday, Kasuya 4:6, Hoffmann and Osamah all
// gave identical instructions, and Hoffmann's single quick pour and final stir
// were contradicted. Now: close the valve on the first step, open it on the
// second, and every step keeps the style's own note.
const H = require("./harness"); H.load();
const R = H.Reporter("12 PULSAR x BREW STYLES");

H.GOALS.map(g => g.id).forEach(goal => ["hot", "iced"].forEach(serve => [15, 20].forEach(dose => {
  const tag = goal + "/" + serve + "/" + dose + "g";
  if (goal === "everyday" && serve === "hot") return;   // follows Gagne's recipe - checked below
  const pul = H.splitPours(H.buildRecipe(H.base({ brewer: "pulsar", goal, serve, dose }))).pours;
  const v60 = H.splitPours(H.buildRecipe(H.base({ brewer: "v60", goal, serve, dose }))).pours;
  R.count();
  if (pul.length !== v60.length) { R.flag("shape", tag + ": Pulsar has " + pul.length + " pours, V60 " + v60.length); return; }
  pul.forEach((p, i) => {
    R.count();
    // the only intended difference: Hoffmann drops "keeping the cone full" on the Pulsar
    const own = H.tr(v60[i].note || "").split(", keeping the cone full").join("");
    const got = H.tr(p.note || "");
    if (own && got.indexOf(own) < 0)
      R.flag("style-lost", tag + " step " + (i + 1) + ': style note "' + own.slice(0, 50) + '" missing on the Pulsar');
    if (/short bursts/.test(got))
      R.flag("generic", tag + " step " + (i + 1) + ': generic "short bursts" line is back');
  });
  R.count();
  if (!/Close the valve/.test(H.tr(pul[0].note || ""))) R.flag("valve", tag + ": first step does not close the valve");
  if (pul[1] && !/Open the valve/.test(H.tr(pul[1].note || ""))) R.flag("valve", tag + ": second step does not open the valve");
})));

// Hoffmann on the Pulsar: no "keeping the cone full" (it is a cylinder); the V60 keeps it.
const hp = H.buildRecipe(H.base({ brewer: "pulsar", goal: "classic" })).pours.map(p => H.tr(p.note || "")).join(" ");
const hv = H.buildRecipe(H.base({ brewer: "v60", goal: "classic" })).pours.map(p => H.tr(p.note || "")).join(" ");
R.count(); if (/cone full/.test(hp)) R.flag("cone", 'Hoffmann on the Pulsar still says "keeping the cone full"');
R.count(); if (!/cone full/.test(hv)) R.flag("cone", 'Hoffmann on the V60 lost "keeping the cone full"');

// The red "sweeter cup" tip appears for the Pulsar only.
H.BREWERS.forEach(b => {
  R.count();
  const tip = (H.buildRecipe(H.base({ brewer: b.id })).notes || []).filter(n => n.red);
  if (b.id === "pulsar" && tip.length !== 1) R.flag("tip", "Pulsar is missing the red sweeter-cup tip");
  if (b.id !== "pulsar" && tip.length) R.flag("tip", b.id + " shows the Pulsar-only tip");
});

// --- Everyday + Pulsar + hot follows Jonathan Gagne's recipe (NextLevel card) ---
// Bloom 3x with the valve open, close at first drips, light swirl; open at 0:30;
// small pulses into the centre of the cap keeping the water under 1cm (~47ml over
// the Pulsar's 7.7cm bore); about 3:30 total at 20g.
for (let dose = 15; dose <= 40; dose++) {
  const r = H.buildRecipe(H.base({ brewer: "pulsar", goal: "everyday", dose }));
  const p = H.splitPours(r).pours, tag = "Gagne " + dose + "g";
  R.count();
  if (!/^Open the valve/.test(H.tr(p[0].note || "")) || !/starts to drip/.test(H.tr(p[0].note || "")))
    R.flag("gagne-bloom", tag + ": bloom does not start with 'Open the valve' and close at first drips");
  R.count();
  if (!p[0].valveTag || !/Open valve, close at first drip/.test(p[0].valveTag)) R.flag("valve-tag", tag + ": bloom has no valve marker for the timer");
  R.count();
  if (p[1].valveTag !== "Open the valve") R.flag("valve-tag", tag + ": the 0:30 step has no 'Open the valve' marker for the timer");
  p.slice(2).forEach(x => { R.count(); if (x.valveTag) R.flag("valve-tag", tag + ": a later pulse is marked as a valve step"); });
  R.count();
  if (p[1].t !== 30 || !/Open the valve/.test(H.tr(p[1].note || ""))) R.flag("gagne-open", tag + ": valve does not open at 0:30");
  R.count();
  if (Math.abs(p[0].pour / dose - 3) > 0.4) R.flag("gagne-bloom", tag + ": bloom is " + (p[0].pour / dose).toFixed(1) + "x, Gagne uses 3x");
  p.slice(1).forEach(x => { R.count(); if (x.pour > 47) R.flag("gagne-pulse", tag + ": a " + x.pour + "ml pulse would rise above 1cm"); });
  R.count();
  const sum = p.reduce((a, x) => a + x.pour, 0);
  if (sum !== r.totalWater || p[p.length - 1].cum !== r.totalWater)
    R.flag("gagne-water", tag + ": pulses add up to " + sum + "ml, recipe water is " + r.totalWater + "ml");
}
{
  const r = H.buildRecipe(H.base({ brewer: "pulsar", goal: "everyday", dose: 20 }));
  const drain = H.splitPours(r).drain, m = /aim (\d+):(\d+)–(\d+):(\d+)/.exec(H.tr(drain.note));
  R.count();
  if (!m || (+m[1] * 60 + +m[2]) > 210 || (+m[3] * 60 + +m[4]) < 210)
    R.flag("gagne-time", "20g finish window does not include Gagne's 3:30: " + (m ? m[0] : "none"));
  const notes = r.notes || [];
  R.count(); if (!notes.some(n => /Gagn/.test(H.tr(n.text)))) R.flag("gagne-credit", "recipe is not credited to Jonathan Gagne");
  R.count(); if (/Rao|Gagn/.test(r.method)) R.flag("everyday-header", 'Pulsar Everyday must stay Everyday, not look like a new style: "' + r.method + '"');
  R.count(); if (notes.some(n => /do not swirl/.test(H.tr(n.text)))) R.flag("swirl-note", "Pulsar agitation note still says not to swirl");
  R.count(); if (!notes.some(n => n.red && /1:00/.test(H.tr(n.text)))) R.flag("gagne-tip", "sweeter-cup tip should say open at 1:00");
}
// Other Pulsar styles: the timer marks "Close the valve" on step 1 and "Open the valve" on step 2.
H.GOALS.map(g => g.id).forEach(goal => ["hot", "iced"].forEach(serve => {
  if (goal === "everyday" && serve === "hot") return;
  const p = H.splitPours(H.buildRecipe(H.base({ brewer: "pulsar", goal, serve }))).pours;
  R.count();
  if (p[0].valveTag !== "Close the valve" || p[1].valveTag !== "Open the valve")
    R.flag("valve-tag", goal + "/" + serve + ": timer valve markers missing (" + p[0].valveTag + " / " + p[1].valveTag + ")");
}));
// Setup line ("Before you start") for the Pulsar only; valve markers never appear on other brewers.
H.BREWERS.forEach(b => {
  const r = H.buildRecipe(H.base({ brewer: b.id }));
  R.count();
  const has = (r.notes || []).some(n => /Before you start/.test(H.tr(n.label)));
  if (b.id === "pulsar" && !has) R.flag("setup", "Pulsar has no 'Before you start' setup line");
  if (b.id !== "pulsar" && has) R.flag("setup", b.id + " shows the Pulsar setup line");
  R.count();
  if (b.id !== "pulsar" && r.pours.some(p => p.valveTag)) R.flag("valve-tag", b.id + " has Pulsar valve markers");
});

// Iced Everyday on the Pulsar keeps the normal Pulsar steps (Gagne's recipe is hot).
{
  const p = H.splitPours(H.buildRecipe(H.base({ brewer: "pulsar", goal: "everyday", serve: "iced" }))).pours;
  R.count(); if (!/Close the valve first/.test(H.tr(p[0].note || ""))) R.flag("gagne-iced", "iced Everyday changed - Gagne's recipe should be hot only");
}

process.exit(R.done("every brew style on the Pulsar keeps its own instructions; Everyday follows Gagne"));
