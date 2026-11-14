export default function Loading() {
  return (
    <section aria-label="Loading page" aria-busy="true" aria-live="polite" className="min-h-[70svh] bg-ivory/30">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <p className="text-[10px] font-medium uppercase tracking-[.3em] text-[#9c7f56]">Skyline Estates</p>
        <div className="mt-5 h-10 w-64 max-w-full animate-pulse bg-line/70" />
        <div className="mt-3 h-4 w-96 max-w-full animate-pulse bg-line/50" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="overflow-hidden border border-line/60 bg-white">
              <div className="aspect-[4/3] animate-pulse bg-line/60" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-24 animate-pulse bg-line/60" />
                <div className="h-6 w-3/4 animate-pulse bg-line/60" />
                <div className="h-4 w-1/2 animate-pulse bg-line/60" />
              </div>
            </div>
          ))}
        </div>
        <p className="sr-only">Loading page content…</p>
      </div>
    </section>
  );
}
