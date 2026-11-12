"use client";
import { useRef } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useStore } from "@/lib/store";
import { useWide } from "@/lib/useWide";
import { inr, hiRes } from "@/lib/format";
import type { Property } from "@/types";
function Slide({p}:{p:Property}){
 const {wishlist,toggleWish}=useStore();const saved=wishlist.includes(p.id);
 return <article className="group relative aspect-[4/5] w-[85vw] shrink-0 snap-center overflow-hidden bg-charcoal md:aspect-auto md:h-[60vh] md:w-[72vw]">
  <img src={hiRes(p.image)} alt={p.title} loading="lazy" onError={(e)=>{const t=e.currentTarget;if(t.dataset.fallback)return;t.dataset.fallback="1";t.src="/images/hero-3d.jpg";}} className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-105"/>
  <div className="absolute inset-0 bg-gradient-to-t from-matte/85 via-matte/10 to-transparent" aria-hidden="true"/>
  <button aria-pressed={saved} aria-label={saved?"Remove from wishlist":"Add to wishlist"} onClick={()=>toggleWish(p.id)} className="absolute right-4 top-4 rounded-full bg-white/90 p-2"><Heart size={18} className={saved?"fill-matte":""}/></button>
  <div className="absolute inset-x-0 bottom-0 p-6 text-ivory md:p-10"><p className="text-xs uppercase tracking-[.3em] text-beige">{p.category} · {p.location.split(",")[0]}</p>
   <h3 className="mt-2 font-serif text-3xl md:text-5xl">{p.title}</h3>
   <p className="mt-2 text-sm text-ivory/80">{inr(p.price)}{p.listing==="Rent"?" /month":""} · {p.bhk?`${p.bhk} BHK · `:""}{p.areaSqft} sq ft</p>
   <Link href={`/property/${p.id}`} className="mt-4 inline-block border-b border-beige pb-1 text-sm text-beige">View property</Link></div></article>;}
function Head(){return <div className="px-5 md:px-10"><p className="text-xs uppercase tracking-[.3em] text-beige">The collection</p><h2 className="mt-2 font-serif text-4xl text-ivory md:text-5xl">Residences worth the scroll</h2></div>;}
function Pinned({items}:{items:Property[]}){
 const ref=useRef<HTMLDivElement>(null);
 const {scrollYProgress}=useScroll({target:ref,offset:["start start","end end"]});
 const x=useTransform(scrollYProgress,[0,1],["0vw",`-${items.length*75-100}vw`]);
 return <section ref={ref} style={{height:`${items.length*80}vh`}} className="relative bg-matte"><div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-16"><Head/>
  <motion.div style={{x}} className="mt-8 flex gap-[3vw] px-5 md:pl-10">{items.map(p=><Slide key={p.id} p={p}/>)}</motion.div></div></section>;}
export default function HorizontalShowcase(){
 const {properties}=useStore();const wide=useWide();const reduce=useReducedMotion();
 const items=[...properties].sort((a,b)=>Number(b.featured)-Number(a.featured)).slice(0,6);
 if(items.length===0)return null;
 if(wide&&!reduce)return <Pinned items={items}/>;
 return <section className="bg-matte py-16"><Head/><div className="mt-8 flex snap-x gap-4 overflow-x-auto px-5 pb-4 md:px-10" tabIndex={0} aria-label="Residences, scroll sideways">{items.map(p=><Slide key={p.id} p={p}/>)}</div></section>;}
