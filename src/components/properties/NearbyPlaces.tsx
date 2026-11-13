import { School, Train, Cross, ShoppingBag, Utensils, Dumbbell } from "lucide-react";

/**
 * Nearby amenities for a listing. Distances are illustrative samples seeded
 * from the listing id so every property shows a stable, believable set.
 * Replace with a places service when one exists.
 */
export default function NearbyPlaces({ seed }: { seed: string }) {
 const h = [...seed].reduce((a, c) => a + c.charCodeAt(0), 7);
 const dist = (salt: number, spread: number, base: number) => (base + ((h * salt) % spread) / 10).toFixed(1);
 const places: [typeof School, string, string][] = [
  [School, "Schools", `${dist(31, 45, 4)} km`],
  [Train, "Metro & transit", `${dist(17, 32, 5)} km`],
  [Cross, "Hospital", `${dist(11, 28, 7)} km`],
  [ShoppingBag, "Retail & malls", `${dist(23, 26, 9)} km`],
  [Utensils, "Food & cafés", `${dist(13, 18, 2)} km`],
  [Dumbbell, "Fitness centres", `${dist(29, 16, 3)} km`],
 ];
 return (
  <section className="border border-line/70 bg-white p-6 md:p-8" aria-label="Nearby places">
   <p className="text-[11px] uppercase tracking-[.28em] text-[#9c7f56]">Around this property</p>
   <h2 className="mt-2 font-serif text-3xl text-matte md:text-4xl">What's <em className="italic text-[#9c7f56]">nearby?</em></h2>
   <ul className="mt-5 grid grid-cols-2 gap-px bg-line/60 sm:grid-cols-3 lg:grid-cols-6">
    {places.map(([Icon, label, d]) => (
     <li key={label} className="flex flex-col items-center gap-2 bg-ivory/40 px-3 py-5 text-center transition-colors duration-300 hover:bg-ivory">
      <Icon size={22} strokeWidth={1.5} className="text-[#9c7f56]"/>
      <span className="text-[10px] font-medium uppercase tracking-[.14em] text-slate leading-snug">{label}</span>
      <span className="font-serif text-lg leading-none text-matte tabular-nums">{d}<span className="text-xs font-sans"> km</span></span>
     </li>
    ))}
   </ul>
   <p className="mt-3 text-[10px] uppercase tracking-[.16em] text-slate/70">Sample distances · illustrative</p>
  </section>
 );
}
