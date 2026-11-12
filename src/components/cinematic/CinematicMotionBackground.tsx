"use client";
import { useRef } from "react";
import { useCinematic } from "./useCinematic";
import { canPin } from "@/lib/gsap";

type Props = {
  trigger: React.RefObject<HTMLElement | null>;
  primary: string;
  secondary?: string;
  start?: string;
  end?: string;
  intensity?: "soft" | "medium" | "deep";
  tint?: "warm" | "cool" | "neutral";
  priority?: boolean;
};

/**
 * Video-free cinematic background: scroll-scrubbed Ken Burns/parallax layers,
 * atmospheric light, and film depth. Used when no video asset is available.
 */
export default function CinematicMotionBackground({
  trigger,
  primary,
  secondary,
  start = "top top",
  end,
  intensity = "medium",
  tint = "warm",
  priority,
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const a = useRef<HTMLDivElement>(null);
  const b = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const scaleTo = intensity === "deep" ? 1.28 : intensity === "soft" ? 1.14 : 1.2;
  const yTo = intensity === "deep" ? -10 : intensity === "soft" ? -4 : -7;
  const pin = canPin();
  const resolvedEnd = end || (pin ? "+=150%" : "bottom top");
  const tintBg =
    tint === "cool"
      ? "radial-gradient(ellipse at 70% 25%,rgba(120,150,180,.14),transparent 55%)"
      : tint === "neutral"
      ? "radial-gradient(ellipse at 60% 30%,rgba(216,195,165,.10),transparent 55%)"
      : "radial-gradient(ellipse at 35% 30%,rgba(216,195,165,.18),transparent 55%)";

  useCinematic(trigger, ({ gsap }) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: trigger.current, start, end: resolvedEnd, scrub: 1.1 } });
    tl.fromTo(a.current, { scale: 1.04, yPercent: 2, xPercent: 0 }, { scale: scaleTo, yPercent: yTo, xPercent: -2.5, ease: "none" }, 0)
      .fromTo(light.current, { opacity: 0.25, yPercent: 8, xPercent: -4 }, { opacity: 0.7, yPercent: -10, xPercent: 4, ease: "none" }, 0);
    if (b.current && secondary) {
      tl.fromTo(b.current, { scale: 1.12, opacity: 0 }, { scale: 1.02, opacity: 0.28, yPercent: -6, ease: "none" }, 0.15)
        .to(b.current, { opacity: 0.06, ease: "none" }, 0.75);
    }
  }, [primary, secondary, resolvedEnd, scaleTo, yTo]);

  return (
    <div ref={wrap} className="absolute inset-0 overflow-hidden bg-matte">
      <div ref={a} className="absolute inset-[-10%] will-change-transform">
        <img src={primary} alt="" onError={(e)=>{const t=e.currentTarget;if(t.dataset.fallback)return;t.dataset.fallback="1";t.src="/images/hero-3d.jpg";}} className="absolute inset-0 h-full w-full object-cover" fetchPriority={priority ? "high" : undefined} />
      </div>
      {secondary ? (
        <div ref={b} className="absolute inset-[-8%] will-change-transform mix-blend-luminosity">
          <img src={secondary} alt="" loading="lazy" onError={(e)=>{const t=e.currentTarget;if(t.dataset.fallback)return;t.dataset.fallback="1";t.src="/images/hero-3d.jpg";}} className="absolute inset-0 h-full w-full object-cover" />
        </div>
      ) : null}
      <div ref={light} aria-hidden="true" className="pointer-events-none absolute inset-[-10%]" style={{ background: tintBg }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(0deg,rgba(248,245,240,.18)_0,rgba(248,245,240,.18)_1px,transparent_1px,transparent_3px)]" />
    </div>
  );
}
