"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import AutoVideo from "@/components/common/AutoVideo";
import { setIntroDone, setIntroPlaying } from "@/lib/intro";
import { read as motionOverrideOn } from "@/lib/motionPref";

const EASE: [number, number, number, number] = [.22, 1, .36, 1];
const WIPE: [number, number, number, number] = [.76, 0, .24, 1];
const WORDS = ["SKYLINE", "ESTATES"];
const TAGLINE = ["FIND", "YOUR", "PERFECT", "SPACE."];
const DURATION = 5600;

/**
 * Opening film. Plays once per session, on the homepage only: slow-motion
 * footage under letterbox bars that open, the wordmark resolving letter by
 * letter, the tagline, then a wipe up into the hero.
 */
export default function Intro() {
  const path = usePathname();
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (path !== "/") return;
    const force = (() => { try { const sp = new URLSearchParams(window.location.search); return sp.get("intro") === "1" || sp.get("playIntro") === "1"; } catch { return false; } })();
    // Read the OS setting directly: the hook reports false until after mount,
    // which let reduced-motion visitors start the film before it flipped to true.
    const osReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if ((osReduce && !motionOverrideOn() && !force) || (reduce && !force)) { setShow(false); setIntroDone(); return; }
    let seen = false;
    try { seen = !!window.sessionStorage.getItem("skyline.intro"); } catch {}
    if (seen && !force) { setIntroDone(); return; }
    try { window.sessionStorage.setItem("skyline.intro", "1"); } catch {}
    setIntroPlaying();
    setShow(true);
  }, [path, reduce]);

  useEffect(() => {
    if (!show) return;
    const finish = () => { setIntroDone(); setShow(false); };
    const t = setTimeout(finish, DURATION);
    // the skip button is the only focusable control, so keep Tab on it
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
      if (e.key === "Tab") { e.preventDefault(); document.getElementById("intro-skip")?.focus(); }
    };
    window.addEventListener("keydown", k);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => { clearTimeout(t); window.removeEventListener("keydown", k); document.documentElement.style.overflow = prev; };
  }, [show]);

  const skip = () => { setIntroDone(); setShow(false); };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          role="dialog"
          aria-modal="true"
          aria-label="Welcome to Skyline Estates"
          initial={{ clipPath: "inset(0 0 0 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1.15, ease: WIPE }}
          className="fixed inset-0 z-[100] overflow-hidden bg-matte text-ivory"
        >
          <motion.div className="absolute inset-0" initial={{ scale: 1.12 }} animate={{ scale: 1 }} exit={{ scale: 1.2 }} transition={{ duration: 7, ease: "linear" }}>
            <AutoVideo src="/videos/hero.mp4" srcLite="/videos/hero-720.mp4" poster="/videos/hero-poster.jpg" priority loop={false} startAt={5.5} rate={0.8} />
          </motion.div>
          <div className="absolute inset-0 bg-matte/55" aria-hidden="true" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(17,17,17,.7)_100%)]" aria-hidden="true" />

          {/* letterbox bars: the film "opens" */}
          <motion.div aria-hidden="true" className="absolute inset-x-0 top-0 h-[14vh] origin-top bg-matte" initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} transition={{ delay: .4, duration: 1.8, ease: WIPE }} />
          <motion.div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[14vh] origin-bottom bg-matte" initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} transition={{ delay: .4, duration: 1.8, ease: WIPE }} />

          <div className="relative flex h-full flex-col items-center justify-center px-5 text-center">
            <motion.h1
              aria-label="Skyline Estates"
              className="flex flex-col items-center gap-2 font-serif text-[clamp(2.4rem,9vw,7rem)] leading-none md:flex-row md:gap-[.6em]"
              initial={{ letterSpacing: ".55em" }}
              animate={{ letterSpacing: ".18em" }}
              transition={{ delay: .9, duration: 3.2, ease: EASE }}
            >
              {WORDS.map((w, wi) => (
                <span key={w} aria-hidden="true" className="flex">
                  {w.split("").map((c, i) => (
                    <span key={i} className="overflow-hidden pb-[.1em]">
                      <motion.span
                        className="inline-block"
                        initial={{ y: "110%", opacity: 0, filter: "blur(10px)" }}
                        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                        transition={{ delay: 1 + wi * .5 + i * .07, duration: 1.2, ease: EASE }}
                      >{c}</motion.span>
                    </span>
                  ))}
                </span>
              ))}
            </motion.h1>
            <motion.span aria-hidden="true" className="mt-8 block h-px w-32 origin-center bg-beige md:w-48" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 2.7, duration: 1.2, ease: EASE }} />
            <p className="mt-7 flex flex-wrap justify-center gap-x-[.9em] text-xs tracking-[.5em] text-beige md:text-sm" aria-label="Find your perfect space.">
              {TAGLINE.map((w, i) => (
                <span key={w} aria-hidden="true" className="overflow-hidden">
                  <motion.span className="inline-block" initial={{ y: "120%" }} animate={{ y: 0 }} transition={{ delay: 3.1 + i * .16, duration: 1, ease: EASE }}>{w}</motion.span>
                </span>
              ))}
            </p>
          </div>

          <div aria-hidden="true" className="absolute inset-x-5 bottom-6 h-px bg-ivory/15 md:inset-x-10">
            <motion.div className="h-full origin-left bg-beige" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: DURATION / 1000, ease: "linear" }} />
          </div>
          <button id="intro-skip" onClick={skip} autoFocus className="absolute bottom-10 right-5 text-sm text-ivory/70 underline underline-offset-4 hover:text-ivory md:right-10">Skip intro</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
