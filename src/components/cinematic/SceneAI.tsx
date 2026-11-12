"use client";
import { useRef } from "react";
import Link from "next/link";
import { Sparkles, TrendingUp, MapPin, Bot, ArrowRight } from "lucide-react";
import { useCinematic } from "./useCinematic";
import { canPin } from "@/lib/gsap";
import ScrollScrubVideo from "./ScrollScrubVideo";
import { cinematicMedia } from "@/lib/cinematicMedia";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/format";
function score(p: { price: number; areaSqft: number; location: string; verified?: boolean }) {
  let s = 62;
  if (p.verified) s += 8;
  if (/gachibowli|kokapet|financial|madhapur/i.test(p.location)) s += 14;
  if (p.areaSqft > 1500) s += 6;
  if (p.price > 0 && p.price / Math.max(p.areaSqft, 1) < 6500) s += 8;
  return Math.min(96, s);
}

export default function SceneAI() {
  const ref = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const { properties } = useStore();
  const recs = properties.filter(p => p.bhk === 3 && p.price < 12000000 && p.listing === "Buy").slice(0, 2);
  const top = [...properties].sort((a, b) => score(b) - score(a))[0] || properties[0];

  useCinematic(ref, ({ gsap }) => {
    const pin = canPin();
    gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: "top top", end: pin ? "+=170%" : "bottom top", pin, scrub: 1.05, anticipatePin: pin ? 1 : 0 },
    })
      .fromTo(bg.current, { scale: 1.08, filter: "brightness(0.48) saturate(0.92)" }, { scale: 1.22, filter: "brightness(0.38) saturate(1.02)", ease: "none" }, 0)
      .fromTo(grid.current, { opacity: 0.1, yPercent: 4 }, { opacity: 0.24, yPercent: -4, ease: "none" }, 0)
      .fromTo(".ai-head", { y: 30, opacity: 0 }, { y: 0, opacity: 1, ease: "none" }, 0.06)
      .to(".ai-head", { y: -14, opacity: 0.9, ease: "none" }, 0.75)
      .fromTo(".ai-card", { y: 56, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.045, ease: "none" }, 0.18);
  }, [recs.length, top?.id]);

  return (
    <section ref={ref} className="relative h-[100svh] overflow-hidden bg-matte text-ivory">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-24 bg-gradient-to-b from-matte to-transparent" />
      <div ref={bg} className="absolute inset-[-10%] will-change-transform">
        <ScrollScrubVideo trigger={ref} {...cinematicMedia.ai} start="top top" end={canPin() ? "+=170%" : "bottom top"} />
      </div>
      <div ref={grid} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(216,195,165,.10)_1px,transparent_1px),linear-gradient(90deg,rgba(216,195,165,.10)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-matte/74 via-matte/60 to-matte/82" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(216,195,165,.08),transparent_45%)]" aria-hidden="true" />
      <div className="relative z-[1] mx-auto flex h-full max-w-7xl flex-col justify-center px-5 py-16 md:px-8">
        <div className="ai-head max-w-3xl">
          <p className="text-[11px] tracking-[.38em] text-beige/80">INTELLIGENT DISCOVERY</p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4.6vw,4.3rem)] leading-[1.03]">Intelligence, <span className="text-gold">quietly precise.</span></h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ivory/74 md:text-base">Recommendations, insights, and investment signals — presented with the same care as the architecture itself.</p>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
          <div className="ai-card border border-ivory/12 bg-matte/55 p-5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-beige"><Sparkles size={16}/><span className="text-xs tracking-[.2em]">AI PROPERTY RECOMMENDATIONS</span></div>
            <p className="mt-3 text-sm text-ivory/70">Matched to budget, BHK, and corridor preference (rule-based on live listings).</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {recs.map(p => (
                <Link key={p.id} href={`/property/${p.id}`} className="border border-ivory/10 bg-ivory/5 p-4 transition hover:border-beige/40">
                  <p className="font-serif text-lg leading-tight">{p.title}</p>
                  <p className="mt-1 text-xs text-ivory/60">{p.location.split(",")[0]} · {p.bhk} BHK</p>
                  <p className="mt-2 text-sm text-beige">{inr(p.price)}</p>
                </Link>
              ))}
              {recs.length === 0 && <p className="text-sm text-ivory/60">Explore all listings for tailored matches.</p>}
            </div>
          </div>
          <div className="grid gap-4">
            <div className="ai-card border border-ivory/12 bg-matte/55 p-5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-beige"><TrendingUp size={16}/><span className="text-xs tracking-[.2em]">AI PROPERTY INSIGHTS</span></div>
              {top && <div className="mt-3">
                <p className="font-serif text-xl">{top.title}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-ivory/60"><MapPin size={13}/>{top.location}</p>
                <div className="mt-4 flex items-end justify-between border-t border-ivory/10 pt-3">
                  <div><p className="text-[11px] tracking-[.2em] text-ivory/50">INVESTMENT SCORE</p><p className="mt-1 font-serif text-4xl text-gold">{score(top)}<span className="text-base text-ivory/45">/100</span></p></div>
                  <div className="text-right text-xs text-ivory/65"><p>Demand &amp; location signals</p><p>Price-per-sq-ft context</p><p>Verification confidence</p></div>
                </div>
              </div>}
            </div>
            <div className="ai-card flex items-center justify-between gap-4 border border-beige/25 bg-beige/10 p-5">
              <div><div className="flex items-center gap-2 text-beige"><Bot size={16}/><span className="text-xs tracking-[.2em]">AI REAL ESTATE ASSISTANT</span></div><p className="mt-2 text-sm text-ivory/78">Ask for homes by budget, BHK, or neighbourhood.</p></div>
              <Link href="/ai-assistant" className="inline-flex shrink-0 items-center gap-2 border border-beige px-4 py-3 text-xs tracking-[.14em] text-beige transition hover:bg-beige hover:text-matte">OPEN <ArrowRight size={14}/></Link>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-24 bg-gradient-to-t from-matte to-transparent" />
    </section>
  );
}
