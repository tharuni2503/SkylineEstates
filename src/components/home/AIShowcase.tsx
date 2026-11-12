"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useStore } from "@/lib/store";
import { filterProperties } from "@/services/propertyService";
import { inr } from "@/lib/format";
const Q="Show me 3 BHK properties under ₹1 Crore near IT hubs.";
export default function AIShowcase(){
 const reduce=useReducedMotion();const {properties}=useStore();
 const [go,setGo]=useState(false);const [n,setN]=useState(0);const [phase,setPhase]=useState(0);
 useEffect(()=>{if(!go)return;if(reduce){setN(Q.length);return;}const id=setInterval(()=>setN(v=>Math.min(v+1,Q.length)),38);return ()=>clearInterval(id);},[go,reduce]);
 useEffect(()=>{if(n<Q.length)return;if(reduce){setPhase(2);return;}setPhase(1);const t=setTimeout(()=>setPhase(2),1100);return ()=>clearTimeout(t);},[n,reduce]);
 const res=filterProperties(properties,{bhk:3,maxPrice:10000000,listing:"Buy"}).slice(0,2);
 return <section className="bg-matte py-24 text-ivory"><div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2">
  <div><p className="text-xs uppercase tracking-[.3em] text-beige">AI property assistant</p><h2 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">Your Next Home, Intelligently Discovered.</h2>
   <p className="mt-4 max-w-md text-ivory/70">Tell us what you're looking for. Our AI-powered assistant helps you discover properties that match your lifestyle, budget and preferences.</p>
   <Link href="/ai-assistant" className="mt-6 inline-block bg-beige px-8 py-4 text-xs font-medium tracking-[.18em] text-matte transition hover:bg-ivory">EXPLORE WITH AI</Link>
   <p className="mt-4 text-xs text-ivory/50">An example conversation. Matching is rule-based on our listings, not a trained AI model.</p></div>
  <motion.div onViewportEnter={()=>setGo(true)} viewport={{once:true,amount:.5}} aria-live="polite" className="min-h-[320px] space-y-4 border border-ivory/15 p-6">
   <div className="text-right"><p className="inline-block max-w-[90%] bg-ivory px-4 py-3 text-left text-sm text-charcoal">{Q.slice(0,n)}{n<Q.length&&go&&<span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-charcoal align-middle"/>}</p></div>
   {phase>=1&&<motion.p initial={{opacity:0}} animate={{opacity:1}} className="inline-block bg-ivory/10 px-4 py-3 text-sm">{phase===1?"Searching listings…":`I found ${res.length} matching ${res.length===1?"property":"properties"}.`}</motion.p>}
   {phase>=2&&<div className="grid gap-3 sm:grid-cols-2">{res.map(p=><Link key={p.id} href={`/property/${p.id}`} className="border border-ivory/20 p-4 text-sm transition hover:border-beige"><p className="font-serif text-lg">{p.title}</p><p className="text-ivory/60">{p.location.split(",")[0]}</p><p className="mt-1">{inr(p.price)}</p></Link>)}</div>}</motion.div></div></section>;}
