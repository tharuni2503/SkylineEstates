"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, BedDouble, Bath, Ruler, BadgeCheck, MapPin, ArrowUpRight, Check, Scale } from "lucide-react";
import type { Property } from "@/types";
import { inr } from "@/lib/format";

export default function PropertyCard({p,saved,onToggle,compared=false,onCompare,list=false,titleAs="h3"}:{p:Property;saved:boolean;onToggle:(id:string)=>void;compared?:boolean;onCompare?:(id:string)=>void;list?:boolean;titleAs?:"h2"|"h3"}){
 const baths = p.bathrooms ?? (p.bhk ? Math.max(1, Math.ceil(p.bhk * 0.75)) : undefined);
 const href = `/property/${p.id}`;
 const TitleTag = titleAs;
 return <motion.article layout initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:.55,ease:[.22,1,.36,1]}} className={`property-card group relative flex h-full flex-col overflow-hidden rounded-sm border border-line/70 bg-white shadow-[0_10px_30px_rgba(17,17,17,.04)] transition-shadow duration-500 hover:shadow-[0_26px_60px_rgba(17,17,17,.12)] ${list?"md:flex-row":""}`}>
  {/* Media */}
  <div className={`relative aspect-[4/3] shrink-0 overflow-hidden bg-matte/10 ${list?"md:aspect-auto md:min-h-[16.5rem] md:w-[38%]":""}`}>
    <img src={p.image} alt={p.title} loading="lazy" decoding="async" onError={(e)=>{const t=e.currentTarget;if(t.dataset.fallback)return;t.dataset.fallback="1";t.src="/images/hero-3d.jpg";}} className="absolute inset-0 h-full w-full object-cover object-center transition duration-[900ms] ease-out group-hover:scale-[1.06]"/>
    <div className="absolute inset-0 bg-gradient-to-t from-matte/60 via-matte/10 to-transparent" aria-hidden="true"/>
    {/* stretched link across the media for sure-fire tap targets */}
    <Link href={href} aria-label={`View ${p.title}`} tabIndex={-1} className="absolute inset-0 z-[1]" />
    {/* Badges */}
    <div className="pointer-events-none absolute left-3 top-3 z-[2] flex flex-wrap gap-1.5">
     {p.featured&&<span className="bg-beige px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[.18em] text-matte shadow-sm">Featured</span>}
     {p.verified&&<span className="inline-flex items-center gap-1 bg-matte/80 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[.16em] text-ivory backdrop-blur-sm" title="Reviewed listing (demo)"><BadgeCheck size={12}/>Verified (demo)</span>}
     <span className="bg-white/92 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[.16em] text-matte backdrop-blur-sm">{p.listing==="Buy"?"For Sale":"For Rent"}</span>
    </div>
    {/* Wishlist */}
    <motion.button whileTap={{scale:.78}} type="button" aria-pressed={saved} aria-label={saved?"Remove from wishlist":"Add to wishlist"} title={saved?"Saved to wishlist":"Save to wishlist"} onClick={()=>onToggle(p.id)} className={`absolute right-3 top-3 z-[2] rounded-full border p-2.5 shadow-sm backdrop-blur-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${saved?"border-matte/20 bg-matte text-beige":"border-white/60 bg-white/92 text-matte hover:bg-white"}`}>
      <Heart key={saved?"on":"off"} size={17} strokeWidth={1.75} className={saved?"heart-pop fill-beige text-beige":"transition-transform duration-300 hover:scale-110"}/>
    </motion.button>
  </div>
  {/* Body */}
  <div className={`flex flex-1 flex-col p-5 md:p-6 ${list?"md:justify-center md:py-6":""}`}>
    <p className="text-[10px] font-medium uppercase tracking-[.24em] text-[#9c7f56]">{p.category}</p>
    <TitleTag className="mt-1.5 min-h-[3.5rem] font-serif text-[1.32rem] leading-[1.28] text-matte md:min-h-[3.8rem] md:text-[1.4rem]"><Link href={href} className="line-clamp-2 decoration-beige/70 decoration-[2px] underline-offset-4 transition-colors hover:text-[#3a3026] hover:underline">{p.title}</Link></TitleTag>
    <p className="mt-1.5 flex min-h-[1.5rem] items-center gap-1.5 text-[13px] text-slate"><MapPin size={13} className="shrink-0 text-[#9c7f56]"/><span className="line-clamp-1">{p.location}</span></p>
    <div className="mt-3 min-h-[3rem]">
      <p className="font-serif text-[1.72rem] leading-none text-matte tabular-nums md:text-[1.85rem]">{inr(p.price)}</p>
      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] uppercase tracking-[.14em] text-slate">
        <span>{p.listing==="Rent" ? "per month" : "guide price (demo)"}</span>
        {p.areaSqft ? <><span className="text-slate/40">·</span><span className="normal-case tracking-normal text-slate/80">{inr(Math.round(p.price / p.areaSqft))} / sq ft</span></> : null}
      </div>
    </div>
    <div className="mt-4 flex min-h-[3.25rem] flex-wrap items-center gap-x-4 gap-y-2 border-t border-line/60 pt-4 text-[13px] text-charcoal/85 tabular-nums">
     {p.bhk?<span className="inline-flex items-center gap-1.5"><BedDouble size={15} strokeWidth={1.75} className="text-[#9c7f56]"/>{p.bhk} BHK</span>:<span className="inline-flex items-center gap-1.5"><BedDouble size={15} strokeWidth={1.75} className="text-[#9c7f56]"/>Plot / Area</span>}
     {baths?<span className="inline-flex items-center gap-1.5"><Bath size={15} strokeWidth={1.75} className="text-[#9c7f56]"/>{baths} Baths</span>:null}
     <span className="inline-flex items-center gap-1.5"><Ruler size={15} strokeWidth={1.75} className="text-[#9c7f56]"/>{p.areaSqft.toLocaleString()} sq ft</span>
    </div>
    <div className="mt-auto flex items-center gap-2.5 pt-5">
     {onCompare&&<button onClick={()=>onCompare(p.id)} aria-pressed={compared} type="button" className={`inline-flex h-10 items-center gap-1.5 border px-3.5 text-[10px] font-medium uppercase tracking-[.16em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${compared?"border-matte bg-matte text-ivory":"border-line/80 bg-white text-charcoal hover:border-matte hover:bg-ivory"}`}>{compared?<Check size={13}/>:<Scale size={13}/>}{compared?"Added":"Compare"}</button>}
     <Link href={href} className="group/cta ml-auto inline-flex h-10 items-center gap-2 bg-matte px-4 text-[10px] font-medium uppercase tracking-[.18em] text-ivory transition duration-300 hover:bg-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2">View Property <ArrowUpRight size={14} className="transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"/></Link>
    </div>
  </div>
 </motion.article>;
}
