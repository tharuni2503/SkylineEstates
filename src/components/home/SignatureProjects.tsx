"use client";
import Link from "next/link";
import SectionHead from "@/components/common/SectionHead";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";

// Uses featured listings from the store so admin changes update the homepage.
export default function SignatureProjects() {
  const { properties, ready } = useStore();
  const items = properties.filter((p) => p.featured).slice(0, 3);
  if (!ready) return <section aria-label="Signature projects" className="mx-auto max-w-7xl px-5 py-20"><div className="aspect-[21/9] animate-pulse bg-line/50" /></section>;
  if (!items.length) return null;
  return (
    <section aria-label="Signature projects" className="mx-auto max-w-7xl px-5 py-20">
      <SectionHead eyebrow="Signature projects" title="Residences worth *a closer look.*" />
      <div className="mt-10 space-y-6">
        {items.map((p) => (
          <article key={p.id} className="group relative aspect-[4/5] overflow-hidden bg-matte text-ivory sm:aspect-[16/9] lg:aspect-[21/9]">
            <img src={p.image} alt={p.title} loading="lazy" onError={(e)=>{const t=e.currentTarget;if(t.dataset.fallback)return;t.dataset.fallback="1";t.src="/images/hero-3d.jpg";}} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-matte/85 via-matte/30 to-transparent" aria-hidden="true" />
            <div className="absolute inset-0 flex flex-col justify-end gap-3 p-6 md:max-w-xl md:p-10">
              <h3 className="font-serif text-3xl md:text-5xl">{p.title}</h3>
              <p className="text-sm text-ivory/80">{p.location.split(",")[0]} · {p.bhk ? `${p.bhk} BHK · ` : ""}{p.areaSqft} sq ft · {inr(p.price)}</p>
              <Link href={`/property/${p.id}`} className="mt-2 inline-block self-start border border-ivory/70 px-7 py-3 text-xs font-medium tracking-[.18em] transition hover:bg-ivory hover:text-matte">EXPLORE PROJECT</Link>
            </div>
          </article>
        ))}
      </div>
      <Link href="/projects" className="mt-8 inline-block border-b border-matte pb-1 text-sm">View all projects</Link>
    </section>
  );
}
