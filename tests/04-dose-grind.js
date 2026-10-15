// Dose must nudge the grind smoothly: never more than one click per gram on a
// click-dial grinder, and always the correct direction (bigger dose = coarser).
const H=require("./harness"); H.load();
const R=H.Reporter("04 DOSE -> GRIND SMOOTHNESS");
const micro=H.allGrinders().filter(g=>g.micro);
micro.forEach(g=>{
  [0,2.5,-1,4].forEach(cal=>{        // several calibration offsets
    H.GRINDOFF[g.id]=cal;
    let prev=null;
    for(let d=H.DOSE_FRINGE_MIN; d<=H.DOSE_FRINGE_MAX; d++){
      R.count();
      const num=H.buildRecipe(H.base({grinder:g.id,dose:d})).grindNumeric;
      if(prev!==null){
        const clicks=Math.abs(num-prev)*g.micro;
        if(clicks>1.01) R.flag("click-jump", g.id+" cal="+cal+": dose "+(d-1)+"->"+d+" moved "+clicks.toFixed(1)+" clicks");
      }
      prev=num;
    }
    delete H.GRINDOFF[g.id];
  });
});
// direction on every grinder
H.allGrinders().forEach(g=>{
  if(g.byFeel||g.stepless) return;
  R.count();
  const lo=H.buildRecipe(H.base({grinder:g.id,dose:H.DOSE_MIN})).grindNumeric;
  const hi=H.buildRecipe(H.base({grinder:g.id,dose:H.DOSE_MAX})).grindNumeric;
  if(typeof lo==="number"&&typeof hi==="number"&&hi<lo)
    R.flag("direction", g.id+": bigger dose went finer ("+lo+" -> "+hi+")");
});
process.exit(R.done("click-dial grinders: "+micro.map(g=>g.id).join(", ")));
