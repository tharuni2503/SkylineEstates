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
 const stage = useRef<HTMLDivElement>(null); // tilts with the mouse
 const bg = useRef<HTMLDivElement>(null); // scroll dolly + rotation
 const glow = useRef<HTMLDivElement>(null); // warm light bloom (parallax layer)
 const fg = useRef<HTMLDivElement>(null);
 const mist = useRef<HTMLDivElement>(null);
 const line1 = useRef<HTMLSpanElement>(null);
 const line2 = useRef<HTMLSpanElement>(null);
 const sub = useRef<HTMLParagraphElement>(null);
 const ctas = useRef<HTMLDivElement>(null);
 const eyebrow = useRef<HTMLDivElement>(null);
 const reduce = useReducedMotion();

 /* Intro + scroll-driven 3D camera move */
 useCinematic(ref, ({ gsap }) => {
   // Start slightly pushed back, tilted like a drone shot
   gsap.set(bg.current, {
     scale: 1.12,
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
     { opacity: 0, scale: 1.22, filter: "blur(14px) brightness(1.4)" },
     { opacity: 1, scale: 1.12, filter: "blur(0px) brightness(1)", duration: 2.3, ease: "power2.out" },
     0
   )
     .fromTo(eyebrow.current, { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.25)
     .fromTo(
       [line1.current, line2.current],
       { yPercent: 118, opacity: 0 },
       { yPercent: 0, opacity: 1, duration: 1.25, stagger: 0.16 },
       0.4
     )
     .fromTo(sub.current, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.95 }, "-=0.5")
     .fromTo(ctas.current, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85 }, "-=0.55");

   // Scroll: camera dollies forward and over the roofline
   gsap
     .timeline({
       scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: 1.15 },
     })
     .to(
       bg.current,
       { scale: 1.3, yPercent: 8, rotationX: 14, rotationY: 4, z: 60, ease: "none", force3D: true },
       0
     )
     .to(glow.current, { scale: 1.5, opacity: 0.3, ease: "none" }, 0)
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
     gsap.set(stage.current, { transformPerspective: 1200, force3D: true });
     const rotY = gsap.quickTo(stage.current, "rotationY", { duration: 1.1, ease: "power3.out" });
     const rotX = gsap.quickTo(stage.current, "rotationX", { duration: 1.1, ease: "power3.out" });
     const glowX = gsap.quickTo(glow.current, "x", { duration: 1.4, ease: "power3.out" });
     const glowY = gsap.quickTo(glow.current, "y", { duration: 1.4, ease: "power3.out" });

     const onMove = (e: MouseEvent) => {
       const r = el.getBoundingClientRect();
       const nx = (e.clientX - r.left) / r.width - 0.5;
       const ny = (e.clientY - r.top) / r.height - 0.5;
       rotY(nx * 4.5);
       rotX(-ny * 3);
       glowX(nx * -42); // light drifts opposite = depth illusion
       glowY(ny * -30);
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
     className="grain relative h-[112svh] overflow-hidden bg-matte text-ivory md:h-[120svh]"
   >
     <div className="sticky top-0 h-[100svh] overflow-hidden [clip-path:inset(0)]">
       {/* 3D stage: mouse tilt wrapper (flattened so it can never paint outside the hero/clipped area) */}
       <div ref={stage} className="absolute inset-0 will-change-transform">
         {/* Layer 1: the film — local 1080p with a 720p lite variant; poster-first so it never flashes black */}
         <div ref={bg} className="absolute inset-[-6%] will-change-transform">
           {/* Cinematic colour grade on the footage itself: warm amber roll-off, cool shadows, gentle contrast */}
           <div className="absolute inset-0 [filter:contrast(1.08)_saturate(.94)_brightness(.74)_sepia(.16)_hue-rotate(-6deg)]">
             <AutoVideo
               src="/videos/hero.mp4"
               srcLite="/videos/hero-720.mp4"
               poster="/videos/hero-poster.jpg"
               priority
               loop
               rate={0.85}
             />
           </div>
           <div
             aria-hidden="true"
             className="absolute inset-0 mix-blend-soft-light bg-[linear-gradient(155deg,rgba(24,39,54,.45),rgba(64,42,18,.2))]"
           />
         </div>

         {/* Layer 2: warm light bloom that moves against the video for depth */}
         <div
           ref={glow}
           aria-hidden="true"
           className="pointer-events-none absolute inset-[-10%] mix-blend-screen will-change-transform
             bg-[radial-gradient(ellipse_at_62%_58%,rgba(255,196,120,.30),transparent_42%),radial-gradient(ellipse_at_38%_72%,rgba(80,210,230,.20),transparent_38%)]"
         />
       </div>

       {/* Grade: teal/orange cinematic tone */}
       <div
         className="absolute inset-0 mix-blend-soft-light bg-[linear-gradient(160deg,rgba(20,60,90,.5),rgba(255,150,70,.22))]"
         aria-hidden="true"
       />
       {/* Text legibility: directional sweep + centre-bottom pool for the copy, plus edge vignette */}
       <div className="absolute inset-0 bg-gradient-to-r from-matte/92 via-matte/50 to-matte/10" aria-hidden="true" />
       <div className="absolute inset-0 bg-gradient-to-t from-matte via-matte/35 to-transparent" aria-hidden="true" />
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_52%,rgba(17,17,17,.55)_100%)]" aria-hidden="true" />
       <div ref={mist} className="pointer-events-none absolute inset-0 bg-matte opacity-0" aria-hidden="true" />
       <div
         ref={fg}
         aria-hidden="true"
         className="pointer-events-none absolute inset-x-0 bottom-0 h-[45vh] bg-gradient-to-t from-matte/65 to-transparent"
       />

       {/* Letterbox bars for the widescreen film look */}
       <div className="pointer-events-none absolute inset-x-0 top-0 h-[4svh] bg-gradient-to-b from-black to-black/80" aria-hidden="true" />
       <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[5svh] bg-gradient-to-t from-black/70 to-transparent" aria-hidden="true" />
       <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-beige/35 to-transparent" aria-hidden="true" />

       <div className="hero-copy relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-[4.5rem] pt-28 md:px-8 md:pb-24">
         <div ref={eyebrow} className="mb-7 flex items-center gap-4">
           <span aria-hidden="true" className="h-px w-12 bg-gradient-to-r from-beige/20 via-beige/80 to-beige/20" />
           <p className="inline-flex items-center rounded-full border border-beige/25 bg-matte/20 px-3 py-1 text-[10px] font-medium tracking-[.42em] text-beige/95 backdrop-blur-sm sm:text-[11px]">SKYLINE ESTATES · HYDERABAD</p>
         </div>
         <h1 className="max-w-5xl font-serif text-[clamp(2.85rem,9.5vw,8.1rem)] leading-[0.93] tracking-[-0.025em] [text-shadow:0_14px_50px_rgba(0,0,0,.6)]">
           <span className="-mb-[.1em] block overflow-hidden pb-[.1em]">
             <span ref={line1} className={`block ${reduce ? "" : "will-change-transform"}`}>
               Homes of&nbsp;
             </span>
           </span>
           <span className="-mb-[.1em] block overflow-hidden pb-[.14em]">
             <span ref={line2} className={`text-sheen block ${reduce ? "" : "will-change-transform"}`}>
               Quiet Distinction.
             </span>
           </span>
         </h1>
         <div className="mt-6 flex items-start gap-4">
           <span aria-hidden="true" className="mt-2 hidden h-px w-14 shrink-0 bg-gradient-to-r from-beige/70 to-transparent sm:block" />
           <p ref={sub} className="max-w-xl text-[15px] leading-relaxed tracking-[.02em] text-ivory/90 sm:text-base">
             Curated residences across Hyderabad&rsquo;s finest addresses&mdash;thoughtfully presented to help you discover, compare, and plan your next move with clarity and confidence.
           </p>
         </div>
         <div ref={ctas} className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
           <Link
             href="/properties"
             className="group inline-flex w-full items-center justify-center gap-3 border border-beige/30 bg-beige px-8 py-4 text-center text-[11px] font-medium tracking-[.22em] text-matte shadow-[0_16px_40px_rgba(0,0,0,.38)] transition duration-500 hover:-translate-y-0.5 hover:bg-ivory hover:shadow-[0_20px_46px_rgba(0,0,0,.42)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:w-auto sm:px-10"
           >
             EXPLORE PROPERTIES <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1.5" />
           </Link>
           <Link
             href="/locations"
             className="group inline-flex w-full items-center justify-center gap-2 border border-ivory/35 bg-matte/20 px-7 py-4 text-[11px] font-medium tracking-[.22em] text-ivory backdrop-blur-sm transition duration-500 hover:-translate-y-0.5 hover:border-beige/40 hover:bg-ivory/10 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:w-auto"
           >
             BROWSE AREAS
           </Link>
         </div>
         <div className="mt-8 border-t border-ivory/10 pt-5 sm:mt-10">
           <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] uppercase tracking-[.24em] text-ivory/70">
             <span className="inline-flex items-center gap-2.5"><span className="h-1.5 w-1.5 rounded-full bg-beige shadow-[0_0_0_4px_rgba(216,195,165,.12)]" aria-hidden="true" />Curated sample listings</span>
             <span className="hidden h-3 w-px bg-ivory/15 sm:block" aria-hidden="true" />
             <span className="inline-flex items-center gap-2.5"><span className="h-1.5 w-1.5 rounded-full bg-beige shadow-[0_0_0_4px_rgba(216,195,165,.12)]" aria-hidden="true" />Compare &amp; shortlist</span>
             <span className="hidden h-3 w-px bg-ivory/15 sm:block" aria-hidden="true" />
             <span className="inline-flex items-center gap-2.5"><span className="h-1.5 w-1.5 rounded-full bg-beige shadow-[0_0_0_4px_rgba(216,195,165,.12)]" aria-hidden="true" />Demo experience</span>
           </div>
         </div>
         <div aria-hidden="true" className="mt-8 flex items-center gap-4 text-[10px] tracking-[.34em] text-ivory/55 md:mt-12">
           <span className="scroll-line h-7 w-px bg-gradient-to-b from-beige/90 to-transparent" /> SCROLL
         </div>
       </div>
     </div>
   </section>
 );
}
