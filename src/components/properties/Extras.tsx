import ContactForm from "@/components/forms/ContactForm";

/**
 * Property detail "extras": optional floor plan slot + enquiry form.
 * Location map, nearby places, amenities, agent card and cost/EMI are rendered
 * by dedicated components on the detail page — kept out of here to avoid duplication.
 */
export default function Extras({
  propertyId,
  propertyTitle,
  children,
}: {
  location?: string;
  propertyId?: string;
  propertyTitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      {children}
      <section className="border border-line/70 bg-white p-6 md:p-8" aria-label="Enquire about this property">
        <p className="text-[11px] uppercase tracking-[.28em] text-[#9c7f56]">Enquire</p>
        <h2 className="mt-2 font-serif text-3xl text-matte md:text-4xl">Send an enquiry</h2>
        <p className="mt-2 text-sm text-slate">Questions about pricing, availability or documentation? Send a message — this is a demo form (no backend connected).</p>
        <div id="contact-agent" className="mt-5 scroll-mt-24">
          <ContactForm propertyId={propertyId} propertyTitle={propertyTitle} />
        </div>
      </section>
    </>
  );
}
