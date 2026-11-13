"use client";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/lib/toast";
import { categories, locations } from "@/data/content";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { CONTACT_EMAIL, CONTACT_ADDRESS } from "@/lib/contact";
const nav=[["Home","/"],["Properties","/properties"],["Locations","/locations"],["Projects","/projects"],["About Us","/about"],["Contact Us","/contact"],["AI Assistant","/ai-assistant"],["Insights","/blog"]];
export default function Footer(){
 const toast=useToast();const [email,setEmail]=useState("");const [err,setErr]=useState("");
 const sub=(e:React.FormEvent)=>{e.preventDefault();if(!/^\S+@\S+\.\S+$/.test(email)){setErr("Enter a valid email address");return;}setErr("");setEmail("");toast("Thanks. Newsletter sign-up is a demo and nothing was stored.");};
 const h="text-[11px] font-medium uppercase tracking-[.28em] text-beige/90";
 return <footer data-site-reveal className="relative overflow-hidden bg-matte px-5 pb-8 pt-20 text-ivory/75 md:px-8">
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(216,195,165,.12),transparent_35%),radial-gradient(ellipse_at_90%_100%,rgba(201,166,107,.10),transparent_30%)]"/>
  <div className="relative mx-auto mb-14 flex max-w-7xl flex-col items-start justify-between gap-6 border-b border-ivory/10 pb-10 lg:flex-row lg:items-end">
   <div>
    <p className="text-[11px] uppercase tracking-[.35em] text-beige/80">Private Real Estate Advisory</p>
    <h2 className="mt-3 max-w-2xl font-serif text-3xl leading-tight text-ivory md:text-5xl">Begin your search with clarity, care, and confidence.</h2>
   </div>
   <Link href="/contact" className="group inline-flex items-center gap-2 border border-beige/40 bg-beige/10 px-6 py-3 text-[11px] font-medium uppercase tracking-[.2em] text-ivory transition hover:border-beige hover:bg-beige hover:text-matte">Speak to an advisor <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/></Link>
  </div>
  <div className="relative mx-auto grid max-w-7xl gap-10 border-b border-ivory/10 pb-14 sm:grid-cols-2 lg:grid-cols-12">
   <div className="lg:col-span-4"><p className="font-serif text-3xl text-ivory">Skyline Estates</p><p className="mt-3 max-w-sm text-sm leading-relaxed text-ivory/65">A premium real-estate experience for Hyderabad, pairing curated residences, verified information, and attentive advisory.</p>
    <div className="mt-5 space-y-2 text-sm text-ivory/65"><p className="flex items-center gap-2"><MapPin size={14} className="text-beige"/>{CONTACT_ADDRESS}</p><p className="flex items-center gap-2"><Mail size={14} className="text-beige"/><a href={`mailto:${CONTACT_EMAIL}`} className="transition hover:text-ivory">{CONTACT_EMAIL}</a></p><p className="text-xs text-ivory/45">Demo contact details — replace with approved business information before launch.</p></div>
    <form onSubmit={sub} noValidate className="mt-6"><label className="text-[11px] uppercase tracking-[.22em] text-beige" htmlFor="news">Newsletter</label>
     <div className="mt-2 flex gap-2"><input id="news" value={email} onChange={e=>setEmail(e.target.value)} aria-invalid={!!err} aria-describedby={err?"news-err":undefined} placeholder="Email address" className="min-w-0 flex-1 border border-ivory/10 bg-charcoal/80 px-3 py-2.5 text-sm text-ivory placeholder:text-ivory/35 focus:border-beige/40 focus:outline-none"/><button className="bg-beige px-4 py-2.5 text-sm font-medium text-matte transition hover:bg-ivory">Join</button></div>
     {err&&<p id="news-err" role="alert" className="mt-1 text-xs text-beige">{err}</p>}</form></div>
   <nav aria-label="Navigate" className="lg:col-span-2 lg:col-start-6"><p className={h}>Navigate</p><ul className="mt-4 space-y-2.5 text-sm">{nav.map(([l,href])=><li key={href}><Link href={href} className="transition hover:text-ivory">{l}</Link></li>)}</ul></nav>
   <div className="lg:col-span-3"><p className={h}>Explore</p><ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm sm:grid-cols-1">{categories.slice(0,5).map(c=><li key={c}><Link href={`/properties?category=${encodeURIComponent(c)}`} className="transition hover:text-ivory">{c}</Link></li>)}{locations.slice(0,4).map(([n])=><li key={n}><Link href={`/properties?q=${encodeURIComponent(n)}`} className="transition hover:text-ivory">{n}</Link></li>)}</ul></div>
   <div className="lg:col-span-2"><p className={h}>Account</p><ul className="mt-4 space-y-2.5 text-sm">{[["Sign in","/login"],["Create account","/register"],["Wishlist","/wishlist"],["Dashboard","/dashboard"],["Builder","/builder"],["Admin","/admin"]].map(([l,href])=><li key={href}><Link href={href} className="transition hover:text-ivory">{l}</Link></li>)}</ul></div>
  </div>
  <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 pt-6 text-xs text-ivory/45"><p>© {new Date().getFullYear()} Skyline Estates. Demonstration experience with sample data and actions.</p>
   <nav aria-label="Legal" className="flex gap-4"><Link href="/privacy" className="transition hover:text-ivory">Privacy</Link><Link href="/terms" className="transition hover:text-ivory">Terms</Link></nav></div>
 </footer>;
}