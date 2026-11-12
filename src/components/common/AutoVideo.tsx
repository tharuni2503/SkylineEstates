"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMediaMode } from "@/lib/media";

type Props = {
  src: string;
  /** lighter encode for phones and tablets */
  srcLite?: string;
  poster: string;
  /** mark the poster as the LCP image */
  priority?: boolean;
  /** don't request the video until it is within one viewport of the screen */
  lazy?: boolean;
  loop?: boolean;
  /** seconds into the clip to start from */
  startAt?: number;
  /** 1 = normal, 0.8 = gentle slow motion */
  rate?: number;
};

/**
 * Muted, inline, autoplaying background video with the poster as a real <Image>
 * underneath. Falls back to the poster alone for reduced motion / Data Saver /
 * load errors, pauses itself when scrolled off screen, and fades in only once
 * frames are actually playing, so there is never a black flash.
 */
export default function AutoVideo({ src, srcLite, poster, priority = false, lazy = false, loop = true, startAt = 0, rate = 1 }: Props) {
  const mode = useMediaMode();
  const box = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(!lazy);
  const [playing, setPlaying] = useState(false);
  const [bad, setBad] = useState(false);

  useEffect(() => {
    if (near) return;
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: "100% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  const useVideo = mode !== null && mode !== "poster" && near && !bad;
  const file = mode === "lite" && srcLite ? srcLite : src;

  useEffect(() => {
    const el = vid.current, b = box.current;
    if (!useVideo || !el || !b) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.play().catch(() => {}); else el.pause(); }, { threshold: 0.05 });
    io.observe(b);
    return () => io.disconnect();
  }, [useVideo, file]);

  return (
    <div ref={box} className="absolute inset-0 overflow-hidden">
      <Image src={poster} alt="" fill priority={priority} sizes="100vw" className="object-cover" />
      {useVideo && (
        <video
          ref={vid}
          key={file}
          src={file}
          muted
          loop={loop}
          autoPlay
          playsInline
          preload="auto"
          disablePictureInPicture
          tabIndex={-1}
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ${playing ? "opacity-100" : "opacity-0"}`}
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            v.muted = true;
            if (startAt > 0 && v.duration > startAt) v.currentTime = startAt;
            v.playbackRate = rate;
          }}
          onPlaying={() => setPlaying(true)}
          onError={() => setBad(true)}
        />
      )}
    </div>
  );
}
