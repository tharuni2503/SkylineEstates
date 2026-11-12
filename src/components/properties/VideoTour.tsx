export default function VideoTour({ src, sample, title }: { src?: string; sample?: boolean; title: string }) {
  return (
    <section aria-label="Video tour">
      <h2 className="mt-14 border-t border-line pt-6 font-serif text-3xl">Video tour</h2>
      {src ? (
        <>
          <video controls playsInline preload="none" className="mt-3 aspect-video w-full bg-matte object-cover" aria-label={`Video tour of ${title}`}>
            <source src={src} type="video/mp4" />
          </video>
          {sample && <p className="mt-1 text-xs text-slate">Sample footage. A walkthrough of this exact property is available on request.</p>}
        </>
      ) : (
        <div className="mt-3 flex aspect-video w-full flex-col items-center justify-center gap-3 bg-matte p-6 text-center text-ivory">
          <p className="font-serif text-2xl">A video walkthrough is available on request.</p>
          <a href="#contact-agent" className="border border-ivory/70 px-6 py-3 text-xs font-medium tracking-[.18em] transition hover:bg-ivory hover:text-matte">REQUEST VIDEO TOUR</a>
        </div>
      )}
    </section>
  );
}
