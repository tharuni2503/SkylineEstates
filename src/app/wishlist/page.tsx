"use client";

import Link from "next/link";
import SectionHead from "@/components/common/SectionHead";
import PropertyCard from "@/components/properties/PropertyCard";
import RecommendedForYou from "@/components/properties/RecommendedForYou";
import { useStore } from "@/lib/store";

export default function Wishlist() {
  const {
    properties,
    wishlist,
    toggleWish,
    compare,
    toggleCompare,
    hydrated,
  } = useStore();

  const items = properties.filter((property) => wishlist.includes(property.id));

  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <SectionHead as="h1" eyebrow="Wishlist" title="Saved *properties.*" />

      {!hydrated ? (
        <section
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Loading saved properties"
          aria-busy="true"
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden border border-line/70 bg-white"
            >
              <div className="aspect-[4/3] animate-pulse bg-line/50" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-2/5 animate-pulse bg-line/60" />
                <div className="h-5 w-4/5 animate-pulse bg-line/60" />
                <div className="h-4 w-3/5 animate-pulse bg-line/60" />
              </div>
            </div>
          ))}
          <p className="sr-only" role="status">Loading your saved properties.</p>
        </section>
      ) : items.length === 0 ? (
        <section className="py-16 text-center" aria-live="polite">
          <p className="font-serif text-2xl text-matte">Your shortlist starts here</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate">
            You haven&apos;t saved any properties yet. Tap the heart on a listing
            to keep the homes you love in one place.
          </p>
          <Link
            href="/properties"
            className="mt-6 inline-flex min-h-11 items-center justify-center bg-matte px-8 py-3 text-sm text-ivory transition hover:bg-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matte"
          >
            Browse properties
          </Link>
        </section>
      ) : (
        <section
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Saved properties"
        >
          {items.map((property) => (
            <PropertyCard
              key={property.id}
              p={property}
              titleAs="h2"
              saved
              onToggle={toggleWish}
              compared={compare.includes(property.id)}
              onCompare={toggleCompare}
            />
          ))}
        </section>
      )}

      {hydrated && <RecommendedForYou />}
    </main>
  );
}
