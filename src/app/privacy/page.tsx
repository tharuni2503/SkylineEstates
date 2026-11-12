import SectionHead from "@/components/common/SectionHead";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const sections: [string, string][] = [
  ["Information we collect", "When you browse Skyline Estates, we collect only what the experience needs: the details you enter in search filters, enquiry and site-visit forms, and basic technical information (browser type, pages visited) that helps us keep the site fast and reliable."],
  ["How we use your details", "Your enquiries, site-visit requests, and saved properties are used to respond to you, prepare curated shortlists, and improve the experience. We never sell personal information, and marketing emails are only sent if you subscribe through our newsletter form."],
  ["Local demonstration storage", "This experience stores preferences in your browser — such as your wishlist, comparison list, saved listings, and account session — so everything remains on your device and can be cleared at any time from your browser settings."],
  ["Cookies & analytics", "We use essential storage to keep the site working. If optional analytics are added later, they will be described here with a clear opt-out."],
  ["Third-party services", "Embedded maps (Google Maps) and hosted media may receive basic technical requests when you view them. Their handling of data follows their own privacy policies."],
  ["Your choices", "You can withdraw an enquiry by contacting us, clear stored preferences from your browser, and unsubscribe from the newsletter at any time. For questions about this policy, write to hello@skylineestates.in."],
];

export default function Privacy() {
  return (
    <div className="bg-ivory/30">
      <div className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate transition hover:text-matte"><ArrowLeft size={15} />Back home</Link>
        <header className="mt-8 border-b border-line/70 pb-8">
          <SectionHead as="h1" eyebrow="Privacy" title="Your information, *handled with care.*" />
          <p className="mt-4 text-sm leading-relaxed text-slate">We collect the minimum needed to help you find a home, we never sell it, and you stay in control. Last updated: November 2026.</p>
        </header>
        <div className="mt-10 space-y-8">
          {sections.map(([t, d], i) => (
            <section key={t} className="border-l-2 border-beige/50 pl-5">
              <p className="text-[11px] uppercase tracking-[.24em] text-[#9c7f56]">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-1.5 font-serif text-2xl text-matte">{t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/80">{d}</p>
            </section>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-4 border border-line/70 bg-white p-6">
          <p className="flex-1 text-sm text-slate">Questions about privacy? We answer every message.</p>
          <Link href="/contact" className="inline-flex bg-matte px-6 py-3 text-[11px] font-medium uppercase tracking-[.18em] text-ivory transition hover:bg-charcoal">Contact us</Link>
        </div>
      </div>
    </div>
  );
}
