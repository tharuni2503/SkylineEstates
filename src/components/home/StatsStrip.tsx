"use client";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { useInView, useReducedMotion } from "framer-motion";

function Count({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setN(value); return; }
    const dur = 900; const t0 = performance.now(); let raf = 0;
    const tick = (t: number) => { const p = Math.min(1, (t - t0) / dur); const eased = 1 - Math.pow(1 - p, 3); setN(Math.round(eased * value)); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);
  return <span ref={ref}>{n}</span>;
}

export default function StatsStrip(){
 const {properties}=useStore();
 const areas=new Set(properties.map(p=>p.location.split(",")[0])).size;
 const rows:[number,string][]=[[properties.length,"Residences listed"],[areas,"Hyderabad localities"],[properties.filter(p=>p.verified).length,"Verified listings"],[6,"Services under one roof"]];
 return <section aria-label="Skyline Estates in numbers" className="relative overflow-hidden border-y border-beige/10 bg-matte text-ivory">
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(216,195,165,.10),transparent_45%),radial-gradient(ellipse_at_80%_50%,rgba(201,166,107,.08),transparent_40%)]"/>
  <dl className="relative mx-auto grid max-w-7xl grid-cols-2 gap-px bg-ivory/10 md:grid-cols-4">{rows.map(([n,l])=><div key={l} className="group bg-matte px-5 py-9 text-center transition-colors duration-500 hover:bg-charcoal/60"><dt className="font-serif text-4xl text-beige md:text-5xl"><Count value={n}/></dt><dd className="mt-2 text-[11px] uppercase tracking-[.22em] text-ivory/60">{l}</dd></div>)}</dl>
 </section>;
}