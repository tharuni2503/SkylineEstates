"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { read as motionOverrideOn } from "@/lib/motionPref";

export default function SiteScrollEffects() {
  const pathname = usePathname();
  useEffect(() => {
    registerGsap();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches && !motionOverrideOn();
    if (reduce) return;
    const ctx = gsap.context(() => {
      // Subtle cinematic reveal for content sections outside pinned scenes
      const sections = Array.from(document.querySelectorAll<HTMLElement>("main [data-site-reveal], main .motion-reveal"));
      sections.forEach((el) => {
        if (el.dataset.revealed) return;
        el.dataset.revealed = "1";
        gsap.fromTo(
          el,
          { y: 38, opacity: 0.01 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%", once: true },
            clearProps: "transform",
          }
        );
      });
      // Gentle parallax for marked media
      Array.from(document.querySelectorAll<HTMLElement>("main [data-site-parallax], main .image-parallax")).forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -4 },
          { yPercent: 4, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.1 } }
        );
      });
      // Re-evaluate after route changes and image/layout settling.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => ctx.revert();
  }, [pathname]);
  return null;
}
