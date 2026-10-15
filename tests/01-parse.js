// Device-path parse check: brew.html must contain no backslash (breaks Scriptable
// template embedding) and its script must parse standalone.
const fs=require("fs"), path=require("path");
const APP=path.join(__dirname,"..","brew.html");
const raw=fs.readFileSync(APP,"utf8");
let fail=0;
if(raw.indexOf("\\")>=0){ console.log("FAIL: backslash found in brew.html"); fail=1; }
try{
  const page=eval("`"+raw+"`");
  const a=page.indexOf("<script>")+8,b=page.lastIndexOf("</script>");
  new Function(page.substring(a,b).replace(/\bconst /g,"var ").replace(/\blet /g,"var "));
}catch(e){ console.log("FAIL: parse error - "+e.message); fail=1; }
console.log("="  .repeat(52));
console.log("01 PARSE / DEVICE PATH");
console.log("=".repeat(52));
console.log(fail?"FAIL\n":"PASS - clean parse, no backslash\n");
process.exit(fail);
