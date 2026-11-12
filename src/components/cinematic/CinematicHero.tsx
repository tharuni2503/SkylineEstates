"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCinematic } from "./useCinematic";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Hero media. GIF/video-like assets use a plain <img> so animation/frames render reliably.
 */
const HERO_IMAGE = "/images/luxurious-house-night-hero.jpg";
const EASE = "power3.out";

export default function CinematicHero() {
  const ref = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null); // tilts with the mouse
  const bg = useRef<HTMLDivElement>(null); // scroll dolly + rotation
  const glow = useRef<HTMLDivElement>(null); // warm light bloom (parallax layer)
  const fg = useRef<HTMLDivElement>(null);
  const mist = useRef<HTMLDivElement>(null);
  const line1 = useRef<HTMLSpanElement>(null);
  const line2 = useRef<HTMLSpanElement>(null);
  const sub = useRef<HTMLParagraphElement>(null);
  const ctas = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  /* Intro + scroll-driven 3D camera move */
  useCinematic(ref, ({ gsap }) => {
    // Start slightly pushed back, tilted like a drone shot
    gsap.set(bg.current, {
      scale: 1.08,
      rotationX: 6,
      rotationY: -3,
      z: -120,
      transformPerspective: 1400,
      transformOrigin: "50% 60%",
      force3D: true,
    });

    const tl = gsap.timeline({ defaults: { ease: EASE } });
    tl.fromTo(
      bg.current,
      { opacity: 0, scale: 1.18, filter: "blur(12px)" },
      { opacity: 1, scale: 1.08, filter: "blur(0px)", duration: 2.2, ease: "power2.out" },
      0
    )
      .fromTo(
        [line1.current, line2.current],
        { yPercent: 115, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.15, stagger: 0.14 },
        0.5
      )
      .fromTo(sub.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.45")
      .fromTo(ctas.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.55");

    // Scroll: camera dollies forward and over the roofline
    gsap
      .timeline({
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: 1.15 },
      })
      .to(
        bg.current,
        { scale: 1.28, yPercent: 8, rotationX: 14, rotationY: 4, z: 60, ease: "none", force3D: true },
        0
      )
      .to(glow.current, { scale: 1.5, opacity: 0.25, ease: "none" }, 0)
      .to(fg.current, { yPercent: -18, ease: "none" }, 0)
      .to(mist.current, { opacity: 0.92, ease: "none" }, 0)
      .to(".hero-copy", { yPercent: -22, opacity: 0, ease: "none" }, 0);
  }, []);

  /* Mouse-driven parallax tilt (desktop only, skipped for reduced motion) */
  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover)").matches) return;

    let cleanup = () => {};
    let cancelled = false;

    import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      // Self-contained perspective = real 3D tilt while staying flattened (clip-safe)
      gsap.set(stage.current, { transformPerspective: 1200, force3D: true });
      const rotY = gsap.quickTo(stage.current, "rotationY", { duration: 1.1, ease: "power3.out" });
      const rotX = gsap.quickTo(stage.current, "rotationX", { duration: 1.1, ease: "power3.out" });
      const glowX = gsap.quickTo(glow.current, "x", { duration: 1.4, ease: "power3.out" });
      const glowY = gsap.quickTo(glow.current, "y", { duration: 1.4, ease: "power3.out" });

      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        rotY(nx * 5);
        rotX(-ny * 3.5);
        glowX(nx * -40); // light drifts opposite = depth illusion
        glowY(ny * -28);
      };
      const onLeave = () => {
        rotY(0);
        rotX(0);
        glowX(0);
        glowY(0);
      };

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      cleanup = () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [reduce]);

  return (
    <section
      ref={ref}
      aria-label="Skyline Estates cinematic introduction"
      className="grain relative h-[120svh] overflow-hidden bg-matte text-ivory"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden [clip-path:inset(0)]">
        {/* 3D stage: mouse tilt wrapper (flattened so it can never paint outside the hero/clipped area) */}
        <div ref={stage} className="absolute inset-0 will-change-transform">
          {/* Layer 1: the villa photo, scroll dolly */}
          <div ref={bg} className="absolute inset-[-6%] will-change-transform">
            <img
              src={HERO_IMAGE}
              alt="Luxurious house at night"
              className="absolute inset-0 h-full w-full object-cover object-center [filter:contrast(1.08)_saturate(1.12)_brightness(.92)]"
              decoding="async"
              fetchPriority="high"
            />
          </div>

          {/* Layer 2: warm light bloom that moves against the photo for depth */}
          <div
            ref={glow}
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-10%] mix-blend-screen will-change-transform
              bg-[radial-gradient(ellipse_at_62%_58%,rgba(255,196,120,.30),transparent_42%),radial-gradient(ellipse_at_38%_72%,rgba(80,210,230,.22),transparent_38%)]"
          />
        </div>

        {/* Grade: teal/orange cinematic tone */}
        <div
          className="absolute inset-0 mix-blend-soft-light bg-[linear-gradient(160deg,rgba(20,60,90,.55),rgba(255,150,70,.25))]"
          aria-hidden="true"
        />
        {/* Text legibility + vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-matte/85 via-matte/30 to-matte/10" aria-hidden="true" />
        <div ref={mist} className="pointer-events-none absolute inset-0 bg-matte opacity-0" aria-hidden="true" />
        <div
          ref={fg}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[45vh] bg-gradient-to-t from-matte/60 to-transparent"
        />

        {/* Letterbox bars for the widescreen film look */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[4svh] bg-black" aria-hidden="true" />
        {/* bottom letterbox removed: eliminating the dead space at the hero's base */}

        <div className="hero-copy relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-20 pt-28 md:px-8 md:pb-28">
          <p className="mb-6 text-[11px] font-medium tracking-[.46em] text-beige/90">SKYLINE ESTATES</p>
          <h1 className="font-serif text-[clamp(3rem,9vw,8rem)] leading-[0.94] tracking-[-0.02em] [text-shadow:0_8px_40px_rgba(0,0,0,.45)]">
            <span className="-mb-[.1em] block overflow-hidden pb-[.1em]">
              <span ref={line1} className={`block ${reduce ? "" : "will-change-transform"}`}>
                Homes of&nbsp;
              </span>
            </span>
            <span className="-mb-[.1em] block overflow-hidden pb-[.1em]">
              <span ref={line2} className={`block text-gold ${reduce ? "" : "will-change-transform"}`}>
                Quiet Distinction.
              </span>
            </span>
          </h1>
          <p ref={sub} className="mt-6 max-w-md text-sm tracking-[.04em] text-ivory/80 md:text-[15px]">
            Curated residences across Hyderabad&rsquo;s finest addresses.
          </p>
          <div ref={ctas} className="mt-10">
            <Link
              href="/properties"
              className="group inline-flex w-full items-center justify-center gap-3 bg-beige px-8 py-4 text-center text-[11px] font-medium tracking-[.2em] text-matte shadow-[0_10px_30px_rgba(17,17,17,.22)] transition duration-500 hover:-translate-y-0.5 hover:bg-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:w-auto sm:px-9 sm:tracking-[.24em]"
            >
              EXPLORE PROPERTIES <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </div>
          <div aria-hidden="true" className="mt-14 flex items-center gap-4 text-[10px] tracking-[.34em] text-ivory/45">
            <span className="h-px w-10 bg-beige/40" /> SCROLL
          </div>
        </div>
      </div>
    </section>
  );
}
