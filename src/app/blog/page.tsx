"use client";
import SectionHead from "@/components/common/SectionHead";
import Link from "next/link";
import { useState } from "react";
import { posts } from "@/data/blogs";
import { ArrowUpRight } from "lucide-react";
const cats=["All",...Array.from(new Set(posts.map(p=>p.category)))];
export default function Blog(){const [c,setC]=useState("All");const [q,setQ]=useState("");const list=posts.filter(p=>(c==="All"||p.category===c)&&`${p.title} ${p.summary}`.toLowerCase().includes(q.toLowerCase()));const [first,...rest]=list;
 return <div className="relative overflow-hidden bg-ivory/30">
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_10%,rgba(216,195,165,.16),transparent_40%),radial-gradient(ellipse_at_90%_80%,rgba(17,17,17,.04),transparent_45%)]"/>
  <div className="relative mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
   <div className="grid gap-6 border-b border-line/70 pb-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
    <SectionHead as="h1" eyebrow="Insights and journal" title="Reading for *better decisions.*"/>
    <p className="max-w-xl text-sm leading-relaxed text-slate">Perspectives on buying, neighbourhoods, investment, and the details that matter when choosing a home.</p>
   </div>
   <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <input aria-label="Search articles" placeholder="Search articles" value={q} onChange={e=>setQ(e.target.value)} className="w-full max-w-md border border-line bg-white px-4 py-3 text-sm focus:border-beige/60 focus:outline-none"/>
    <div className="flex flex-wrap gap-2">{cats.map(x=><button type="button" key={x} aria-pressed={c===x} onClick={()=>setC(x)} className={`border px-4 py-2 text-xs uppercase tracking-[.14em] transition ${c===x?"border-matte bg-matte text-ivory":"border-line bg-white hover:border-matte"}`}>{x}</button>)}</div>
   </div>
   {list.length===0&&<div className="mt-10 border border-line/70 bg-white p-10 text-center"><p className="font-serif text-2xl text-matte">No articles match your search</p><p className="mt-2 text-sm text-slate">Try a different keyword or category.</p></div>}
   {first&&<Link href={`/blog/${first.slug}`} className="group mt-10 grid overflow-hidden border border-line/70 bg-white shadow-[0_14px_40px_rgba(17,17,17,.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(17,17,17,.09)] lg:grid-cols-[1.1fr_.9fr]">
    <div className="relative min-h-[14rem] bg-matte p-8 text-ivory md:p-10">
     <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(216,195,165,.20),transparent_45%)]"/>
     <p className="relative text-[11px] uppercase tracking-[.28em] text-beige/85">Featured · {first.category}</p>
     <h2 className="relative mt-3 font-serif text-3xl leading-tight md:text-5xl">{first.title}</h2>
    </div>
    <div className="flex flex-col justify-center p-8 md:p-10">
     <p className="text-sm leading-relaxed text-slate md:text-[15px]">{first.summary}</p>
     <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-matte transition group-hover:text-[#9c7f56]">Read article <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/></span>
    </div>
   </Link>}
   <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{rest.map(p=><article key={p.slug} className="group flex flex-col border border-line/70 bg-white p-6 shadow-[0_10px_30px_rgba(17,17,17,.04)] transition-all duration-500 hover:-translate-y-1 hover:border-beige/50 hover:shadow-[0_18px_42px_rgba(17,17,17,.08)]"><p className="text-[11px] uppercase tracking-[.22em] text-[#9c7f56]">{p.category}</p><h2 className="mt-3 font-serif text-2xl leading-tight"><Link href={`/blog/${p.slug}`} className="text-matte transition hover:text-[#9c7f56]">{p.title}</Link></h2><p className="mt-3 flex-1 text-sm leading-relaxed text-slate">{p.summary}</p><Link href={`/blog/${p.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-matte transition group-hover:text-[#9c7f56]">Read article <ArrowUpRight size={14}/></Link></article>)}</div>
  </div>
 </div>;}