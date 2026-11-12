import type { Property } from "@/types";
import { inr } from "@/lib/format";

type Factor = { label: string; points: number; note: string };

// Rule-based, explainable score computed only from the listings on this site.
// It is not a prediction and does not use outside market data.
export function scoreProperty(p: Property, all: Property[]): { score: number; factors: Factor[]; note?: string } | null {
  if (p.listing !== "Buy" || !p.areaSqft) return null;
  const factors: Factor[] = [];
  const peers = all.filter(x => x.id !== p.id && x.listing === "Buy" && x.category === p.category && x.areaSqft > 0);
  if (peers.length >= 2) {
    const avg = peers.reduce((a, x) => a + x.price / x.areaSqft, 0) / peers.length;
    const mine = p.price / p.areaSqft;
    const diff = (avg - mine) / avg;
    const pts = Math.max(-15, Math.min(15, Math.round(diff * 50)));
    factors.push({ label: "Price per sq ft", points: pts, note: `${inr(Math.round(mine))} vs ${inr(Math.round(avg))} average across ${peers.length} similar listings here` });
  }
  factors.push({ label: "Verification", points: p.verified ? 10 : 0, note: p.verified ? "Documents checked by Skyline" : "Not yet verified" });
  const am = p.amenities.length;
  factors.push({ label: "Amenities", points: Math.min(10, am * 2), note: `${am} listed` });
  factors.push({ label: "Featured listing", points: p.featured ? 5 : 0, note: p.featured ? "Selected by our team" : "Standard listing" });
  const score = Math.max(0, Math.min(100, 50 + factors.reduce((a, f) => a + f.points, 0)));
  return { score, factors, note: peers.length < 2 ? "Too few similar listings to compare price per sq ft." : undefined };
}

export default function InsightCard({ p, all }: { p: Property; all: Property[] }) {
  const r = scoreProperty(p, all);
  if (!r) return null;
  return (
    <section aria-label="Property insight" className="mt-10 border border-line bg-white p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-serif text-2xl">Property insight</h2>
        <p className="font-serif text-3xl">{r.score}<span className="text-base text-slate"> / 100</span></p>
      </div>
      <ul className="mt-4 divide-y divide-line text-sm">
        {r.factors.map(f => (
          <li key={f.label} className="flex items-start justify-between gap-4 py-2">
            <span><span className="font-medium">{f.label}</span><span className="block text-slate">{f.note}</span></span>
            <span className={f.points < 0 ? "text-red-700" : "text-charcoal"}>{f.points > 0 ? "+" : ""}{f.points}</span>
          </li>
        ))}
      </ul>
      {r.note && <p className="mt-3 text-xs text-slate">{r.note}</p>}
      <p className="mt-4 text-xs text-slate">Rule-based score starting from 50, using only the listings on this site. It is not financial advice, does not use external market data and does not predict returns.</p>
    </section>
  );
}
