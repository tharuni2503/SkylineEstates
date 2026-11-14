"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { filterProperties } from "@/services/propertyService";
import { scoreProperty } from "@/components/properties/InsightCard";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import type { Property, PropertyQuery } from "@/types";
import { inr } from "@/lib/format";
import { ArrowRight, BedDouble, Check, GitCompare, Ruler, Sparkles, ShieldCheck, Info, MapPin, Calculator, LineChart, SlidersHorizontal } from "lucide-react";

type Intent = { bhk?: number; maxPrice?: number; minPrice?: number; listing?: "Buy" | "Rent"; category?: string; loc?: string; amenities: string[]; wantsEmi: boolean; wantsInvest: boolean };
type Ranked = { p: Property; match: number; reasons: string[] };
type Msg = { id: number; role: "user" | "assistant"; text: string; results?: Ranked[]; emi?: { p: Property; monthly: number }; invest?: { p: Property; score: number; positives: string[] } };

const prompts = ["Show me 3 BHK properties under ₹1 Crore near IT hubs", "Villas in Kokapet", "2 BHK apartments for rent", "What about investment?"];
const followUps = ["Under ₹1 Cr", "Rentals only", "Villas with a swimming pool", "What about investment?", "Best match — monthly EMI"];
const AMENITIES: [RegExp, string][] = [[/pool/i, "Swimming Pool"], [/gym/i, "Gym"], [/clubhouse/i, "Clubhouse"], [/parking/i, "Covered Parking"], [/security/i, "Security"], [/garden/i, "Landscaped Garden"], [/ev/i, "EV Charging"], [/power/i, "Power Backup"]];
const AMENITY_OPTIONS = ["Swimming Pool", "Gym", "Clubhouse", "Covered Parking", "Security", "Landscaped Garden", "EV Charging", "Power Backup"];
const LOCATIONS = ["Gachibowli", "Kokapet", "Narsingi", "Financial District", "Kondapur", "Madhapur", "Tellapur", "Miyapur"];
const IT_HUBS = ["Gachibowli", "Financial District", "Kondapur", "Madhapur", "Kokapet"];

const parse = (q: string): Intent => {
  const t = q.toLowerCase();
  const bhkM = t.match(/(\d)\s*\+?\s*bhk/);
  const m = t.match(/(?:under|below|up to|max|budget of)\s*₹?\s*([\d.]+)\s*(crore|cr|lakh|l)?\b/);
  const unit = m?.[2] ?? "cr";
  const maxPrice = m ? Number(m[1]) * (unit.startsWith("cr") ? 1e7 : 1e5) : undefined;
  const minPriceM = t.match(/(?:above|from|more than|over)\s*₹?\s*([\d.]+)\s*(crore|cr|lakh|l)?\b/);
  const minPrice = minPriceM ? Number(minPriceM[1]) * ((minPriceM[2] ?? "cr").startsWith("cr") ? 1e7 : 1e5) : undefined;
  const cat = ([[/villa/i, "Villa"], [/apartment|flat|tower/i, "Apartment"], [/house|independent/i, "Independent House"], [/plot|land/i, "Residential Plot"], [/commercial|office|shop/i, "Commercial"]] as [RegExp, string][]).find(([re]) => re.test(t))?.[1];
  const listing = /rent|lease/i.test(t) ? "Rent" : /buy|sale|purchase/i.test(t) ? "Buy" : undefined;
  const loc = LOCATIONS.find(l => t.includes(l.toLowerCase()));
  const nearWork = /it\s*(hub|park|corridor)|near work|tech|office hub/i.test(t);
  const amenities = AMENITIES.filter(([re]) => re.test(t)).map(([, v]) => v);
  return { bhk: bhkM ? Number(bhkM[1]) : undefined, maxPrice, minPrice, listing, category: cat, loc: loc ?? (nearWork ? "near IT hubs" : undefined), amenities, wantsEmi: /emi|monthly|instal/i.test(t), wantsInvest: /invest|return|appreciation|score|best deal|value/i.test(t) };
};

