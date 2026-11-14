"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RefreshCw, ArrowLeft } from "lucide-react";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Keep diagnostic details in the browser console without exposing them to visitors.
    console.error("Skyline Estates route error:", error);
  }, [error]);

  return (
    <main className="relative flex min-h-[70svh] items-center justify-center overflow-hidden bg-matte px-5 py-20 text-ivory">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(216,195,165,.16),transparent_45%),radial-gradient(ellipse_at_85%_80%,rgba(248,245,240,.06),transparent_40%)]" />
      <div className="relative mx-auto max-w-xl text-center">
        <p className="text-[11px] uppercase tracking-[.35em] text-beige/80">Skyline Estates</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">A brief pause in the journey.</h1>
        <p className="mt-4 text-sm leading-relaxed text-ivory/75">This page couldn't load as expected. Your saved demo preferences remain in this browser. Please try again or return to the property collection.</p>
        {error.digest && <p className="mt-3 text-xs text-ivory/45">Reference: {error.digest}</p>}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => reset()} className="inline-flex items-center justify-center gap-2 bg-beige px-7 py-3.5 text-[11px] font-medium uppercase tracking-[.18em] text-matte transition hover:bg-ivory">
            <RefreshCw size={14} /> Try again
          </button>
          <Link href="/properties" className="inline-flex items-center justify-center gap-2 border border-ivory/35 px-7 py-3.5 text-[11px] font-medium uppercase tracking-[.18em] text-ivory transition hover:bg-ivory/10">
            <ArrowLeft size={14} /> Browse properties
          </Link>
        </div>
      </div>
    </main>
  );
}
