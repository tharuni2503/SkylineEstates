"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

export const canPin = () => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;

export { gsap, ScrollTrigger };