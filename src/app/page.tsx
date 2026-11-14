"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import CinematicJourney from "@/components/cinematic/CinematicJourney";
import StatsStrip from "@/components/home/StatsStrip";
import LocationsShowcase from "@/components/home/LocationsShowcase";
import SectionHead from "@/components/common/SectionHead";
import Fade from "@/components/common/Fade";
import ProcessTimeline from "@/components/home/ProcessTimeline";
import { testimonials, reasons } from "@/data/content";
import { posts } from "@/data/blogs";
import { ArrowUpRight, Building2, KeyRound, Landmark, LineChart, ShieldCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import { CONTACT_EMAIL, PHONE } from "@/lib/contact";

/* Category imagery for the homepage bento — reliable local first, curated remote with local fallback */
const CATEGORY_CARDS = [
  { c: "Apartment", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80", fb: "/images/hero-3d.jpg", blurb: "Skyline living with concierge amenities and city views." },
  { c: "Villa", img: "/images/villa-hero.jpg", fb: "/images/luxurious-house-night-hero.jpg", blurb: "Private gardens, pools, and room for the whole family." },
  { c: "Independent House", img: "/images/luxurious-house-night-hero.jpg", fb: "/images/hero-3d.jpg", blurb: "Standalone homes with privacy on independent plots." },
  { c: "Residential Plot", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80", fb: "/images/villa-hero.jpg", blurb: "Land in growth corridors, ready for your blueprint." },
  { c: "Commercial", img: "https://images.unsplash.com/photo-1486406116922-15f4554b7b8a?auto=format&fit=crop&w=1200&q=80", fb: "/images/hero-3d.jpg", blurb: "Offices, retail, and high-street investment assets." },
] as const;

/* Distinct accent per service card — colorful but restrained */
const SERVICE_ACCENTS = [
  { chip: "border-[#9c7f56]/50 bg-[#9c7f56]/10 text-[#9c7f56] group-hover:bg-[#9c7f56]/20 group-hover:shadow-[0_8px_20px_rgba(156,127,86,.25)]", line: "from-[#9c7f56]/80" },
  { chip: "border-teal-700/40 bg-teal-600/10 text-teal-800 group-hover:bg-teal-600/20 group-hover:shadow-[0_8px_20px_rgba(13,148,136,.22)]", line: "from-teal-600/80" },
  { chip: "border-orange-700/35 bg-orange-600/10 text-orange-800 group-hover:bg-orange-600/20 group-hover:shadow-[0_8px_20px_rgba(234,88,12,.22)]", line: "from-orange-600/80" },
  { chip: "border-emerald-700/35 bg-emerald-600/10 text-emerald-800 group-hover:bg-emerald-600/20 group-hover:shadow-[0_8px_20px_rgba(5,150,105,.22)]", line: "from-emerald-600/80" },
  { chip: "border-indigo-700/35 bg-indigo-600/10 text-indigo-800 group-hover:bg-indigo-600/20 group-hover:shadow-[0_8px_20px_rgba(79,70,229,.22)]", line: "from-indigo-600/80" },
] as const;

/* Scroll-driven spine with a traveling gold jewel — pure effect, no imagery.
   Progress is derived geometrically from the spine's own position so it maps exactly. */
function AdvisorySpine() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const smooth = useSpring(progress, { stiffness: 120, damping: 30, mass: 0.5 });
  const top = useTransform(smooth, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = () => {
      // measured live on every scroll event — immune to layout shifts and hidden-tab rAF pauses;
      // visual smoothness comes from the spring
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.9 - r.top) / (r.height + vh * 0.25)));
      if (Math.abs(p - progress.get()) > 0.0005) progress.set(p);
    };
    apply();
    window.addEventListener("scroll", apply, { passive: true });
    window.addEventListener("resize", apply);
    return () => {
      window.removeEventListener("scroll", apply);
      window.removeEventListener("resize", apply);
    };
  }, [progress]);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 hidden w-px lg:block">
      {/* static hairline */}
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line" />
      {/* progress fill that grows downward as you scroll */}
      <motion.span
        className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-gold via-[#9c7f56]/70 to-transparent"
        style={{ scaleY: smooth }}
      />
      {/* traveling jewel */}
      <motion.span
        className="absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_14px_3px_rgba(201,166,107,.55)]"
        style={{ top }}
      />
    </div>
  );
}

