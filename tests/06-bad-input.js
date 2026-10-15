// Deliberately feed the engine bad data: garbage doses, extreme adjustments,
// stale option values from older app versions. Nothing may crash or emit nonsense.
const H=require("./harness"); H.load();
const R=H.Reporter("06 BAD INPUT / RESILIENCE");
function tryBuild(cat,label,st){
  R.count();
  try{
    const r=H.buildRecipe(H.base(st));
    if(isNaN(r.temp)) R.flag(cat,label+": temp is NaN");
    if(r.pours.some(p=>isNaN(p.cum)||p.cum<0)) R.flag(cat,label+": invalid water amount");
    if(!r.grindNumber) R.flag(cat,label+": no grind shown");
  }catch(e){ R.flag(cat,label+": CRASH "+e.message); }
}
// garbage doses
[0,-5,0.5,NaN,999,1e6].forEach(d=>tryBuild("dose","dose="+d,{dose:d}));
// garbage freshness
[-10,0,365,9999,NaN].forEach(d=>tryBuild("days","days="+d,{days:d}));
// extreme adjustments together
[-999,999].forEach(g=>[-999,999].forEach(t=>tryBuild("adjust","grindAdj="+g+" tempAdj="+t,{grindAdj:g,tempAdj:t})));
// stale/unknown option values (e.g. a bag saved before an option was renamed)
["nonexistent","","xyz",null,undefined].forEach(v=>{
  tryBuild("stale-origin","origin="+v,{origin:v});
  tryBuild("stale-roast","roast="+v,{roast:v});
  tryBuild("stale-goal","goal="+v,{goal:v});
  tryBuild("stale-brewer","brewer="+v,{brewer:v});
  tryBuild("stale-grinder","grinder="+v,{grinder:v});
  tryBuild("stale-strength","strength="+v,{strength:v});
});
// extreme calibration on every grinder
H.allGrinders().forEach(g=>{
  [-50,50].forEach(cal=>{
    H.GRINDOFF[g.id]=cal;
    R.count();
    try{
      const r=H.buildRecipe(H.base({grinder:g.id}));
      const n=parseFloat(String(r.grindNumber));
      if(g.min!==undefined&&!isNaN(n)&&(n>g.max||n<g.min))
        R.flag("calibration-overflow",g.id+" cal="+cal+": "+n+" outside ["+g.min+","+g.max+"]");
    }catch(e){ R.flag("calibration-crash",g.id+" cal="+cal+": "+e.message); }
    delete H.GRINDOFF[g.id];
  });
});
process.exit(R.done());
