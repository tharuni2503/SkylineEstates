"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCinematic } from "./useCinematic";
import { useReducedMotion } from "@/lib/useReducedMotion";
import AutoVideo from "@/components/common/AutoVideo";

const EASE = "power3.out";

export default function CinematicHero() {
  const ref = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const eyebrow = useRef<HTMLParagraphElement>(null);
  const line1 = useRef<HTMLSpanElement>(null);
  const line2 = useRef<HTMLSpanElement>(null);
  const sub = useRef<HTMLParagraphElement>(null);
  const ctas = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useCinematic(ref, ({ gsap }) => {
    gsap.set(bg.current, { scale: 1.08, transformOrigin: "50% 50%", force3D: true });
    const tl = gsap.timeline({ defaults: { ease: EASE } });
    tl.fromTo(bg.current, { opacity: 0, scale: 1.14 }, { opacity: 1, scale: 1.08, duration: 2.1, ease: "power2.out" }, 0)
      .fromTo(overlay.current, { opacity: 0.2 }, { opacity: 1, duration: 1.6, ease: "power1.out" }, 0)
      .fromTo(eyebrow.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 0.25)
      .fromTo([line1.current, line2.current], { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.15, stagger: 0.14 }, 0.35)
      .fromTo(sub.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.45")
      .fromTo(ctas.current, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.5");

    gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: 1.1 } })
      .to(bg.current, { scale: 1.18, yPercent: 6, ease: "none" }, 0)
      .to(".hero-copy", { yPercent: -16, opacity: 0.12, ease: "none" }, 0);
  }, []);

  /* Gentle mouse drift on desktop */
  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover)").matches) return;
    let cleanup = () => {};
    let cancelled = false;
    import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      const x = gsap.quickTo(bg.current, "xPercent", { duration: 1.4, ease: "power3.out" });
      const y = gsap.quickTo(bg.current, "yPercent", { duration: 1.4, ease: "power3.out" });
      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        x(((e.clientX - r.left) / r.width - 0.5) * -2.5);
        y(((e.clientY - r.top) / r.height - 0.5) * -2.5);
      };
      const onLeave = () => { x(0); y(0); };
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      cleanup = () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
    });
    return () => { cancelled = true; cleanup(); };
  }, [reduce]);

  return (
    <section
      ref={ref}
      aria-label="Skyline Estates hero"
      className="relative h-[100svh] min-h-[620px] overflow-hidden bg-matte text-ivory"
    >
      {/* Full-screen background video */}
      <div ref={bg} className="absolute inset-0 will-change-transform">
        <div className="absolute inset-0">
          <AutoVideo
            src="/videos/hero.mp4"
            srcLite="/videos/hero-720.mp4"
            poster="/videos/hero-poster.jpg"
            priority
            loop
            rate={1}
          />
        </div>
      </div>

      {/* Overlay for readability while preserving video quality */}
      <div ref={overlay} aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,.28)_100%)]" />
      </div>

      {/* Hero content */}
      <div className="hero-copy relative z-10 mx-auto flex h-full max-w-7xl flex-col items-start justify-center px-5 text-left md:px-8 lg:px-10">
        <p ref={eyebrow} className="hero-eyebrow inline-flex items-center gap-2 rounded-full border border-ivory/25 bg-black/20 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[.34em] text-ivory/90 backdrop-blur-sm sm:text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full bg-beige" aria-hidden="true" /> Skyline Estates · Hyderabad
        </p>

        <h1 className="hero-title mt-5 max-w-4xl font-serif leading-[0.98] tracking-[-0.02em] text-ivory [text-shadow:0_12px_40px_rgba(0,0,0,.45)] sm:mt-6">
          <span className="block overflow-hidden pb-[.08em]">
            <span ref={line1} className={`block ${reduce ? "" : "will-change-transform"}`}>Homes of</span>
          </span>
          <span className="block overflow-hidden pb-[.08em]">
            <span ref={line2} className={`block text-beige ${reduce ? "" : "will-change-transform"}`}>Quiet Distinction</span>
          </span>
        </h1>

        <p ref={sub} className="hero-sub mt-5 max-w-2xl text-[15px] leading-relaxed text-ivory/88 sm:text-base md:text-lg">
          Curated residences across Hyderabad&rsquo;s finest addresses — discover, compare, and plan your next move with clarity.
        </p>

        <div ref={ctas} className="hero-ctas mt-8 flex flex-col items-stretch gap-3 sm:mt-9 sm:flex-row sm:items-center">
          <Link
            href="/properties"
            className="group inline-flex min-w-[12.5rem] items-center justify-center gap-2.5 border border-beige/40 bg-beige px-7 py-3.5 text-[11px] font-medium uppercase tracking-[.22em] text-matte shadow-[0_14px_34px_rgba(0,0,0,.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-ivory"
          >
            Explore Properties <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/contact?visit=1"
            className="inline-flex min-w-[12.5rem] items-center justify-center gap-2 border border-ivory/45 bg-black/20 px-7 py-3.5 text-[11px] font-medium uppercase tracking-[.22em] text-ivory backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-beige/50 hover:bg-white/10"
          >
            Book a Visit
          </Link>
        </div>

        <p className="hero-subnote mt-5 text-[10px] uppercase tracking-[.26em] text-ivory/70 sm:mt-6">A refined frontend demonstration experience</p>
      </div>

      <div aria-hidden="true" className="hero-scroll pointer-events-none absolute bottom-6 left-5 z-10 flex flex-col items-start gap-2 text-[10px] uppercase tracking-[.3em] text-ivory/60 md:left-8 lg:left-10">
        <span>Scroll</span>
        <span className="scroll-line h-8 w-px bg-gradient-to-b from-ivory/70 to-transparent" />
      </div>
    </section>
  );
}
