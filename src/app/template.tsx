"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import "@/lib/intro"; // Window typings

/**
 * Page transition: on client-side navigation a matte curtain lifts off the new
 * page. The first load never shows it (the homepage has its own opening film),
 * and it is skipped entirely for reduced motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const [curtain] = useState(() => typeof window !== "undefined" && !!window.__skylineNav);
  useEffect(() => { window.__skylineNav = true; }, []);
  return (
    <>
      {curtain && !reduce && <motion.div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[45] origin-top bg-matte" initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} transition={{ duration: .85, ease: [.76, 0, .24, 1] }} />}
      <motion.div initial={reduce ? { opacity: 1 } : false} animate={{ opacity: 1 }} transition={{ duration: .6, delay: curtain && !reduce ? .25 : 0 }} style={{ opacity: 1 }}>{children}</motion.div>
    </>
  );
}
