import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "@/data/blogs";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
export function generateStaticParams(){return posts.map(p=>({slug:p.slug}));}
export default function Post({params}:{params:{slug:string}}){const p=posts.find(x=>x.slug===params.slug);if(!p)notFound();
 const related=[...posts.filter(x=>x.slug!==p.slug&&x.category===p.category),...posts.filter(x=>x.slug!==p.slug&&x.category!==p.category)].slice(0,3);
 return <div className="bg-ivory/30"><article className="mx-auto max-w-3xl px-5 py-12 md:py-16">
  <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-slate transition hover:text-matte"><ArrowLeft size={15}/>All insights</Link>
  <header className="mt-8 border-b border-line/70 pb-8">
   <p className="text-[11px] uppercase tracking-[.28em] text-[#9c7f56]">{p.category}</p>
   <h1 className="mt-3 font-serif text-4xl leading-tight text-matte md:text-6xl">{p.title}</h1>
   <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate">{p.summary}</p>
  </header>
  <div className="mt-10 space-y-6 text-[1.02rem] leading-[1.85] text-charcoal/85">{p.body.map((t,i)=><p key={i}>{t}</p>)}</div>
  <section className="mt-16 border-t border-line/70 pt-10">
   <p className="text-[11px] uppercase tracking-[.28em] text-[#9c7f56]">Continue reading</p>
   <h2 className="mt-2 font-serif text-3xl text-matte">Related articles</h2>
   <ul className="mt-6 grid gap-4 sm:grid-cols-3">{related.map(r=><li key={r.slug}><Link href={`/blog/${r.slug}`} className="group flex h-full flex-col border border-line/70 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-beige/50 hover:shadow-[0_14px_34px_rgba(17,17,17,.07)]"><p className="text-[10px] uppercase tracking-[.18em] text-slate">{r.category}</p><p className="mt-2 flex-1 font-serif text-xl leading-tight text-matte">{r.title}</p><span className="mt-4 inline-flex items-center gap-1.5 text-sm text-[#9c7f56]">Read <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/></span></Link></li>)}</ul>
  </section>
 </article></div>;}