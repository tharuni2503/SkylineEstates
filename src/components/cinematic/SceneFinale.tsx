"use client";
import { useRef } from "react";
import Link from "next/link";
import { useCinematic } from "./useCinematic";
import ScrollScrubVideo from "./ScrollScrubVideo";
import { cinematicMedia } from "@/lib/cinematicMedia";
export default function SceneFinale() {
  const ref = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);

  useCinematic(ref, ({ gsap }) => {
    // No pinning here — pin + multiple scrub triggers on the same element can break while scrolling.
    gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: "top 85%", end: "top 15%", scrub: 1, invalidateOnRefresh: true },
    })
      .fromTo(bg.current, { scale: 1.08, yPercent: 3 }, { scale: 1.02, yPercent: 0, ease: "none" }, 0)
      .fromTo(copy.current, { y: 22, opacity: 0 }, { y: 0, opacity: 1, ease: "none" }, 0);
  }, []);

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden bg-matte text-ivory">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-24 bg-gradient-to-b from-matte to-transparent" />
      <div ref={bg} className="absolute inset-[-8%] will-change-transform">
        <ScrollScrubVideo trigger={ref} {...cinematicMedia.finale} start="top bottom" end="bottom top" />
      </div>
      <div className="absolute inset-0 bg-matte/45" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-matte via-matte/22 to-matte/28" aria-hidden="true" />
      <div className="relative z-[1] flex min-h-[100svh] items-center justify-center text-center">
        <div ref={copy} className="max-w-4xl px-5">
          <p className="text-[11px] tracking-[.38em] text-beige/90">SKYLINE ESTATES</p>
          <h2 className="mt-4 font-serif text-[clamp(2.6rem,7vw,6.4rem)] leading-[1.0]">FIND YOUR <span className="text-gold">PERFECT SPACE.</span></h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-ivory/80 md:text-base">Explore properties that match your lifestyle and aspirations.</p>
          <Link href="/properties" className="mt-9 inline-flex items-center justify-center bg-beige px-10 py-4 text-[11px] font-medium tracking-[.22em] text-matte shadow-[0_10px_30px_rgba(17,17,17,.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-ivory">
            EXPLORE COLLECTION
          </Link>
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-24 bg-gradient-to-t from-matte to-transparent" />
    </section>
  );
}
