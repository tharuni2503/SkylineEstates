import SectionHead from "@/components/common/SectionHead";
import Image from "next/image";
import Link from "next/link";
import MaskReveal from "@/components/common/MaskReveal";

const values=[["Reviewed before listing (demo)","In a live deployment, each property would be inspected and its documents checked before going live."],["Prices you can trust","We aim to show clear costs, including indicative charges, so you can compare with confidence."],["Local, not generic","Our advisors focus on the neighbourhoods they know well."],["Advice before sales","We believe good guidance includes saying when not to buy."]];
const stats=[["12","Curated listings in this demo"],["8","Hyderabad localities covered"],["6","Services under one roof"]];
const team=[["Lakshmi Prasad","Senior advisor, Gachibowli"],["Imran Siddiqui","Advisor, Narsingi and Kokapet"],["Meera Iyer","Head of builder partnerships"],["Rohan Das","Investment analyst"]];

export default function About(){return <div className="bg-ivory/30">
 <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
  <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
   <div>
    <SectionHead as="h1" eyebrow="About Skyline Estates" title="A property company built around the *buyer's questions.*" className="max-w-3xl"/>
    <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-charcoal/80">Skyline Estates began with a simple frustration: finding a home in Hyderabad meant juggling listings, brokers, and half-answered questions. We bring verified properties, local advisors, and thoughtful guidance together so every decision feels clear and confident.</p>
   </div>
   <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
    {stats.map(([n,l])=><div key={l} className="border border-line/70 bg-white p-5 shadow-[0_10px_30px_rgba(17,17,17,.04)]"><p className="font-serif text-4xl text-matte">{n}</p><p className="mt-1 text-sm text-slate">{l}</p></div>)}
    <p className="col-span-2 text-xs text-slate sm:col-span-3 lg:col-span-2">Figures describe this demonstration site and will be replaced with company data.</p>
   </div>
  </div>
  <MaskReveal className="mt-10"><div className="relative aspect-[16/9] overflow-hidden border border-line/70 bg-matte/5"><Image src="/brand-sign.jpg" alt="Skyline Estates sign: Find your perfect space" fill priority sizes="(min-width:1280px) 1280px,100vw" className="object-cover"/></div></MaskReveal>
 </section>

 <section className="relative overflow-hidden bg-matte py-16 text-ivory md:py-20">
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(216,195,165,.14),transparent_45%),radial-gradient(ellipse_at_85%_80%,rgba(248,245,240,.06),transparent_40%)]"/>
  <div className="relative mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-2 md:px-8">
   <div className="border border-ivory/10 bg-ivory/[0.03] p-7"><p className="text-[11px] uppercase tracking-[.28em] text-beige/80">Vision</p><h2 className="mt-3 font-serif text-3xl md:text-4xl">A more trusted way home.</h2><p className="mt-3 leading-relaxed text-ivory/75">To be the most trusted way to find a home or an investment in Hyderabad and the cities that follow.</p></div>
   <div className="border border-ivory/10 bg-ivory/[0.03] p-7"><p className="text-[11px] uppercase tracking-[.28em] text-beige/80">Mission</p><h2 className="mt-3 font-serif text-3xl md:text-4xl">Clarity in every decision.</h2><p className="mt-3 leading-relaxed text-ivory/75">To make every property decision clear: honest information, transparent costs, and advisors who answer to the buyer first.</p></div>
  </div>
 </section>

 <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
  <SectionHead eyebrow="Our principles" title="What we hold *ourselves to.*" />
  <dl className="mt-10 grid gap-4 sm:grid-cols-2">{values.map(([t,d],i)=><div key={t} className="group border border-line/70 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:border-beige/50 hover:shadow-[0_18px_40px_rgba(17,17,17,.07)]"><p className="text-[11px] uppercase tracking-[.22em] text-[#9c7f56]">0{i+1}</p><dt className="mt-2 font-serif text-2xl text-matte">{t}</dt><dd className="mt-2 text-sm leading-relaxed text-slate">{d}</dd></div>)}</dl>
 </section>

 <section className="border-y border-line/70 bg-white py-16 md:py-20">
  <div className="mx-auto max-w-7xl px-5 md:px-8">
   <SectionHead eyebrow="Our people" title="The team behind *the guidance.*" />
   <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{team.map(([n,r])=><li key={n} className="group border border-line/70 bg-ivory/50 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-beige/50 hover:bg-white hover:shadow-[0_16px_36px_rgba(17,17,17,.07)]"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-matte font-serif text-lg text-ivory transition-colors duration-300 group-hover:bg-[#9c7f56]" aria-hidden="true">{n.split(" ").map(w=>w[0]).join("")}</span><p className="mt-4 font-serif text-xl text-matte">{n}</p><p className="mt-1 text-sm text-slate">{r}</p></li>)}</ul>
   <p className="mt-4 text-xs text-slate">Sample team members for demonstration.</p>
  </div>
 </section>

 <section className="relative overflow-hidden bg-[#f3efe8] py-16 text-center md:py-20">
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(216,195,165,.22),transparent_55%)]"/>
  <div className="relative mx-auto max-w-3xl px-5">
   <p className="text-[11px] uppercase tracking-[.3em] text-[#9c7f56]">Begin a conversation</p>
   <h2 className="mt-3 font-serif text-3xl text-matte md:text-5xl">Talk to someone who knows the neighbourhood.</h2>
   <p className="mt-4 text-sm leading-relaxed text-slate">Personal guidance, curated shortlists, and clarity at every step.</p>
   <Link href="/contact" className="mt-7 inline-flex bg-matte px-8 py-3.5 text-[11px] font-medium uppercase tracking-[.18em] text-ivory transition hover:bg-charcoal">Contact an advisor</Link>
  </div>
 </section>
</div>;}