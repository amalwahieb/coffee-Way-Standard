// Every grinder: builds, dial-in moves the right direction, settings stay inside
// the dial's real min/max, and calibration round-trips.
const H=require("./harness"); H.load();
const R=H.Reporter("03 GRINDERS");
H.allGrinders().forEach(g=>{
  const gid=g.id;
  delete H.GRINDOFF[gid];
  R.count();
  let r;
  try{ r=H.buildRecipe(H.base({grinder:gid})); }
  catch(e){ R.flag("crash", gid+": "+e.message); return; }
  if(!r.grindNumber) R.flag("empty", gid+": no grind shown");

  if(!g.byFeel && !g.stepless){
    // dial-in direction
    const mid=H.buildRecipe(H.base({grinder:gid,grindAdj:0})).grindNumeric;
    const up =H.buildRecipe(H.base({grinder:gid,grindAdj:3})).grindNumeric;
    const dn =H.buildRecipe(H.base({grinder:gid,grindAdj:-3})).grindNumeric;
    if(typeof mid==="number"){
      if(!(up>=mid)) R.flag("dial-in", gid+": coarser did not increase ("+mid+"->"+up+")");
      if(!(dn<=mid)) R.flag("dial-in", gid+": finer did not decrease ("+mid+"->"+dn+")");
    }
    // clamp to the real dial range
    if(g.min!==undefined && g.max!==undefined){
      const hi=parseFloat(String(H.buildRecipe(H.base({grinder:gid,grindAdj:999})).grindNumber));
      const lo=parseFloat(String(H.buildRecipe(H.base({grinder:gid,grindAdj:-999})).grindNumber));
      if(!isNaN(hi)&&hi>g.max) R.flag("clamp", gid+": "+hi+" above max "+g.max);
      if(!isNaN(lo)&&lo<g.min) R.flag("clamp", gid+": "+lo+" below min "+g.min);
    }
    // calibration round-trip
    if(g.min!==undefined){
      const target=Math.round((g.min+g.max)/2);
      const fb=H.buildRecipe(H.base({grinder:gid})).grindNumeric;
      if(typeof fb==="number"){
        H.GRINDOFF[gid]=Math.round((target-fb)*1000)/1000;
        const shown=H.buildRecipe(H.base({grinder:gid})).grindNumeric;
        if(Math.abs(shown-target)>0.6) R.flag("calibration", gid+": set "+target+" shows "+shown);
        delete H.GRINDOFF[gid];
      }
    }
  }
});
process.exit(R.done(H.allGrinders().length+" grinders"));
