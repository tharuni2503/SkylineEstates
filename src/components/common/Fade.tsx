/**
 * Soft hand-off where a cinematic dark section meets an ivory or white one,
 * so the page never cuts from black to light along a hard line.
 */
const C = { matte: "#111111", ivory: "#F8F5F0", white: "#FFFFFF" } as const;
export default function Fade({ from, to }: { from: keyof typeof C; to: keyof typeof C }) {
  return <div aria-hidden="true" className="h-20 md:h-28" style={{ background: `linear-gradient(to bottom, ${C[from]}, ${C[to]})` }} />;
}
