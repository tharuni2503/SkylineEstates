"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import "@/lib/intro"; // Window typings

const EASE: [number, number, number, number] = [.22, 1, .36, 1];

/**
 * Page transition: on client-side navigation a matte curtain lifts off the new
 * page. The first load never shows it (the homepage has its own opening film),
 * and it is skipped entirely for reduced motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
 const reduce = useReducedMotion();
 const [curtain] = useState(() => typeof window !== "undefined" && !!window.__skylineNav);
 useEffect(() => { window.__skylineNav = true; }, []);
 const enter = !reduce;
 return (
   <>
     {curtain && enter && <motion.div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[45] origin-top bg-matte" initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} transition={{ duration: .85, ease: [.76, 0, .24, 1] }} />}
     <motion.div
       initial={!enter ? { opacity: 1 } : curtain ? { opacity: 0, y: 18, filter: "blur(6px)" } : false}
       animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
       transition={{ duration: .65, delay: curtain && enter ? .28 : 0, ease: EASE }}
     >
       {children}
     </motion.div>
   </>
 );
}
