// Core functional checks: the engine builds valid recipes for every option.
const H=require("./harness"); H.load();
const R=H.Reporter("02 FUNCTIONAL");
function t(name,fn){ R.count(); try{ fn(); }catch(e){ R.flag("failed",name+": "+e.message); } }
function assert(c,m){ if(!c) throw new Error(m||"assertion failed"); }

t("builds a default recipe",()=>{ const r=H.buildRecipe(H.base()); assert(r.pours.length>0); });
t("every brew style builds",()=>{ H.GOALS.forEach(g=>{ const r=H.buildRecipe(H.base({goal:g.id})); assert(r.pours.length>0,g.id); }); });
t("every origin builds",()=>{ H.ORIGINS.forEach(o=>{ const r=H.buildRecipe(H.base({origin:o.id})); assert(r.temp>=80,o.id); }); });
t("every roast builds",()=>{ H.ROASTS.forEach(x=>{ const r=H.buildRecipe(H.base({roast:x.id})); assert(r.pours.length>0,x.id); }); });
t("every brewer builds",()=>{ H.BREWERS.forEach(b=>{ const r=H.buildRecipe(H.base({brewer:b.id})); assert(r.pours.length>0,b.id); }); });
t("every grinder builds",()=>{ H.allGrinders().forEach(g=>{ const r=H.buildRecipe(H.base({grinder:g.id})); assert(r.grindNumber!=null,g.id); }); });
t("iced styles build",()=>{ ["hoffmann","foursix","fifty"].forEach(s=>{ const r=H.buildRecipe(H.base({serve:"iced",icedStyle:s})); assert(r.pours.length>0,s); }); });
t("blends build",()=>{ const r=H.buildRecipe(H.base({kind:"blend"})); assert(r.pours.length>0); });
t("grindNumeric is a number",()=>{ const r=H.buildRecipe(H.base({grinder:"opus"})); assert(typeof r.grindNumeric==="number"); });
t("Vietnam origin present",()=>{ assert(H.ORIGINS.some(o=>o.id==="vietnam")); });
t("drain always follows the last pour",()=>{
  H.GOALS.forEach(g=>{ [H.DOSE_MIN,30,H.DOSE_MAX].forEach(d=>{
    const r=H.buildRecipe(H.base({goal:g.id,dose:d}));
    const {pours,drain}=H.splitPours(r);
    if(drain) assert(drain.t>=pours[pours.length-1].t, g.id+" "+d+"g");
  });});
});
t("finish window follows the last pour",()=>{
  H.GOALS.forEach(g=>{ [H.DOSE_MIN,H.DOSE_MAX].forEach(d=>{
    const r=H.buildRecipe(H.base({goal:g.id,dose:d}));
    const {pours}=H.splitPours(r);
    if(r.finishHi) assert(r.finishHi>=pours[pours.length-1].t, g.id+" "+d+"g");
  });});
});
process.exit(R.done());
