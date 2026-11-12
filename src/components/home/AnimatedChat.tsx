"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useStore } from "@/lib/store";
import { filterProperties } from "@/services/propertyService";
import { inr } from "@/lib/format";
const Q="Show me 3 BHK properties under ₹1 Crore.";
export default function AnimatedChat(){
 const ref=useRef<HTMLDivElement>(null);const inView=useInView(ref,{once:true,margin:"-80px"});const reduce=useReducedMotion();
 const {properties}=useStore();const [run,setRun]=useState(0);const [n,setN]=useState(0);const [step,setStep]=useState<0|1|2>(0);
 const found=filterProperties(properties,{bhk:3,maxPrice:10000000,listing:"Buy"}).slice(0,2);
 useEffect(()=>{if(!inView)return;if(reduce){setN(Q.length);setStep(2);return;}
  setN(0);setStep(0);let i=0;const timers:ReturnType<typeof setTimeout>[]=[];
  const iv=setInterval(()=>{i++;setN(i);if(i>=Q.length){clearInterval(iv);timers.push(setTimeout(()=>setStep(1),400),setTimeout(()=>setStep(2),1800));}},45);
  return ()=>{clearInterval(iv);timers.forEach(clearTimeout);};},[inView,reduce,run]);
 return <section className="bg-matte py-24 text-ivory"><div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2">
  <div><p className="text-xs uppercase tracking-[.3em] text-beige">Property assistant</p><h2 className="mt-3 font-serif text-4xl md:text-5xl">A smarter way to find your space.</h2>
   <p className="mt-4 text-ivory/70">Describe your budget, area and must-haves in plain words and get matching listings. It uses rule-based matching on our own listings, not a trained AI model.</p>
   <Link href="/ai-assistant" className="mt-6 inline-block border-b border-beige pb-1 text-sm text-beige">Try the assistant</Link></div>
  <div ref={ref} className="min-h-[300px] border border-ivory/15 bg-charcoal p-5" aria-label="Example conversation">
   <p className="ml-auto min-h-[2.5rem] w-fit max-w-[90%] bg-ivory px-4 py-3 text-sm text-matte">{Q.slice(0,n)}<span className="animate-pulse">{n<Q.length?"|":""}</span></p>
   {step===1&&<p className="mt-4 text-sm text-ivory/60" aria-live="polite">Searching listings…</p>}
   {step===2&&<div className="mt-4 space-y-3 text-sm"><p>{found.length?`I found ${found.length} matching ${found.length>1?"homes":"home"}:`:"Nothing matches yet. Try a higher budget."}</p>
    {found.map(p=><Link key={p.id} href={`/property/${p.id}`} className="block border border-ivory/15 p-3 hover:border-beige"><span className="font-serif text-lg">{p.title}</span><span className="block text-ivory/60">{p.location.split(",")[0]} · {inr(p.price)}</span></Link>)}</div>}
   {step===2&&!reduce&&<button onClick={()=>setRun(r=>r+1)} className="mt-4 text-xs text-ivory/60 underline">Replay</button>}</div></div></section>;}
