"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Heart, Share2, GitCompare, BedDouble, Ruler, Car, Bath, MapPin, ShieldCheck, ArrowUpRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { inr } from "@/lib/format";
import { PHONE } from "@/lib/contact";
import Gallery from "@/components/properties/Gallery";
import FloorPlan from "@/components/properties/FloorPlan";
import Extras from "@/components/properties/Extras";
import VisitForm from "@/components/forms/VisitForm";
import PropertyCard from "@/components/properties/PropertyCard";
import InsightCard from "@/components/properties/InsightCard";
import VideoTour from "@/components/properties/VideoTour";
import EmiCalculator from "@/components/properties/EmiCalculator";
import NearbyPlaces from "@/components/properties/NearbyPlaces";
import { agents, fallbackAgent } from "@/data/agents";
import { useEffect } from "react";
import { Phone, Star, CalendarCheck2 } from "lucide-react";

/** Records this listing as recently viewed (session demo list). */
function TrackRecent({ id }: { id?: string }) {
  useEffect(() => {
    if (!id) return;
    try {
      const k = "skyline.recent";
      const prev: string[] = JSON.parse(window.localStorage.getItem(k) ?? "[]");
      window.localStorage.setItem(k, JSON.stringify([id, ...prev.filter(x => x !== id)].slice(0, 6)));
    } catch {}
  }, [id]);
  return null;
}

