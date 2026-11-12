"use client";
import { useRef } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useCinematic } from "./useCinematic";
import { canPin } from "@/lib/gsap";
import ScrollScrubVideo from "./ScrollScrubVideo";
import { cinematicMedia } from "@/lib/cinematicMedia";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/format";

export default function SceneProperties() {
  const ref = useRef<HTMLElement>(null);
  const bgA = useRef<HTMLDivElement>(null);
  const bgB = useRef<HTMLDivElement>(null);
  const bgC = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const { properties, wishlist, toggleWish } = useStore();
  const featured = properties.filter((p) => p.featured).slice(0, 3);

  useCinematic(ref, ({ gsap }) => {
    const pin = canPin();
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: "top top", end: pin ? "+=180%" : "bottom top", pin, scrub: true, anticipatePin: pin ? 1 : 0 },
    });
    tl.fromTo(bgA.current, { scale: 1.08, opacity: 1, filter: "brightness(0.88)" }, { scale: 1.22, xPercent: -2, filter: "brightness(1.04)", ease: "none" }, 0)
      .fromTo(bgB.current, { opacity: 0.05 }, { opacity: 0.35, ease: "none" }, 0.1)
      .to(bgB.current, { opacity: 0.08, ease: "none" }, 0.6)
      .fromTo(bgC.current, { opacity: 0 }, { opacity: 0.22, yPercent: -3, ease: "none" }, 0.45)
      .fromTo(head.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: "none" }, 0.06)
      .to(head.current, { y: -30, opacity: 0.08, ease: "none" }, 0.62)
      .fromTo(cards.current?.children || [], { y: 90, opacity: 0, rotateX: -8 }, { y: 0, opacity: 1, rotateX: 0, stagger: 0.06, ease: "none" }, 0.22);
  }, [featured.length]);

  return (
    <section ref={ref} className="relative h-[100svh] overflow-hidden bg-matte text-ivory [perspective:1200px]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-24 bg-gradient-to-b from-matte to-transparent" />
      <div ref={bgA} className="absolute inset-[-8%] will-change-transform">
        <ScrollScrubVideo trigger={ref} {...cinematicMedia.properties} start="top top" end={canPin() ? "+=180%" : "bottom top"} />
      </div>
      <div ref={bgB} className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(216,195,165,.18),transparent_55%)]" aria-hidden="true" />
      <div ref={bgC} className="absolute inset-0 bg-gradient-to-tr from-matte/10 via-transparent to-matte/40" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-matte via-matte/68 to-matte/42" aria-hidden="true" />
      <div className="relative z-[1] mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-10 pt-20 md:px-8 md:pb-14">
        <div ref={head} className="mb-6 max-w-3xl">
          <p className="text-[11px] tracking-[.38em] text-beige/80">EXCEPTIONAL PROPERTIES</p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4.6vw,4.4rem)] leading-[1.03]">Interiors with presence. <span className="text-gold">Addresses with stature.</span></h2>
        </div>
        <div ref={cards} className="grid gap-4 md:grid-cols-3">
          {featured.map((p) => {
            const saved = wishlist.includes(p.id);
            return (
              <article key={p.id} className="group relative overflow-hidden border border-ivory/12 bg-matte/60 backdrop-blur-sm shadow-[0_16px_40px_rgba(17,17,17,.25)]">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img src={p.image} alt={p.title} loading="lazy" onError={(e)=>{const t=e.currentTarget;if(t.dataset.fallback)return;t.dataset.fallback="1";t.src="/images/hero-3d.jpg";}} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-matte/75 via-matte/10 to-transparent" />
                  <button aria-pressed={saved} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"} onClick={() => toggleWish(p.id)} className="absolute right-3 top-3 rounded-full bg-ivory/92 p-2 text-matte transition hover:bg-white"><Heart size={16} className={saved ? "fill-matte" : ""} /></button>
                </div>
                <div className="p-4 md:p-5">
                  <p className="text-[10px] uppercase tracking-[.24em] text-beige/90">{p.category} · {p.location.split(",")[0]}</p>
                  <h3 className="mt-1.5 font-serif text-xl leading-tight md:text-2xl">{p.title}</h3>
                  <p className="mt-1.5 text-sm text-ivory/72">{inr(p.price)}{p.listing === "Rent" ? " /mo" : ""} · {p.bhk ? `${p.bhk} BHK · ` : ""}{p.areaSqft.toLocaleString("en-IN")} sq ft</p>
                  <Link href={`/property/${p.id}`} className="mt-3 inline-block text-sm text-beige underline decoration-beige/40 underline-offset-4 transition hover:decoration-beige">View property</Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-24 bg-gradient-to-t from-matte to-transparent" />
    </section>
  );
}
