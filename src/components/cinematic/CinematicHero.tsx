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
               src="/videos/hero_background_clean.mp4"
               poster="/videos/hero-background-poster.jpg"
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

       <div className="hero-copy relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-6 pt-16 sm:pb-8 sm:pt-20 md:px-8 md:pb-10 lg:pb-14">
         <div ref={eyebrow} className="hero-eyebrow mb-3 flex items-center gap-4 sm:mb-4 md:mb-5">
           <span aria-hidden="true" className="h-px w-12 bg-gradient-to-r from-beige/10 via-beige/80 to-beige/10" />
           <p className="inline-flex items-center gap-2 rounded-full border border-beige/30 bg-matte/25 px-3.5 py-1.5 text-[10px] font-medium tracking-[.4em] text-beige/95 shadow-[0_8px_24px_rgba(0,0,0,.18)] backdrop-blur-md sm:text-[11px]">
             <span className="h-1.5 w-1.5 rounded-full bg-gold/90" aria-hidden="true" />SKYLINE ESTATES · HYDERABAD
           </p>
         </div>
         <h1 className="hero-title max-w-5xl font-serif leading-[0.94] tracking-[-0.028em] [text-shadow:0_18px_60px_rgba(0,0,0,.62)]">
           <span className="-mb-[.1em] block overflow-hidden pb-[.1em]">
             <span ref={line1} className={`block ${reduce ? "" : "will-change-transform"}`}>
               Homes of&nbsp;
             </span>
           </span>
           <span className="-mb-[.1em] block overflow-hidden pb-[.14em]">
             <span ref={line2} className={`text-sheen block bg-gradient-to-r from-ivory via-beige to-ivory bg-clip-text text-transparent ${reduce ? "" : "will-change-transform"}`}>
               Quiet Distinction.
             </span>
           </span>
         </h1>
         <div className="mt-4 flex items-start gap-4 sm:mt-5 md:mt-6">
           <span aria-hidden="true" className="mt-2.5 hidden h-px w-16 shrink-0 bg-gradient-to-r from-beige/80 via-beige/40 to-transparent sm:block" />
           <div>
             <p ref={sub} className="hero-sub max-w-xl text-[14px] leading-relaxed tracking-[.02em] text-ivory/92 sm:text-[15px] md:text-[1.02rem]">
               Curated residences across Hyderabad&rsquo;s finest addresses&mdash;thoughtfully presented to help you discover, compare, and plan your next move with clarity and confidence.
             </p>
             <p className="hero-subnote mt-2 text-[11px] uppercase tracking-[.28em] text-beige/75 sm:mt-3">A refined, frontend demonstration experience</p>
           </div>
         </div>
         <div ref={ctas} className="hero-ctas mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
           <Link
             href="/properties"
             className="group inline-flex w-full items-center justify-center gap-3 border border-beige/40 bg-beige px-8 py-3.5 text-center text-[11px] font-medium tracking-[.24em] text-matte sm:py-4 shadow-[0_18px_44px_rgba(0,0,0,.4)] transition duration-500 hover:-translate-y-0.5 hover:bg-ivory hover:shadow-[0_22px_52px_rgba(0,0,0,.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:w-auto sm:px-10"
           >
             EXPLORE PROPERTIES <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1.5" />
           </Link>
           <Link
             href="/locations"
             className="group inline-flex w-full items-center justify-center gap-2 border border-ivory/30 bg-matte/25 px-7 py-3.5 text-[11px] font-medium tracking-[.22em] text-ivory sm:py-4 backdrop-blur-md transition duration-500 hover:-translate-y-0.5 hover:border-beige/45 hover:bg-ivory/10 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:w-auto"
           >
             BROWSE AREAS
           </Link>
           <Link
             href="/ai-assistant"
             className="group inline-flex w-full items-center justify-center gap-2 px-2 py-3 text-[11px] font-medium tracking-[.2em] text-ivory/80 transition duration-300 hover:text-beige sm:w-auto sm:px-4"
           >
             ASK AI ASSISTANT <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
           </Link>
         </div>
         <div className="hero-meta mt-6 border-t border-ivory/15 pt-4 sm:mt-8 sm:pt-5">
           <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
             <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] uppercase tracking-[.24em] text-ivory/70">
               <span className="inline-flex items-center gap-2.5"><span className="h-1.5 w-1.5 rounded-full bg-beige shadow-[0_0_0_4px_rgba(216,195,165,.14)]" aria-hidden="true" />Curated sample listings</span>
               <span className="hidden h-3 w-px bg-ivory/15 sm:block" aria-hidden="true" />
               <span className="inline-flex items-center gap-2.5"><span className="h-1.5 w-1.5 rounded-full bg-beige shadow-[0_0_0_4px_rgba(216,195,165,.14)]" aria-hidden="true" />Compare &amp; shortlist</span>
               <span className="hidden h-3 w-px bg-ivory/15 sm:block" aria-hidden="true" />
               <span className="inline-flex items-center gap-2.5"><span className="h-1.5 w-1.5 rounded-full bg-beige shadow-[0_0_0_4px_rgba(216,195,165,.14)]" aria-hidden="true" />Plan visits with clarity</span>
             </div>
             <div className="flex items-center gap-3 text-[10px] uppercase tracking-[.28em] text-ivory/55">
               <span aria-hidden="true" className="hidden h-px w-10 bg-gradient-to-r from-transparent to-beige/40 sm:block" />
               Private residences · Prime localities
             </div>
           </div>
         </div>
         <div aria-hidden="true" className="hero-scroll mt-6 flex items-center gap-4 text-[10px] tracking-[.34em] text-ivory/55 md:mt-8">
           <span className="scroll-line h-7 w-px bg-gradient-to-b from-beige/90 to-transparent" /> SCROLL
         </div>
       </div>
     </div>
   </section>
 );
}
