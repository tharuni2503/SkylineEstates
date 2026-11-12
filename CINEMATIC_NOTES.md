# Cinematic upgrade notes

Run: `npm install && npm run dev`. Check: `npm run lint` (tsc) and `npm run build`. Deploy: push to Git and import in Vercel
(framework auto-detected, no env vars needed).

Video policy (`src/lib/media.ts`): desktop gets 1080p/720p; phones and tablets get 720p/540p; reduced motion, Data Saver and 2G get
posters and stills only. The scrub video is not requested until the visitor starts scrolling the hero. Videos are served with Range
support and a 7-day cache header (`next.config.js`).
