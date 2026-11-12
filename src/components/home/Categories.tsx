"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
const items:[string,string,string,string][]=[["Luxury villas","Villa","Private gardens, generous plots and room to breathe.","https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=80"],["Premium apartments","Apartment","High-rise views and amenities close to the IT corridor.","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"],["Independent houses","Independent House","Your own address in a settled neighbourhood.","https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80"],["Residential plots","Residential Plot","Land in growth corridors, ready for your design.","https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=2000&q=80"],["Commercial properties","Commercial","Offices and business floors in the IT corridor.","https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"]];
export default function Categories(){
 const [i,setI]=useState(0);
 return <section aria-label="Property categories" className="relative min-h-[80vh] overflow-hidden bg-matte text-ivory">
  <AnimatePresence><motion.div key={i} className="absolute inset-0" initial={{opacity:0,scale:1.08}} animate={{opacity:1,scale:1}} exit={{opacity:0}} transition={{duration:.9}}><img src={items[i][3]} alt="" onError={(e)=>{const t=e.currentTarget;if(t.dataset.fallback)return;t.dataset.fallback="1";t.src="/images/hero-3d.jpg";}} className="absolute inset-0 h-full w-full object-cover"/></motion.div></AnimatePresence>
  <div className="absolute inset-0 bg-matte/60" aria-hidden="true"/>
  <div className="relative mx-auto flex min-h-[80vh] max-w-7xl flex-col justify-center px-5 py-20"><p className="text-xs uppercase tracking-[.3em] text-beige">Discover exceptional living</p>
   <ul className="mt-8 divide-y divide-ivory/20 border-y border-ivory/20">{items.map(([t,c,d],k)=><li key={t} onMouseEnter={()=>setI(k)}>
    <button aria-expanded={i===k} onClick={()=>setI(k)} onFocus={()=>setI(k)} className={`w-full py-5 text-left font-serif text-3xl transition-opacity md:text-6xl ${i===k?"opacity-100":"opacity-50 hover:opacity-80"}`}>{t}</button>
    {i===k&&<motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="flex flex-wrap items-center gap-6 pb-6"><p className="max-w-md text-ivory/80">{d}</p><Link href={`/properties?category=${encodeURIComponent(c)}`} className="border-b border-beige pb-1 text-sm text-beige">Explore {t.toLowerCase()}</Link></motion.div>}</li>)}</ul></div></section>;}
