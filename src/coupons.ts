// 日本藥妝店給外國旅客的優惠券。券圖放在 public/coupons/（點開就能直接給店員掃，不用再連到別的網站）。
// 券更新時：換掉 public/coupons/<id>.jpg，改這裡的 tiers／until。資料以券圖上印的為準（2026/11/15 核對）。

export interface Coupon {
  id: string;
  /** 中文店名 */
  name: string;
  /** 招牌上的日文／英文，認店用 */
  sign: string;
  /** 一句話的折扣級距（免稅之外再加） */
  tiers: string;
  /** 到期日 YYYY-MM-DD；券上沒寫就不填 */
  until?: string;
  /** 有券圖就直接顯示 */
  img?: string;
  /** 沒有券圖（或只收網頁）的要開這個網址 */
  url?: string;
  /** 結帳時最容易踩到的事，一句話 */
  note: string;
  /** 對 OpenStreetMap 的 name／brand 用 */
  match: RegExp;
  /** 只有少數指定分店收券的，「找附近」不列（不然郊區分店會誤導） */
  fewStores?: boolean;
}

const img = (id: string) => `coupons/${id}.jpg`;

export const COUPONS: Coupon[] = [
  { id: "matsukiyo", name: "松本清", sign: "マツモトキヨシ", tiers: "滿 1 萬 3%・3 萬 5%・5 萬 7%", until: "2027-03-31", img: img("matsukiyo"), note: "Outlet 和部分分店不收。專櫃化妝品、尿布、嬰兒食品不折。", match: /マツモトキヨシ|マツキヨ|matsumoto\s?kiyoshi|matsukiyo/i },
  { id: "donki", name: "唐吉訶德", sign: "ドン・キホーテ", tiers: "滿 1 萬 5%・3 萬 7%（未稅）", url: "https://japanportal.donki-global.com/coupon/?ptcd=0076001603", note: "只收官方網頁上的條碼，截圖無效，所以要連網開。", match: /ドン・?キホーテ|ドンキ|don\s?quijote|donki/i },
  { id: "cocokara", name: "Cocokara Fine", sign: "ココカラファイン", tiers: "滿 1 萬 3%・3 萬 5%・5 萬 7%", until: "2027-03-31", img: img("cocokara"), note: "不是每家都能免稅。券面寫截圖不收，被拒絕就改去松本清。", match: /ココカラ|cocokara/i },
  { id: "sundrug", name: "Sundrug 尚都樂客", sign: "サンドラッグ", tiers: "滿 1 萬 3%・3 萬 5%・5 萬 7%（未稅）", img: img("sundrug"), note: "只能在免稅櫃台結帳時用。", match: /サンドラッグ|sun\s?drug/i },
  { id: "sugi", name: "SUGI 杉藥局", sign: "スギ薬局", tiers: "滿 1 萬 4%・3 萬 6%・5 萬 8%", until: "2027-02-28", img: img("sugi"), note: "只限免稅結帳。食品、專櫃化妝品、POSA 卡不折。", match: /スギ薬局|スギドラッグ|\bsugi\b/i },
  { id: "tsuruha", name: "鶴羽藥妝", sign: "ツルハドラッグ", tiers: "滿 1 萬 3%・3 萬 5%・5 萬 7%（含稅）", img: img("tsuruha"), note: "郊區店不一定有免稅櫃台，進門先看 TAX FREE。", match: /ツルハ|tsuruha/i },
  { id: "welcia", name: "Welcia", sign: "ウエルシア", tiers: "滿 1 萬 3%・3 萬 5%・5 萬 8%（未稅）", until: "2027-03-31", img: img("welcia"), note: "HAC、金光藥品的免稅店也能用。資生堂、佳麗寶、KOSE 不折。", match: /ウエルシア|welcia|ハックドラッグ|金光薬品/i },
  { id: "kokumin", name: "國民藥妝", sign: "コクミン KoKuMiN", tiers: "滿 5500 円 3%・1 萬 5%・3 萬 8%", until: "2027-06-30", img: img("kokumin"), note: "一人只能用一次。部分品牌化妝品不折。", match: /コクミン|kokumin/i },
  { id: "bic", name: "Bic Camera", sign: "ビックカメラ", tiers: "藥妝、日用品 5%・家電 7%・清酒 3%", until: "2027-04-30", img: img("bic"), note: "折完要滿 5000 円。兩個條碼都要掃。Apple、遊戲主機不折。", match: /ビックカメラ|bic\s?camera|コジマ/i },
  { id: "takeya", name: "多慶屋（御徒町）", sign: "多慶屋 TAKEYA", tiers: "滿 5000 円 5%・3 萬 7%；海外 JCB 卡 12%", until: "2027-04-30", img: img("takeya"), note: "只有御徒町本店。一筆最多折 1 萬円。", match: /多慶屋|takeya/i },
  { id: "cosmos", name: "COSMOS 科摩思", sign: "コスモス", tiers: "滿 1 萬 5%・3 萬 7%・5 萬 9%", img: img("cosmos"), note: "東京只有歌舞伎町一丁目店、廣尾站店收。一天一次。", match: /コスモス|cosmos/i, fewStores: true },
  { id: "daikoku", name: "大國藥妝", sign: "ダイコクドラッグ", tiers: "滿 1 萬 3%・3 萬 5%・5 萬 7%（未稅）", url: "https://www.japanuts.com/2022/12/2023.html", note: "限東京分店。沒有可以直接開的券，要到這篇文章裡找券圖。", match: /ダイコク|daikoku/i },
  { id: "fukutaro", name: "福太郎", sign: "くすりの福太郎", tiers: "滿 1 萬 3%・3 萬 5%・5 萬 8%", url: "https://matcha-jp.com/tw/coupon/143", note: "限東京、千葉指定免稅店。券在 MATCHA 網頁上。", match: /福太郎|fukutaro/i },
  { id: "tomods", name: "Tomod's", sign: "トモズ", tiers: "免稅再加最高 8%", url: "https://matcha-jp.com/tw/coupon/148?code=matcha", note: "券在 MATCHA 網頁上。", match: /トモズ|tomod/i },
];

