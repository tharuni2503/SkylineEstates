"use client";
import { useEffect, useState } from "react";
import { inr } from "@/lib/format";

/**
 * Illustrative EMI estimator for this property. Pure client-side maths on the
 * listing price; every figure is an example — not a lender's offer.
 */
export default function EmiCalculator({ price }: { price: number }) {
 const [dp, setDp] = useState(20);
 const [rate, setRate] = useState(8.5);
 const [years, setYears] = useState(20);

 const loan = Math.round((price * (100 - dp)) / 100);
 const r = rate / 12 / 100;
 const n = years * 12;
 const emi = Math.round((loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
 const total = emi * n;
 const interest = total - loan;
 const down = price - loan;

 // Donut chart geometry (radius 40, circumference 251.3)
 const C = 2 * Math.PI * 40;
 const principalShare = total > 0 ? loan / total : 0;
 const dash = Math.round(principalShare * C);

 const row = "flex items-baseline justify-between gap-4 border-t border-line/60 py-2 text-sm first:border-0 first:pt-0";

 return (
  <section aria-label="EMI estimator" className="border border-line/70 bg-white p-6 md:p-8">
   <p className="text-[11px] uppercase tracking-[.28em] text-[#9c7f56]">Plan this purchase</p>
   <h2 className="mt-2 font-serif text-3xl text-matte md:text-4xl">Estimate your <em className="italic text-[#9c7f56]">EMI.</em></h2>
   <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1fr_.8fr]">
    <div className="space-y-5">
     <div>
      <div className="flex items-baseline justify-between gap-3"><label htmlFor="dp" className="text-xs font-medium uppercase tracking-[.16em] text-slate">Down payment</label><span className="text-sm font-medium text-matte tabular-nums">{dp}% · {inr(down)}</span></div>
      <input id="dp" type="range" min={5} max={50} step={5} value={dp} onChange={e => setDp(+e.target.value)} className="mt-2 w-full accent-[#9c7f56]" />
     </div>
     <div>
      <div className="flex items-baseline justify-between gap-3"><label htmlFor="rate" className="text-xs font-medium uppercase tracking-[.16em] text-slate">Interest rate</label><span className="text-sm font-medium text-matte tabular-nums">{rate.toFixed(1)}% p.a.</span></div>
      <input id="rate" type="range" min={6} max={14} step={0.1} value={rate} onChange={e => setRate(+e.target.value)} className="mt-2 w-full accent-[#9c7f56]" />
     </div>
     <div>
      <div className="flex items-baseline justify-between gap-3"><label htmlFor="tenure" className="text-xs font-medium uppercase tracking-[.16em] text-slate">Loan tenure</label><span className="text-sm font-medium text-matte tabular-nums">{years} years</span></div>
      <input id="tenure" type="range" min={5} max={30} step={1} value={years} onChange={e => setYears(+e.target.value)} className="mt-2 w-full accent-[#9c7f56]" />
     </div>
     <dl className="border border-line/70 bg-ivory/40 p-4 text-sm">
      <div className={row}><dt className="text-slate">Home loan amount</dt><dd className="font-medium text-matte tabular-nums">{inr(loan)}</dd></div>
      <div className={row}><dt className="text-slate">Monthly EMI</dt><dd className="font-serif text-xl text-[#9c7f56] tabular-nums">{inr(emi)}</dd></div>
      <div className={row}><dt className="text-slate">Total interest</dt><dd className="font-medium text-matte tabular-nums">{inr(interest)}</dd></div>
      <div className={row}><dt className="text-slate">Total payment</dt><dd className="font-medium text-matte tabular-nums">{inr(total)}</dd></div>
     </dl>
    </div>
    <div className="flex flex-col items-center">
     <svg width="190" height="190" viewBox="0 0 100 100" role="img" aria-label={`Principal vs interest split: principal ${Math.round(principalShare * 100)} percent`}>
      <circle cx="50" cy="50" r="40" fill="none" stroke="#e7e3dc" strokeWidth="14" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="#D8C3A5" strokeWidth="14" strokeDasharray={`${dash} ${C}`} strokeLinecap="round" transform="rotate(-90 50 50)" />
      <text x="50" y="46" textAnchor="middle" fontSize="10" fill="#111" fontFamily="serif">{Math.round(principalShare * 100)}%</text>
      <text x="50" y="59" textAnchor="middle" fontSize="4.6" fill="#5a5a5e" letterSpacing="1.4">PRINCIPAL</text>
     </svg>
     <p className="mt-4 text-center text-xs leading-relaxed text-slate">Gold: principal repaid &nbsp;·&nbsp; Grey: interest &nbsp;·&nbsp; At {rate.toFixed(1)}% over {years} years.</p>
     <p className="mt-3 text-center text-[10px] uppercase tracking-[.16em] text-slate/70">Indicative only — not a lender's offer</p>
    </div>
   </div>
  </section>
 );
}
