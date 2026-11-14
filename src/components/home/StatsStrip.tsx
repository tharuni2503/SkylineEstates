"use client";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { useReducedMotion } from "framer-motion";

/**
 * Counts up from 0 to value once the strip scrolls into view.
 * Deliberately timer-driven (not rAF): rAF never fires in unfocused or
 * backgrounded windows, which previously pinned the strip at "0" forever.
 * The final value is guaranteed to land even if observers and intervals stall.
 */
function Count({ value }: { value: number }) {
 const ref = useRef<HTMLSpanElement>(null);
 const reduce = useReducedMotion();
 // Render the meaningful target immediately (SSR/first paint) so stats never appear as "0".
 const [n, setN] = useState(value);
 const animated = useRef(false);

 useEffect(() => {
  if (reduce) { setN(value); animated.current = true; return; }
  if (animated.current) { setN(value); return; }
  const el = ref.current;
  const dur = 1100;
  let interval: number | undefined;
  let hard: number | undefined;
  let begin: number | undefined;
  let t0: number | null = null;
  let done = false;
  const startFrom = Math.max(0, Math.floor(value * 0.45));

  const finish = () => {
   if (done) return;
   done = true;
   animated.current = true;
   setN(value);
   if (interval) window.clearInterval(interval);
   if (hard) window.clearTimeout(hard);
  };
  const start = () => {
   if (t0 !== null || animated.current) return;
   setN(startFrom);
   t0 = performance.now();
   const tick = () => {
    const p = Math.min(1, (performance.now() - (t0 as number)) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    setN(Math.round(startFrom + eased * (value - startFrom)));
    if (p >= 1) finish();
   };
   tick();
   interval = window.setInterval(tick, 40);
   // Hard guarantee the strip lands on the real value even if intervals stall.
   hard = window.setTimeout(finish, dur + 200);
  };

  let io: IntersectionObserver | null = null;
  if (el && "IntersectionObserver" in window) {
   io = new IntersectionObserver((entries) => {
    if (entries.some(e => e.isIntersecting)) { start(); io?.disconnect(); }
   }, { rootMargin: "0px 0px -10% 0px", threshold: 0.01 });
   io.observe(el);
  } else {
   start();
  }
  // Begin anyway shortly after mount; the observer only makes it start earlier.
  begin = window.setTimeout(start, 1200);

  return () => {
   io?.disconnect();
   if (begin) window.clearTimeout(begin);
   // On unmount/cleanup ensure the meaningful value remains visible.
   if (!animated.current) setN(value);
   if (interval) window.clearInterval(interval);
   if (hard) window.clearTimeout(hard);
  };
 }, [value, reduce]);

 return <span ref={ref}>{n}</span>;
}

export default function StatsStrip(){
 const {properties}=useStore();
 const areas=new Set(properties.map(p=>p.location.split(",")[0].trim())).size;
 const verified=properties.filter(p=>p.verified).length;
 const rows:[number,string][]=[[properties.length,"Sample residences"],[areas,"Sample localities"],[verified,"Marked verified"],[6,"Services & tools"]];
 return <section aria-label="Skyline Estates in numbers" className="relative overflow-hidden border-y border-beige/10 bg-matte text-ivory">
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(216,195,165,.10),transparent_45%),radial-gradient(ellipse_at_80%_50%,rgba(201,166,107,.08),transparent_40%)]"/>
  <dl className="relative mx-auto grid max-w-7xl grid-cols-2 gap-px bg-ivory/10 md:grid-cols-4">{rows.map(([n,l])=><div key={l} className="group bg-matte px-4 py-8 text-center transition-colors duration-500 hover:bg-charcoal/60 sm:px-5 sm:py-9"><dt className="font-serif text-4xl tabular-nums text-beige md:text-5xl"><Count value={n}/></dt><dd className="mt-2 text-[10px] uppercase tracking-[.2em] text-ivory/70 sm:text-[11px] sm:tracking-[.22em]">{l}</dd></div>)}</dl>
 </section>;
}
