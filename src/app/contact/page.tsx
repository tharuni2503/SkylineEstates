"use client";
import SectionHead from "@/components/common/SectionHead";
import { useEffect, useState } from "react";
import VisitForm from "@/components/forms/VisitForm";
import ContactForm from "@/components/forms/ContactForm";
import { Mail, MapPin, PhoneCall, Clock } from "lucide-react";
import { CONTACT_EMAIL, CONTACT_ADDRESS, CONTACT_NOTE, CONTACT_HOURS, PHONE } from "@/lib/contact";

export default function Contact(){const [tab,setTab]=useState<"msg"|"visit">("msg");
 useEffect(()=>{if(new URLSearchParams(window.location.search).get("visit"))setTab("visit");},[]);
 return <div className="relative overflow-hidden bg-ivory/30">
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_10%,rgba(216,195,165,.16),transparent_40%),radial-gradient(ellipse_at_90%_80%,rgba(17,17,17,.04),transparent_45%)]"/>
  <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:gap-10 sm:px-5 md:px-8 md:py-16 lg:grid-cols-[.95fr_1.05fr]">
   <div>
    <SectionHead as="h1" eyebrow="Contact" title="Talk to an *advisor.*"/>
    <p className="mt-4 max-w-md text-sm leading-relaxed text-slate">Send us a question, request a curated shortlist, or book a site visit. {CONTACT_HOURS}. Enquiries and bookings on this site are demonstrations (no backend connected).</p>
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
     <div className="border border-line/70 bg-white p-4"><p className="flex items-center gap-2 text-[11px] uppercase tracking-[.18em] text-[#9c7f56]"><MapPin size={14}/>Office</p><address className="mt-2 text-sm not-italic leading-relaxed text-charcoal/80">{CONTACT_ADDRESS}</address></div>
     <div className="border border-line/70 bg-white p-4"><p className="flex items-center gap-2 text-[11px] uppercase tracking-[.18em] text-[#9c7f56]"><Clock size={14}/>Hours</p><p className="mt-2 text-sm leading-relaxed text-charcoal/80">{CONTACT_HOURS}</p></div>
     <a href={`mailto:${CONTACT_EMAIL}`} className="border border-line/70 bg-white p-4 transition hover:border-beige/50 hover:shadow-[0_10px_24px_rgba(17,17,17,.05)]"><p className="flex items-center gap-2 text-[11px] uppercase tracking-[.18em] text-[#9c7f56]"><Mail size={14}/>Email</p><p className="mt-2 text-sm text-charcoal/80">{CONTACT_EMAIL}</p></a>
     {PHONE ? <a href={`tel:${PHONE}`} className="border border-line/70 bg-white p-4 transition hover:border-beige/50 hover:shadow-[0_10px_24px_rgba(17,17,17,.05)]"><p className="flex items-center gap-2 text-[11px] uppercase tracking-[.18em] text-[#9c7f56]"><PhoneCall size={14}/>Phone</p><p className="mt-2 text-sm text-charcoal/80">{PHONE}</p></a>
     : <div className="border border-line/70 bg-white p-4"><p className="flex items-center gap-2 text-[11px] uppercase tracking-[.18em] text-[#9c7f56]"><PhoneCall size={14}/>Phone</p><p className="mt-2 text-sm text-charcoal/80">Request a callback using the form — a direct number will be added once approved.</p></div>}
    </div>
    <p className="mt-3 text-xs text-slate/80">{CONTACT_NOTE}</p>
    <div className="mt-6 overflow-hidden border border-line/70 bg-white shadow-[0_12px_34px_rgba(17,17,17,.05)]">
     <iframe title="Skyline Estates office, Financial District, Hyderabad" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=Financial+District,+Hyderabad&output=embed" className="aspect-[16/10] w-full border-0"/>
    </div>
   </div>
   <div className="border border-line/70 bg-white p-5 shadow-[0_14px_40px_rgba(17,17,17,.06)] md:p-7 lg:self-start lg:sticky lg:top-24">
    <div role="tablist" aria-label="Contact options" className="mb-5 flex gap-6 border-b border-line">
     {([["msg","Send an enquiry"],["visit","Book a site visit"]] as const).map(([k,l])=>(
      <button type="button" key={k} id={`contact-tab-${k}`} role="tab" aria-selected={tab===k} aria-controls={`contact-panel-${k}`} tabIndex={tab===k?0:-1} onClick={()=>setTab(k)} className={`pb-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${tab===k?"border-b-2 border-matte font-medium text-matte":"text-slate hover:text-matte"}`}>
       {l}
      </button>
     ))}
    </div>
    <div id={`contact-panel-${tab}`} role="tabpanel" aria-labelledby={`contact-tab-${tab}`}>
     {tab==="msg"?<ContactForm/>:<VisitForm/>}
    </div>
   </div>
  </div>
 </div>;}