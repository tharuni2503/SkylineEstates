import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70svh] items-center justify-center overflow-hidden bg-matte px-5 py-20 text-ivory">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(216,195,165,.16),transparent_45%),radial-gradient(ellipse_at_85%_80%,rgba(248,245,240,.06),transparent_40%)]" />
      <div className="relative mx-auto max-w-xl text-center">
        <p className="text-[11px] uppercase tracking-[.35em] text-beige/80">Skyline Estates</p>
        <h1 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">This page isn&apos;t here.</h1>
        <p className="mt-4 text-sm leading-relaxed text-ivory/75">The address may have changed or the link may be incomplete. Explore our collection or return home.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="inline-flex items-center justify-center bg-beige px-7 py-3.5 text-[11px] font-medium uppercase tracking-[.18em] text-matte transition hover:bg-ivory">Back to home</Link>
          <Link href="/properties" className="inline-flex items-center justify-center border border-ivory/35 px-7 py-3.5 text-[11px] font-medium uppercase tracking-[.18em] text-ivory transition hover:bg-ivory/10">Browse properties</Link>
        </div>
      </div>
    </div>
  );
}
