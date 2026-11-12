"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BedDouble, Building2, CalendarCheck, IndianRupee, MapPin, Search } from "lucide-react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import AutoVideo from "@/components/common/AutoVideo";
import { useIntroDone } from "@/lib/intro";
import { categories } from "@/data/content";

const EASE: [number, number, number, number] = [.22, 1, .36, 1];
const LINES: [string, string][] = [["FIND YOUR", "text-ivory"], ["PERFECT SPACE.", "text-gold"]];
const prices: [string, string][] = [["2500000", "₹25 L"], ["5000000", "₹50 L"], ["7500000", "₹75 L"], ["10000000", "₹1 Cr"], ["20000000", "₹2 Cr"], ["50000000", "₹5 Cr"]];
const cell = "w-full bg-transparent text-sm text-ivory placeholder:text-ivory/60 focus:outline-none [&>option]:text-charcoal";
const wrap = "flex items-center gap-3 bg-matte/55 px-4 py-3";
const lab = "block text-[11px] text-beige/80";

function Rise({ ready, delay, className, children }: { ready: boolean; delay: number; className?: string; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 18 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 1.1, delay, ease: EASE }}>{children}</motion.div>;
}

export default function Hero() {
  const reduce = useReducedMotion();
  const ready = useIntroDone();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: s } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const vScale = useTransform(s, [0, 1], [1, 1.14]);
  const vY = useTransform(s, [0, 1], ["0%", "12%"]);
  const dim = useTransform(s, [0, .9], [0, .92]);
  const tY = useTransform(s, [0, 1], [0, -90]);
  const tO = useTransform(s, [0, .55], [1, 0]);

  return (
    <section ref={ref} aria-label="Skyline Estates" className="grain relative flex min-h-[100svh] items-end overflow-hidden bg-matte text-ivory">
      <motion.div style={reduce ? undefined : { scale: vScale, y: vY }} className="absolute inset-0">
        <motion.div className="absolute inset-0" initial={{ scale: 1 }} animate={ready && !reduce ? { scale: 1.07 } : { scale: 1 }} transition={{ duration: 22, ease: "linear" }}>
          <AutoVideo src="/videos/hero.mp4" srcLite="/videos/hero-720.mp4" poster="/videos/hero-poster.jpg" priority />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-matte/75 via-matte/30 to-transparent" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-matte via-matte/40 to-matte/20" aria-hidden="true" />
      {!reduce && <motion.div style={{ opacity: dim }} className="absolute inset-0 bg-matte" aria-hidden="true" />}

      <motion.div style={reduce ? undefined : { y: tY, opacity: tO }} className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-36 md:pb-24">
        <h1 className="font-serif text-[clamp(2.8rem,8vw,7.5rem)] font-normal leading-[1.02] tracking-[-.01em]">
          {LINES.map(([l, c], i) => (
            <span key={l} className="-mb-[.14em] block overflow-hidden pb-[.14em]">
              <motion.span className={`block ${c}`} initial={reduce ? false : { y: "108%" }} animate={ready ? { y: 0 } : undefined} transition={{ duration: 1.25, delay: .1 + i * .14, ease: EASE }}>{l}</motion.span>
            </span>
          ))}
        </h1>
        <Rise ready={ready} delay={.7} className="mt-6 max-w-xl text-ivory/80">
          <p>Discover exceptional properties, luxury homes, modern apartments, and prime investments. Designed for the way you want to live.</p>
        </Rise>
        <Rise ready={ready} delay={.85} className="mt-8 flex flex-col gap-4 text-xs font-medium tracking-[.18em] sm:flex-row">
          <Link href="/properties" className="group inline-flex items-center justify-center gap-3 bg-beige px-8 py-4 text-matte transition hover:bg-ivory">EXPLORE PROPERTIES <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link>
          <Link href="/contact?visit=1" className="inline-flex items-center justify-center gap-3 border border-ivory/70 px-8 py-4 text-ivory transition hover:bg-ivory/10">BOOK A SITE VISIT <CalendarCheck size={16} strokeWidth={1.5} /></Link>
        </Rise>
        <Rise ready={ready} delay={1}>
          <form action="/properties" role="search" className="mt-12 grid gap-px border border-ivory/20 bg-ivory/15 backdrop-blur-md md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_.8fr_1.3fr_auto]">
            <label className={wrap}><MapPin size={18} strokeWidth={1.5} className="shrink-0 text-gold" /><span className="w-full"><span className={lab}>Location</span><input name="q" placeholder="Enter location" className={cell} /></span></label>
            <label className={wrap}><Building2 size={18} strokeWidth={1.5} className="shrink-0 text-gold" /><span className="w-full"><span className={lab}>Property type</span><select name="category" className={cell}><option value="">All types</option>{categories.map(c => <option key={c}>{c}</option>)}</select></span></label>
            <label className={wrap}><BedDouble size={18} strokeWidth={1.5} className="shrink-0 text-gold" /><span className="w-full"><span className={lab}>BHK / Beds</span><select name="bhk" className={cell}><option value="">Any</option>{[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} BHK</option>)}<option value="5">5+ BHK</option></select></span></label>
            <div className={`${wrap} md:col-span-2 lg:col-span-1`}><IndianRupee size={18} strokeWidth={1.5} className="shrink-0 text-gold" /><span className="w-full"><span className={lab}>Price range</span><span className="flex gap-2"><select name="minPrice" aria-label="Minimum price" className={cell}><option value="">Min</option>{prices.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select><select name="maxPrice" aria-label="Maximum price" className={cell}><option value="">Max</option>{prices.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></span></span></div>
            <button className="flex items-center justify-center gap-2 bg-beige px-9 py-4 text-xs font-medium tracking-[.18em] text-matte transition hover:bg-ivory md:col-span-2 lg:col-span-1"><Search size={16} /> SEARCH</button>
          </form>
        </Rise>
        <div aria-hidden="true" className="mt-8 flex flex-col items-center gap-2 text-[11px] tracking-[.3em] text-ivory/60">
          <span>SCROLL TO EXPLORE</span>
          <span className="relative h-10 w-px overflow-hidden bg-ivory/25"><motion.span className="absolute inset-x-0 top-0 h-4 bg-beige" animate={reduce ? {} : { y: [-16, 40] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} /></span>
        </div>
      </motion.div>
    </section>
  );
}
