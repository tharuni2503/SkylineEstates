"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";

const css = `
.hero-film{--hf-black:#111111;--hf-beige:#D8C3A5;--hf-ivory:#F8F5F0;--hf-slate:#6B7280;--hf-serif:var(--font-playfair),Georgia,serif;--hf-sans:var(--font-poppins),system-ui,sans-serif;position:relative;width:100%;height:100svh;min-height:560px;overflow:hidden;background:#000;container-type:inline-size;color:var(--hf-ivory);font-family:var(--hf-sans)}
.hero-film .hf-cam{position:absolute;inset:0;transform-origin:52% 62%}
.hero-film .hf-cam svg{width:100%;height:100%;display:block}
.hero-film .hf-vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.62) 100%);pointer-events:none}
.hero-film .hf-grain{position:absolute;inset:0;opacity:.09;mix-blend-mode:overlay;pointer-events:none;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>")}
.hero-film .hf-black{position:absolute;inset:0;background:#000;opacity:1;pointer-events:none}
.hero-film .hf-cap{position:absolute;left:6cqw;right:6cqw;opacity:0;font-family:var(--hf-serif);font-weight:400;color:var(--hf-ivory);font-size:3.1cqw;line-height:1.25;letter-spacing:.01em;pointer-events:none}
.hero-film .hf-cap small{display:block;font-family:var(--hf-sans);font-weight:300;font-size:1.05cqw;letter-spacing:.28em;color:var(--hf-beige);margin-top:1cqw}
.hero-film .hf-c1{top:9cqw}
.hero-film .hf-c3{bottom:22cqw}
.hero-film .hf-ai{position:absolute;left:5cqw;bottom:18cqw;width:min(34cqw,420px);padding:1.4cqw 1.6cqw;background:rgba(17,17,17,.62);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(216,195,165,.35);opacity:0;pointer-events:none}
.hero-film .hf-ai .hf-q{font-size:clamp(11px,1.15cqw,16px);font-weight:300;color:var(--hf-ivory);white-space:nowrap;overflow:hidden;max-width:0;display:block}
.hero-film .hf-ai .hf-r{margin-top:1cqw;display:flex;gap:.6cqw;flex-wrap:wrap;opacity:0}
.hero-film .hf-ai .hf-r span{font-size:clamp(10px,.95cqw,13px);padding:.35cqw .8cqw;border:1px solid var(--hf-beige);color:var(--hf-beige)}
.hero-film .hf-ai .hf-r b{font-weight:400;font-size:clamp(10px,1cqw,14px);color:var(--hf-slate);width:100%}
.hero-film .hf-end{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;opacity:0;padding-bottom:8vh;pointer-events:none}
.hero-film .hf-end h1{font-family:var(--hf-serif);font-weight:400;font-size:clamp(2.4rem,7.4cqw,6.5rem);letter-spacing:.04em;line-height:1;margin:0}
.hero-film .hf-end p{margin:1.6cqw 0 0;font-size:clamp(10px,1.15cqw,14px);font-weight:300;letter-spacing:.34em;color:var(--hf-beige)}
.hero-film .hf-end i{display:block;width:0;height:1px;background:var(--hf-beige);margin-top:2cqw}
.hero-film .hf-bar{position:absolute;left:0;right:0;height:0;background:#000;pointer-events:none}
.hero-film .hf-ui{position:absolute;inset-x:0;bottom:0;z-index:5;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding:18px 20px calc(18px + env(safe-area-inset-bottom,0px))}
.hero-film .hf-cta{display:inline-flex;align-items:center;gap:10px;background:var(--hf-beige);color:var(--hf-black);padding:14px 22px;font:500 11px var(--hf-sans);letter-spacing:.22em;text-decoration:none;transition:transform .4s,background .4s}
.hero-film .hf-cta:hover{transform:translateY(-1px);background:#efe6d8}
.hero-film .hf-replay{display:inline-flex;align-items:center;gap:8px;background:rgba(17,17,17,.35);color:rgba(248,245,240,.78);border:1px solid rgba(248,245,240,.22);padding:12px 14px;font:400 10px var(--hf-sans);letter-spacing:.18em;cursor:pointer;backdrop-filter:blur(6px)}
.hero-film .hf-replay:hover{color:var(--hf-ivory);border-color:rgba(248,245,240,.4)}
.hero-film .hf-scroll{position:absolute;left:50%;bottom:88px;transform:translateX(-50%);z-index:4;font:300 10px var(--hf-sans);letter-spacing:.34em;color:rgba(248,245,240,.45);display:flex;align-items:center;gap:12px;pointer-events:none}
.hero-film .hf-scroll span{width:40px;height:1px;background:rgba(216,195,165,.45)}
/* Timeline (30s) — no close-to-black; holds on end frame */
.hero-film.play .hf-cam{animation:hf-push 28s cubic-bezier(.35,.05,.45,1) forwards}
@keyframes hf-push{from{transform:scale(1) translateX(0)}to{transform:scale(1.2) translateX(-1.5%)}}
.hero-film.play .hf-black{animation:hf-open 3s ease .2s forwards}
@keyframes hf-open{to{opacity:0}}
.hero-film.play .hf-glow{animation:hf-dusk 20s ease-in-out forwards}
@keyframes hf-dusk{from{opacity:1}to{opacity:.18}}
.hero-film.play .hf-stars{animation:hf-stars 14s ease 3s both}
@keyframes hf-stars{from{opacity:0}to{opacity:1}}
.hero-film.play .hf-win{animation:hf-lit 2.2s ease var(--d) both}
@keyframes hf-lit{from{fill:#1d1d1d}to{fill:#EBD3A6}}
.hero-film.play .hf-wg{animation:hf-lg 2.4s ease var(--d) both}
@keyframes hf-lg{from{opacity:0}to{opacity:.55}}
.hero-film.play .hf-cap{animation:hf-cap var(--dur) ease var(--s) both}
@keyframes hf-cap{0%{opacity:0;transform:translateY(1cqw);filter:blur(6px)}14%{opacity:1;transform:none;filter:none}86%{opacity:1;transform:none;filter:none}100%{opacity:0;filter:blur(6px)}}
.hero-film.play .hf-ai{animation:hf-cap 8.5s ease 6.2s both}
.hero-film.play .hf-ai .hf-q{animation:hf-type 2.6s steps(44) 7s forwards}
@keyframes hf-type{to{max-width:40cqw}}
.hero-film.play .hf-ai .hf-r{animation:hf-show 1s ease 10.4s forwards}
@keyframes hf-show{to{opacity:1}}
.hero-film.play .hf-beam{animation:hf-scan 5.5s ease-in-out 12.2s both}
@keyframes hf-scan{0%{transform:translateX(0);opacity:0}15%{opacity:.9}85%{opacity:.9}100%{transform:translateX(780px);opacity:0}}
.hero-film.play .hf-tag{animation:hf-tag 3.2s ease var(--d) both}
@keyframes hf-tag{0%{opacity:0}18%{opacity:1}82%{opacity:1}100%{opacity:0}}
.hero-film.play .hf-end{animation:hf-endin 2.4s ease 19.6s forwards}
@keyframes hf-endin{to{opacity:1}}
.hero-film.play .hf-end i{animation:hf-rule 2.4s ease 21s forwards}
@keyframes hf-rule{to{width:min(14cqw,160px)}}
.hero-film.play .hf-bar{animation:hf-bars 2.5s ease .1s forwards}
@keyframes hf-bars{to{height:5.5%}}
@media (prefers-reduced-motion: reduce){
  .hero-film.play *{animation:none!important}
  .hero-film .hf-black,.hero-film .hf-cap,.hero-film .hf-ai{display:none}
  .hero-film .hf-end{opacity:1}.hero-film .hf-end i{width:min(14cqw,160px)}.hero-film .hf-glow{opacity:.35}.hero-film .hf-stars,.hero-film .hf-win,.hero-film .hf-wg{opacity:1}.hero-film .hf-win{fill:#EBD3A6}
}
@container (max-width: 700px){
  .hero-film .hf-cap{font-size:5.2cqw}.hero-film .hf-cap small{font-size:2.2cqw}
  .hero-film .hf-ai{width:78cqw;left:6cqw;bottom:24cqw}.hero-film .hf-c3{bottom:44cqw}.hero-film .hf-scroll{display:none}
}
`;

