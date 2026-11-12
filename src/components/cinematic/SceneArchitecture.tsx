"use client";
import { useRef } from "react";
import { useCinematic } from "./useCinematic";
import ScrollScrubVideo from "./ScrollScrubVideo";
import { canPin } from "@/lib/gsap";
import { cinematicMedia } from "@/lib/cinematicMedia";

export default function SceneArchitecture() {
  const ref = useRef<HTMLElement>(null);
  const layerBack = useRef<HTMLDivElement>(null);
  const sheen = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const meta = useRef<HTMLDivElement>(null);

  useCinematic(ref, ({ gsap }) => {
    const pin = canPin();
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: "top top", end: pin ? "+=150%" : "bottom top", pin, scrub: 0.8, anticipatePin: pin ? 1 : 0 },
    });
    tl.fromTo(layerBack.current, { scale: 1.08, xPercent: 0, filter: "brightness(0.92) contrast(1.02)" }, { scale: 1.2, xPercent: -2.5, filter: "brightness(1.02) contrast(1.06)", ease: "none" }, 0)
      .fromTo(sheen.current, { opacity: 0.15, yPercent: 6 }, { opacity: 0.45, yPercent: -8, ease: "none" }, 0)
      .fromTo(copy.current, { y: 36, opacity: 0 }, { y: 0, opacity: 1, ease: "none" }, 0.06)
      .to(copy.current, { y: -24, opacity: 0.12, ease: "none" }, 0.7)
      .fromTo(meta.current, { y: 28, opacity: 0 }, { y: 0, opacity: 1, ease: "none" }, 0.22);
  }, []);

  return (
    <section ref={ref} className="relative h-[100svh] overflow-hidden bg-matte text-ivory">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-28 bg-gradient-to-b from-matte to-transparent" />
      <div ref={layerBack} className="absolute inset-[-10%] will-change-transform">
        <ScrollScrubVideo trigger={ref} {...cinematicMedia.architecture} start="top top" end={canPin() ? "+=150%" : "bottom top"} />
      </div>
      <div ref={sheen} aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(216,195,165,.16),transparent_50%)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-matte/78 via-matte/38 to-matte/55" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-matte/70 via-transparent to-matte/25" aria-hidden="true" />
      <div className="relative z-[1] flex h-full items-end">
        <div className="mx-auto grid w-full max-w-7xl items-end gap-8 px-5 pb-14 md:grid-cols-[1.15fr_.85fr] md:pb-20 md:px-8">
          <div ref={copy} className="max-w-2xl">
            <p className="text-[11px] tracking-[.38em] text-beige/80">ARCHITECTURE &amp; DESIGN</p>
            <h2 className="mt-4 font-serif text-[clamp(2.2rem,5.4vw,5rem)] leading-[1.02]">Design revealed in <span className="text-gold">motion.</span></h2>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ivory/78 md:text-base">Move through facades, frames, and materials. The camera follows your scroll — revealing craft, depth, and intent with every movement.</p>
          </div>
          <div ref={meta} className="border-t border-beige/25 pt-5 text-sm text-ivory/70 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <p className="font-serif text-2xl text-ivory">Crafted perspective</p>
            <p className="mt-2 max-w-sm">Light, proportion, and atmosphere respond continuously as you move through the scene.</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-24 bg-gradient-to-t from-matte to-transparent" />
    </section>
  );
}
