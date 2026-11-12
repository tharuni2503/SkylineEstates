"use client";
import { useState, useEffect } from "react";

export default function Gallery({main,title,images=[]}:{main:string;title:string;seed?:number;images?:string[]}){
 // Never show unrelated stock photos as if they belong to this property.
 const imgs=Array.from(new Set([main,...images].filter(Boolean)));
 const [i,setI]=useState(0);
 const [full,setFull]=useState(false);
 const previous=()=>setI(current=>(current-1+imgs.length)%imgs.length);
 const next=()=>setI(current=>(current+1)%imgs.length);

 useEffect(()=>{
  if(!full)return;
  const onKey=(e:KeyboardEvent)=>{
   if(e.key==="Escape")setFull(false);
   if(e.key==="ArrowLeft"&&imgs.length>1)previous();
   if(e.key==="ArrowRight"&&imgs.length>1)next();
  };
  const previousOverflow=document.documentElement.style.overflow;
  document.documentElement.style.overflow="hidden";
  window.addEventListener("keydown",onKey);
  return ()=>{
   window.removeEventListener("keydown",onKey);
   document.documentElement.style.overflow=previousOverflow;
  };
 },[full,imgs.length]);

 const fallback=(e:React.SyntheticEvent<HTMLImageElement>)=>{
  const image=e.currentTarget;
  if(image.dataset.fallback)return;
  image.dataset.fallback="1";
  image.src="/images/hero-3d.jpg";
 };

 return <section aria-label={`${title} photo gallery`} className="min-w-0">
  <button type="button" aria-label="Open property photo fullscreen" onClick={()=>setFull(true)} className="group relative block aspect-[16/10] w-full overflow-hidden bg-matte/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
   <img key={imgs[i]} src={imgs[i]} alt={`${title}, photo ${i+1}`} decoding="async" onError={fallback} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"/>
   <span className="absolute bottom-3 right-3 bg-matte/75 px-3 py-1.5 text-[10px] uppercase tracking-[.16em] text-ivory backdrop-blur-sm">View photo</span>
  </button>
  {imgs.length>1&&<div className="mt-2 grid grid-cols-4 gap-2">{imgs.map((src,index)=><button type="button" key={src} aria-label={`Show photo ${index+1}`} aria-pressed={index===i} onClick={()=>setI(index)} className={`relative aspect-video overflow-hidden bg-matte/5 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${index===i?"ring-2 ring-matte":"opacity-65 hover:opacity-100"}`}><img src={src} alt="" loading="lazy" onError={fallback} className="absolute inset-0 h-full w-full object-cover"/></button>)}</div>}
  {full&&<div role="dialog" aria-modal="true" aria-label={`${title} photo viewer`} className="fixed inset-0 z-[70] flex items-center justify-center bg-matte/95 p-4">
   <div className="relative h-[78vh] w-full max-w-6xl">
    <img src={imgs[i]} alt={`${title}, photo ${i+1}`} onError={fallback} className="absolute inset-0 h-full w-full object-contain"/>
    <p className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-matte/70 px-3 py-1 text-xs text-ivory">{i+1} / {imgs.length}</p>
   </div>
   <button type="button" className="absolute right-5 top-5 min-h-11 px-3 text-sm text-ivory underline underline-offset-4" onClick={()=>setFull(false)}>Close</button>
   {imgs.length>1&&<>
    <button type="button" className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl text-ivory hover:bg-white/20" aria-label="Previous photo" onClick={previous}>‹</button>
    <button type="button" className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl text-ivory hover:bg-white/20" aria-label="Next photo" onClick={next}>›</button>
   </>}
  </div>}
 </section>;
}
