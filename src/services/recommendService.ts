import type { Property } from "@/types";

export interface Recommendation { property: Property; score: number; reasons: string[] }

const area = (p: Property) => p.location.split(",")[0];

// Rule-based and explainable. Learns only from the listings the person has saved.
// Replace with the Python recommendation service when it exists.
export function recommend(all: Property[], savedIds: string[], limit = 3): Recommendation[] {
  const saved = all.filter(p => savedIds.includes(p.id));
  if (!saved.length) return [];
  const cats = new Set(saved.map(p => p.category));
  const areas = new Set(saved.map(area));
  const listings = new Set(saved.map(p => p.listing));
  const bhks = new Set(saved.filter(p => p.bhk).map(p => p.bhk));
  const avg = saved.reduce((a, p) => a + p.price, 0) / saved.length;
  const amen = new Set(saved.flatMap(p => p.amenities));

  return all
    .filter(p => !savedIds.includes(p.id) && listings.has(p.listing))
    .map(p => {
      const reasons: string[] = [];
      let score = 0;
      if (cats.has(p.category)) { score += 3; reasons.push(`Same type: ${p.category}`); }
      if (areas.has(area(p))) { score += 2; reasons.push(`In ${area(p)}, like one you saved`); }
      if (Math.abs(p.price - avg) / avg <= 0.3) { score += 2; reasons.push("Close to your saved budget"); }
      if (p.bhk && bhks.has(p.bhk)) { score += 1; reasons.push(`${p.bhk} BHK`); }
      const shared = p.amenities.filter(a => amen.has(a)).length;
      if (shared >= 2) { score += 1; reasons.push(`${shared} amenities you favour`); }
      return { property: p, score, reasons };
    })
    .filter(r => r.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