export default function PropertyPage() {
  const { id } = useParams<{ id: string }>();
  const { properties, ready, wishlist, toggleWish, compare, toggleCompare } = useStore();
  const toast = useToast();
  if (!ready) return <div className="mx-auto max-w-7xl px-5 py-10"><div className="aspect-[16/10] animate-pulse bg-line/70" /><div className="mt-8 space-y-3"><div className="h-4 w-40 animate-pulse bg-line/70" /><div className="h-10 w-2/3 animate-pulse bg-line/70" /><div className="h-6 w-1/3 animate-pulse bg-line/70" /></div></div>;
  const p = properties.find(x => x.id === id);
  if (!p) return <div className="mx-auto max-w-xl px-5 py-24 text-center"><p className="text-[11px] uppercase tracking-[.3em] text-slate">Listing unavailable</p><h1 className="mt-3 font-serif text-4xl text-matte">Property not found</h1><p className="mt-3 text-slate">This residence may have been removed or is no longer available.</p><Link href="/properties" className="mt-7 inline-flex bg-matte px-6 py-3 text-[11px] font-medium uppercase tracking-[.18em] text-ivory transition hover:bg-charcoal">Back to properties</Link></div>;
  const agent = agents.find(a => a.id === p.agentId) ?? fallbackAgent;
  // Purchase costs are illustrative only; actual charges depend on property type,
  // transaction structure and current local rules. Do not imply a universal GST rate.
  const registrationEstimate = p.listing === "Buy" ? Math.round(p.price * 0.07) : 0;
  const indicativePurchaseTotal = p.price + registrationEstimate;
  const similar = properties.filter(x => x.id !== p.id && x.category === p.category).slice(0, 3);
  const specs: [string, string][] = [["Listing", p.listing === "Buy" ? "For sale" : "For rent"], ...(p.furnishing ? [["Furnishing", p.furnishing] as [string, string]] : []), ...(p.bathrooms ? [["Bathrooms", String(p.bathrooms)] as [string, string]] : []), ["Posted", new Date(p.postedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })]];
  const share = async () => { try { await navigator.clipboard.writeText(window.location.href); toast("Link copied"); } catch { toast("Copy failed. Copy the address bar link instead."); } };
  const btn = "flex items-center gap-2 border border-line bg-white px-4 py-2.5 text-sm transition hover:border-matte hover:bg-ivory";
  const saved = wishlist.includes(p.id); const inCmp = compare.includes(p.id);
  const baths = p.bathrooms ?? (p.bhk ? Math.max(1, Math.ceil(p.bhk * 0.75)) : undefined);
  return <div className="bg-ivory/30">
    <TrackRecent id={p.id} />
    <div className="mx-auto max-w-7xl px-5 pb-16 pt-8 md:pt-10">
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[.16em] text-slate"><Link href="/" className="hover:text-matte">Home</Link><span>/</span><Link href="/properties" className="hover:text-matte">Properties</Link><span>/</span><span className="text-matte/70">{p.title}</span></nav>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <Gallery main={p.image} title={p.title} seed={Math.max(0, properties.indexOf(p))} />
          <div className="mt-8 border border-line/70 bg-white p-6 shadow-[0_12px_34px_rgba(17,17,17,.04)] md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-ivory px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.16em] text-matte">{p.category}</span>
                  <span className="border border-line px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.16em] text-matte">{p.listing === "Buy" ? "For Sale" : "For Rent"}</span>
                  {p.featured && <span className="bg-beige px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.16em] text-matte">Featured</span>}
                  {p.verified && <span className="inline-flex items-center gap-1 bg-matte px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.16em] text-ivory"><ShieldCheck size={12} />Verified (demo)</span>}
                </div>
                <h1 className="mt-4 font-serif text-4xl leading-[1.05] text-matte md:text-6xl">{p.title}</h1>
                <p className="mt-2 flex items-center gap-1.5 text-slate"><MapPin size={15} className="text-[#9c7f56]" />{p.location}</p>
              </div>
              <div className="text-left lg:text-right">
                <p className="font-serif text-4xl leading-none text-matte md:text-5xl">{inr(p.price)}{p.listing === "Rent" && <span className="ml-1 font-sans text-base font-normal text-slate">/ month</span>}</p>
                {p.areaSqft ? <p className="mt-2 text-sm text-slate">{inr(Math.round(p.price / p.areaSqft))} / sq ft</p> : null}
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button className={`${btn} justify-center sm:justify-start`} aria-pressed={saved} onClick={() => toggleWish(p.id)}><Heart size={16} className={saved ? "fill-matte" : ""} />{saved ? "Saved" : "Save"}</button>
              <button className={`${btn} justify-center sm:justify-start`} aria-pressed={inCmp} onClick={() => toggleCompare(p.id)}><GitCompare size={16} />{inCmp ? "In comparison" : "Compare"}</button>
              <button className={`${btn} justify-center sm:justify-start`} onClick={share}><Share2 size={16} />Copy link</button>
              <Link href="#visit" className="inline-flex items-center justify-center gap-2 bg-matte px-6 py-3 text-[11px] font-medium uppercase tracking-[.18em] text-ivory shadow-[0_10px_24px_rgba(17,17,17,.16)] transition hover:-translate-y-0.5 hover:bg-charcoal sm:ml-auto">Schedule Visit <ArrowUpRight size={14} /></Link>
            </div>
          </div>

          <ul aria-label="Key facts" className="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-matte/90 bg-matte/90 text-ivory sm:grid-cols-4">{([[BedDouble, p.bhk ? `${p.bhk} BHK` : "—", "Configuration"], [Bath, baths ? `${baths} Baths` : "—", "Bathrooms"], [Ruler, `${p.areaSqft.toLocaleString()} sq ft`, "Built-up area"], [Car, p.parking ?? "On request", "Parking"]] as const).map(([I, v, k]) => <li key={k} className="bg-matte p-5"><I size={20} strokeWidth={1.5} className="text-gold" /><p className="mt-3 font-serif text-2xl leading-tight">{v}</p><p className="mt-1 text-xs uppercase tracking-[.14em] text-ivory/55">{k}</p></li>)}</ul>
          <dl className="mt-px grid grid-cols-2 gap-px bg-line sm:grid-cols-4">{specs.map(([k, v]) => <div key={k} className="bg-white p-4"><dt className="text-[11px] uppercase tracking-[.14em] text-slate">{k}</dt><dd className="mt-1.5 font-medium text-matte">{v}</dd></div>)}</dl>

          <div className="mt-8 space-y-8">
            <section className="border border-line/70 bg-white p-6 md:p-8"><InsightCard p={p} all={properties} /></section>
            <section className="border border-line/70 bg-white p-6 md:p-8">
              <p className="text-[11px] uppercase tracking-[.28em] text-[#9c7f56]">Overview</p>
              <h2 className="mt-2 font-serif text-3xl text-matte md:text-4xl">About this property</h2>
              {p.description ? <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-charcoal/80">{p.description}</p> : <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-charcoal/80">A {p.bhk ? `${p.bhk}-bedroom ` : ""}{p.category.toLowerCase()} of {p.areaSqft.toLocaleString()} sq ft in {p.location.split(",")[0]}, thoughtfully positioned for connectivity, comfort, and everyday ease near Hyderabad’s key corridors. (Sample description.)</p>}
            </section>
            <EmiCalculator price={p.price} />
            <NearbyPlaces seed={p.id} />
            <section className="border border-line/70 bg-white p-6 md:p-8" aria-label="Location on the map">
              <p className="text-[11px] uppercase tracking-[.28em] text-[#9c7f56]">Location</p>
              <h2 className="mt-2 font-serif text-3xl text-matte md:text-4xl">Find it on <em className="italic text-[#9c7f56]">the map.</em></h2>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-slate"><MapPin size={14} className="text-[#9c7f56]" />{p.location}</p>
              <div className="mt-4 overflow-hidden border border-line/60">
                <iframe title={`Map showing ${p.location}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://maps.google.com/maps?q=${encodeURIComponent(p.location)}&output=embed`} className="aspect-[16/9] w-full border-0" />
              </div>
              <p className="mt-2 text-xs text-slate">Map shows the locality (demo embed), not the exact address.</p>
            </section>
            <section className="border border-line/70 bg-white p-6 md:p-8">
              <p className="text-[11px] uppercase tracking-[.28em] text-[#9c7f56]">Features</p>
              <h2 className="mt-2 font-serif text-3xl text-matte md:text-4xl">Amenities & highlights</h2>
              <ul className="mt-5 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">{p.amenities.map(a => <li key={a} className="flex items-center gap-3 border-b border-line/70 py-2.5 text-charcoal/85"><span className="h-1.5 w-1.5 rounded-full bg-beige" aria-hidden="true" />{a}</li>)}</ul>
            </section>
            <VideoTour src={p.videoUrl ?? (p.category === "Villa" ? "/videos/hero-720.mp4" : undefined)} sample={!p.videoUrl} title={p.title} />
            <Extras location={p.location} propertyId={p.id} propertyTitle={p.title}><FloorPlan bhk={p.bhk} areaSqft={p.areaSqft} /></Extras>
            <section>
              <div className="flex items-end justify-between gap-4 border-t border-line/70 pt-8"><div><p className="text-[11px] uppercase tracking-[.28em] text-[#9c7f56]">More like this</p><h2 className="mt-2 font-serif text-3xl text-matte md:text-4xl">Similar properties</h2></div><Link href="/properties" className="hidden text-sm underline underline-offset-4 sm:inline">View all</Link></div>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{similar.length ? similar.map(s => <PropertyCard key={s.id} p={s} saved={wishlist.includes(s.id)} onToggle={toggleWish} compared={compare.includes(s.id)} onCompare={toggleCompare} />) : <div className="border border-line/70 bg-white p-8 text-sm text-slate">No similar listings right now. <Link href="/properties" className="underline">Browse all properties</Link>.</div>}</div>
            </section>
          </div>
        </div>

        <aside id="visit" className="scroll-mt-24 pb-24 lg:pb-0 lg:sticky lg:top-24 lg:self-start">
          <div className="border border-line/70 bg-white p-5 shadow-[0_14px_38px_rgba(17,17,17,.06)] md:p-6">
            <p className="text-[11px] uppercase tracking-[.28em] text-[#9c7f56]">Private viewing</p>
            <h2 className="mt-2 font-serif text-3xl text-matte">Schedule a site visit</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate">Share your preferred time and our advisor will coordinate your visit. <span className="text-slate/80">Demo request — no booking is sent.</span></p>
            <div className="mt-5"><VisitForm propertyId={p.id} /></div>
          </div>
          <div className="mt-4 border border-line/70 bg-matte p-5 text-ivory">
            <p className="font-serif text-xl">Need guidance?</p>
            <p className="mt-1 text-sm text-ivory/70">Speak with a Skyline advisor for pricing, availability, and neighbourhood insights.</p>
            <Link href="/contact" className="mt-4 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[.18em] text-beige hover:text-ivory">Contact advisor <ArrowUpRight size={14} /></Link>
          </div>
          {/* Agent profile */}
          <div className="mt-4 border border-line/70 bg-white p-5">
            <div className="flex items-center gap-4">
              <span aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-matte font-serif text-lg text-ivory">{agent.name.split(" ").map(w => w[0]).slice(0, 2).join("")}</span>
              <div className="min-w-0">
                <p className="font-serif text-xl leading-tight text-matte">{agent.name}</p>
                <p className="text-[10px] uppercase tracking-[.18em] text-[#9c7f56]">{agent.role} · {agent.area}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line/60 pt-4 text-sm text-charcoal/85">
              <span className="inline-flex items-center gap-1.5"><Star size={14} className="fill-gold text-gold" />{agent.rating} <span className="text-slate">({agent.reviews} sample)</span></span>
              <span>{agent.deals} deals (demo)</span><span>{agent.years} yrs</span>
            </div>
            <a href="#visit" className="mt-4 inline-flex w-full items-center justify-center gap-2 border border-line bg-ivory/60 px-4 py-2.5 text-sm text-matte transition hover:border-matte hover:bg-ivory"><Phone size={15} />Contact via enquiry (demo)</a>
            <p className="mt-2 flex items-center gap-1.5 text-[10px] uppercase tracking-[.16em] text-slate/80"><CalendarCheck2 size={12} />Response time shown as a demo indicator</p>
          </div>
          {/* Cost guidance: avoid presenting sample percentages as statutory tax advice. */}
          <div className="mt-4 border border-line/70 bg-white p-5">
            <p className="text-[11px] uppercase tracking-[.28em] text-[#9c7f56]">{p.listing === "Buy" ? "Illustrative purchase estimate" : "Rental cost guide"}</p>
            {p.listing === "Buy" ? <>
              <dl className="mt-3 space-y-1.5 text-sm">
                <div className="flex items-baseline justify-between gap-3"><dt className="text-slate">Listed property price</dt><dd className="font-medium text-matte tabular-nums">{inr(p.price)}</dd></div>
                <div className="flex items-baseline justify-between gap-3"><dt className="text-slate">Indicative registration allowance (7% sample)</dt><dd className="font-medium text-matte tabular-nums">{inr(registrationEstimate)}</dd></div>
                <div className="flex items-baseline justify-between gap-3 border-t border-line/60 pt-1.5"><dt className="font-medium text-matte">Illustrative subtotal</dt><dd className="font-serif text-lg text-[#9c7f56] tabular-nums">{inr(indicativePurchaseTotal)}</dd></div>
              </dl>
              <p className="mt-2 text-[10px] leading-relaxed text-slate/80">Planning estimate only, not a tax or legal quote. Actual stamp duty, registration, GST applicability and other charges depend on the property and transaction. Confirm with the relevant authority and a qualified advisor.</p>
            </> : <>
              <p className="mt-3 font-serif text-2xl text-matte">{inr(p.price)} <span className="font-sans text-sm font-normal text-slate">per month</span></p>
              <p className="mt-2 text-xs leading-relaxed text-slate">Ask the listing contact to confirm the security deposit, maintenance, brokerage and any other move-in charges before booking.</p>
            </>}
          </div>
        </aside>
      </div>
    </div>
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-white/96 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(17,17,17,.08)] backdrop-blur lg:hidden"><a href="#visit" className="flex-1 bg-matte py-3.5 text-center text-sm font-medium text-ivory transition hover:bg-charcoal">Schedule visit</a>{PHONE && <a href={`tel:${PHONE}`} className="flex-1 border border-matte py-3.5 text-center text-sm font-medium text-matte transition hover:bg-matte hover:text-ivory">Call agent</a>}</div>
  </div>;
}
