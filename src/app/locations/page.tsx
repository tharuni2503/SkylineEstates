"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import SectionHead from "@/components/common/SectionHead";
import { locations } from "@/data/content";
import { useStore } from "@/lib/store";
import { ArrowUpRight } from "lucide-react";

export default function LocationsPage() {
  const { properties } = useStore();
  return (
    <div className="relative overflow-hidden bg-ivory">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,rgba(216,195,165,.18),transparent_40%),radial-gradient(ellipse_at_85%_80%,rgba(17,17,17,.04),transparent_45%)]" />
      <div className="relative mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="grid gap-6 border-b border-line/70 pb-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <SectionHead as="h1" eyebrow="Prime locations" title="Neighbourhoods we *know by heart.*" />
          <p className="max-w-xl text-sm leading-relaxed text-slate">Explore Hyderabad’s most sought-after areas — each with its own character, connectivity, and lifestyle. Discover verified listings tailored to every address.</p>
        </motion.div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {locations.map(([name, blurb], i) => {
            const n = properties.filter((p) => p.location.startsWith(name)).length;
            const span = i===0?"lg:col-span-7":i===1?"lg:col-span-5":i===2?"lg:col-span-4":i===3?"lg:col-span-4":i===4?"lg:col-span-4":i===5?"lg:col-span-5":"lg:col-span-7";
            return (
              <motion.li
                key={name}
                className={span}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={`/properties?q=${encodeURIComponent(name)}`} className="group relative block h-full min-h-[13rem] overflow-hidden border border-line/70 bg-white p-7 shadow-[0_10px_30px_rgba(17,17,17,.04)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-beige/55 hover:bg-[#fdfaf5] hover:shadow-[0_22px_50px_rgba(17,17,17,.09)]">
                  <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-beige/80 via-beige/30 to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100" />
                  <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-beige/10 opacity-0 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100" />
                  <p className="text-[11px] uppercase tracking-[.22em] text-[#9c7f56]">Hyderabad</p>
                  <p className="mt-2 font-serif text-3xl text-matte transition-colors duration-300 group-hover:text-[#3a3026] md:text-[2.1rem]">{name}</p>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-slate transition-colors duration-300 group-hover:text-charcoal/75">{blurb}</p>
                  <div className="mt-8 flex items-center justify-between gap-3">
                    <p className="inline-flex items-center border border-line/80 bg-ivory/70 px-3 py-1.5 text-[11px] tracking-[.16em] text-slate transition-all duration-300 group-hover:border-beige/40 group-hover:bg-white group-hover:text-matte">
                      {n} {n === 1 ? "LISTING" : "LISTINGS"}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm text-[#9c7f56] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-1" aria-hidden="true">Explore <ArrowUpRight size={14}/></span>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}