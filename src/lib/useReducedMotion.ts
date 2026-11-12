"use client";
import { useEffect, useState } from "react";
import { useReducedMotion as useFramerReducedMotion } from "framer-motion";
import { useMotionOverride } from "@/lib/motionPref";

/**
 * Hydration-safe replacement for framer-motion's useReducedMotion.
 *
 * The server cannot know the visitor's OS setting, so it always renders the
 * animated markup. framer's hook can already return `true` during the browser's
 * first render, which makes the client tree differ from the server HTML and
 * throws "Hydration failed". This hook returns `false` until the component has
 * mounted, then reports the real preference, so both renders match.
 */
export function useReducedMotion(): boolean {
  const pref = useFramerReducedMotion();
  const override = useMotionOverride();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !override ? !!pref : false;
}
