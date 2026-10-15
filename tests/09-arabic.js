// Arabic rendering of the brew timeline.
//
// Labels and notes are stored as ENGLISH keys and translated at render time by
// tr(). A test that reads recipe.label / recipe.note directly therefore sees
// English and proves nothing - that mistake once produced a false report of 14
// untranslated notes that were in fact already translated. Always go through
// tr(), exactly as the renderer does.
//
// It also catches the real failure mode: a note assembled at build time
// (a split sub-pour prefix, or a volume spliced into a sentence) stops being a
// TR key, so tr() falls through and the English shows.
const H = require("./harness"); H.load();
const R = H.Reporter("09 ARABIC RENDERING");

H.setLang("ar");
const goals = H.GOALS.map(x => x.id);
const brewers = H.BREWERS.map(x => x.id);
const strengths = H.STRENGTHS.map(x => x.id);
const seen = {};

for (let dose = H.DOSE_MIN; dose <= H.DOSE_MAX; dose++)
  goals.forEach(g => brewers.forEach(b => strengths.forEach(st =>
    ["hot", "iced"].forEach(serve => {
      R.count();
      let r;
      try { r = H.buildRecipe(H.base({ dose, goal: g, brewer: b, strength: st, serve })); }
      catch (e) { return; }
      const tag = dose + "g " + g + "/" + b + "/" + st + "/" + serve;
      r.pours.forEach(p => {
        const label = H.tr(p.label);
        const note = H.tr(p.note || "");
        // A run of 4+ latin letters means a word, not a unit like "ml" or "1:45".
        if (/[A-Za-z]{4,}/.test(label) && !seen["L" + label]) {
          seen["L" + label] = 1;
          R.flag("english-label", tag + ': "' + label + '"');
        }
        if (/[A-Za-z]{4,}/.test(note) && !seen["N" + note]) {
          seen["N" + note] = 1;
          R.flag("english-note", tag + ': "' + note.slice(0, 80) + '"');
        }
      });
    }))));

H.setLang("en");
process.exit(R.done("every style x brewer x strength x dose x hot/iced, rendered through tr()"));
