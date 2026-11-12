import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useMotionOverride } from "@/lib/motionPref";

/**
 * How much video this visitor should get.
 *  - "full":   desktop, 1080p / 720p sources
 *  - "lite":   phones and tablets, 720p / 540p sources
 *  - "poster": reduced motion, Data Saver or 2G. No video is downloaded at all.
 * Returns null until the browser has been inspected (SSR and first paint), so
 * callers render the poster and never download video during that window.
 */
export type MediaMode = "poster" | "lite" | "full";

type Conn = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (t: string, f: () => void) => void;
  removeEventListener?: (t: string, f: () => void) => void;
};

export function useMediaMode(): MediaMode | null {
  const reduce = useReducedMotion();
  const override = useMotionOverride();
  const [mode, setMode] = useState<MediaMode | null>(null);
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: Conn }).connection;
    const mq = window.matchMedia("(min-width:1024px)");
    const calc = () => {
      const slow = !!conn && (conn.saveData === true || /(^|-)2g$/.test(conn.effectiveType ?? ""));
      setMode(!override && (reduce || slow) ? "poster" : mq.matches ? "full" : "lite");
    };
    calc();
    mq.addEventListener("change", calc);
    conn?.addEventListener?.("change", calc);
    return () => {
      mq.removeEventListener("change", calc);
      conn?.removeEventListener?.("change", calc);
    };
  }, [reduce, override]);
  return mode;
}