const rank = (q: string, list: Property[]): Ranked[] => {
  const i = parse(q);
  const f: PropertyQuery = { bhk: i.bhk, maxPrice: i.maxPrice, minPrice: i.minPrice, listing: i.listing, category: i.category as PropertyQuery["category"] ?? "All", amenity: i.amenities[0] };
  let r = filterProperties(list, f);
  if (i.loc && i.loc !== "near IT hubs") r = r.filter(p => p.location.includes(i.loc!));
  else if (i.loc === "near IT hubs") r = r.filter(p => IT_HUBS.some(l => p.location.includes(l)));
  return r.map(p => {
    let score = 45;
    const reasons: string[] = [];
    if (i.bhk && p.bhk === i.bhk) { score += 20; reasons.push(`${p.bhk} BHK, as asked`); }
    if (i.maxPrice && p.price <= i.maxPrice) { score += 12; reasons.push(`Under ${inr(i.maxPrice)}`); }
    if (i.minPrice && p.price >= i.minPrice) { score += 6; reasons.push(`From ${inr(i.minPrice)}`); }
    if (i.loc) { score += 15; reasons.push(i.loc === "near IT hubs" ? "Close to IT hubs" : `In ${i.loc}`); }
    if (i.category && p.category === i.category) { score += 12; reasons.push(p.category); }
    if (i.listing && p.listing === i.listing) { score += 8; reasons.push(i.listing === "Buy" ? "For sale" : "For rent"); }
    i.amenities.forEach(a => { if (p.amenities.includes(a)) { score += 5; reasons.push(a); } });
    if (p.verified) { score += 5; reasons.push("Verified listing"); }
    if (p.featured) { score += 3; reasons.push("Featured"); }
    return { p, match: Math.min(97, score), reasons };
  }).sort((a, b) => b.match - a.match).slice(0, 3);
};

const emi = (price: number) => {
  const principal = price * 0.8, r = 0.085 / 12, n = 240;
  return Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
};

const EASE: [number, number, number, number] = [.22, 1, .36, 1];

