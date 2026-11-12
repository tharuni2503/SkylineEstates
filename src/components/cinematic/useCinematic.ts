"use client";
import { useEffect } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useMediaMode } from "@/lib/media";
import { read as motionOverrideOn } from "@/lib/motionPref";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";

/**
 * Registers scroll-driven GSAP timelines for a cinematic scene.
 * Respects prefers-reduced-motion (and the visitor's motion override) and
 * cleans up all triggers/tweens on unmount or dependency changes.
 */
export function useCinematic(
  scope: React.RefObject<HTMLElement | null>,
  build: (ctx: { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger; reduce: boolean; canVideo: boolean }) => void | (() => void),
  deps: unknown[] = []
) {
  const reduce = useReducedMotion();
  const mode = useMediaMode();
  const canVideo = mode === "full" || mode === "lite";
  useEffect(() => {
    registerGsap();
    const el = scope.current;
    if (!el) return;
    const osReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if ((osReduce && !motionOverrideOn()) || reduce) return;
    const ctx = gsap.context(() => {
      build({ gsap, ScrollTrigger, reduce: false, canVideo });
      // refresh after layout/images settle (important in Next.js/hydration)
      requestAnimationFrame(() => ScrollTrigger.refresh());
      setTimeout(() => ScrollTrigger.refresh(), 250);
    }, el);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, canVideo, ...deps]);
}
