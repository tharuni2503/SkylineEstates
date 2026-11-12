"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { recommend } from "@/services/recommendService";
import { inr } from "@/lib/format";

export default function RecommendedForYou() {
  const { properties, wishlist } = useStore();
  const recs = recommend(properties, wishlist);
  if (!recs.length) return null;
  return (
    <section aria-label="Recommended for you" className="mt-16 border-t border-line pt-10">
      <h2 className="font-serif text-3xl">Recommended for you</h2>
      <p className="mt-1 text-sm text-slate">Based on the properties you saved. A simple matching rule, not a trained model.</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        {recs.map(({ property: p, reasons }) => (
          <li key={p.id}>
            <Link href={`/property/${p.id}`} className="block h-full bg-white p-5 transition hover:shadow">
              <p className="font-serif text-xl">{p.title}</p>
              <p className="text-sm text-slate">{p.location.split(",")[0]} · {inr(p.price)}</p>
              <ul className="mt-3 space-y-1 text-xs text-charcoal/80">{reasons.slice(0, 3).map(r => <li key={r}>{r}</li>)}</ul>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
