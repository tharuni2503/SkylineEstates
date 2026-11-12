# Skyline Estates – Hero (Cinematic 4K) generation prompt

Use this prompt with your video/image generator to produce the homepage hero background.
Drop the output into `public/videos/` and the hero will pick it up via `src/lib/cinematicMedia.ts`.

## Prompt

> Cinematic 4K photorealistic drone orbit around a luxury modern villa at golden hour dusk, two storeys with a cantilevered upper floor, floor-to-ceiling glass, warm interior lights glowing, infinity pool reflecting the sky, manicured landscaping, matte black and warm beige materials. Slow smooth 360° orbit, shallow depth of field, anamorphic lens flare, shot on ARRI Alexa, 24fps, no people, no text.

## Recommended output / wiring

- **Main (4K):** save as `public/videos/hero.mp4` (replaces current) — `cinematicMedia.hero.src`
- **Lite (720p, optional):** save as `public/videos/hero-720.mp4` — `cinematicMedia.hero.srcLite`
- **Poster frame:** save a matching still as `public/videos/hero-poster.jpg` — `cinematicMedia.hero.poster`

The hero (`src/components/cinematic/CinematicHero.tsx` + `ScrollScrubVideo`) scroll-scrubs the video and falls back to the poster when video/motion is unavailable. Keep motion slow and smooth (360° orbit) for best scrub feel. Avoid fast cuts; no people/text.