"use client";
import Link from "next/link";
import { locations } from "@/data/content";
import { useStore } from "@/lib/store";

const LOCATION_IMAGES: Record<string, string> = {
  Gachibowli: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
  Kokapet: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
  Narsingi: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
  "Financial District": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
  Tellapur: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  Kondapur: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
  Miyapur: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80",
};
const FALLBACK = "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1600&q=80";

export default function LocationsShowcase() {
  const { properties } = useStore();
  return (
    <ul className="mt-10 grid auto-rows-[240px] grid-cols-1 gap-6 sm:auto-rows-[260px] sm:grid-cols-2 lg:auto-rows-[220px] lg:grid-cols-12">
      {locations.map(([name, blurb], i) => {
        const here = properties.filter((p) => p.location.startsWith(name));
        const img = LOCATION_IMAGES[name] ?? here[0]?.image ?? FALLBACK;
        const span = i === 0
          ? "sm:col-span-2 lg:col-span-7 lg:row-span-2"
          : i === 1
          ? "sm:col-span-1 lg:col-span-5 lg:row-span-2"
          : i === 2
          ? "lg:col-span-4"
          : i === 3
          ? "lg:col-span-4"
          : i === 4
          ? "lg:col-span-4"
          : i === 5
          ? "lg:col-span-5"
          : "sm:col-span-2 lg:col-span-7";
        return (
          <li key={name} className={`min-h-0 ${span}`}>
            <Link href={`/properties?q=${encodeURIComponent(name)}`} className="group relative block h-full min-h-[220px] overflow-hidden border border-line/60 bg-ivory/90 shadow-[0_14px_40px_rgba(17,17,17,.08)] transition duration-700 ease-out hover:-translate-y-1 hover:border-beige/60 hover:shadow-[0_22px_50px_rgba(156,127,86,.16)]">
              <img src={img} alt={name} loading="lazy" onError={(e)=>{const t=e.currentTarget;if(t.dataset.fallback)return;t.dataset.fallback="1";t.src="/images/hero-3d.jpg";}} className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.14]" />
              <span className="absolute inset-0 bg-gradient-to-t from-[#f6f2eb]/96 via-ivory/55 to-ivory/8 transition duration-700 ease-out group-hover:from-ivory/90" aria-hidden="true" />
              <span className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-ivory/70 to-transparent" aria-hidden="true" />
              <span className="absolute inset-x-0 bottom-0 p-5 text-charcoal md:p-6">
                <span className="block font-serif text-2xl md:text-3xl transition-colors duration-300 group-hover:text-matte">{name}</span>
                <span className="mt-1 block text-sm text-charcoal/72 transition-colors duration-300 group-hover:text-charcoal/80">{blurb}</span>
                <span className="mt-3 inline-flex items-center border border-beige/60 bg-beige/25 px-3 py-1 text-[11px] tracking-[.18em] text-[#9c7f56] transition duration-300 group-hover:border-beige/80 group-hover:bg-beige/35">{here.length} {here.length === 1 ? "LISTING" : "LISTINGS"}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
