"use client";
import AutoVideo from "@/components/common/AutoVideo";
/** Looping background video for closing sections. Lazy: loads only when near the viewport. */
export default function BgVideo({ src, poster, lite }: { src: string; poster: string; lite?: string }) {
  return <AutoVideo src={src} srcLite={lite} poster={poster} lazy />;
}
