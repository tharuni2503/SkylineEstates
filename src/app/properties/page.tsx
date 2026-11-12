"use client";
import SectionHead from "@/components/common/SectionHead";
import { useEffect, useState } from "react";
import { filterProperties } from "@/services/propertyService";
import type { Property, PropertyQuery } from "@/types";
import { useStore } from "@/lib/store";
import PropertyCard from "@/components/properties/PropertyCard";
import { inr } from "@/lib/format";
import { locations } from "@/data/content";

const budgets:[number,string][]=[[0,"Any"],[2500000,"₹25 L"],[5000000,"₹50 L"],[7500000,"₹75 L"],[10000000,"₹1 Cr"],[20000000,"₹2 Cr"],[50000000,"₹5 Cr"]];
const cats=["All","Apartment","Villa","Independent House","Residential Plot","Commercial"] as const;
const amen=["Clubhouse","Swimming Pool","Gym","Power Backup","Covered Parking","Security","Landscaped Garden","EV Charging"];
const base:PropertyQuery={category:"All",sort:"latest"};

export default function PropertiesPage(){
 const [f,setF]=useState<PropertyQuery>(base);
 const [items,setItems]=useState<Property[]|null>(null);
 const {properties:list,ready,wishlist:saved,toggleWish:toggle,compare:cmp,toggleCompare:compare,clearCompare}=useStore();
 const [listView,setListView]=useState(false);
 const [err,setErr]=useState(false);
 const [drawer,setDrawer]=useState(false);

 useEffect(()=>{const s=new URLSearchParams(window.location.search);const c=s.get("category"),q=s.get("q"),l=s.get("listing"),m=s.get("maxPrice"),b=s.get("bhk"),mn=s.get("minPrice");setF(x=>({...x,...(c&&{category:c as PropertyQuery["category"]}),...(q&&{q}),...(l&&{listing:l as PropertyQuery["listing"]}),...(m&&{maxPrice:+m}),...(b&&{bhk:+b}),...(mn&&{minPrice:+mn})}));},[]);
 useEffect(()=>{if(!ready)return;setErr(false);try{setItems(filterProperties(list,f));}catch{setErr(true);setItems([]);}},[f,list,ready]);

 const cls="border border-line bg-white px-4 py-3 text-sm transition focus:border-beige/70 focus:outline-none";
 const picked=list.filter(p=>cmp.includes(p.id));
 const sel=`mt-1 w-full ${cls}`;
 const num=(v?:number)=>v===undefined?"":String(v);
 const active=Object.entries(f).filter(([k,v])=>v!==undefined&&v!==""&&v!==false&&!(k==="category"&&v==="All")&&!(k==="sort"&&v==="latest")).length;
 const loading = items===null;

 const panel=<div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <label className="text-sm">Type<select className={sel} value={f.category} onChange={e=>setF({...f,category:e.target.value as PropertyQuery["category"]})}>{cats.map(c=><option key={c}>{c}</option>)}</select></label>
    <label className="text-sm">BHK<select className={sel} value={f.bhk??""} onChange={e=>setF({...f,bhk:e.target.value?+e.target.value:undefined})}><option value="">Any</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n===5?"5+ BHK":`${n} BHK`}</option>)}</select></label>
    <label className="text-sm">Amenity<select className={sel} value={f.amenity??""} onChange={e=>setF({...f,amenity:e.target.value||undefined})}><option value="">Any</option>{amen.map(a=><option key={a}>{a}</option>)}</select></label>
    <label className="text-sm">Min budget<select className={sel} value={f.minPrice??0} onChange={e=>setF({...f,minPrice:+e.target.value||undefined})}>{budgets.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
    <label className="text-sm">Max budget<select className={sel} value={f.maxPrice??0} onChange={e=>setF({...f,maxPrice:+e.target.value||undefined})}>{budgets.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
    <label className="text-sm">Min area (sq ft)<input type="number" min={0} className={sel} value={num(f.minArea)} onChange={e=>setF({...f,minArea:e.target.value?+e.target.value:undefined})}/></label>
    <label className="text-sm">Max area (sq ft)<input type="number" min={0} className={sel} value={num(f.maxArea)} onChange={e=>setF({...f,maxArea:e.target.value?+e.target.value:undefined})}/></label>
    <div className="flex items-end gap-4 pb-3 text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={!!f.verified} onChange={e=>setF({...f,verified:e.target.checked||undefined})}/>Verified</label><label className="flex items-center gap-2"><input type="checkbox" checked={!!f.featured} onChange={e=>setF({...f,featured:e.target.checked||undefined})}/>Featured</label></div></div>
   <button className="mt-4 text-sm underline underline-offset-4 hover:text-matte" onClick={()=>setF(base)}>Clear all filters</button></div>;

 return <div className="mx-auto max-w-7xl px-5 py-12 md:py-14">
  <div className="grid gap-6 border-b border-line/70 pb-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
   <SectionHead as="h1" eyebrow="Skyline collection" title="Properties in *Hyderabad.*"/>
   <p className="max-w-xl text-sm leading-relaxed text-slate">Discover verified residences, compare options, and refine by location, budget, type, and amenities with clarity.</p>
  </div>
  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
   <p className="text-sm text-slate" aria-live="polite">{loading?"Loading properties…":err?"Unable to load properties.":`${items.length} ${items.length===1?"property":"properties"} found.`} {!loading&&!err&&" Compare up to 4."}</p>
   {active>0&&<p className="text-xs uppercase tracking-[.18em] text-[#9c7f56]">{active} active filter{active===1?"":"s"}</p>}
  </div>

  <div className="mt-8 space-y-3">
   <div role="group" aria-label="Property categories" className="flex flex-wrap gap-2">{cats.map(c=><button key={c} aria-pressed={f.category===c} onClick={()=>setF({...f,category:c})} className={`border px-4 py-2 text-xs tracking-wide transition ${f.category===c?"border-matte bg-matte text-ivory shadow-sm":"border-line bg-white hover:border-matte hover:bg-ivory"}`}>{c==="All"?"All properties":c}</button>)}</div>
   <div role="group" aria-label="Locations" className="flex flex-wrap gap-2">{locations.map(([n])=><button key={n} aria-pressed={f.q===n} onClick={()=>setF({...f,q:f.q===n?undefined:n})} className={`border px-4 py-2 text-xs tracking-wide transition ${f.q===n?"border-gold bg-gold/20 text-matte":"border-line bg-white hover:border-matte"}`}>{n}</button>)}</div>
  </div>

  <div className="mt-5 flex flex-wrap gap-3 rounded-sm border border-line/70 bg-white/70 p-3 shadow-[0_8px_24px_rgba(17,17,17,.03)]">
   <input aria-label="Search by location" placeholder="Search by name or location" className={`min-w-0 w-full flex-1 sm:min-w-[15rem] ${cls}`} value={f.q??""} onChange={e=>setF({...f,q:e.target.value})}/>
   <select aria-label="Buy or rent" className={`min-w-0 flex-1 sm:flex-none ${cls}`} value={f.listing??""} onChange={e=>setF({...f,listing:(e.target.value||undefined) as PropertyQuery["listing"]})}><option value="">Buy or Rent</option><option>Buy</option><option>Rent</option></select>
   <select aria-label="Sort" className={`min-w-0 flex-1 sm:flex-none ${cls}`} value={f.sort} onChange={e=>setF({...f,sort:e.target.value as PropertyQuery["sort"]})}><option value="latest">Latest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select>
   <button className={`${cls} lg:hidden`} onClick={()=>setDrawer(true)}>Filters{active>0?` (${active})`:""}</button>
   <button className={cls} aria-pressed={listView} onClick={()=>setListView(!listView)}>{listView?"Grid view":"List view"}</button>
  </div>

  <div className="mt-3 hidden border border-line/70 bg-white p-4 lg:block">{panel}</div>

  {drawer&&<div role="dialog" aria-modal="true" aria-label="Filters" className="fixed inset-0 z-50 lg:hidden"><button aria-label="Close filters" className="absolute inset-0 bg-matte/60" onClick={()=>setDrawer(false)}/><div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto bg-white p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-serif text-xl">Filters</h2><button className="text-sm underline" onClick={()=>setDrawer(false)}>Close</button></div>{panel}<button className="mt-6 w-full bg-matte py-3 text-sm text-ivory" onClick={()=>setDrawer(false)}>Show {items?.length??0} results</button></div></div>}

  <div className={`mt-8 grid gap-6 ${listView?"max-w-4xl":"sm:grid-cols-2 lg:grid-cols-3"}`}>
   {loading?Array.from({length:6}).map((_,i)=><div key={i} className="overflow-hidden border border-line/60 bg-white"><div className="aspect-[4/3] animate-pulse bg-line/70"/><div className="space-y-3 p-5"><div className="h-3 w-24 animate-pulse bg-line/70"/><div className="h-6 w-3/4 animate-pulse bg-line/70"/><div className="h-4 w-1/2 animate-pulse bg-line/70"/><div className="h-8 w-2/3 animate-pulse bg-line/70"/></div></div>):items.map(p=><PropertyCard key={p.id} list={listView} p={p} saved={saved.includes(p.id)} onToggle={toggle} compared={cmp.includes(p.id)} onCompare={compare}/>)}
  </div>

  {err&&<div role="alert" className="mt-10 border border-red-100 bg-red-50/60 p-8 text-center"><p className="font-serif text-2xl text-matte">We couldn&apos;t load properties</p><p className="mt-2 text-sm text-slate">Please try again. If this persists, refresh the page.</p><button className="mt-4 border border-matte px-5 py-2 text-sm transition hover:bg-matte hover:text-ivory" onClick={()=>setF({...f})}>Try again</button></div>}

  {!err&&!loading&&items?.length===0&&<div className="mt-10 border border-line/70 bg-white p-10 text-center shadow-[0_10px_30px_rgba(17,17,17,.04)]"><p className="font-serif text-3xl text-matte">No properties match these filters</p><p className="mx-auto mt-2 max-w-md text-sm text-slate">Try broadening your search by clearing filters, adjusting budget, or exploring another location.</p><div className="mt-5 flex flex-wrap justify-center gap-3"><button className="bg-matte px-5 py-2.5 text-sm text-ivory transition hover:bg-charcoal" onClick={()=>setF(base)}>Clear all filters</button><a href="/contact" className="border border-line px-5 py-2.5 text-sm transition hover:border-matte">Speak to an advisor</a></div></div>}

  {picked.length>=2&&<section aria-label="Comparison" className="fixed inset-x-0 bottom-0 z-40 max-h-[60vh] overflow-auto border-t border-line bg-white/98 p-4 shadow-[0_-10px_40px_rgba(17,17,17,.12)] backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between gap-3"><h2 className="font-serif text-xl">Comparing {picked.length}</h2><button className="text-sm underline" onClick={clearCompare}>Clear</button></div>
   <div className="mx-auto mt-2 max-w-7xl overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><tbody>{([["Property",(p:Property)=>p.title],["Location",(p:Property)=>p.location],["Type",(p:Property)=>p.category],["Listing",(p:Property)=>p.listing==="Buy"?"For sale":"For rent"],["Price",(p:Property)=>inr(p.price)],["Area",(p:Property)=>`${p.areaSqft} sq ft`],["BHK",(p:Property)=>p.bhk?String(p.bhk):"—"],["Price per sq ft",(p:Property)=>p.areaSqft?inr(Math.round(p.price/p.areaSqft)):"—"],["Verified",(p:Property)=>p.verified?"Yes":"No"],["Amenities",(p:Property)=>p.amenities.join(", ")||"—"]] as [string,(p:Property)=>string][]).map(([k,fn])=><tr key={k} className="border-t border-line align-top"><th className="whitespace-nowrap py-2.5 pr-4 font-normal text-slate">{k}</th>{picked.map(p=><td key={p.id} className="min-w-[10rem] py-2.5 pr-4">{fn(p)}</td>)}</tr>)}</tbody></table></div></section>}
 </div>;
}