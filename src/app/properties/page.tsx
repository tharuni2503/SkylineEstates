"use client";
import SectionHead from "@/components/common/SectionHead";
import { useEffect, useState, useRef } from "react";
import { filterProperties } from "@/services/propertyService";
import type { Property, PropertyQuery } from "@/types";
import { useStore } from "@/lib/store";
import PropertyCard from "@/components/properties/PropertyCard";
import { inr } from "@/lib/format";
import { locations } from "@/data/content";
import { Search, X, ChevronDown, SlidersHorizontal, LayoutGrid, Rows3, BadgeCheck, Star } from "lucide-react";

const budgets:[number,string][]=[[0,"Any"],[2500000,"₹25 L"],[5000000,"₹50 L"],[7500000,"₹75 L"],[10000000,"₹1 Cr"],[20000000,"₹2 Cr"],[50000000,"₹5 Cr"]];
const cats=["All","Apartment","Villa","Independent House","Residential Plot","Commercial"] as const;
const amen=["Clubhouse","Swimming Pool","Gym","Power Backup","Covered Parking","Security","Landscaped Garden","EV Charging"];
const base:PropertyQuery={category:"All",sort:"latest"};

function ChevronSelect({label,value,onChange,children,className=""}:{label:string;value:string;onChange:(e:React.ChangeEvent<HTMLSelectElement>)=>void;children:React.ReactNode;className?:string}){
  return <label className={`relative ${className}`}>
    <span className="sr-only">{label}</span>
    <select aria-label={label} value={value} onChange={onChange} className="h-11 w-full appearance-none border border-line bg-white pl-3.5 pr-9 text-sm text-charcoal transition hover:border-matte/60 focus:border-beige/70 focus:outline-none">{children}</select>
    <ChevronDown size={15} aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate"/>
  </label>;
}

