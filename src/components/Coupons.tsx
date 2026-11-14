import { useEffect, useRef, useState } from "react";
import { COUPONS, distText, expired, loadBaked, locate, nearby, searchLink, untilText, walkLink } from "../coupons";
import type { Coupon, Here, Shop } from "../coupons";
import { countryOf } from "../cards";
import { useNow } from "../now";
import { useTrip } from "../trip";

const EVENT = "jp-open-coupons";
/** Open the coupon list (no id) or one coupon's barcode picture straight away (id). */
export const openCoupons = (id?: string) => window.dispatchEvent(new CustomEvent<string | undefined>(EVENT, { detail: id }));

/** Coupons only make sense on a Japan trip. */
export function useCouponsOn(): boolean {
  const { current } = useTrip();
  return countryOf(current?.place ?? "") === "jp";
}

/** Fetch every barcode picture in the background so tapping one shows it at once, even with a weak signal later. */
let warmed = false;
function warm() {
  if (warmed) return;
  warmed = true;
  void loadBaked();
  for (const c of COUPONS) if (c.img) { const i = new Image(); i.decoding = "async"; i.src = c.img; }
}

type Near = { state: "idle" } | { state: "busy"; step: string } | { state: "error"; msg: string; here: Here | null } | { state: "done"; shops: Shop[]; radius: number; live: boolean; here: Here };