export const couponFor = (text: string): Coupon | undefined => COUPONS.find((c) => c.match.test(text));
export const expired = (c: Coupon, today: string) => !!c.until && c.until < today;
export const untilText = (c: Coupon) => (c.until ? `到 ${c.until.replace(/-/g, "/")}` : "券上沒寫期限");

// ---- 附近的店（資料來自 OpenStreetMap，免費、不用金鑰） ----

export interface Shop { key: string; name: string; branch: string; lat: number; lon: number; dist: number; coupon?: Coupon }
export interface Here { lat: number; lon: number; acc: number }

export function locate(): Promise<Here> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) { reject(new Error("這個瀏覽器不能定位")); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy }),
      (e) => reject(new Error(e.code === e.PERMISSION_DENIED ? "沒有拿到定位權限。到手機的「設定 → 瀏覽器 → 位置」打開，再按一次。" : e.code === e.TIMEOUT ? "定位太久沒有回應，到室外或靠窗再試一次。" : "現在定不到位置，稍後再試。")),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  });
}

const metres = (a: { lat: number; lon: number }, b: { lat: number; lon: number }) => {
  const rad = Math.PI / 180, dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 6371000 * 2 * Math.asin(Math.sqrt(h));
};

const ENDPOINTS = ["https://overpass-api.de/api/interpreter", "https://overpass.private.coffee/api/interpreter", "https://overpass.kumi.systems/api/interpreter"];
const BIG = "ドン・キホーテ|ビックカメラ|多慶屋|ダイコク";

interface Element { type: string; id: number; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> }

async function overpass(q: string): Promise<Element[]> {
  let last: unknown = null;
  for (const url of ENDPOINTS) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 12000);
    try {
      const r = await fetch(url, { method: "POST", body: new URLSearchParams({ data: q }), signal: ctl.signal });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return ((await r.json()) as { elements?: Element[] }).elements ?? [];
    } catch (e) { last = e; } finally { clearTimeout(timer); }
  }
  throw new Error(`店家資料現在查不到（${last instanceof Error ? last.message : "連線失敗"}）`);
}

