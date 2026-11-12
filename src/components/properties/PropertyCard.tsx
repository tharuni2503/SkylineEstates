"use client";
import { motion } from "framer-motion";
import Tilt from "@/components/common/Tilt";
import Link from "next/link";
import { Heart, BedDouble, Bath, Ruler, BadgeCheck, MapPin, ArrowUpRight } from "lucide-react";
import type { Property } from "@/types";
import { inr } from "@/lib/format";

export default function PropertyCard({p,saved,onToggle,compared=false,onCompare,list=false}:{p:Property;saved:boolean;onToggle:(id:string)=>void;compared?:boolean;onCompare?:(id:string)=>void;list?:boolean}){
 const baths = p.bathrooms ?? (p.bhk ? Math.max(1, Math.ceil(p.bhk * 0.75)) : undefined);
 return (
  <Tilt className="h-full">
   <motion.article
    initial={{opacity:0,y:18}}
    whileInView={{opacity:1,y:0}}
    viewport={{once:true,amount:.12}}
    transition={{duration:.55,ease:[.22,1,.36,1]}}
    whileHover={{y:-5}}
    className={`property-card group relative flex h-full flex-col overflow-hidden rounded-sm border border-line/70 bg-white shadow-[0_10px_30px_rgba(17,17,17,.04)] transition-shadow duration-500 hover:shadow-[0_24px_55px_rgba(17,17,17,.10)] ${list?"md:flex-row":""}`}
   >
    <div className={`relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-matte/5 ${list?"md:aspect-auto md:min-h-[18rem] md:w-[38%] lg:w-[40%]":""}`}>
     <img src={p.image} alt={p.title} loading="lazy" decoding="async" onError={(e)=>{const t=e.currentTarget;if(t.dataset.fallback)return;t.dataset.fallback="1";t.src="/images/hero-3d.jpg";}} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"/>
     <div className="absolute inset-0 bg-gradient-to-t from-matte/55 via-matte/5 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" aria-hidden="true"/>
     <div className="absolute left-3 top-3 flex flex-wrap gap-2 pr-14">
      {p.featured&&<span className="bg-beige px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.16em] text-matte shadow-sm">Featured</span>}
      {p.verified&&<span className="flex items-center gap-1 bg-matte/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.14em] text-ivory backdrop-blur-sm"><BadgeCheck size={13}/>Verified</span>}
      <span className="bg-white/92 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.14em] text-matte backdrop-blur-sm">{p.listing==="Buy"?"For Sale":"For Rent"}</span>
     </div>
     <motion.button type="button" aria-pressed={saved} aria-label={saved?"Remove from wishlist":`Add ${p.title} to wishlist`} onClick={()=>onToggle(p.id)} whileTap={{scale:.86}} className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/95 text-matte shadow-sm backdrop-blur-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
      <motion.span animate={{scale:saved?[1.12,1]:1}} transition={{duration:.22}}><Heart size={17} strokeWidth={1.7} className={saved?"fill-matte":"fill-transparent"}/></motion.span>
     </motion.button>
    </div>
    <div className={`flex min-w-0 flex-1 flex-col p-5 md:p-6 ${list?"md:justify-center":""}`}>
     <p className="text-[11px] font-medium uppercase tracking-[.22em] text-slate">{p.category}</p>
     <h3 className="mt-2 font-serif text-[1.4rem] leading-tight text-matte md:text-[1.65rem]"><Link href={`/property/${p.id}`} className="decoration-beige/60 underline-offset-4 hover:underline focus-visible:rounded-sm">{p.title}</Link></h3>
     <p className="mt-2 flex min-w-0 items-center gap-1.5 text-sm text-slate"><MapPin size={14} className="shrink-0 text-[#9c7f56]"/><span className="truncate">{p.location}</span></p>
     <p className="mt-4 font-serif text-[1.8rem] leading-none text-matte md:text-[1.95rem]">{inr(p.price)}{p.listing==="Rent"&&<span className="ml-1 font-sans text-sm font-normal text-slate">/ month</span>}</p>
     <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-charcoal/80">
      {p.bhk>0&&<span className="inline-flex items-center gap-1.5"><BedDouble size={15} className="text-[#9c7f56]"/>{p.bhk} Beds</span>}
      {baths&&<span className="inline-flex items-center gap-1.5"><Bath size={15} className="text-[#9c7f56]"/>{baths} Baths</span>}
      <span className="inline-flex items-center gap-1.5"><Ruler size={15} className="text-[#9c7f56]"/>{p.areaSqft.toLocaleString()} sq ft</span>
     </div>
     <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
      {onCompare&&<button type="button" onClick={()=>onCompare(p.id)} aria-pressed={compared} className={`min-h-10 border px-3.5 py-2 text-[11px] font-medium uppercase tracking-[.14em] transition-colors ${compared?"border-matte bg-matte text-ivory":"border-line text-charcoal hover:border-matte"}`}>{compared?"Compared":"Compare"}</button>}
      <Link href={`/property/${p.id}`} className="group/cta ml-auto inline-flex min-h-10 items-center gap-2 bg-matte px-5 py-2.5 text-[11px] font-medium uppercase tracking-[.16em] text-ivory transition-colors duration-300 hover:bg-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2">View Property <ArrowUpRight size={14} className="transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"/></Link>
     </div>
    </div>
   </motion.article>
  </Tilt>
 );
}
