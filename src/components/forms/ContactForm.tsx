"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/schemas";
import { sendInquiry } from "@/services/inquiryService";
import { useToast } from "@/lib/toast";

export default function ContactForm({ propertyId, propertyTitle }: { propertyId?: string; propertyTitle?: string } = {}) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactInput>({ resolver: zodResolver(contactSchema), defaultValues: propertyTitle ? { message: `I'm interested in ${propertyTitle}. Please share more details.` } : undefined });
  const toast = useToast();
  const [fail, setFail] = useState(false);
  const submit = async (d: ContactInput) => {
    setFail(false);
    try {
      await sendInquiry({ ...d, ...(propertyId && { propertyId }) });
      toast("Message sent. We'll reply within one working day.");
      reset({ name: "", email: "", phone: "", message: propertyTitle ? `I'm interested in ${propertyTitle}. Please share more details.` : "" });
    } catch { setFail(true); }
  };
  const c = "w-full border border-line bg-white px-4 py-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70";
  const msg = errors.message?.message as string | undefined;
  return <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4 bg-white p-6" aria-label={propertyId ? "Property enquiry form" : "Contact form"}>
    <div>
      <label htmlFor="contact-name" className="sr-only">Full name</label>
      <input id="contact-name" type="text" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "contact-name-err" : undefined} placeholder="Full name" className={c} {...register("name")} />
      {errors.name?.message && <p id="contact-name-err" role="alert" className="mt-1 text-xs text-red-700">{errors.name.message}</p>}
    </div>
    <div>
      <label htmlFor="contact-email" className="sr-only">Email</label>
      <input id="contact-email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "contact-email-err" : undefined} placeholder="Email" className={c} {...register("email")} />
      {errors.email?.message && <p id="contact-email-err" role="alert" className="mt-1 text-xs text-red-700">{errors.email.message}</p>}
    </div>
    <div>
      <label htmlFor="contact-phone" className="sr-only">Mobile number</label>
      <input id="contact-phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "contact-phone-err" : undefined} placeholder="Mobile number" className={c} {...register("phone")} />
      {errors.phone?.message && <p id="contact-phone-err" role="alert" className="mt-1 text-xs text-red-700">{errors.phone.message}</p>}
    </div>
    <div>
      <label htmlFor="contact-message" className="sr-only">Message</label>
      <textarea id="contact-message" aria-invalid={!!msg} aria-describedby={msg ? "contact-message-err" : undefined} placeholder="How can we help?" rows={4} className={c} {...register("message")} />
      {msg && <p id="contact-message-err" role="alert" className="mt-1 text-xs text-red-700">{msg}</p>}
    </div>
    {fail && <p role="alert" className="text-sm text-red-700">We couldn&apos;t send your message. Check your connection and try again.</p>}
    <button disabled={isSubmitting} className="w-full bg-matte py-3 text-sm text-ivory transition hover:bg-charcoal disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">{isSubmitting ? "Sending…" : propertyId ? "Send property enquiry" : "Send message"}</button>
  </form>;
}
