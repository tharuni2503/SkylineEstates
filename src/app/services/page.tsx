"use client";
import SectionHead from "@/components/common/SectionHead";
import Link from "next/link";
import MaskReveal from "@/components/common/MaskReveal";
import { services, serviceImages } from "@/data/services";
import { ArrowUpRight } from "lucide-react";

export default function Services(){return <div className="relative overflow-hidden bg-ivory/30">
 <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_10%,rgba(216,195,165,.16),transparent_40%),radial-gradient(ellipse_at_90%_80%,rgba(17,17,17,.04),transparent_45%)]"/>
 <div className="relative mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
  <div className="grid gap-6 border-b border-line/70 pb-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
   <SectionHead as="h1" eyebrow="Services" title="Every side of a *property decision.*"/>
   <p className="max-w-xl text-sm leading-relaxed text-slate">Whether you are buying a first home, selling a villa, or launching a project, Skyline advisors bring clarity, care, and expertise to every step.</p>
  </div>
  <div className="mt-12 space-y-8 md:space-y-10">{services.map((s,i)=><section key={s.slug} className="group grid items-center gap-6 overflow-hidden border border-line/70 bg-white shadow-[0_12px_34px_rgba(17,17,17,.05)] transition-all duration-500 hover:shadow-[0_22px_50px_rgba(17,17,17,.09)] md:grid-cols-2">
   <MaskReveal className={`relative aspect-[4/3] min-h-[16rem] md:aspect-auto md:h-full ${i%2?"md:order-2":""}`}><img src={serviceImages[i]} alt={`${s.title} illustration`} loading="lazy" onError={(e)=>{const t=e.currentTarget;if(t.dataset.fallback)return;t.dataset.fallback="1";t.src="/images/hero-3d.jpg";}} className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-[1.04]"/></MaskReveal>
   <div className="p-6 md:p-10">
    <p className="text-[11px] uppercase tracking-[.26em] text-[#9c7f56]">Service 0{i+1}</p>
    <h2 className="mt-2 font-serif text-3xl text-matte md:text-4xl">{s.title}</h2>
    <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate">{s.summary}</p>
    <ul className="mt-5 space-y-2 border-l-2 border-beige/60 pl-4 text-sm text-charcoal/80">{s.points.slice(0,3).map(p=><li key={p}>{p}</li>)}</ul>
    <div className="mt-7 flex flex-wrap gap-3 text-sm">
     <Link href={`/services/${s.slug}`} className="inline-flex items-center gap-2 bg-matte px-6 py-3 text-[11px] font-medium uppercase tracking-[.18em] text-ivory transition hover:bg-charcoal">See how it works <ArrowUpRight size={14}/></Link>
     <Link href="/contact" className="inline-flex items-center border border-line px-6 py-3 text-[11px] font-medium uppercase tracking-[.18em] text-matte transition hover:border-matte">Talk to an advisor</Link>
    </div>
   </div>
  </section>)}</div>
 </div>
</div>;}