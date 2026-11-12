import { useEffect, useState } from "react";

/**
 * Tiny hand-off between the opening film (Intro) and the hero, so the hero's
 * headline reveal starts exactly as the intro wipes away instead of playing
 * unseen underneath it.
 */
declare global {
  interface Window {
    __skylineIntro?: "playing" | "done";
    __skylineNav?: boolean;
  }
}
export const INTRO_EVENT = "skyline:intro-done";
export const setIntroPlaying = () => { window.__skylineIntro = "playing"; };
export const setIntroDone = () => { window.__skylineIntro = "done"; window.dispatchEvent(new Event(INTRO_EVENT)); };

/** true once there is no opening film in the way (or it has just finished). */
export function useIntroDone() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (window.__skylineIntro !== "playing") { setDone(true); return; }
    const f = () => setDone(true);
    window.addEventListener(INTRO_EVENT, f);
    return () => window.removeEventListener(INTRO_EVENT, f);
  }, []);
  return done;
}
