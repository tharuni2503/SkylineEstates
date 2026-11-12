"use client";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { useInView, useReducedMotion } from "framer-motion";

function Count({ value, ready }: { value: number; ready: boolean }) {
 const ref=useRef<HTMLSpanElement>(null);
 const inView=useInView(ref,{once:true,margin:"-20% 0px"});
 const reduce=useReducedMotion();
 const [n,setN]=useState(0);
 useEffect(()=>{
  if(!ready||!inView)return;
  if(reduce){setN(value);return;}
  const duration=1000;
  const start=performance.now();
  let frame=0;
  const tick=(now:number)=>{
   const progress=Math.min(1,(now-start)/duration);
   const eased=1-Math.pow(1-progress,3);
   setN(Math.round(eased*value));
   if(progress<1)frame=requestAnimationFrame(tick);
  };
  frame=requestAnimationFrame(tick);
  return ()=>cancelAnimationFrame(frame);
 },[inView,value,reduce,ready]);
 return <span ref={ref} aria-label={ready?String(value):"Loading"}>{ready?n.toLocaleString("en-IN"):"—"}</span>;
}

export default function StatsStrip(){
 const {properties,ready}=useStore();
 const areas=new Set(properties.map(p=>p.location.split(",")[0].trim()).filter(Boolean)).size;
 const stats:[number,string][]=[
  [properties.length,"Residences listed"],
  [areas,"Hyderabad localities"],
  [properties.filter(p=>p.verified).length,"Verified listings"],
  [6,"Services under one roof"]
 ];
 return <section aria-label="Skyline Estates in numbers" className="relative overflow-hidden border-y border-beige/10 bg-matte text-ivory">
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(216,195,165,.10),transparent_45%),radial-gradient(ellipse_at_80%_50%,rgba(201,166,107,.08),transparent_40%)]"/>
  <dl className="relative mx-auto grid max-w-7xl grid-cols-2 gap-px bg-ivory/10 md:grid-cols-4">
   {stats.map(([value,label])=><div key={label} className="group bg-matte px-4 py-8 text-center transition-colors duration-500 hover:bg-charcoal/60 sm:px-5 md:py-9">
    <dt className="font-serif text-4xl tabular-nums text-beige md:text-5xl"><Count value={value} ready={ready}/></dt>
    <dd className="mt-2 text-[10px] uppercase tracking-[.18em] text-ivory/60 sm:text-[11px] sm:tracking-[.22em]">{label}</dd>
   </div>)}
  </dl>
 </section>;
}
