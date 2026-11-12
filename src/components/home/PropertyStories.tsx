"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Heart, BadgeCheck } from "lucide-react";
import { animate, motion, useInView, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/format";
import WordReveal from "@/components/common/WordReveal";
import type { Property } from "@/types";

type Align = "full" | "right" | "left";
const ALIGNS: Align[] = ["full", "right", "left"];
const hi = (u: string) => (u.includes("images.unsplash.com") ? u.replace(/w=\d+/, "w=2400") : u);

/** Price that counts up when it scrolls into view. Screen readers get the final figure. */
function Price({ value, rent }: { value: number; rent: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [v, setV] = useState(value);
  // reduced motion shows the real figure at once; otherwise start from 0 and count up
  useEffect(() => { setV(reduce ? value : 0); }, [reduce, value]);
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, value, { duration: 2.2, ease: [.22, 1, .36, 1], onUpdate: x => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, value, reduce]);
  const unit = rent ? " per month" : "";
  return (
    <p ref={ref} className="font-serif text-5xl text-beige md:text-6xl">
      <span className="sr-only">{inr(value)}{unit}</span>
      <span aria-hidden="true">{inr(v)}{rent && <span className="text-base text-ivory/60"> /month</span>}</span>
    </p>
  );
}

function Story({ p, align }: { p: Property; align: Align }) {
  const reduce = useReducedMotion();
  const { wishlist, toggleWish } = useStore();
  const saved = wishlist.includes(p.id);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: s } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // the image opens sideways only (never from the top) and is full width by the time it is centred
  const inset = useTransform(s, [0, .25], [reduce ? 0 : 6, 0]);
  const clip = useMotionTemplate`inset(0% ${inset}% 0% ${inset}%)`;
  const shift = useTransform(s, [0, 1], reduce ? ["0%", "0%"] : ["-5%", "5%"]);
  const zoom = useTransform(s, [0, .5], reduce ? [1, 1] : [1.1, 1.03]);

  const imgBox = align === "full" ? "w-full" : align === "right" ? "md:ml-auto md:w-[78%]" : "md:w-[78%]";
  const titlePos = align === "left" ? "right-5 text-right md:right-10" : "left-5 md:left-10";
  const outer = align === "full" ? "" : "mx-auto max-w-[1600px] md:px-10";

  return (
    <section ref={ref} className="relative bg-matte pb-10 pt-10 text-ivory md:pb-16 md:pt-14">
      <div className={`relative ${outer}`}>
        <div className={imgBox}>
          <motion.div style={{ clipPath: clip }} className="relative h-[68vh] max-h-[920px] overflow-hidden md:h-[80vh]">
            <motion.div style={{ y: shift, scale: zoom }} className="absolute inset-x-0 -top-[7%] h-[114%]">
              <img src={hi(p.image)} alt={p.title} loading="lazy" onError={(e)=>{const t=e.currentTarget;if(t.dataset.fallback)return;t.dataset.fallback="1";t.src="/images/hero-3d.jpg";}} className="absolute inset-0 h-full w-full object-cover" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-matte/85 via-matte/10 to-matte/20" aria-hidden="true" />
            {p.verified && <span className="absolute left-5 top-5 flex items-center gap-1 bg-matte/70 px-3 py-1.5 text-xs text-ivory backdrop-blur md:left-8 md:top-8"><BadgeCheck size={14} />Verified</span>}
            <button aria-pressed={saved} aria-label={saved ? `Remove ${p.title} from wishlist` : `Add ${p.title} to wishlist`} onClick={() => toggleWish(p.id)} className="absolute right-5 top-5 rounded-full bg-ivory/90 p-2.5 text-matte md:right-8 md:top-8"><Heart size={18} className={saved ? "fill-matte" : ""} /></button>
          </motion.div>
        </div>
        {/* the title straddles the lower edge of the image */}
        <div className={`pointer-events-none absolute bottom-0 max-w-[92%] translate-y-[42%] md:max-w-4xl ${titlePos}`}>
          <WordReveal as="h3" text={p.title} className="font-serif text-5xl leading-[.98] md:text-7xl lg:text-8xl" />
        </div>
      </div>

      <div className="mx-auto mt-24 grid max-w-[1600px] gap-10 px-5 md:mt-36 md:grid-cols-12 md:gap-12 md:px-10">
        <div className="md:col-span-4">
          <Price value={p.price} rent={p.listing === "Rent"} />
          <p className="mt-3 text-ivory/60">{p.location}</p>
        </div>
        <div className="md:col-span-5">
          <p className="max-w-prose leading-relaxed text-ivory/80">{p.description ?? "A residence chosen for its light, layout and neighbourhood."}</p>
          <p className="mt-4 text-sm text-ivory/55">{p.amenities.slice(0, 4).join(", ")}.</p>
        </div>
        <div className="md:col-span-3">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm md:grid-cols-1">
            <div className="border-t border-ivory/15 py-3"><dt className="text-ivory/50">Residence</dt><dd className="mt-0.5">{p.bhk ? `${p.bhk} BHK ${p.category.toLowerCase()}` : p.category}</dd></div>
            <div className="border-t border-ivory/15 py-3"><dt className="text-ivory/50">Size</dt><dd className="mt-0.5">{p.areaSqft.toLocaleString("en-IN")} sq ft</dd></div>
          </dl>
          <Link href={`/property/${p.id}`} className="mt-5 inline-block border border-beige px-8 py-3 text-sm text-beige transition-colors hover:bg-beige hover:text-matte">Explore property</Link>
        </div>
      </div>
    </section>
  );
}

export default function PropertyStories() {
  const { properties } = useStore();
  const feat = properties.filter(p => p.featured);
  const items = (feat.length ? feat : properties).slice(0, 3);
  if (!items.length) return null;
  return (
    <div aria-label="Featured residences">
      <div className="bg-matte px-5 pb-2 pt-20 text-ivory md:px-10 md:pt-28">
        <div className="mx-auto max-w-[1600px]">
          <p className="text-xs uppercase tracking-[.3em] text-beige">The residences</p>
          <h2 className="mt-3 font-serif text-4xl md:text-6xl">Featured residences</h2>
          <p className="mt-4 max-w-md text-ivory/70">Homes from the Skyline collection, shown in full.</p>
        </div>
      </div>
      {items.map((p, i) => <Story key={p.id} p={p} align={ALIGNS[i % ALIGNS.length]} />)}
    </div>
  );
}