function svgEl(tag: string, attrs: Record<string, string>, parent: Element) {
  const e = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  parent.appendChild(e);
  return e;
}

export default function CinematicHeroFilm() {
  const stageRef = useRef<HTMLElement>(null);
  const starsRef = useRef<SVGGElement>(null);
  const wgRef = useRef<SVGGElement>(null);
  const winsRef = useRef<SVGGElement>(null);

  function play() {
    const stage = stageRef.current;
    if (!stage) return;
    stage.classList.remove("play");
    void stage.offsetWidth;
    stage.classList.add("play");
  }

  useEffect(() => {
    const st = starsRef.current, wg = wgRef.current, wn = winsRef.current;
    if (!st || !wg || !wn) return;
    if (st.childElementCount === 0) {
      let s = 7; const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
      for (let i = 0; i < 70; i++) svgEl("circle", { cx: String(r() * 1600), cy: String(r() * 300), r: String(r() * 1.3 + 0.3), fill: "#F8F5F0", opacity: (r() * 0.6 + 0.3).toFixed(2) }, st);
    }
    if (wg.childElementCount === 0) {
      const W: [number, number, number, number][] = [[585,448,80,64],[690,448,80,64],[795,448,80,64],[900,448,100,64],[700,336,150,78],[870,336,150,78],[1040,336,200,78]];
      const order = [3,0,5,2,6,1,4];
      W.forEach((w, i) => {
        const d = (3.2 + order.indexOf(i) * 1.1).toFixed(1) + "s";
        svgEl("rect", { x: String(w[0]-6), y: String(w[1]-6), width: String(w[2]+12), height: String(w[3]+12), fill: "#E9CFA0", filter: "url(#hf-bl)", class: "hf-wg", style: `opacity:0;--d:${d}` }, wg);
        svgEl("rect", { x: String(w[0]), y: String(w[1]), width: String(w[2]), height: String(w[3]), fill: "#1d1d1d", class: "hf-win", style: `--d:${d}` }, wn);
      });
      W.forEach((w, i) => {
        const d = (3.6 + order.indexOf(i) * 1.1).toFixed(1) + "s";
        if (w[1] > 400) svgEl("rect", { x: String(w[0]-200), y: String(w[1]+90), width: String(w[2]*.6), height: "6", fill: "#1d1d1d", class: "hf-win", style: `--d:${d};opacity:.9` }, wn);
      });
    }
    play();
  }, []);

  return (
    <section ref={stageRef} className="hero-film" role="img" aria-label="A cinematic film: a modern villa at dusk lights up window by window, an AI search finds matching homes, and the Skyline Estates title appears.">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="hf-cam">
        <svg viewBox="0 0 1600 686" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="hf-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#07070a"/><stop offset=".6" stopColor="#14110f"/><stop offset="1" stopColor="#2a221a"/></linearGradient>
            <radialGradient id="hf-gl" cx=".5" cy="1" r=".9"><stop offset="0" stopColor="#D8C3A5" stopOpacity=".85"/><stop offset=".45" stopColor="#8a6a4a" stopOpacity=".35"/><stop offset="1" stopColor="#111" stopOpacity="0"/></radialGradient>
            <linearGradient id="hf-bm" x1="0" x2="1"><stop offset="0" stopColor="#D8C3A5" stopOpacity="0"/><stop offset=".5" stopColor="#F8F5F0" stopOpacity=".55"/><stop offset="1" stopColor="#D8C3A5" stopOpacity="0"/></linearGradient>
            <linearGradient id="hf-pool" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2b2a2a"/><stop offset="1" stopColor="#121212"/></linearGradient>
            <filter id="hf-bl"><feGaussianBlur stdDeviation="16"/></filter>
          </defs>
          <rect width="1600" height="686" fill="url(#hf-sky)"/>
          <g className="hf-stars" ref={starsRef}></g>
          <rect className="hf-glow" width="1600" height="686" fill="url(#hf-gl)"/>
          <g fill="#17140f" opacity=".9">
            <rect x="40" y="380" width="60" height="150"/><rect x="110" y="340" width="46" height="190"/><rect x="170" y="400" width="80" height="130"/>
            <rect x="1280" y="360" width="64" height="170"/><rect x="1352" y="320" width="50" height="210"/><rect x="1410" y="390" width="90" height="140"/><rect x="1510" y="350" width="60" height="180"/>
          </g>
          <g fill="#0c0b0a"><ellipse cx="380" cy="470" rx="90" ry="85"/><ellipse cx="300" cy="500" rx="70" ry="55"/><ellipse cx="1330" cy="465" rx="100" ry="90"/><ellipse cx="1430" cy="500" rx="70" ry="50"/></g>
          <g>
            <rect x="560" y="430" width="560" height="100" fill="#1a1917"/>
            <rect x="670" y="318" width="600" height="112" fill="#222"/>
            <rect x="650" y="306" width="640" height="14" fill="#D8C3A5" opacity=".9"/>
            <rect x="540" y="422" width="590" height="9" fill="#cdb894" opacity=".8"/>
            <rect x="1040" y="430" width="14" height="100" fill="#2c2a27"/>
          </g>
          <g ref={wgRef}></g><g ref={winsRef}></g>
          <rect x="0" y="530" width="1600" height="156" fill="#0b0a09"/>
          <rect x="360" y="548" width="540" height="64" fill="url(#hf-pool)"/>
          <rect x="360" y="548" width="540" height="2" fill="#D8C3A5" opacity=".5"/>
          <g className="hf-beam" style={{ opacity: 0 }}><rect x="430" y="250" width="120" height="300" fill="url(#hf-bm)"/><rect x="489" y="250" width="2" height="300" fill="#F8F5F0" opacity=".8"/></g>
          <g fontFamily="var(--font-poppins), Poppins, sans-serif" fontSize="13" fill="#D8C3A5" stroke="#D8C3A5">
            <g className="hf-tag" style={{ opacity: 0, ["--d" as any]: "13.2s" }}><line x1="780" y1="360" x2="780" y2="250" strokeWidth="1"/><circle cx="780" cy="360" r="3"/><text x="790" y="248" stroke="none">4 bedrooms</text></g>
            <g className="hf-tag" style={{ opacity: 0, ["--d" as any]: "14.4s" }}><line x1="620" y1="480" x2="500" y2="640" strokeWidth="1"/><circle cx="620" cy="480" r="3"/><text x="380" y="656" stroke="none">South-facing living room</text></g>
            <g className="hf-tag" style={{ opacity: 0, ["--d" as any]: "15.6s" }}><line x1="1180" y1="370" x2="1180" y2="250" strokeWidth="1"/><circle cx="1180" cy="370" r="3"/><text x="1190" y="248" stroke="none">12 min to school</text></g>
          </g>
        </svg>
        <div className="hf-ai" aria-hidden="true">
          <span className="hf-q">4 bedrooms, quiet street, near a good school</span>
          <div className="hf-r"><b>12 homes matched</b><span>Banjara Hills</span><span>Jubilee Hills</span><span>Gachibowli</span></div>
        </div>
      </div>
      <div className="hf-cap hf-c1" style={{ ["--s" as any]: ".9s", ["--dur" as any]: "5s" }}>Every home begins as a feeling.</div>
      <div className="hf-cap hf-c3" style={{ ["--s" as any]: "15.4s", ["--dur" as any]: "4.4s" }}>Walk through it before you ever visit.<small>PROPERTY INSIGHTS, POWERED BY AI</small></div>
      <div className="hf-end"><h1>Skyline Estates</h1><i></i><p>AI-POWERED REAL ESTATE</p></div>
      <div className="hf-vig"></div><div className="hf-grain"></div>
      <div className="hf-bar" style={{ top: 0 }}></div><div className="hf-bar" style={{ bottom: 0 }}></div>
      <div className="hf-black"></div>
      <div className="hf-scroll" aria-hidden="true"><span /> SCROLL TO DISCOVER</div>
      <div className="hf-ui">
        <Link href="/properties" className="hf-cta">EXPLORE PROPERTIES <ArrowRight size={15} aria-hidden="true" /></Link>
        <button type="button" className="hf-replay" onClick={play} aria-label="Replay cinematic hero film"><RotateCcw size={14} aria-hidden="true" /> REPLAY FILM</button>
      </div>
    </section>
  );
}
