// Cinematic scene media — add/replace video files in public/videos/ then set src/srcLite here.
// Hero 4K generation prompt saved at docs/hero-cinematic-prompt.md (drop result as /videos/hero.mp4).
// Hero uses the local professional cinematic video when available; other scenes are poster-only until you send new files.
export type SceneMedia = { src?: string; srcLite?: string; poster: string; segment?: [number, number] };

export const cinematicMedia = {
  hero: { poster: "/images/hero-3d.jpg" },
  discover: { poster: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2200&q=80" },
  architecture: { poster: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=80" },
  properties: { poster: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=80" },
  discovery: { poster: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=2200&q=80" },
  ai: { poster: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2200&q=80" },
  finale: { poster: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2400&q=85" },
} satisfies Record<string, SceneMedia>;