export default function Assistant() {
  const { properties, compare, toggleCompare, clearCompare, wishlist } = useStore();
  const toast = useToast();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [prefsOpen, setPrefsOpen] = useState(true);
  const [pref, setPref] = useState({ budget: "", location: "", bhk: "", type: "", listing: "Buy", amenities: [] as string[] });
  const idRef = useRef(0);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs, busy]);

  const send = async (q: string) => {
    const query = q.trim();
    if (!query || busy) return;
    setError("");
    setText("");
    setBusy(true);
    setMsgs(m => [...m, { id: ++idRef.current, role: "user", text: query }]);
    try {
      await new Promise(r => setTimeout(r, 650));
      const results = rank(query, properties);
      const i = parse(query);
      let answer: string;
      let invest: Msg["invest"];
      let emiInfo: Msg["emi"];
      if (results.length) {
        if (i.wantsEmi) {
          emiInfo = { p: results[0].p, monthly: emi(results[0].p.price) };
          answer = `Estimated EMI for ${results[0].p.title} with 20% down and an 8.5% rate over 20 years. For comparison of other matches, open the listing for its full breakdown.`;
        } else if (i.wantsInvest) {
          const top = results[0].p;
          const s = scoreProperty(top, properties);
          const positives = s?.factors.filter(f => f.points > 0).map(f => f.label) ?? ["Verified listing"];
          invest = { p: top, score: s?.score ?? 50, positives };
          answer = `My read on ${top.title}: rule-based insight over our own listings only — strong on ${positives.slice(0, 3).join(", ") || "fundamentals"}. Not a return prediction or financial advice.`;
        } else {
          answer = `Found ${results.length} ${results.length > 1 ? "matches" : "match"} — ordered by fit, not popularity. Tap any card to open the listing, or add two or more to compare.`;
        }
      } else {
        answer = "Nothing matches that yet. Try a wider budget, a different area, or removing an amenity — or ask for villas, rentals or BHK counts.";
      }
      setMsgs(m => [...m, { id: ++idRef.current, role: "assistant", text: answer, results: results.length ? results : undefined, emi: emiInfo, invest }]);
    } catch {
      setError("The demo assistant couldn't complete this request. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const buildPrefQuery = () => {
    const parts: string[] = [];
    if (pref.listing) parts.push(pref.listing === "Buy" ? "to buy" : "for rent");
    if (pref.bhk) parts.push(`${pref.bhk} BHK`);
    if (pref.type) parts.push(pref.type.toLowerCase());
    if (pref.location) parts.push(`in ${pref.location}`);
    if (pref.budget) parts.push(`under ${pref.budget}`);
    if (pref.amenities.length) parts.push(`with ${pref.amenities.join(", ")}`);
    return parts.length ? `Show me ${parts.join(" ")}` : "";
  };

  const sendPrefs = () => {
    const q = buildPrefQuery();
    if (!q) { toast("Choose at least one preference"); return; }
    send(q);
  };

  const saved = properties.filter(p => wishlist.includes(p.id));
  const comparing = properties.filter(p => compare.includes(p.id));

  return (
    <div className="bg-ivory/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-5 md:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line/70 pb-6">
          <div>
            <p className="text-[11px] uppercase tracking-[.3em] text-[#9c7f56]">Skyline assistant</p>
            <h1 className="mt-2 font-serif text-4xl text-matte md:text-5xl">Ask for <em className="italic text-[#9c7f56]">homes.</em></h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate">Describe budget, location, BHK or amenities — or use the preference controls — to get explainable matches from our sample listings.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-beige/60 bg-[#f5efe3] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[.18em] text-[#6f5c37]"><span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />Interactive demo · not investment advice</span>
            {msgs.length > 0 && <button type="button" onClick={() => { setMsgs([]); setError(""); }} className="text-xs font-medium uppercase tracking-[.16em] text-slate underline decoration-beige/60 underline-offset-4 transition hover:text-matte">Clear chat</button>}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          <div className="flex min-h-[72vh] flex-col border border-line/70 bg-white shadow-[0_14px_40px_rgba(17,17,17,.06)]">
            <div className="flex items-center justify-between border-b border-line/60 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-matte text-beige"><Sparkles size={17} /></span>
                <div><p className="text-sm font-medium text-matte">Assistant</p><p className="text-[10px] uppercase tracking-[.2em] text-slate">Rule-based over sample data</p></div>
              </div>
              <p className="hidden text-[10px] uppercase tracking-[.18em] text-slate sm:block">{properties.length} listings indexed</p>
            </div>

            <div className="border-b border-line/60 bg-ivory/40 p-4">
              <button type="button" onClick={() => setPrefsOpen(o => !o)} className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[.18em] text-[#9c7f56] hover:text-matte"><SlidersHorizontal size={14} />{prefsOpen ? "Hide" : "Show"} preferences</button>
              {prefsOpen && (
                <div className="mt-3 space-y-3">
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                    <label className="text-[10px] uppercase tracking-[.14em] text-slate">Budget<select value={pref.budget} onChange={e => setPref({ ...pref, budget: e.target.value })} className="mt-1 h-10 w-full border border-line bg-white px-2 text-sm text-charcoal"><option value="">Any</option><option value="₹50 L">₹50 L</option><option value="₹1 Cr">₹1 Cr</option><option value="₹2 Cr">₹2 Cr</option><option value="₹5 Cr">₹5 Cr</option></select></label>
                    <label className="text-[10px] uppercase tracking-[.14em] text-slate">Location<select value={pref.location} onChange={e => setPref({ ...pref, location: e.target.value })} className="mt-1 h-10 w-full border border-line bg-white px-2 text-sm text-charcoal"><option value="">Any</option>{LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}</select></label>
                    <label className="text-[10px] uppercase tracking-[.14em] text-slate">BHK<select value={pref.bhk} onChange={e => setPref({ ...pref, bhk: e.target.value })} className="mt-1 h-10 w-full border border-line bg-white px-2 text-sm text-charcoal"><option value="">Any</option>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n === 5 ? "5+" : n}</option>)}</select></label>
                    <label className="text-[10px] uppercase tracking-[.14em] text-slate">Type<select value={pref.type} onChange={e => setPref({ ...pref, type: e.target.value })} className="mt-1 h-10 w-full border border-line bg-white px-2 text-sm text-charcoal"><option value="">Any</option><option>Apartment</option><option>Villa</option><option>Independent House</option><option>Residential Plot</option><option>Commercial</option></select></label>
                    <label className="text-[10px] uppercase tracking-[.14em] text-slate">Intent<select value={pref.listing} onChange={e => setPref({ ...pref, listing: e.target.value })} className="mt-1 h-10 w-full border border-line bg-white px-2 text-sm text-charcoal"><option value="Buy">Buy</option><option value="Rent">Rent</option><option value="">Any</option></select></label>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[.14em] text-slate">Preferred amenities</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">{AMENITY_OPTIONS.map(a => { const on = pref.amenities.includes(a); return <button key={a} type="button" onClick={() => setPref(p => ({ ...p, amenities: on ? p.amenities.filter(x => x !== a) : [...p.amenities, a] }))} className={`border px-2.5 py-1 text-[11px] transition ${on ? "border-matte bg-matte text-ivory" : "border-line bg-white text-charcoal hover:border-beige"}`}>{a}</button>; })}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button type="button" onClick={sendPrefs} disabled={busy} className="inline-flex h-10 items-center gap-2 bg-matte px-5 text-[10px] font-medium uppercase tracking-[.18em] text-ivory transition hover:bg-charcoal disabled:opacity-60"><Sparkles size={13} />Find matches</button>
                    <button type="button" onClick={() => setPref({ budget: "", location: "", bhk: "", type: "", listing: "Buy", amenities: [] })} className="text-xs text-slate underline underline-offset-4 hover:text-matte">Reset preferences</button>
                    <span className="text-xs text-slate">Selections are converted into a demo query and matched against sample listings.</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5 sm:px-6" aria-live="polite">
              {msgs.length === 0 && !busy && (
                <div>
                  <p className="text-sm text-slate">Suggested questions</p>
                  <div className="mt-3 flex flex-wrap gap-2">{prompts.map(p => <button type="button" key={p} onClick={() => send(p)} className="border border-line bg-ivory/70 px-3 py-2 text-left text-[13px] leading-snug text-charcoal transition hover:border-beige hover:bg-white hover:text-matte">{p}</button>)}</div>
                </div>
              )}
              {msgs.map(m => m.role === "user" ? (
                <div key={m.id} className="flex justify-end"><p className="max-w-[85%] bg-matte px-4 py-3 text-sm leading-relaxed text-ivory">{m.text}</p></div>
              ) : (
                <div key={m.id} className="max-w-full">
                  <div className="flex items-start gap-2.5"><span aria-hidden="true" className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-beige/40 text-matte"><Sparkles size={13} /></span><p className="flex-1 text-sm leading-relaxed text-charcoal/90">{m.text}</p></div>
                  {m.emi && <div className="mt-3 ml-9 max-w-md border border-line/70 bg-ivory/60 p-4"><p className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-[#9c7f56]"><Calculator size={12} />Indicative EMI · 20% down · 8.5% · 20 yrs</p><p className="mt-1.5 font-serif text-3xl text-matte tabular-nums">{inr(m.emi.monthly)}<span className="text-sm font-sans text-slate"> / month</span></p><p className="mt-1 text-xs text-slate">{m.emi.p.title} — price {inr(m.emi.p.price)}</p></div>}
                  {m.invest && <div className="mt-3 ml-9 max-w-md border border-line/70 bg-ivory/60 p-4"><p className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-[#9c7f56]"><LineChart size={12} />Skyline insight score · demo</p><p className="mt-1.5 font-serif text-3xl text-matte tabular-nums">{m.invest.score}<span className="text-base font-sans text-slate"> / 100</span></p><div className="mt-1.5 h-1.5 w-full bg-line/70"><div className="h-full bg-gold transition-all duration-700" style={{ width: `${m.invest.score}%` }} /></div><p className="mt-2 text-xs leading-relaxed text-slate">Strongest signals: {m.invest.positives.join(", ") || "fundamentals"}. Not a prediction or advice.</p></div>}
                  {m.results && <div className="mt-3 ml-9 grid gap-3">{m.results.map((r, i) => (
                    <motion.article key={r.p.id} initial={{ opacity: 0, y: 18, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: i * 0.14, duration: 0.6, ease: EASE }} className="flex overflow-hidden border border-line/70 bg-white transition-shadow hover:shadow-[0_14px_34px_rgba(17,17,17,.10)]">
                      <Link href={`/property/${r.p.id}`} className="relative w-28 shrink-0 sm:w-36"><img src={r.p.image} alt={r.p.title} loading="lazy" onError={(e) => { const t = e.currentTarget; if (t.dataset.fallback) return; t.dataset.fallback = "1"; t.src = "/images/hero-3d.jpg"; }} className="absolute inset-0 h-full w-full object-cover" /></Link>
                      <div className="min-w-0 flex-1 p-3 sm:p-4">
                        <div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="text-[9px] uppercase tracking-[.2em] text-[#9c7f56]">{r.p.category} · {r.p.listing === "Buy" ? "For sale" : "For rent"}</p><h3 className="mt-0.5 truncate font-serif text-base leading-tight text-matte sm:text-lg"><Link href={`/property/${r.p.id}`} className="hover:underline">{r.p.title}</Link></h3></div>{r.p.verified && <span title="Verified listing (demo)"><ShieldCheck size={16} className="shrink-0 text-[#9c7f56]" /></span>}</div>
                        <p className="mt-1 flex items-center gap-1 text-[11px] text-slate"><MapPin size={11} /><span className="truncate">{r.p.location.split(",")[0]}</span></p>
                        <p className="mt-1.5 font-serif text-lg leading-none text-matte tabular-nums">{inr(r.p.price)}</p>
                        <div className="mt-2 flex items-center gap-2 text-[11px] text-charcoal/80 tabular-nums">
                          {r.p.bhk > 0 && <span className="inline-flex items-center gap-1"><BedDouble size={12} className="text-[#9c7f56]" />{r.p.bhk} BHK</span>}
                          <span className="inline-flex items-center gap-1"><Ruler size={12} className="text-[#9c7f56]" />{r.p.areaSqft.toLocaleString()} sq ft</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-1.5 flex-1 bg-line/60" aria-hidden="true"><motion.div className="h-full bg-gold" initial={{ width: 0 }} animate={{ width: `${r.match}%` }} transition={{ delay: 0.25 + i * 0.14, duration: 0.8, ease: EASE }} /></div>
                          <span className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#9c7f56] tabular-nums">{r.match}%</span>
                        </div>
                        <div className="mt-2 hidden flex-wrap gap-x-3 gap-y-0.5 sm:flex">{r.reasons.slice(0, 4).map(reason => <span key={reason} className="inline-flex items-center gap-1 text-[10px] text-slate"><Check size={10} className="text-emerald-700" />{reason}</span>)}</div>
                        <div className="mt-2.5 flex flex-wrap items-center gap-2"><Link href={`/property/${r.p.id}`} className="inline-flex h-8 items-center gap-1.5 bg-matte px-3 text-[9px] font-medium uppercase tracking-[.18em] text-ivory transition hover:bg-charcoal">View <ArrowRight size={11} /></Link><button onClick={() => { toggleCompare(r.p.id); toast(compare.includes(r.p.id) ? "Removed from comparison" : "Added to comparison"); }} aria-pressed={compare.includes(r.p.id)} className={`inline-flex h-8 items-center gap-1.5 border px-3 text-[9px] font-medium uppercase tracking-[.16em] transition ${compare.includes(r.p.id) ? "border-matte bg-matte text-ivory" : "border-line bg-white text-charcoal hover:border-matte"}`}><GitCompare size={11} />{compare.includes(r.p.id) ? "Added" : "Compare"}</button></div>
                      </div>
                    </motion.article>))}</div>}
                </div>
              ))}
              {busy && <div className="ml-9 flex items-center gap-2 text-sm text-slate"><motion.span className="h-2 w-2 rounded-full bg-beige" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} /><motion.span className="h-2 w-2 rounded-full bg-beige" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.15 }} /><motion.span className="h-2 w-2 rounded-full bg-beige" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.3 }} /><span className="ml-1">Searching listings…</span></div>}
              {error && <div role="alert" className="ml-9 border border-red-100 bg-red-50 p-3 text-sm text-red-900">{error}</div>}
              <div ref={end} />
            </div>

            <div className="border-t border-line/60 p-4 sm:p-5">
              {msgs.length > 0 && <div className="mb-3 flex flex-wrap gap-1.5">{followUps.map(f => <button type="button" key={f} onClick={() => send(f)} className="border border-line bg-ivory/60 px-2.5 py-1.5 text-[11px] text-slate transition hover:border-beige hover:text-matte">{f}</button>)}</div>}
              <form onSubmit={e => { e.preventDefault(); send(text); }} className="flex gap-2">
                <input aria-label="Ask the assistant about homes" value={text} onChange={e => setText(e.target.value)} placeholder="e.g. 3 BHK under ₹1.2 Cr in Gachibowli…" className="h-12 min-w-0 flex-1 border border-line bg-ivory/50 px-4 text-sm text-matte placeholder:text-slate focus:border-beige/70 focus:bg-white focus:outline-none" />
                <button type="submit" disabled={busy} className="h-12 bg-matte px-6 text-[10px] font-medium uppercase tracking-[.2em] text-ivory transition hover:bg-charcoal disabled:opacity-60">Send</button>
              </form>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="border border-line/70 bg-matte p-5 text-ivory">
              <p className="text-[11px] uppercase tracking-[.28em] text-beige/85">Portfolio pulse · demo</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="bg-ivory/5 p-3"><p className="font-serif text-2xl tabular-nums">{saved.length}</p><p className="text-[10px] uppercase tracking-[.18em] text-ivory/70">Saved</p></div>
                <div className="bg-ivory/5 p-3"><p className="font-serif text-2xl tabular-nums">{comparing.length}</p><p className="text-[10px] uppercase tracking-[.18em] text-ivory/70">Comparing</p></div>
              </div>
              {saved.length > 0 && <p className="mt-3 text-xs leading-relaxed text-ivory/70">Average saved budget: <span className="text-beige">{inr(Math.round(saved.reduce((a, p) => a + p.price, 0) / saved.length))}</span>{saved[0]?.location ? ` · across ${new Set(saved.map(p => p.location.split(",")[0])).size} areas` : ""}</p>}
              <Link href="/properties" className="mt-4 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[.2em] text-beige transition hover:text-ivory">Open collection <ArrowRight size={12} /></Link>
            </div>

            <div className="border border-line/70 bg-white p-5">
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[.28em] text-[#9c7f56]"><Info size={12} />How matching works</p>
              <ol className="mt-3 space-y-1.5 text-xs leading-relaxed text-slate"><li>1. Parse budget, BHK, area, type, amenities from your words or preferences.</li><li>2. Filter listings, then score each (budget fit, location, verification).</li><li>3. Cards show why each matched — nothing is hidden.</li></ol>
              <p className="mt-3 border-t border-line/60 pt-3 text-[10px] uppercase tracking-[.16em] text-slate/75">Rule-based demo over sample data — not a trained model, not live market analysis, not advice.</p>
            </div>

            <div className="border border-line/70 bg-white p-5">
              <p className="text-[11px] uppercase tracking-[.28em] text-[#9c7f56]">Ask me about</p>
              <ul className="mt-2.5 grid gap-1.5 text-[13px] text-charcoal/90">
                <li>“3 BHK under ₹1.2 Cr in Gachibowli”</li>
                <li>“Best villas in Kokapet with a pool”</li>
                <li>“What about investment?” — insight score &amp; signals (demo)</li>
                <li>“Best match — monthly EMI” — instalment estimate</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
      {comparing.length >= 2 && (
        <section aria-label="Comparison" className="fixed inset-x-0 bottom-0 z-40 max-h-[46vh] overflow-auto border-t border-line bg-white/97 p-4 shadow-[0_-10px_40px_rgba(17,17,17,.12)] backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3"><h2 className="font-serif text-xl">Comparing {comparing.length}</h2><button type="button" className="text-sm underline underline-offset-4" onClick={clearCompare}>Clear</button></div>
          <div className="mx-auto mt-2 max-w-7xl overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><tbody>{([["Price", (p: Property) => inr(p.price)], ["Type", (p: Property) => p.category], ["Area", (p: Property) => `${p.areaSqft.toLocaleString()} sq ft`], ["BHK", (p: Property) => p.bhk ? String(p.bhk) : "—"], ["Verified", (p: Property) => p.verified ? "Yes" : "No"]] as [string, (p: Property) => string][]).map(([k, fn]) => <tr key={k} className="border-t border-line align-top"><th className="whitespace-nowrap py-2 pr-4 font-normal text-slate">{k}</th>{comparing.map(p => <td key={p.id} className="min-w-[9rem] py-2 pr-4">{fn(p)}</td>)}</tr>)}</tbody></table></div>
        </section>
      )}
    </div>
  );
}
