"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";

const pool=["photo-1600596542815-ffad4c1539a9","photo-1613490493576-7fde63acd811","photo-1512917774080-9991f1c4c750","photo-1600585154340-be6161a56a0c","photo-1545324418-cc1a3fa10c00","photo-1564013799919-ab600027ffc6","photo-1600607687939-ce8a6c25118c","photo-1600566753190-17f0baa2a6c3","photo-1613977257363-707ba9348227","photo-1600047509807-ba8f99d2cdde","photo-1583608205776-bfd35f0d9f83","photo-1568605114967-ef698201069b"];

export default function Gallery({main,title,seed}:{main:string;title:string;seed:number}){
 const imgs=[main,...[1,2,3].map(k=>`https://images.unsplash.com/${pool[(seed*5 + k*4)%pool.length]}?auto=format&fit=crop&w=1600&q=80`)];
 const [i,setI]=useState(0);
 const [full,setFull]=useState(false);
 const boxRef=useRef<HTMLDivElement>(null);
 const total=imgs.length;
 const go=(d:number)=>setI(v=>(v+d+total)%total);

 // Keyboard navigation while the lightbox is open + scroll lock
 useEffect(()=>{
  if(!full) return;
  const k=(e:KeyboardEvent)=>{
   if(e.key==="Escape") setFull(false);
   else if(e.key==="ArrowLeft") go(-1);
   else if(e.key==="ArrowRight") go(1);
  };
  window.addEventListener("keydown",k);
  const prev=document.documentElement.style.overflow; document.documentElement.style.overflow="hidden";
  return ()=>{ window.removeEventListener("keydown",k); document.documentElement.style.overflow=prev; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
 },[full]);

 const fb=(e:React.SyntheticEvent<HTMLImageElement>)=>{const t=e.currentTarget;if(t.dataset.fallback)return;t.dataset.fallback="1";t.src="/images/hero-3d.jpg";};
 const arrow="absolute top-1/2 z-[2] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-matte/55 text-ivory backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-beige hover:text-beige focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold";

 return <div ref={boxRef}>
  {/* Main frame */}
  <div className="relative">
    <button aria-label="View photo full screen" onClick={()=>setFull(true)} className="relative block aspect-[16/10] w-full overflow-hidden border border-line/60 bg-matte/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
      <img key={imgs[i]} src={imgs[i]} alt={`${title}, photo ${i+1} of ${total}`} decoding="async" onError={fb} className="gallery-fade absolute inset-0 h-full w-full object-cover object-center"/>
      <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-matte/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[.18em] text-ivory backdrop-blur-sm"><Expand size={11}/>View</span>
      <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-white/20 bg-matte/60 px-3 py-1 text-[11px] font-medium tracking-[.2em] text-ivory backdrop-blur-sm tabular-nums">{i+1} / {total}</span>
    </button>
    <button onClick={()=>go(-1)} aria-label="Previous photo" className={`${arrow} left-3`}><ChevronLeft size={20}/></button>
    <button onClick={()=>go(1)} aria-label="Next photo" className={`${arrow} right-3`}><ChevronRight size={20}/></button>
  </div>

  {/* Thumbnail strip */}
  <ul className="mt-2 grid grid-cols-4 gap-2" aria-label="Photos of this property">
    {imgs.map((s,k)=><li key={k}><button aria-label={`Show photo ${k+1} of ${total}`} aria-current={k===i} onClick={()=>setI(k)} className={`relative block aspect-video w-full overflow-hidden border transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${k===i?"border-matte ring-2 ring-matte ring-offset-1":"border-line/60 opacity-60 hover:border-matte/50 hover:opacity-100"}`}><img src={s} alt="" loading="lazy" decoding="async" onError={fb} className="absolute inset-0 h-full w-full object-cover"/></button></li>)}
  </ul>

  {/* Full screen lightbox */}
  {full&&<div role="dialog" aria-modal="true" aria-label="Photo viewer" className="fixed inset-0 z-[70] flex items-center justify-center bg-matte/96 backdrop-blur-sm" onClick={()=>setFull(false)}>
    <div className="relative h-[82vh] w-full max-w-6xl select-none px-14 sm:px-20" onClick={e=>e.stopPropagation()}>
      <img key={imgs[i]} src={imgs[i]} alt={`${title}, photo ${i+1} of ${total}`} onError={fb} className="gallery-fade absolute inset-0 h-full w-full px-0 object-contain"/>
      <button className="absolute -right-1 top-0 sm:-right-2 sm:top-2 text-sm font-medium uppercase tracking-[.2em] text-ivory/80 underline decoration-ivory/30 underline-offset-4 transition hover:text-ivory" onClick={()=>setFull(false)} aria-label="Close photo viewer"><span className="hidden sm:inline">Close</span><X size={22} className="sm:hidden"/></button>
      <button className="absolute left-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/20 text-ivory/90 transition hover:border-beige hover:text-beige" onClick={()=>go(-1)} aria-label="Previous photo"><ChevronLeft size={22}/></button>
      <button className="absolute right-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/20 text-ivory/90 transition hover:border-beige hover:text-beige" onClick={()=>go(1)} aria-label="Next photo"><ChevronRight size={22}/></button>
      <p aria-live="polite" className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] font-medium uppercase tracking-[.24em] text-ivory/70 tabular-nums">{i+1} of {total}</p>
    </div>
  </div>}
 </div>;
}