/** 純函式：把 Overpass 的結果變成依距離排好的店（有券的全留，沒券的只留幾家藥妝店）。 */
export function toShops(els: Element[], here: { lat: number; lon: number }): Shop[] {
  const all: Shop[] = [];
  for (const e of els) {
    const t = e.tags ?? {};
    const lat = e.lat ?? e.center?.lat, lon = e.lon ?? e.center?.lon;
    if (lat == null || lon == null) continue;
    const text = [t.name, t.brand, t["name:en"], t["name:ja"], t["brand:en"], t.operator].filter(Boolean).join(" ");
    const hit = couponFor(text);
    if (hit?.fewStores) continue;
    const coupon = hit;
    if (!coupon && t.shop !== "chemist") continue;
    const name = t.name ?? t.brand ?? "";
    if (!name) continue;
    all.push({ key: `${e.type}${e.id}`, name, branch: t.branch ?? "", lat, lon, dist: metres(here, { lat, lon }), coupon });
  }
  all.sort((a, b) => a.dist - b.dist);
  // 同一家店常被畫成一個點＋一棟建築：40 公尺內同品牌只留最近的
  const out: Shop[] = [];
  for (const s of all) {
    if (out.some((o) => (o.coupon?.id ?? o.name) === (s.coupon?.id ?? s.name) && metres(o, s) < 40)) continue;
    out.push(s);
  }
  const withCoupon = out.filter((s) => s.coupon).slice(0, 12), without = out.filter((s) => !s.coupon).slice(0, 4);
  return [...withCoupon, ...without].sort((a, b) => a.dist - b.dist);
}

// 行程範圍內有券的店預先抓好放在 public/coupons/shops.json（seed/.build/shops-fetch.mjs 產生），定位後直接算，不用現場等查詢
interface Baked { at: string; bbox: [number, number, number, number]; shops: [number, number, string, string, string][] }
let baked: Promise<Baked | null> | null = null;
export const loadBaked = (): Promise<Baked | null> => (baked ??= fetch("coupons/shops.json").then((r) => (r.ok ? (r.json() as Promise<Baked>) : null)).catch(() => { baked = null; return null; }));

/** 純函式：預載清單裡離這裡 radius 公尺內的店。 */
export function bakedShops(b: Baked, here: { lat: number; lon: number }, radius: number): Shop[] {
  const dLat = radius / 111000, dLon = radius / (111000 * Math.cos(here.lat * Math.PI / 180));
  const els: Element[] = [];
  b.shops.forEach(([lat, lon, name, branch, brand], i) => {
    if (Math.abs(lat - here.lat) > dLat || Math.abs(lon - here.lon) > dLon) return;
    els.push({ type: "b", id: i, lat, lon, tags: { name, branch, brand } });
  });
  return toShops(els, here).filter((s) => s.dist <= radius);
}
const inside = (b: Baked, h: { lat: number; lon: number }) => h.lat >= b.bbox[0] && h.lat <= b.bbox[2] && h.lon >= b.bbox[1] && h.lon <= b.bbox[3];

/** 先找 800 公尺內，沒有可以用券的店再放寬到 3 公里。在預載範圍內用預載的（立刻有結果），範圍外才即時查 OpenStreetMap。 */
export async function nearby(here: Here): Promise<{ shops: Shop[]; radius: number; live: boolean }> {
  const b = await loadBaked();
  if (b && inside(b, here)) {
    for (const radius of [800, 3000]) {
      const shops = bakedShops(b, here, radius);
      if (shops.length || radius === 3000) return { shops, radius, live: false };
    }
  }
  for (const radius of [800, 3000]) {
    const a = `(around:${radius},${here.lat.toFixed(5)},${here.lon.toFixed(5)})`;
    const els = await overpass(`[out:json][timeout:10];(nwr${a}[shop=chemist];nwr${a}[amenity=pharmacy];nwr${a}[name~"${BIG}"];nwr${a}[brand~"${BIG}"];);out center tags 200;`);
    const shops = toShops(els, here);
    if (shops.some((s) => s.coupon) || radius === 3000) return { shops, radius, live: true };
  }
  return { shops: [], radius: 3000, live: true };
}

export const walkLink = (s: { lat: number; lon: number }) => `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}&travelmode=walking`;
export const searchLink = (here?: Here | null) => (here ? `https://www.google.com/maps/search/${encodeURIComponent("ドラッグストア")}/@${here.lat},${here.lon},16z` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("ドラッグストア")}`);
export const distText = (m: number) => (m < 950 ? `${Math.max(10, Math.round(m / 10) * 10)} 公尺` : `${(m / 1000).toFixed(1)} 公里`);
