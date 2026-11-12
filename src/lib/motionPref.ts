"use client";
import { useEffect, useState } from "react";

/**
 * Visitor-chosen override for the "reduce motion" / Data Saver stills mode.
 * Opt-in only: it is off unless the visitor presses "Play the film with motion",
 * and it is stored just in this browser.
 */
const KEY = "skyline.motion";
const EVT = "skyline:motion";

export const read = (): boolean => { try { return window.localStorage.getItem(KEY) === "on"; } catch { return false; } };
export function setMotionOverride(on: boolean) {
  try { if (on) window.localStorage.setItem(KEY, "on"); else window.localStorage.removeItem(KEY); } catch {}
  window.dispatchEvent(new Event(EVT));
}
/** false on the server and on first render, so hydration always matches. */
export function useMotionOverride(): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const f = () => setOn(read());
    f();
    window.addEventListener(EVT, f);
    return () => window.removeEventListener(EVT, f);
  }, []);
  return on;
}
