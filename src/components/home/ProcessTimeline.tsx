"use client";
import { useRef } from "react";
import { useCinematic } from "@/components/cinematic/useCinematic";
import { canPin } from "@/lib/gsap";

const steps: [string, string][] = [
  ["Tell us what you need", "Set your budget, area and must-haves, or ask the assistant."],
  ["Compare verified homes", "Save favourites and compare up to four side by side."],
  ["Visit with an advisor", "Book a site visit; an agent confirms your slot."],
  ["Close with clarity", "We check documents and costs before you commit."],
];

export default function ProcessTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useCinematic(ref, ({ gsap }) => {
    gsap.fromTo(fill.current, { scaleY: 0 }, {
      scaleY: 1,
      ease: "none",
      transformOrigin: "top center",
      scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 55%", scrub: 0.6 },
    });
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el, { opacity: 0.35, y: 18 }, {
        opacity: 1, y: 0, ease: "none",
        scrollTrigger: { trigger: el, start: "top 82%", end: "top 55%", scrub: 0.5 },
      });
      const dot = el.querySelector<HTMLElement>("[data-step-dot]");
      if (dot) gsap.fromTo(dot, { scale: 0.7, backgroundColor: "rgba(216,195,165,0.25)" }, {
        scale: 1, backgroundColor: "rgba(216,195,165,1)", ease: "none",
        scrollTrigger: { trigger: el, start: "top 78%", end: "top 58%", scrub: 0.4 },
      });
    });
  }, []);

  return (
    <div ref={ref} className="relative mt-12">
      {/* vertical track */}
      <div aria-hidden="true" className="absolute bottom-2 left-[19px] top-2 w-px bg-ivory/12 md:left-1/2 md:-translate-x-px" />
      <div ref={fill} aria-hidden="true" className="absolute bottom-2 left-[19px] top-2 w-px origin-top bg-gradient-to-b from-beige via-beige to-beige/40 md:left-1/2 md:-translate-x-px" />
      <ol className="relative space-y-0">
        {steps.map(([t, d], i) => (
          <li key={t} ref={(el) => { itemRefs.current[i] = el; }} className="relative min-h-[8.5rem] pb-8 pl-14 last:pb-0 md:grid md:min-h-[8rem] md:grid-cols-[1fr_auto_1fr] md:items-start md:gap-8 md:pb-10 md:pl-0 md:last:pb-0">
            <div className={`md:pt-1 ${i % 2 === 0 ? "md:col-start-1 md:text-right" : "md:col-start-3"}`}>
              <p className="text-[11px] tracking-[.22em] text-beige/75">STEP 0{i + 1}</p>
              <p className="mt-2 font-serif text-2xl text-ivory md:text-3xl">{t}</p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-ivory/68 md:ml-auto md:mr-0">{d}</p>
            </div>
            <div className="absolute left-0 top-0 md:static md:col-start-2 md:flex md:justify-center">
              <span data-step-dot className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full border border-beige/40 bg-matte font-serif text-sm text-matte shadow-[0_0_0_6px_rgba(17,17,17,1)]">{i + 1}</span>
            </div>
            <div className="hidden md:block" />
          </li>
        ))}
      </ol>
    </div>
  );
}
