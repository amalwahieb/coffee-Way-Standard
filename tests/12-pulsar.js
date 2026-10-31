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

// --- Everyday + Pulsar + hot follows Jonathan Gagne's recipe (his article) ---
// Level the bed; bloom 3x with the valve open, close it gently at the first drip,
// swirl by the base; open the valve at 1:00; small pulses keeping the slurry about
// 1cm above the bed; total 3:30-4:30, about 4:00 at 20g; water hotter than usual.
for (let dose = 15; dose <= 40; dose++) {
  const r = H.buildRecipe(H.base({ brewer: "pulsar", goal: "everyday", dose }));
  const p = H.splitPours(r).pours, tag = "Gagne " + dose + "g", b = H.tr(p[0].note || "");
  R.count();
  if (!/^Level the bed/.test(b) || !/Open the valve/.test(b) || !/starts to drip/.test(b) || !/by the base/.test(b))
    R.flag("gagne-bloom", tag + ": bloom is missing level-the-bed / open valve / close at drip / swirl by the base");
  R.count();
  if (Math.abs(p[0].pour / dose - 3) > 0.4) R.flag("gagne-bloom", tag + ": bloom is " + (p[0].pour / dose).toFixed(1) + "x, Gagne uses about 3x");
  R.count();
  if (p[1].t !== 60 || !/Open the valve/.test(H.tr(p[1].note || ""))) R.flag("gagne-open", tag + ": valve does not open at 1:00");
  R.count();
  if (!p[0].valveTag || p[1].valveTag !== "Open the valve") R.flag("valve-tag", tag + ": timer valve markers missing");
  R.count();
  if (p.length !== 2 || H.tr(p[1].label) !== "Pulses") R.flag("gagne-merged", tag + ": expected Bloom + one Pulses step, got " + p.map(x => H.tr(x.label)).join(", "));
  R.count();
  if (!p[1].pourFor) R.flag("gagne-pulse", tag + ": pulse step has no pulsing time for the timer");
  const pulses = Math.round(((p[1].pourFor || 8) - 8) / 20) + 1;
  R.count();
  if (pulses > 8) R.flag("gagne-pulse", tag + ": " + pulses + " pulses, at most 8 so the brew finishes on time");
  const limit = dose <= 30 ? 55 : 80;   // about 1cm (~47ml) within his 20-30g range
  R.count();
  if (p[1].pour / pulses > limit) R.flag("gagne-pulse", tag + ": pulses of " + Math.round(p[1].pour / pulses) + "ml are far above 1cm");
  R.count();
  if (!/about 1cm/.test(H.tr(p[1].note || "")) || H.tr(p[1].note || "").indexOf(String(r.totalWater) + "ml") < 0)
    R.flag("gagne-pulse", tag + ": pulse note must say about 1cm and the total (" + r.totalWater + "ml)");
  R.count();
  const sum = p.reduce((a, x) => a + x.pour, 0);
  if (sum !== r.totalWater || p[p.length - 1].cum !== r.totalWater)
    R.flag("gagne-water", tag + ": pulses add up to " + sum + "ml, recipe water is " + r.totalWater + "ml");
  if (dose >= 20 && dose <= 30) {
    const m = /aim (\d+):(\d+)–(\d+):(\d+)/.exec(H.tr(H.splitPours(r).drain.note));
    R.count();
    if (!m || (+m[1] * 60 + +m[2]) < 210 - 15 || (+m[3] * 60 + +m[4]) > 270 + 15)
      R.flag("gagne-time", tag + ": finish " + (m ? m[0] : "none") + " is outside Gagne's 3:30-4:30");
  }
}
{
  const r = H.buildRecipe(H.base({ brewer: "pulsar", goal: "everyday", dose: 20 }));
  const m = /aim (\d+):(\d+)–(\d+):(\d+)/.exec(H.tr(H.splitPours(r).drain.note));
  R.count();
  if (!m || (+m[1] * 60 + +m[2]) > 240 || (+m[3] * 60 + +m[4]) < 240) R.flag("gagne-time", "20g window does not include 4:00: " + (m ? m[0] : "none"));
  const notes = r.notes || [];
  R.count(); if (!notes.some(n => /Gagn/.test(H.tr(n.text)))) R.flag("gagne-credit", "recipe is not credited to Jonathan Gagne");
  R.count(); if (/Rao|Gagn/.test(r.method)) R.flag("everyday-header", 'Pulsar Everyday must stay Everyday: "' + r.method + '"');
  R.count(); if (!notes.some(n => n.red && /Brighter/.test(H.tr(n.label)) && /0:30 instead of 1:00/.test(H.tr(n.text)))) R.flag("gagne-tip", "red tip should be 'Brighter cup: open at 0:30 instead of 1:00'");
  R.count(); if (notes.some(n => /do not swirl/.test(H.tr(n.text)))) R.flag("swirl-note", "Pulsar agitation note still says not to swirl");
}
// Temperature: Everyday on the Pulsar is 4C hotter than the same coffee elsewhere,
// never above 99C; other Pulsar styles keep the normal temperature.
["light", "medium", "dark"].forEach(ro => ["washed", "natural"].forEach(pr => {
  const pe = H.buildRecipe(H.base({ brewer: "pulsar", goal: "everyday", roast: ro, process: pr })).temp;
  const v = H.buildRecipe(H.base({ brewer: "v60", goal: "everyday", roast: ro, process: pr })).temp;
  R.count();
  if (pe !== Math.min(99, v + 4)) R.flag("gagne-temp", ro + "/" + pr + ": Pulsar Everyday " + pe + "C, expected " + Math.min(99, v + 4) + "C (V60 " + v + "C + 4, max 99)");
  ["classic", "osamah", "brighter", "sweeter"].forEach(g => {
    R.count();
    const pt = H.buildRecipe(H.base({ brewer: "pulsar", goal: g, roast: ro, process: pr })).temp;
    const vt = H.buildRecipe(H.base({ brewer: "v60", goal: g, roast: ro, process: pr })).temp;
    if (pt !== vt) R.flag("other-temp", g + " on the Pulsar changed temperature (" + pt + "C vs " + vt + "C)");
  });
  R.count();
  const it = H.buildRecipe(H.base({ brewer: "pulsar", goal: "everyday", serve: "iced", roast: ro, process: pr })).temp;
  const iv = H.buildRecipe(H.base({ brewer: "v60", goal: "everyday", serve: "iced", roast: ro, process: pr })).temp;
  if (it !== iv) R.flag("iced-temp", "iced Everyday on the Pulsar changed temperature (" + it + "C vs " + iv + "C)");
}));

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