export default function Home() {
  const { properties } = useStore();
  const countFor = (c: string) => properties.filter(p => p.category === c).length;

  return (
    <>
      <CinematicJourney />

      <div className="relative bg-matte text-ivory">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-matte to-transparent" />
        <StatsStrip />
        <div aria-hidden="true" className="h-px bg-gradient-to-r from-transparent via-beige/25 to-transparent" />
      </div>
      <div aria-hidden="true" className="h-16 bg-gradient-to-b from-matte via-[#2a2724] to-ivory md:h-20" />

      <div>
        <section className="relative overflow-hidden bg-ivory py-20 md:py-24">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,rgba(216,195,165,.18),transparent_42%),radial-gradient(ellipse_at_85%_80%,rgba(17,17,17,.04),transparent_45%)]" />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div className="grid items-start gap-10 lg:grid-cols-[.95fr_1.05fr] lg:gap-14">
              <div data-site-reveal className="lg:sticky lg:top-28 lg:self-start">
                <span aria-hidden="true" className="skyline-drift pointer-events-none absolute -left-16 -top-10 h-56 w-56 rounded-full bg-beige/20 blur-3xl" />
                <SectionHead eyebrow="Why Skyline Estates" title="Advice that *answers to you.*" />
                <p className="mt-4 max-w-md text-sm leading-relaxed text-slate">A calmer, clearer property experience — from discovery to site visit to decision, grounded in trust and local insight.</p>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  {[["Curated","Every listing reviewed"],["Transparent","Costs made clear"],["Local","Neighbourhood expertise"],["Guided","Advisors, not pressure"]].map(([a,b])=>(
                    <div key={a} className="group/mini relative overflow-hidden border border-line/70 border-l-2 border-l-beige/70 bg-gradient-to-br from-white to-ivory/60 p-4 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-beige/60 hover:from-white hover:to-[#f8f3ea] hover:shadow-[0_14px_30px_rgba(156,127,86,.14)]">
                      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-[#9c7f56]/70 to-transparent transition-transform duration-500 ease-out group-hover/mini:scale-x-100" />
                      <span aria-hidden="true" className="absolute right-3 top-4 h-1.5 w-1.5 rounded-full bg-beige/60 transition-[transform] duration-500 group-hover/mini:-translate-y-1 group-hover/mini:bg-[#9c7f56]" />
                      <p className="font-serif text-lg text-matte">{a}</p><p className="mt-1 text-xs text-slate">{b}</p>
                    </div>
                  ))}
                </div>
                <div aria-hidden="true" className="mt-8 hidden items-center gap-3 lg:flex">
                  <span className="h-px w-10 bg-beige/50" /> <span className="font-serif text-xs italic tracking-wide text-[#9c7f56]">advice over pressure</span>
                </div>
              </div>
              <div className="relative lg:pl-9">
                <AdvisorySpine />
                <dl className="grid gap-4 sm:grid-cols-2">
                  {reasons.map(([t, d], i) => (
                    <div key={t} data-site-reveal className="group relative overflow-hidden border border-line/70 bg-white/80 p-5 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#9c7f56]/50 hover:bg-[#f8f3ea] hover:shadow-[0_18px_40px_rgba(156,127,86,.12)] sm:p-6">
                      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-[#9c7f56]/70 to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100" />
                      {/* shimmer sweep on hover (no images) */}
                      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-transform duration-700 ease-out group-hover:translate-x-[420%] group-hover:opacity-100" />
                      {/* oversized ghost numeral drifting on hover */}
                      <span aria-hidden="true" className="pointer-events-none absolute -right-3 -top-7 select-none font-serif text-8xl leading-none text-[#9c7f56]/[0.08] transition-transform duration-700 ease-out group-hover:-translate-y-1 group-hover:text-[#9c7f56]/[0.16]">{i + 1}</span>
                      <div className="flex items-start gap-4">
                        <span className="mt-0.5 font-serif text-2xl leading-none text-beige/90 transition-colors duration-500 group-hover:text-[#7a6241]">0{i + 1}</span>
                        <div>
                          <dt className="font-serif text-[1.35rem] leading-tight text-matte transition-colors duration-300 group-hover:text-[#3a3026]">{t}</dt>
                          <dd className="mt-2 text-sm leading-relaxed text-slate transition-colors duration-300 group-hover:text-charcoal/80">{d}</dd>
                        </div>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        <Fade from="ivory" to="white" />
        <section data-site-reveal className="bg-white py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <SectionHead eyebrow="Prime locations" title="Discover *Prime Locations.*" />
            <LocationsShowcase />
          </div>
        </section>

        <Fade from="white" to="matte" />
        <section data-site-reveal className="relative overflow-hidden bg-matte py-20 text-ivory md:py-24" aria-labelledby="quick-search-heading">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_25%,rgba(216,195,165,.16),transparent_42%),radial-gradient(ellipse_at_88%_70%,rgba(248,245,240,.07),transparent_38%)]" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-beige/35 to-transparent" />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_.95fr]">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-beige/25 bg-ivory/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[.3em] text-beige/90"><span className="h-1.5 w-1.5 rounded-full bg-gold/90" aria-hidden="true" />Quick Search</p>
                <h2 id="quick-search-heading" className="mt-4 font-serif text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.05]">A fast start to the right address.</h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-ivory/75">Enter a location and budget to jump straight into matching residences. For detailed filters, amenities, and comparisons, use the full search on the Properties page.</p>
                <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[11px] uppercase tracking-[.18em] text-ivory/60">
                  <li className="inline-flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-beige/70" aria-hidden="true" />Instant results</li>
                  <li className="inline-flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-beige/70" aria-hidden="true" />Curated listings</li>
                  <li className="inline-flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-beige/70" aria-hidden="true" />Demo experience</li>
                </ul>
              </div>
              <form action="/properties" className="grid gap-4 rounded-sm border border-beige/20 bg-gradient-to-b from-ivory/[0.07] to-ivory/[0.03] p-5 shadow-[0_24px_60px_rgba(0,0,0,.22)] backdrop-blur-sm sm:grid-cols-2">
                <div className="sm:col-span-2 flex items-center justify-between border-b border-ivory/10 pb-3">
                  <p className="text-[11px] font-medium uppercase tracking-[.22em] text-beige/85">Start your search</p>
                  <span className="text-[10px] uppercase tracking-[.18em] text-ivory/50">Homepage shortcut</span>
                </div>
                <label className="sm:col-span-2"><span className="block text-[11px] uppercase tracking-[.16em] text-beige/80">Location or project</span><input name="q" placeholder="e.g. Gachibowli, Kokapet, villa" className="mt-1.5 h-12 w-full border border-ivory/15 bg-matte/45 px-4 text-sm text-ivory placeholder:text-ivory/40 focus:border-beige/50 focus:outline-none" /></label>
                <label><span className="block text-[11px] uppercase tracking-[.16em] text-beige/80">Max budget</span><select name="maxPrice" className="mt-1.5 h-12 w-full border border-ivory/15 bg-matte/45 px-4 text-sm text-ivory focus:border-beige/50 focus:outline-none [&>option]:text-charcoal"><option value="">Any budget</option><option value="5000000">?50 L</option><option value="10000000">?1 Cr</option><option value="20000000">?2 Cr</option><option value="50000000">?5 Cr</option></select></label>
                <button type="submit" className="self-end h-12 bg-beige px-5 text-[11px] font-medium tracking-[.2em] text-matte shadow-[0_10px_24px_rgba(0,0,0,.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">SEARCH PROPERTIES</button>
              </form>
            </div>
          </div>
        </section>

        <Fade from="matte" to="white" />
        <section data-site-reveal className="relative overflow-hidden bg-white py-20 md:py-24">
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-[radial-gradient(ellipse_at_0%_40%,rgba(216,195,165,.16),transparent_55%)]" />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_.9fr]">
              <SectionHead eyebrow="Property categories" title="Spaces shaped for *every ambition.*" />
              <p className="max-w-xl text-sm leading-relaxed text-slate lg:justify-self-end">From skyline apartments to private villas and strategic plots, explore categories curated for distinct lifestyles and investment goals.</p>
            </div>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
              {CATEGORY_CARDS.map(({ c, img, fb, blurb }, i) => {
                const n = countFor(c);
                return (
                  <Link
                    key={c}
                    href={`/properties?category=${encodeURIComponent(c)}`}
                    className={`group/card relative min-h-[15rem] overflow-hidden border border-line/60 bg-matte shadow-[0_10px_30px_rgba(17,17,17,.06)] transition-all duration-500 hover:-translate-y-1.5 hover:border-beige/50 hover:shadow-[0_26px_54px_rgba(17,17,17,.14)] ${i===0?"lg:col-span-7 lg:min-h-[22rem]":i===1?"lg:col-span-5 lg:min-h-[22rem]":"lg:col-span-4"}`}
                  >
                    {/* Image layer with cinematic grades */}
                    <img
                      src={img}
                      alt={`${c} category`}
                      loading="lazy"
                      onError={(e) => { const t = e.currentTarget; if (t.dataset.fallback) return; t.dataset.fallback = "1"; t.src = fb; }}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover/card:scale-[1.07]"
                    />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-matte/92 via-matte/45 to-matte/10 transition-opacity duration-500 group-hover/card:opacity-90" />
                    <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_15%,rgba(216,195,165,.16),transparent_50%)] opacity-70" />
                    <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-beige via-gold to-transparent transition-transform duration-500 ease-out group-hover/card:scale-x-100" />

                    {/* Top row: index + live listing count */}
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 md:p-6">
                      <p className="font-serif text-sm italic text-beige/85">0{i+1}</p>
                      <span className="inline-flex items-center gap-2 border border-ivory/25 bg-matte/45 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[.18em] text-ivory backdrop-blur-sm">
                        <span className={`h-1.5 w-1.5 rounded-full ${n>0?"bg-beige":"bg-ivory/40"}`} aria-hidden="true" />
                        {n>0?`${n} ${n===1?"listing":"listings"}`:"Coming soon"}
                      </span>
                    </div>

                    {/* Bottom content */}
                    <div className="absolute inset-x-0 bottom-0 p-5 text-ivory md:p-6">
                      <h3 className="font-serif text-[1.7rem] leading-tight md:text-[1.9rem] lg:text-3xl">{c}</h3>
                      <p className="mt-1.5 max-w-[34ch] text-[13px] leading-relaxed text-ivory/70">{blurb}</p>
                      <span className="mt-4 inline-flex translate-y-1 items-center gap-2 text-[11px] font-medium uppercase tracking-[.2em] text-beige opacity-90 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100">
                        Explore {c}
                        <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full border border-beige/40 transition-all duration-300 group-hover/card:border-beige group-hover/card:bg-beige group-hover/card:text-matte">
                          <ArrowUpRight size={13} />
                        </span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-white py-20 md:py-24">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,rgba(216,195,165,.14),transparent_40%)]" />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
              <SectionHead eyebrow="Services" title="Every side of a *property decision.*" />
              <p className="max-w-2xl text-sm leading-relaxed text-slate lg:pt-10">Advisory, buying, selling, legal guidance, and investment insight — delivered as one composed, end-to-end experience.</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                [Building2,"Property Advisory","Personalised guidance to match homes with your lifestyle and goals."],
                [KeyRound,"Buying & Site Visits","Curated shortlists, seamless visits, and confident negotiations."],
                [Landmark,"Legal & Documentation","Clear checks and documentation support before you commit."],
                [LineChart,"Investment Insights","Data-informed perspectives across Hyderabad's growth corridors."],
                [ShieldCheck,"Verified Listings","Thoroughly reviewed properties for transparency and peace of mind."],
              ].map(([Icon,title,desc],i)=>{
                const accent = SERVICE_ACCENTS[i] ?? SERVICE_ACCENTS[0];
                return (
                <Link key={title as string} href="/services" className={`group relative overflow-hidden border border-line/70 bg-ivory/50 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-beige/60 hover:bg-white hover:shadow-[0_18px_42px_rgba(17,17,17,.08)] ${i===0?"lg:col-span-2":""}`}>
                  <span aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r ${accent.line} to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100`} />
                  <span className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-500 ${accent.chip}`}><Icon size={19}/></span>
                  <h3 className="mt-4 font-serif text-2xl text-matte">{title as string}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-slate">{desc as string}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[.18em] text-matte">Discover <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/></span>
                </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-matte py-20 text-ivory md:py-24">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(216,195,165,.12),transparent_45%),linear-gradient(180deg,rgba(248,245,240,.03),transparent_30%,rgba(0,0,0,.18))]" />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <SectionHead eyebrow="The process" title="From first look to *front door.*" dark />
            <ProcessTimeline />
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#f3efe8] py-20 md:py-24">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(216,195,165,.22),transparent_40%)]" />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-start">
              <div data-site-reveal>
                <SectionHead eyebrow="Example journeys" title="A clearer path to *your next move.*" />
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate">Explore how buyers, investors and sellers can use the platform. These are illustrative product scenarios, not customer testimonials.</p>
              </div>
              <div data-site-reveal className="max-w-sm border border-line/70 bg-white/90 px-5 py-4 text-sm leading-relaxed text-slate shadow-[0_10px_26px_rgba(17,17,17,.05)] lg:mt-10 lg:justify-self-end">Illustrative demo content · No customer rating or review count is being claimed.</div>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map(([n, t], i) => (
                <article key={n} data-site-reveal className={`group flex h-full flex-col border border-line/70 bg-white p-6 shadow-[0_12px_34px_rgba(17,17,17,.05)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(17,17,17,.08)] ${i===0?"md:col-span-2 lg:col-span-1":""}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-medium tracking-[.16em] text-[#9c7f56]"><span className="h-1.5 w-1.5 rounded-full bg-beige" aria-hidden="true" />ILLUSTRATIVE SCENARIO</span>
                    <span className="text-[10px] uppercase tracking-[.16em] text-slate">Product example</span>
                  </div>
                  <span className="mt-4 font-serif text-4xl leading-none text-beige/60" aria-hidden="true">“</span>
                  <blockquote className="-mt-2 flex-1 text-[15px] leading-relaxed text-charcoal/84">{t}</blockquote>
                  <footer className="mt-6 flex items-center gap-3 border-t border-line/70 pt-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-matte font-serif text-sm text-ivory" aria-hidden="true">{n.split(" ").map(w => w[0]).join("")}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-matte">{n}</p>
                      <p className="text-xs text-slate">Example platform workflow</p>
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-white py-20 md:py-24">
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(ellipse_at_center,rgba(216,195,165,.14),transparent_65%)]" />
          <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-beige/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-2 md:px-8">
            <div data-site-reveal>
              <SectionHead eyebrow="Our people" title="Builders and *agents.*" />
              <ul className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
                {[["Aurum Developers", "Builder", "Kokapet"], ["Lakshmi Prasad", "Senior advisor", "Gachibowli"], ["Greenfield Homes", "Builder", "Tellapur"], ["Imran Siddiqui", "Advisor", "Narsingi"]].map(([n, r, a], i) => (
                  <li key={n} data-site-reveal className="group relative flex items-center gap-3 overflow-hidden border border-line/70 bg-ivory/70 p-4 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-beige/60 hover:bg-white hover:shadow-[0_14px_34px_rgba(17,17,17,.07)]">
                    <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-beige/70 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
                    <span aria-hidden="true" className="pointer-events-none absolute -right-2 -top-5 select-none font-serif text-7xl leading-none text-[#9c7f56]/[0.08] transition-transform duration-700 ease-out group-hover:-translate-y-1 group-hover:text-[#9c7f56]/[0.14]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="relative z-[1] flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-matte font-serif text-ivory transition-all duration-500 group-hover:scale-105 group-hover:bg-[#9c7f56] group-hover:shadow-[0_8px_18px_rgba(156,127,86,.25)]" aria-hidden="true">{n.split(" ").map(w => w[0]).slice(0, 2).join("")}</span>
                    <span className="relative z-[1] min-w-0">
                      <span className="block font-serif text-[1.15rem] leading-snug text-matte transition-colors duration-300 group-hover:text-[#3a3026]">{n}</span>
                      <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-[.16em] text-[#9c7f56]">{r}, {a}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div data-site-reveal className="group relative overflow-hidden border border-line/70 bg-matte p-7 text-ivory transition-all duration-500 hover:border-beige/30 hover:shadow-[0_24px_60px_rgba(17,17,17,.18)] md:p-8">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(216,195,165,.18),transparent_45%)] transition-opacity duration-500 group-hover:opacity-100" />
              <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full border border-beige/10 transition-transform duration-700 group-hover:scale-110" />
              <div className="relative">
                <span aria-hidden="true" className="pointer-events-none absolute -left-3 -top-5 select-none font-serif text-[9rem] leading-none text-ivory/[0.05] transition-opacity duration-700 group-hover:opacity-90">S</span>
                <p className="text-[11px] tracking-[.3em] text-beige/85">PERSONAL GUIDANCE</p>
                <h2 className="mt-3 font-serif text-3xl leading-tight">Ready to find the right address?</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-ivory/72">Speak with a Skyline advisor for curated shortlists, site visits, pricing clarity, and trusted guidance — without the noise.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/contact" className="inline-flex items-center justify-center bg-beige px-6 py-3 text-[11px] font-medium tracking-[.18em] text-matte transition duration-300 hover:-translate-y-0.5 hover:bg-ivory">CONTACT AN ADVISOR</Link>
                  <Link href="/contact?visit=1" className="inline-flex items-center justify-center border border-ivory/35 px-6 py-3 text-[11px] font-medium tracking-[.18em] text-ivory transition duration-300 hover:-translate-y-0.5 hover:bg-ivory/10">BOOK A SITE VISIT</Link>
                </div>
                <p className="mt-5 text-xs text-ivory/55">
                  {PHONE ? <>Call <a href={`tel:${PHONE}`} className="text-beige/90 underline decoration-beige/30 underline-offset-4 transition hover:text-beige">{PHONE}</a> · </> : <>Request a callback via contact · </>}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-beige/90 underline decoration-beige/30 underline-offset-4 transition hover:text-beige">{CONTACT_EMAIL}</a>
                  <span className="ml-1 text-ivory/40">(demo)</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section data-site-reveal className="relative overflow-hidden border-t border-line/70 bg-[#f6f2eb] py-20 text-charcoal md:py-24">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.55),transparent_28%),radial-gradient(ellipse_at_85%_15%,rgba(216,195,165,.18),transparent_42%)]" />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHead eyebrow="Insights and journal" title="Reading for *better decisions.*" />
              <Link href="/blog" className="border-b border-matte/30 pb-0.5 text-sm text-matte transition hover:border-beige hover:text-[#9c7f56]">View all articles</Link>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {posts.slice(0, 3).map((p, i) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className={`group relative flex h-full flex-col overflow-hidden border border-line/80 bg-white p-6 shadow-[0_10px_30px_rgba(17,17,17,.04)] transition duration-500 hover:-translate-y-1 hover:border-beige/50 hover:shadow-[0_18px_42px_rgba(17,17,17,.08)] ${i===0?"md:col-span-2 lg:col-span-1":""}`}>
                  <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-beige/70 via-beige/25 to-transparent opacity-70 transition duration-500 group-hover:opacity-100" />
                  <p className="text-[11px] uppercase tracking-[.22em] text-[#9c7f56]">{p.category}</p>
                  <p className="mt-3 font-serif text-2xl leading-tight text-matte">{p.title}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate">{p.summary}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-matte transition group-hover:text-[#9c7f56]">Read article <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
