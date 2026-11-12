"use client";
import { useRef } from "react";
import Link from "next/link";
import { Search, MapPin, Building2, IndianRupee } from "lucide-react";
import { useCinematic } from "./useCinematic";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/format";
import { categories } from "@/data/content";
const prices: [string, string][] = [["2500000", "₹25 L"], ["5000000", "₹50 L"], ["10000000", "₹1 Cr"], ["20000000", "₹2 Cr"], ["50000000", "₹5 Cr"]];
const cell = "w-full bg-transparent text-sm text-charcoal placeholder:text-slate focus:outline-none [&>option]:text-charcoal";

export default function SceneDiscovery() {
  const ref = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const railWrap = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const { properties } = useStore();
  const picks = [...properties].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 10);

  useCinematic(ref, ({ gsap }) => {
    // Non-pinned flow: avoids the start hitch/jump caused by pin activation.
    const getX = () => {
      const wrap = railWrap.current;
      const r = rail.current;
      if (!wrap || !r) return 0;
      return Math.min(0, -(r.scrollWidth - wrap.clientWidth + 12));
    };
    gsap.set(rail.current, { x: 0, force3D: true });
    gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        start: "top 75%",
        end: "bottom 40%",
        scrub: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
      },
    })
      .fromTo(rail.current, { x: 0 }, { x: () => getX(), ease: "none", immediateRender: false }, 0);
  }, [picks.length]);

  return (
    <section id="property-discovery" ref={ref} className="relative min-h-[100svh] overflow-hidden bg-ivory text-charcoal">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-24 bg-gradient-to-b from-matte/12 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_15%,rgba(216,195,165,.20),transparent_42%),radial-gradient(ellipse_at_85%_75%,rgba(17,17,17,.04),transparent_45%)]" />
      <div className="relative z-[1] mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 py-16 md:px-8">
        <div ref={panel}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[.38em] text-slate">PROPERTY DISCOVERY</p>
              <h2 className="mt-2 max-w-3xl font-serif text-[clamp(1.9rem,4.2vw,4rem)] leading-[1.03] text-matte">Find a home that <span className="text-[#9c7f56]">fits you.</span></h2>
            </div>
            <Link href="/properties" className="hidden border-b border-matte/30 pb-0.5 text-sm text-matte transition hover:border-beige sm:inline-block">View all properties</Link>
          </div>
          <form action="/properties" role="search" className="mt-6 grid max-w-5xl gap-px overflow-hidden border border-line bg-line shadow-[0_18px_60px_rgba(17,17,17,.08)] md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_auto]">
            <label className="flex items-center gap-3 bg-white px-4 py-3.5"><MapPin size={18} className="shrink-0 text-[#9c7f56]" /><span className="w-full"><span className="block text-[11px] text-slate">Location</span><input name="q" placeholder="Search location or property" className={cell} /></span></label>
            <label className="flex items-center gap-3 bg-white px-4 py-3.5"><Building2 size={18} className="shrink-0 text-[#9c7f56]" /><span className="w-full"><span className="block text-[11px] text-slate">Category</span><select name="category" className={cell}><option value="">All types</option>{categories.map(c=><option key={c}>{c}</option>)}</select></span></label>
            <label className="flex items-center gap-3 bg-white px-4 py-3.5"><IndianRupee size={18} className="shrink-0 text-[#9c7f56]" /><span className="w-full"><span className="block text-[11px] text-slate">Max budget</span><select name="maxPrice" className={cell}><option value="">Any</option>{prices.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></span></label>
            <button className="flex items-center justify-center gap-2 bg-matte px-8 py-4 text-[11px] font-medium tracking-[.22em] text-ivory transition duration-300 hover:bg-charcoal"><Search size={16}/> SEARCH</button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2" aria-label="Property categories">
            {categories.map((c) => <Link key={c} href={`/properties?category=${encodeURIComponent(c)}`} className="border border-line bg-white px-4 py-2 text-xs tracking-wide text-charcoal transition hover:border-beige hover:text-matte">{c}</Link>)}
          </div>
        </div>
        <div ref={railWrap} className="mt-7 -mx-5 max-w-full overflow-hidden px-5 md:mx-0 md:px-0">
          <p className="mb-3 text-[11px] tracking-[.22em] text-slate">SCROLL TO EXPLORE</p>
          <div ref={rail} className="flex w-max max-w-none gap-5 pb-1 will-change-transform md:gap-6">
            {picks.map((p) => (
              <Link key={p.id} href={`/property/${p.id}`} className="group relative block h-60 w-[86vw] shrink-0 overflow-hidden border border-line bg-white shadow-[0_18px_44px_rgba(17,17,17,.10)] sm:h-[19rem] sm:w-[420px] lg:h-[21rem] lg:w-[460px]">
                <img src={p.image} alt={p.title} loading="lazy" onError={(e)=>{const t=e.currentTarget;if(t.dataset.fallback)return;t.dataset.fallback="1";t.src="/images/hero-3d.jpg";}} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
                <div className="absolute inset-0 bg-gradient-to-t from-matte/90 via-matte/22 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-ivory md:p-6">
                  <p className="font-serif text-2xl leading-tight md:text-[1.7rem]">{p.title}</p>
                  <p className="mt-1.5 text-sm text-ivory/78">{p.location.split(",")[0]} · {inr(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-20 bg-gradient-to-t from-ivory to-transparent" />
    </section>
  );
}