export default function PropertiesPage(){
 const [f,setF]=useState<PropertyQuery>(base);
 const [items,setItems]=useState<Property[]|null>(null);
 const {properties:list,ready,wishlist:saved,toggleWish:toggle,compare:cmp,toggleCompare:compare,clearCompare}=useStore();
 const [listView,setListView]=useState(false);
 const [err,setErr]=useState(false);
 const [drawer,setDrawer]=useState(false);
 const drawerRef=useRef<HTMLDivElement>(null);
 const filterTriggerRef=useRef<HTMLButtonElement>(null);
 const drawerCloseRef=useRef<HTMLButtonElement>(null);

 useEffect(()=>{const s=new URLSearchParams(window.location.search);const c=s.get("category"),q=s.get("q"),l=s.get("listing"),m=s.get("maxPrice"),b=s.get("bhk"),mn=s.get("minPrice");setF(x=>({...x,...(c&&{category:c as PropertyQuery["category"]}),...(q&&{q}),...(l&&{listing:l as PropertyQuery["listing"]}),...(m&&{maxPrice:+m}),...(b&&{bhk:+b}),...(mn&&{minPrice:+mn})}));},[]);
 useEffect(()=>{if(!ready)return;setErr(false);try{setItems(filterProperties(list,f));}catch{setErr(true);setItems([]);}},[f,list,ready]);

 // Filter drawer: keep keyboard focus inside the modal and restore it on close.
 useEffect(()=>{ if(!drawer) return;
   const previousOverflow=document.documentElement.style.overflow;
   document.documentElement.style.overflow="hidden";
   drawerCloseRef.current?.focus();
   const onKeyDown=(event:KeyboardEvent)=>{
     if(event.key==="Escape"){ event.preventDefault(); setDrawer(false); return; }
     if(event.key!=="Tab") return;
     const focusable=drawerRef.current?.querySelectorAll<HTMLElement>(
       'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
     );
     if(!focusable?.length){ event.preventDefault(); return; }
     const first=focusable[0];
     const last=focusable[focusable.length-1];
     if(event.shiftKey&&document.activeElement===first){ event.preventDefault(); last.focus(); }
     else if(!event.shiftKey&&document.activeElement===last){ event.preventDefault(); first.focus(); }
   };
   window.addEventListener("keydown",onKeyDown);
   return ()=>{
     window.removeEventListener("keydown",onKeyDown);
     document.documentElement.style.overflow=previousOverflow;
     filterTriggerRef.current?.focus();
   };
 },[drawer]);

 const setMinBudget=(v?:number)=>setF(x=>({...x,minPrice:v,maxPrice:v!==undefined&&x.maxPrice!==undefined&&v>x.maxPrice?v:x.maxPrice}));
 const setMaxBudget=(v?:number)=>setF(x=>({...x,maxPrice:v,minPrice:v!==undefined&&x.minPrice!==undefined&&v<x.minPrice?v:x.minPrice}));
 const setMinArea=(v?:number)=>setF(x=>({...x,minArea:v,maxArea:v!==undefined&&x.maxArea!==undefined&&v>x.maxArea?v:x.maxArea}));
 const setMaxArea=(v?:number)=>setF(x=>({...x,maxArea:v,minArea:v!==undefined&&x.minArea!==undefined&&v<x.minArea?v:x.minArea}));

 const cls="h-11 border border-line bg-white px-4 text-sm text-charcoal transition placeholder:text-slate hover:border-matte/60 focus:border-beige/70 focus:outline-none";
 const picked=list.filter(p=>cmp.includes(p.id));
 const sel=`mt-1 w-full ${cls}`;
 const num=(v?:number)=>v===undefined?"":String(v);
 const active=Object.entries(f).filter(([k,v])=>v!==undefined&&v!==""&&v!==false&&!(k==="category"&&v==="All")&&!(k==="sort"&&v==="latest")).length;
 const loading = items===null;

 // Build removable chips from active filters
 const chips:{label:string;clear:()=>void}[]=[];
 if(f.category&&f.category!=="All")chips.push({label:f.category,clear:()=>setF(x=>({...x,category:"All"}))});
 if(f.listing)chips.push({label:f.listing==="Buy"?"Buying":"Renting",clear:()=>setF(x=>({...x,listing:undefined}))});
 if(f.q)chips.push({label:`“${f.q}”`,clear:()=>setF(x=>({...x,q:undefined}))});
 if(f.bhk)chips.push({label:f.bhk>=5?"5+ BHK":`${f.bhk} BHK`,clear:()=>setF(x=>({...x,bhk:undefined}))});
 if(f.minPrice!==undefined)chips.push({label:`From ${inr(f.minPrice)}`,clear:()=>setF(x=>({...x,minPrice:undefined}))});
 if(f.maxPrice!==undefined)chips.push({label:`Up to ${inr(f.maxPrice)}`,clear:()=>setF(x=>({...x,maxPrice:undefined}))});
 if(f.minArea!==undefined)chips.push({label:`From ${f.minArea} sq ft`,clear:()=>setF(x=>({...x,minArea:undefined}))});
 if(f.maxArea!==undefined)chips.push({label:`Up to ${f.maxArea} sq ft`,clear:()=>setF(x=>({...x,maxArea:undefined}))});
 if(f.amenity)chips.push({label:f.amenity,clear:()=>setF(x=>({...x,amenity:undefined}))});
 if(f.verified)chips.push({label:"Verified only",clear:()=>setF(x=>({...x,verified:undefined}))});
 if(f.featured)chips.push({label:"Featured only",clear:()=>setF(x=>({...x,featured:undefined}))});

 const panel=<div>
   <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
     <label className="text-xs font-medium uppercase tracking-[.16em] text-slate">Type<select className={sel} value={f.category} onChange={e=>setF({...f,category:e.target.value as PropertyQuery["category"]})}>{cats.map(c=><option key={c}>{c}</option>)}</select></label>
     <label className="text-xs font-medium uppercase tracking-[.16em] text-slate">BHK<select className={sel} value={f.bhk??""} onChange={e=>setF({...f,bhk:e.target.value?+e.target.value:undefined})}><option value="">Any</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n===5?"5+ BHK":`${n} BHK`}</option>)}</select></label>
     <label className="text-xs font-medium uppercase tracking-[.16em] text-slate">Amenity<select className={sel} value={f.amenity??""} onChange={e=>setF({...f,amenity:e.target.value||undefined})}><option value="">Any</option>{amen.map(a=><option key={a}>{a}</option>)}</select></label>
     <label className="text-xs font-medium uppercase tracking-[.16em] text-slate">Min budget<select className={sel} value={f.minPrice??0} onChange={e=>setMinBudget(+e.target.value||undefined)}>{budgets.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
     <label className="text-xs font-medium uppercase tracking-[.16em] text-slate">Max budget<select className={sel} value={f.maxPrice??0} onChange={e=>setMaxBudget(+e.target.value||undefined)}>{budgets.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
     <label className="text-xs font-medium uppercase tracking-[.16em] text-slate">Min area (sq ft)<input type="number" min={0} max={f.maxArea} inputMode="numeric" className={sel} value={num(f.minArea)} onChange={e=>setMinArea(e.target.value?Math.max(0,Number(e.target.value)):undefined)}/></label>
     <label className="text-xs font-medium uppercase tracking-[.16em] text-slate">Max area (sq ft)<input type="number" min={f.minArea??0} inputMode="numeric" className={sel} value={num(f.maxArea)} onChange={e=>setMaxArea(e.target.value?Math.max(0,Number(e.target.value)):undefined)}/></label>
     <div className="flex flex-wrap items-end gap-x-5 gap-y-3 pb-2.5"><label className="flex cursor-pointer items-center gap-2 text-sm text-charcoal"><input type="checkbox" className="h-4 w-4 accent-[#9c7f56]" checked={!!f.verified} onChange={e=>setF({...f,verified:e.target.checked||undefined})}/><BadgeCheck size={15} className="text-[#9c7f56]"/>Verified</label><label className="flex cursor-pointer items-center gap-2 text-sm text-charcoal"><input type="checkbox" className="h-4 w-4 accent-[#9c7f56]" checked={!!f.featured} onChange={e=>setF({...f,featured:e.target.checked||undefined})}/><Star size={15} className="text-[#9c7f56]"/>Featured</label></div>
   </div>
   <button type="button" className="mt-4 text-xs font-medium uppercase tracking-[.18em] text-[#9c7f56] underline decoration-beige/60 underline-offset-4 transition hover:text-matte" onClick={()=>setF(base)}>Clear all filters</button></div>;

 return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-5 md:py-14">
  <div className="grid gap-6 border-b border-line/70 pb-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
   <SectionHead as="h1" eyebrow="Skyline collection" title="Properties in *Hyderabad.*"/>
   <p className="max-w-xl text-sm leading-relaxed text-slate">Discover verified residences, compare options, and refine by location, budget, type, and amenities with clarity.</p>
  </div>

  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
   <p className="text-sm text-slate" aria-live="polite">{loading?"Loading properties…":err?"Unable to load properties.":<><span className="font-medium text-matte">{items.length}</span> {items.length===1?"property":"properties"} found · Compare up to 4</>}</p>
   {active>0&&<p className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[.2em] text-[#9c7f56]"><span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true"/>{active} active filter{active===1?"":"s"}</p>}
  </div>

  {/* Quick category + locality pills */}
  <div className="mt-4 space-y-2.5">
   <div role="group" aria-label="Property categories" className="flex flex-wrap gap-2">{cats.map(c=><button key={c} aria-pressed={f.category===c} onClick={()=>setF({...f,category:c})} className={`h-9 border px-4 text-[11px] font-medium tracking-[.08em] transition-all duration-300 ${f.category===c?"border-matte bg-matte text-ivory shadow-[0_6px_16px_rgba(17,17,17,.18)]":"border-line bg-white text-charcoal hover:-translate-y-px hover:border-matte/50 hover:text-matte"}`}>{c==="All"?"All properties":c}</button>)}</div>
   <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 sm:flex-wrap" role="group" aria-label="Locations">{locations.map(([n])=><button key={n} aria-pressed={f.q===n} onClick={()=>setF({...f,q:f.q===n?undefined:n})} className={`h-9 shrink-0 border px-4 text-[11px] font-medium tracking-[.08em] transition-all duration-300 ${f.q===n?"border-gold bg-gold/25 text-matte shadow-[0_6px_16px_rgba(201,166,107,.25)]":"border-line bg-white text-charcoal hover:-translate-y-px hover:border-matte/50"}`}>{n}</button>)}</div>
  </div>

  {/* Removable filter chips */}
  {chips.length>0&&<div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Active filters">{chips.map(c=><button key={c.label} onClick={c.clear} className="inline-flex h-8 items-center gap-1.5 border border-beige/60 bg-[#f5efe3] pl-3 pr-2 text-[11px] font-medium text-[#6f5c37] transition hover:border-beige hover:bg-[#eee4d2]">{c.label}<X size={13} aria-hidden="true"/><span className="sr-only">Remove filter</span></button>)}<button onClick={()=>setF(base)} className="text-[11px] font-medium uppercase tracking-[.16em] text-slate underline underline-offset-4 transition hover:text-matte">Clear all</button></div>}

  {/* Search toolbar */}
  <div className="mt-4 flex flex-col gap-2.5 rounded-sm border border-line/70 bg-white/85 p-2.5 shadow-[0_10px_28px_rgba(17,17,17,.05)] lg:flex-row lg:items-center">
   <label className="relative flex-1">
     <Search size={17} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate"/>
     <input type="text" aria-label="Search by location" placeholder="Search by project, locality or keyword…" className="h-12 w-full border border-transparent bg-ivory/60 pl-11 pr-10 text-[15px] text-matte transition placeholder:text-slate focus:border-beige/70 focus:bg-white focus:outline-none" value={f.q??""} onChange={e=>setF({...f,q:e.target.value||undefined})}/>
     {f.q&&<button aria-label="Clear search" onClick={()=>setF({...f,q:undefined})} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate transition hover:bg-line/50 hover:text-matte"><X size={16}/></button>}
   </label>
   <div className="flex flex-wrap items-stretch gap-2.5">
     <ChevronSelect label="Buy or rent" value={f.listing??""} onChange={e=>setF({...f,listing:(e.target.value||undefined) as PropertyQuery["listing"]})} className="min-w-[9.5rem] flex-1 lg:flex-none"><option value="">Buy or Rent</option><option>Buy</option><option>Rent</option></ChevronSelect>
     <ChevronSelect label="Sort" value={f.sort ?? "latest"} onChange={e=>setF({...f,sort:e.target.value as PropertyQuery["sort"]})} className="min-w-[10.5rem] flex-1 lg:flex-none"><option value="latest">Latest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></ChevronSelect>
     <button ref={filterTriggerRef} type="button" className="h-11 border border-matte/15 bg-matte px-4 text-[11px] font-medium uppercase tracking-[.16em] text-ivory lg:hidden" onClick={()=>setDrawer(true)}><span className="inline-flex items-center gap-2"><SlidersHorizontal size={15}/>Filters{active>0&&` (${active})`}</span></button>
     <button type="button" className="h-11 w-11 shrink-0 border border-line bg-white text-charcoal transition hover:border-matte hover:text-matte" aria-pressed={listView} aria-label={listView?"Switch to grid view":"Switch to list view"} title={listView?"Grid view":"List view"} onClick={()=>setListView(!listView)}>{listView?<LayoutGrid size={17} className="mx-auto"/>:<Rows3 size={17} className="mx-auto"/>}</button>
   </div>
  </div>

  {/* Desktop filter panel */}
  <div className="mt-3 hidden border border-line/70 bg-white p-4 shadow-[0_8px_24px_rgba(17,17,17,.03)] lg:block">{panel}</div>

  {/* Mobile filters drawer */}
  {drawer&&<div ref={drawerRef} role="dialog" aria-modal="true" aria-label="Filters" className="fixed inset-0 z-50 lg:hidden"><button aria-label="Close filters" className="absolute inset-0 cursor-default bg-matte/65 backdrop-blur-[2px]" onClick={()=>setDrawer(false)}/><div className="absolute inset-x-0 bottom-0 flex max-h-[88svh] flex-col rounded-t-xl bg-white shadow-[0_-12px_40px_rgba(0,0,0,.28)]"><div className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-line" aria-hidden="true"/><div className="flex items-center justify-between border-b border-line/60 px-5 py-4"><h2 className="font-serif text-2xl text-matte">Filters{active>0&&<span className="ml-2 align-middle text-xs font-sans font-medium uppercase tracking-[.18em] text-[#9c7f56]">{active} active</span>}</h2><button ref={drawerCloseRef} type="button" className="rounded-full p-2 transition hover:bg-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matte" aria-label="Close filters" onClick={()=>setDrawer(false)}><X size={20}/></button></div><div className="overflow-y-auto px-5 py-4">{panel}</div><div className="border-t border-line/60 p-4"><button type="button" className="w-full bg-matte py-3.5 text-[11px] font-medium uppercase tracking-[.2em] text-ivory transition hover:bg-charcoal" onClick={()=>setDrawer(false)}>Show {items?.length??0} results</button></div></div></div>}

  {/* Results grid / list */}
  <div className={`mt-8 grid gap-6 ${listView?"max-w-4xl":"sm:grid-cols-2 lg:grid-cols-3"}`}>
   {loading?Array.from({length:6}).map((_,i)=><div key={i} aria-hidden="true" className="overflow-hidden border border-line/60 bg-white"><div className="aspect-[4/3] animate-pulse bg-line/60"/><div className="space-y-3 p-5"><div className="h-3 w-24 animate-pulse bg-line/60"/><div className="h-6 w-3/4 animate-pulse bg-line/60"/><div className="h-4 w-1/2 animate-pulse bg-line/60"/><div className="h-8 w-2/3 animate-pulse bg-line/60"/></div></div>):items.map(p=><PropertyCard key={p.id} list={listView} p={p} saved={saved.includes(p.id)} onToggle={toggle} compared={cmp.includes(p.id)} onCompare={compare}/>)}
  </div>

  {err&&<div role="alert" className="mt-10 border border-red-100 bg-red-50/60 p-8 text-center"><p className="font-serif text-2xl text-matte">We couldn&apos;t load properties</p><p className="mt-2 text-sm text-slate">Please try again. If this persists, refresh the page.</p><button className="mt-4 border border-matte px-5 py-2 text-sm transition hover:bg-matte hover:text-ivory" onClick={()=>setF({...f})}>Try again</button></div>}

  {!err&&!loading&&items?.length===0&&<div className="mt-10 border border-line/70 bg-white p-10 text-center shadow-[0_10px_30px_rgba(17,17,17,.04)]"><p className="font-serif text-3xl text-matte">No properties match these filters</p><p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate">Try broadening your search by clearing filters, adjusting budget, or exploring another location.</p><div className="mt-5 flex flex-wrap justify-center gap-3"><button className="bg-matte px-5 py-2.5 text-sm text-ivory transition hover:bg-charcoal" onClick={()=>setF(base)}>Clear all filters</button><a href="/contact" className="border border-line px-5 py-2.5 text-sm transition hover:border-matte">Speak to an advisor</a></div></div>}

  {picked.length>=2&&<section aria-label="Comparison" className="fixed inset-x-0 bottom-0 z-40 max-h-[60vh] overflow-auto border-t border-line bg-white/98 p-4 shadow-[0_-10px_40px_rgba(17,17,17,.12)] backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between gap-3"><h2 className="font-serif text-xl">Comparing {picked.length}</h2><button type="button" className="text-sm underline underline-offset-4" onClick={clearCompare}>Clear</button></div>
   <div className="mx-auto mt-2 max-w-7xl overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><tbody>{([["Property",(p:Property)=>p.title],["Location",(p:Property)=>p.location],["Type",(p:Property)=>p.category],["Listing",(p:Property)=>p.listing==="Buy"?"For sale":"For rent"],["Price",(p:Property)=>inr(p.price)],["Area",(p:Property)=>`${p.areaSqft} sq ft`],["BHK",(p:Property)=>p.bhk?String(p.bhk):"—"],["Price per sq ft",(p:Property)=>p.areaSqft?inr(Math.round(p.price/p.areaSqft)):"—"],["Verified",(p:Property)=>p.verified?"Yes":"No"],["Amenities",(p:Property)=>p.amenities.join(", ")||"—"]] as [string,(p:Property)=>string][]).map(([k,fn])=><tr key={k} className="border-t border-line align-top"><th className="whitespace-nowrap py-2.5 pr-4 font-normal text-slate">{k}</th>{picked.map(p=><td key={p.id} className="min-w-[10rem] py-2.5 pr-4">{fn(p)}</td>)}</tr>)}</tbody></table></div></section>}
 </div>;
}
