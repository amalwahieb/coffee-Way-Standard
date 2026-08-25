// Runs the whole suite. Exit code is non-zero if anything failed.
const {execFileSync}=require("child_process");
const fs=require("fs"), path=require("path");
const files=fs.readdirSync(__dirname).filter(f=>/^\d\d-.*\.js$/.test(f)).sort();
let failed=[];
files.forEach(f=>{
  try{ console.log(execFileSync(process.execPath,[path.join(__dirname,f)],{encoding:"utf8"})); }
  catch(e){ console.log(e.stdout||""); failed.push(f); }
});
console.log("=".repeat(52));
if(failed.length===0){ console.log("SUITE PASSED - "+files.length+" test files"); }
else { console.log("SUITE FAILED - "+failed.join(", ")); }
console.log("=".repeat(52));
process.exit(failed.length?1:0);
