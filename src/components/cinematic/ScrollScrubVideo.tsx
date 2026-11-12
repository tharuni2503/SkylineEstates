"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { useMediaMode } from "@/lib/media";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  src?: string;
  srcLite?: string;
  poster: string;
  /** Scrub only this portion of the video duration [0..1, 0..1] to vary scenes using the same file. */
  segment?: [number, number];
  trigger: React.RefObject<HTMLElement | null>;
  start?: string;
  end?: string;
  className?: string;
  priority?: boolean;
};

/**
 * Scroll-scrubbed background video with poster fallback. Parent scene timelines
 * should animate the wrapping container for camera motion (works for both
 * video and poster fallback).
 */
export default function ScrollScrubVideo({ src, srcLite, poster, segment, trigger, start = "top top", end = "bottom bottom", className = "", priority }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const mode = useMediaMode();
  const reduce = useReducedMotion();
  const useVideo = !!src && !!mode && mode !== "poster" && !reduce && !failed;
  const file = mode === "lite" && srcLite ? srcLite : src;

  useEffect(() => {
    if (!useVideo) return;
    registerGsap();
    const video = videoRef.current;
    const el = trigger.current;
    if (!video || !el) return;
    let st: ScrollTrigger | null = null;
    let last = -1;
    const seg = segment || [0, 1];
    const sync = (p: number) => {
      const d = video.duration;
      if (!Number.isFinite(d) || d <= 0) return;
      const from = Math.max(0, Math.min(1, seg[0])) * d;
      const to = Math.max(from + 0.1, Math.min(1, seg[1]) * d);
      const t = Math.min(d - 0.05, Math.max(0, from + p * (to - from)));
      if (Math.abs(t - last) < 0.033) return;
      last = t;
      try {
        const anyV = video as HTMLVideoElement & { fastSeek?: (n: number) => void };
        if (typeof anyV.fastSeek === "function") anyV.fastSeek(t);
        else video.currentTime = t;
      } catch {}
    };
    const setup = () => {
      setReady(true);
      st?.kill();
      st = ScrollTrigger.create({ trigger: el, start, end, scrub: 0.15, onUpdate: (self) => sync(self.progress) });
      sync(st.progress);
    };
    const onErr = () => setFailed(true);
    if (video.readyState >= 1 && Number.isFinite(video.duration)) setup();
    else video.addEventListener("loadedmetadata", setup, { once: true });
    video.addEventListener("error", onErr, { once: true });
    video.pause();
    return () => {
      video.removeEventListener("loadedmetadata", setup);
      video.removeEventListener("error", onErr);
      st?.kill();
    };
  }, [useVideo, file, trigger, start, end, segment?.[0], segment?.[1]]);

  return (
    <div className={`absolute inset-0 overflow-hidden bg-matte ${className}`}>
      <img src={poster} alt="" onError={(e)=>{const t=e.currentTarget;if(t.dataset.fallback)return;t.dataset.fallback="1";t.src="/images/hero-3d.jpg";}} className="absolute inset-0 h-full w-full object-cover" fetchPriority={priority ? "high" : undefined} />
      {useVideo && (
        <video
          ref={videoRef}
          key={file}
          src={file}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          tabIndex={-1}
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}