/** The list: "find drugstores near me" on top, then every coupon as a big button. Used inline on the info page and inside the dialog. */
export function CouponList() {
  const now = useNow();
  const [near, setNear] = useState<Near>({ state: "idle" });
  useEffect(warm, []);
  const find = async () => {
    let here: Here | null = null;
    try {
      setNear({ state: "busy", step: "定位中…" });
      here = await locate();
      setNear({ state: "busy", step: "找附近的藥妝店…" });
      const r = await nearby(here);
      setNear({ state: "done", ...r, here });
    } catch (e) {
      setNear({ state: "error", msg: e instanceof Error ? e.message : "出錯了", here });
    }
  };
  const usable = COUPONS.filter((c) => !expired(c, now.date)), gone = COUPONS.filter((c) => expired(c, now.date));
  return (
    <div className="coupons">
      <div className="cpnear">
        <button type="button" className="btn primary big" onClick={find} disabled={near.state === "busy"}>{near.state === "busy" ? near.step : near.state === "done" ? "📍 重新找附近的藥妝" : "📍 找附近的藥妝"}</button>
        {near.state === "idle" && <p className="note">用手機定位找走路到得了的店，直接配好優惠券。位置只在這支手機上用，不會存下來。</p>}
        {near.state === "error" && <p className="note warn">{near.msg} <a href={searchLink(near.here)} target="_blank" rel="noopener">改用 Google 地圖找藥妝店 ›</a></p>}
        {near.state === "done" && (
          near.shops.length === 0
            ? <p className="note">附近 3 公里內沒有找到可以用券的藥妝店。<a href={searchLink(near.here)} target="_blank" rel="noopener">用 Google 地圖找 ›</a></p>
            : <>
              {!near.shops.some((s) => s.coupon) && <p className="note">附近的店都沒有優惠券。</p>}
              {near.radius > 800 && near.shops.some((s) => s.coupon) && <p className="note">800 公尺內沒有可以用券的店，以下是 3 公里內的。</p>}
              <ul className="cpshops">
                {near.shops.map((s) => (
                  <li key={s.key} className={s.coupon ? "" : "none"}>
                    <div className="cpmain">
                      <b>{s.coupon?.name ?? s.name}{s.branch ? ` ${s.branch}` : ""}</b>
                      <span className="cpsub">{distText(s.dist)}・{s.coupon ? s.coupon.tiers : `${s.name}・沒有優惠券`}</span>
                      {s.coupon && expired(s.coupon, now.date) && <span className="cpwarn">⚠ 券已過期</span>}
                    </div>
                    <div className="cpact">
                      {s.coupon && <button type="button" className="btn primary" onClick={() => openCoupons(s.coupon!.id)}>出示券</button>}
                      <a className="btn" href={walkLink(s)} target="_blank" rel="noopener" aria-label={`走路到 ${s.name}`}>走過去</a>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="note">店家來自 OpenStreetMap，可能漏店；分店有沒有免稅櫃台要進門看 TAX FREE。<a href={searchLink(near.here)} target="_blank" rel="noopener">Google 地圖找更多 ›</a></p>
            </>
        )}
      </div>
      <h4 className="cphead">全部優惠券<small>點一下直接顯示條碼</small></h4>
      <div className="cpgrid">
        {[...usable, ...gone].map((c) => (
          <button key={c.id} type="button" className={`cpcard${expired(c, now.date) ? " gone" : ""}`} onClick={() => openCoupons(c.id)}>
            <b>{c.name}</b>
            <span className="cpsign">{c.sign}</span>
            <span className="cptiers">{c.tiers}</span>
            <span className="cpuntil">{expired(c, now.date) ? "⚠ 已過期" : untilText(c)}{c.img ? "" : "・要連網"}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** One coupon, full screen on white so the till scanner reads it: the picture itself, or a big button for the two chains that only take a live web page. */
function CouponView({ coupon, onClose }: { coupon: Coupon; onClose: () => void }) {
  const now = useNow();
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeRef.current?.focus(); }, []);
  return (
    <div className="cpview" role="dialog" aria-modal="true" aria-label={`${coupon.name} 優惠券`}>
      <header>
        <div>
          <h3>{coupon.name}<small>{coupon.sign}</small></h3>
          <p>{coupon.tiers}・{expired(coupon, now.date) ? "⚠ 券上的期限已過，問店員還收不收" : untilText(coupon)}</p>
        </div>
        <button ref={closeRef} type="button" className="x" aria-label="關閉" onClick={onClose}>×</button>
      </header>
      <div className="cpbody">
        <p className="cptip">結帳<b>前</b>連同護照一起給店員，一筆只能用一張。{coupon.note}</p>
        {coupon.img
          ? <img src={coupon.img} alt={`${coupon.name} 優惠券條碼：${coupon.tiers}`} />
          : <a className="btn primary big" href={coupon.url} target="_blank" rel="noopener">開啟 {coupon.name} 的優惠券網頁 ›</a>}
        {coupon.img && <p className="note">掃不到就把螢幕亮度調到最高，用兩指放大那一級的條碼。</p>}
      </div>
    </div>
  );
}

/** Mounted once in the app: shows the list dialog and/or one coupon when something calls openCoupons(). */
export function CouponHost() {
  const [list, setList] = useState(false);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  useEffect(() => {
    const on = (e: Event) => {
      const id = (e as CustomEvent<string | undefined>).detail;
      const c = id ? COUPONS.find((x) => x.id === id) : undefined;
      if (c) setCoupon(c); else setList(true);
    };
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);
  const active = list || !!coupon;
  useEffect(() => {
    if (!active) return;
    // Esc closes the coupon first, then the list under it
    const onKey = (e: KeyboardEvent) => { if (e.key !== "Escape") return; e.stopPropagation(); if (coupon) setCoupon(null); else setList(false); };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [active, coupon]);
  return (
    <>
      {/* the list stays mounted under an open coupon so the nearby results are still there on the way back */}
      {list && (
        <>
          <div className="scrim" onClick={() => setList(false)} />
          <div className="dialog quickpick cpdialog" role="dialog" aria-modal="true" aria-labelledby="cp-title">
            <header>
              <div><h3 id="cp-title">藥妝優惠券</h3><small>免稅之外再折 3～8%，結帳前出示。</small></div>
              <button type="button" className="x" aria-label="關閉" onClick={() => setList(false)}>×</button>
            </header>
            <CouponList />
          </div>
        </>
      )}
      {coupon && <CouponView coupon={coupon} onClose={() => setCoupon(null)} />}
    </>
  );
}
