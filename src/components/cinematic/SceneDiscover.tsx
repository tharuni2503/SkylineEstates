"use client";
import { useRef } from "react";
import { useCinematic } from "./useCinematic";
import { canPin } from "@/lib/gsap";
import ScrollScrubVideo from "./ScrollScrubVideo";
import { cinematicMedia } from "@/lib/cinematicMedia";

export default function SceneDiscover() {
  const ref = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const fg = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);

  useCinematic(ref, ({ gsap }) => {
    const pin = canPin();
    gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: "top top", end: pin ? "+=170%" : "bottom top", pin, scrub: 1.1, anticipatePin: pin ? 1 : 0 },
    })
      .fromTo(bg.current, { scale: 1.06, yPercent: 3, filter: "brightness(0.9) saturate(1)" }, { scale: 1.26, yPercent: -8, filter: "brightness(1.05) saturate(1.08)", ease: "none" }, 0)
      .fromTo(fg.current, { yPercent: 10, opacity: 0.3 }, { yPercent: -12, opacity: 0.55, ease: "none" }, 0)
      .fromTo(copy.current, { yPercent: 16, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "none" }, 0.1)
      .to(copy.current, { yPercent: -12, opacity: 0, ease: "none" }, 0.74)
      .fromTo(line.current, { scaleX: 0 }, { scaleX: 1, transformOrigin: "left center", ease: "none" }, 0.18);
  }, []);

  return (
    <section id="scene-discover" ref={ref} className="relative h-[100svh] overflow-hidden bg-matte text-ivory">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-24 bg-gradient-to-b from-matte to-transparent" />
      <div ref={bg} className="absolute inset-[-10%] will-change-transform">
        <ScrollScrubVideo trigger={ref} {...cinematicMedia.discover} priority start="top top" end={canPin() ? "+=170%" : "bottom top"} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-matte/55 via-matte/28 to-matte/72" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-matte/38 via-transparent to-matte/18" aria-hidden="true" />
      <div ref={fg} aria-hidden="true" className="pointer-events-none absolute inset-x-[-5%] bottom-[-10%] h-[55%] bg-[radial-gradient(ellipse_at_center,rgba(216,195,165,.16),transparent_65%)] blur-2xl will-change-transform" />
      <div className="relative z-[1] flex h-full items-end">
        <div ref={copy} className="mx-auto w-full max-w-7xl px-5 pb-16 md:px-8 md:pb-24">
          <p className="text-[11px] tracking-[.38em] text-beige/80">DISCOVER LUXURY</p>
          <h2 className="mt-4 max-w-4xl font-serif text-[clamp(2.4rem,6vw,5.6rem)] leading-[1.01]">Architecture that feels <span className="text-gold">inevitable.</span></h2>
          <div ref={line} className="mt-6 h-px w-28 bg-beige/70" />
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ivory/76 md:text-base">Step into residences shaped by light, proportion, and craft — where every arrival becomes a quiet moment of belonging.</p>
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-24 bg-gradient-to-t from-matte to-transparent" />
    </section>
  );
}
