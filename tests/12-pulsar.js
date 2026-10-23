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
  const pul = H.splitPours(H.buildRecipe(H.base({ brewer: "pulsar", goal, serve, dose }))).pours;
  const v60 = H.splitPours(H.buildRecipe(H.base({ brewer: "v60", goal, serve, dose }))).pours;
  R.count();
  if (pul.length !== v60.length) { R.flag("shape", tag + ": Pulsar has " + pul.length + " pours, V60 " + v60.length); return; }
  pul.forEach((p, i) => {
    R.count();
    const own = H.tr(v60[i].note || "");
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

process.exit(R.done("every brew style on the Pulsar keeps its own instructions"));
