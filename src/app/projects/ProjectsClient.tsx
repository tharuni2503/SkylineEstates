"use client";
import Link from "next/link";
import SectionHead from "@/components/common/SectionHead";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";
import { ArrowUpRight } from "lucide-react";

export default function ProjectsClient() {
  const { properties, ready } = useStore();
  const items = properties.filter((p) => p.featured);

  return (
    <div className="relative overflow-hidden bg-ivory/40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_10%,rgba(216,195,165,.18),transparent_40%),radial-gradient(ellipse_at_90%_80%,rgba(17,17,17,.04),transparent_45%)]" />
      <div className="relative mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <div className="grid gap-6 border-b border-line/70 pb-8 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
          <SectionHead as="h1" eyebrow="Signature projects" title="Residences worth *a closer look.*" />
          <p className="max-w-xl text-sm leading-relaxed text-slate lg:pt-10">A curated selection of featured homes and developments, presented with the detail and clarity they deserve.</p>
        </div>
        {!ready ? (
          <div className="mt-10 space-y-10">{[0, 1].map((i) => <div key={i} className="aspect-[16/8] animate-pulse border border-line/60 bg-line/50" />)}</div>
        ) : items.length === 0 ? (
          <div className="mt-10 border border-line/70 bg-white p-10 text-center shadow-[0_10px_30px_rgba(17,17,17,.04)]">
            <p className="font-serif text-3xl text-matte">No featured projects yet</p>
            <p className="mt-2 text-sm text-slate">An admin can mark listings as featured to showcase them here.</p>
            <Link href="/properties" className="mt-5 inline-flex bg-matte px-6 py-3 text-[11px] font-medium uppercase tracking-[.18em] text-ivory transition hover:bg-charcoal">Browse all properties</Link>
          </div>
        ) : (
          <div className="mt-10 space-y-8 md:space-y-10">
            {items.map((p, i) => (
              <article key={p.id} className={`group grid overflow-hidden border border-line/70 bg-white shadow-[0_12px_34px_rgba(17,17,17,.05)] transition-all duration-500 hover:shadow-[0_22px_50px_rgba(17,17,17,.09)] md:grid-cols-2 ${i % 2 ? "md:[&>div:first-child]:order-2" : ""}`}>
                <div className="relative aspect-[4/3] min-h-[16rem] overflow-hidden bg-[#ece7df] md:aspect-auto">
                  <img src={p.image} alt={p.title} loading="lazy" onError={(e)=>{const t=e.currentTarget;if(t.dataset.fallback)return;t.dataset.fallback="1";t.src="/images/hero-3d.jpg";}} className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-[1.05]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-matte/30 via-transparent to-transparent opacity-60" aria-hidden="true"/>
                </div>
                <div className="flex flex-col justify-center p-6 md:p-10">
                  <p className="text-[11px] tracking-[.26em] text-[#9c7f56]">FEATURED {p.category.toUpperCase()}</p>
                  <h2 className="mt-3 font-serif text-3xl leading-tight text-matte md:text-4xl">{p.title}</h2>
                  <p className="mt-2 text-slate">{p.location}</p>
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-charcoal/80">
                    {p.bhk ? <span>{p.bhk} BHK</span> : null}
                    <span>{p.areaSqft.toLocaleString()} sq ft</span>
                    <span>{p.listing === "Rent" ? "For rent" : "For sale"}</span>
                  </div>
                  <p className="mt-4 font-serif text-3xl text-matte">{inr(p.price)}{p.listing === "Rent" ? <span className="ml-1 font-sans text-sm font-normal text-slate">/ month</span> : null}</p>
                  <div className="mt-7">
                    <Link href={`/property/${p.id}`} className="inline-flex items-center gap-2 bg-matte px-7 py-3 text-[11px] font-medium uppercase tracking-[.18em] text-ivory transition hover:bg-charcoal">Explore project <ArrowUpRight size={15}/></Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}