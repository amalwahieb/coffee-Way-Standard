// CWS Trend Scout — monthly specialty-coffee trend scan with suggestions
// Part of Coffee Way Standard · by Abdulmajeed Alwahieb
const FEEDS = [
  { name: "Perfect Daily Grind", url: "https://perfectdailygrind.com/feed/" },
  { name: "Daily Coffee News", url: "https://dailycoffeenews.com/feed/" },
  { name: "Sprudge", url: "https://sprudge.com/feed" }
];
const KNOWN_ORIGINS = ["ethiopia","kenya","colombia","peru","brazil","guatemala","costa rica","rwanda","burundi","panama","yemen","saudi","indonesia","sumatra","honduras","el salvador","india","tanzania","uganda","mexico","thailand"];
const CANDIDATE_ORIGINS = ["vietnam","china","yunnan","myanmar","laos","philippines","bolivia","ecuador","nicaragua","congo","drc","malawi","zambia","papua","png","hawaii","jamaica","nepal"];
const KNOWN_PROC = ["washed","honey","natural","anaerobic","co-ferment","coferment","infused","wet-hulled","wet hulled","decaf"];
const CANDIDATE_PROC = ["thermal shock","carbonic maceration","lactic","yeast inoculat","koji","barrel-aged","barrel aged","frozen cherry","cryo","hydro honey","double ferment"];
const TREND_WORDS = ["fermentation","processing","variety","varietal","brewing method","pour over","pour-over","grinder","water chemistry","freeze","distillation"];

function parseItems(xml, src) {
  const out = [];
  const items = xml.split(/<item[\s>]/).slice(1);
  for (const raw of items) {
    const t = (raw.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/) || [])[1] || "";
    const l = (raw.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || "";
    const d = (raw.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || "";
    const when = Date.parse(d);
    out.push({ title: t.trim(), link: l.trim(), when: isNaN(when) ? 0 : when, src });
  }
  return out;
}
function classify(items) {
  const cutoff = Date.now() - 35 * 86400000;
  const fresh = items.filter(i => i.when >= cutoff && i.title);
  const sug = [], trend = [];
  for (const it of fresh) {
    const t = it.title.toLowerCase();
    const newO = CANDIDATE_ORIGINS.find(o => t.includes(o));
    const newP = CANDIDATE_PROC.find(p => t.includes(p));
    if (newO) sug.push({ ...it, why: "منشأ غير موجود في التطبيق: " + newO });
    else if (newP) sug.push({ ...it, why: "معالجة غير موجودة في التطبيق: " + newP });
    else if (KNOWN_ORIGINS.some(o => t.includes(o)) || KNOWN_PROC.some(p => t.includes(p)) || TREND_WORDS.some(w => t.includes(w))) trend.push(it);
  }
  return { sug, trend: trend.slice(0, 12) };
}
function esc(t){return String(t||"").replace(/&/g,"&amp;").replace(/</g,"&lt;");}
function fmtD(ms){const d=new Date(ms);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}

async function scheduleNext() {
  try {
    const pend = await Notification.allPending();
    for (const n of pend) if (n.threadIdentifier === "cws-trend") n.remove();
    const n = new Notification();
    n.title = "☕ CWS Trend Scout";
    n.body = "شهر جديد — اضغط لفحص توجهات القهوة المختصة وأفكار التطبيق";
    n.threadIdentifier = "cws-trend";
    n.openURL = URLScheme.forRunningScript();
    n.setTriggerDate(new Date(Date.now() + 30 * 86400000));
    await n.schedule();
    return true;
  } catch (e) { return false; }
}
async function run() {
  let all = [], failed = [];
  for (const f of FEEDS) {
    try {
      const req = new Request(f.url);
      req.timeoutInterval = 15;
      const xml = await req.loadString();
      all = all.concat(parseItems(xml, f.name));
    } catch (e) { failed.push(f.name); }
  }
  const { sug, trend } = classify(all);
  let html = '<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{background:#171310;color:#F4EEE3;font-family:-apple-system;padding:20px;line-height:1.7}h1{color:#E0813C;font-size:19px}h2{font-size:14px;color:#E0813C;letter-spacing:1px;margin-top:22px}.it{border:1px solid #3a322b;border-radius:10px;padding:11px 13px;margin:8px 0}.why{color:#7BB661;font-size:12px}.src{color:#A28F78;font-size:11px}a{color:#F4EEE3;text-decoration:none}.note{color:#A28F78;font-size:12px}</style></head><body>';
  html += "<h1>☕ تقرير التوجهات الشهري</h1><div class='note'>آخر ٣٥ يومًا · " + fmtD(Date.now()) + (failed.length ? " · تعذّر: " + failed.join(", ") : "") + "</div>";
  html += "<h2>اقتراحات للتطبيق (" + sug.length + ")</h2>";
  if (sug.length) for (const s of sug) html += '<div class="it"><a href="' + s.link + '">' + esc(s.title) + '</a><div class="why">' + esc(s.why) + '</div><div class="src">' + s.src + " · " + fmtD(s.when) + "</div></div>";
  else html += '<div class="note">لا جديد يستحق الإضافة هذا الشهر — جداولك مكتملة.</div>';
  html += "<h2>توجهات تخصّك (" + trend.length + ")</h2>";
  for (const t of trend) html += '<div class="it"><a href="' + t.link + '">' + esc(t.title) + '</a><div class="src">' + t.src + " · " + fmtD(t.when) + "</div></div>";
  if (!trend.length) html += '<div class="note">لا مقالات مطابقة لاهتماماتك خلال المدة.</div>';
  const sched = await scheduleNext();
  html += '<div class="note" style="margin-top:20px">' + (sched ? "🔔 تم جدولة التذكير القادم بعد ٣٠ يومًا" : "⚠️ لم أستطع جدولة تذكير — فعّل الإشعارات لسكربتبل") + " · Coffee Way Standard</div></body></html>";
  const wv = new WebView();
  await wv.loadHTML(html);
  await wv.present(false);
}
await run();
Script.complete();
