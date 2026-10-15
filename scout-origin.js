// CWS Origin Scout — on-demand lookup for origins & processing methods
// Part of Coffee Way Standard · by Abdulmajeed Alwahieb
const KNOWN_ORIGINS = ["Ethiopia","Kenya","Colombia","Peru","Brazil","Guatemala","Costa Rica","Rwanda","Burundi","Panama","Yemen","Saudi Arabia","Indonesia","Sumatra","Honduras","El Salvador","India","Tanzania","Uganda","Mexico","Thailand"];
const KNOWN_PROCESSES = ["Washed","Honey","Natural","Anaerobic","Co-fermented","Infused","Wet-hulled","Decaf"];

async function wikiSummary(term) {
  const url = "https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(term.replace(/ /g, "_"));
  const req = new Request(url);
  req.headers = { "Accept": "application/json" };
  try { const j = await req.loadJSON(); if (j && j.extract) return j; } catch (e) {}
  return null;
}
async function wikiSearch(term) {
  const url = "https://en.wikipedia.org/w/api.php?action=opensearch&limit=5&format=json&search=" + encodeURIComponent(term);
  try { const j = await new Request(url).loadJSON(); return (j && j[1]) || []; } catch (e) { return []; }
}
function esc(t){return String(t||"").replace(/&/g,"&amp;").replace(/</g,"&lt;");}
function inApp(term){
  const t=term.toLowerCase();
  const o=KNOWN_ORIGINS.find(x=>t.includes(x.toLowerCase())||x.toLowerCase().includes(t));
  const p=KNOWN_PROCESSES.find(x=>t.includes(x.toLowerCase())||x.toLowerCase().includes(t));
  if(o)return "✓ موجود في التطبيق كمنشأ: "+o;
  if(p)return "✓ موجود في التطبيق كمعالجة: "+p;
  return "◌ غير موجود في جداول التطبيق — إن كان مهمًا أرسله للمطور ليُضاف بمصادره";
}
async function run() {
  const a = new Alert();
  a.title = "☕ CWS Origin Scout";
  a.message = "اكتب اسم منشأ أو طريقة معالجة\n(مثال: Vietnam coffee / thermal shock process)";
  a.addTextField("Bolivia coffee");
  a.addAction("ابحث"); a.addCancelAction("إلغاء");
  const idx = await a.presentAlert();
  if (idx === -1) return;
  let term = a.textFieldValue(0).trim();
  if (!term) return;
  let page = await wikiSummary(term);
  if (!page) {
    const alts = await wikiSearch(term + " coffee");
    if (alts.length) page = await wikiSummary(alts[0]);
  }
  const status = inApp(term);
  let html = '<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{background:#171310;color:#F4EEE3;font-family:-apple-system;padding:22px;line-height:1.75}h1{color:#E0813C;font-size:20px}h2{font-size:15px;color:#A28F78}.card{border:1px solid #3a322b;border-radius:12px;padding:14px 16px;margin:12px 0}.st{color:#7BB661;font-size:13px}a{color:#5CA8A8}</style></head><body>';
  html += "<h1>☕ " + esc(term) + "</h1>";
  html += '<div class="card st">' + esc(status) + "</div>";
  if (page) {
    html += '<div class="card"><h2>' + esc(page.title) + "</h2><p>" + esc(page.extract) + "</p>";
    if (page.content_urls && page.content_urls.mobile) html += '<a href="' + page.content_urls.mobile.page + '">المقال الكامل ↗</a>';
    html += "</div>";
  } else {
    html += '<div class="card">لم يُعثر على ملخص موسوعي — جرّب صياغة أخرى بالإنجليزية (أضف كلمة coffee).</div>';
  }
  html += '<div class="card" style="font-size:12px;color:#A28F78">Coffee Way Standard · Scout</div></body></html>';
  const wv = new WebView();
  await wv.loadHTML(html);
  await wv.present(false);
}
await run();
Script.complete();
