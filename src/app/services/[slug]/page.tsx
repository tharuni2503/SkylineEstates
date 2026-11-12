import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/data/services";
import { ArrowLeft, Check } from "lucide-react";
export function generateStaticParams(){return services.map(s=>({slug:s.slug}));}
export default function ServicePage({params}:{params:{slug:string}}){const s=services.find(x=>x.slug===params.slug);if(!s)notFound();
 return <div className="bg-ivory/30"><div className="mx-auto max-w-4xl px-5 py-12 md:py-16">
  <Link href="/services" className="inline-flex items-center gap-2 text-sm text-slate transition hover:text-matte"><ArrowLeft size={15}/>All services</Link>
  <header className="mt-8 grid gap-6 border-b border-line/70 pb-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
   <div>
    <p className="text-[11px] uppercase tracking-[.28em] text-[#9c7f56]">Skyline Service</p>
    <h1 className="mt-3 font-serif text-4xl leading-tight text-matte md:text-6xl">{s.title}</h1>
   </div>
   <p className="text-base leading-relaxed text-slate">{s.summary}</p>
  </header>
  <section className="mt-10 border border-line/70 bg-white p-6 shadow-[0_12px_34px_rgba(17,17,17,.04)] md:p-8">
   <h2 className="font-serif text-3xl text-matte">How we support you</h2>
   <ul className="mt-6 grid gap-4 sm:grid-cols-2">{s.points.map((p,i)=><li key={p} className="flex gap-3 border-b border-line/60 pb-4"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-beige/30 text-[#9c7f56]"><Check size={14}/></span><span className="text-sm leading-relaxed text-charcoal/85"><span className="mr-2 font-medium text-matte">0{i+1}.</span>{p}</span></li>)}</ul>
  </section>
  <div className="mt-8 flex flex-wrap items-center gap-4 border border-line/70 bg-matte p-6 text-ivory md:p-8">
   <div className="min-w-[14rem] flex-1"><p className="font-serif text-2xl">Ready to get started?</p><p className="mt-1 text-sm text-ivory/70">Book a consultation and we’ll guide you through the next steps with clarity.</p></div>
   <Link href="/contact" className="inline-flex bg-beige px-7 py-3 text-[11px] font-medium uppercase tracking-[.18em] text-matte transition hover:bg-ivory">Book a consultation</Link>
  </div>
 </div></div>;}