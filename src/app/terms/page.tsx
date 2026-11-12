import SectionHead from "@/components/common/SectionHead";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const sections: [string, string][] = [
  ["Demonstration experience", "Skyline Estates is a demonstration platform. Listings, reviews, team members, and account features are illustrative, and actions such as saving, comparing, or booking are stored only in your browser."],
  ["Property information", "Property details are provided for illustration. In a live deployment, availability, pricing, and specifications would be verified before publication, and interested buyers should always confirm final terms with the developer or owner."],
  ["No binding offers", "Nothing on this site constitutes a binding offer, a reservation, or investment advice. Decisions to purchase, sell, or invest should be made after independent legal and financial consultation."],
  ["Acceptable use", "You agree not to misuse the site: no scraping in a way that degrades service, no submitting unlawful or misleading information through forms, and no attempts to disrupt the experience for others."],
  ["Intellectual property", "The Skyline Estates name, layout, and design are part of this demonstration. Photography and media remain the property of their respective owners and are used here for presentation purposes only."],
  ["Liability", "The site is provided as-is. To the extent permitted by law, Skyline Estates is not liable for decisions made based on demonstration content. Questions about these terms can be sent to hello@skylineestates.in."],
];

export default function Terms() {
  return (
    <div className="bg-ivory/30">
      <div className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate transition hover:text-matte"><ArrowLeft size={15} />Back home</Link>
        <header className="mt-8 border-b border-line/70 pb-8">
          <SectionHead as="h1" eyebrow="Terms" title="The ground rules, *in plain words.*" />
          <p className="mt-4 text-sm leading-relaxed text-slate">What this experience offers, what it doesn&rsquo;t, and how to use it well. Last updated: November 2026.</p>
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
          <p className="flex-1 text-sm text-slate">Need clarity on anything above? We&rsquo;re happy to walk you through it.</p>
          <Link href="/contact" className="inline-flex bg-matte px-6 py-3 text-[11px] font-medium uppercase tracking-[.18em] text-ivory transition hover:bg-charcoal">Contact us</Link>
        </div>
      </div>
    </div>
  );
}
