"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { visitSchema, type VisitInput } from "@/lib/schemas";
import { bookVisit } from "@/services/visitService";
import { useToast } from "@/lib/toast";
import { useStore } from "@/lib/store";

const times = ["10:00 AM", "12:00 PM", "3:00 PM", "5:00 PM"];

export default function VisitForm({ propertyId = "" }: { propertyId?: string }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<VisitInput>({ resolver: zodResolver(visitSchema), defaultValues: { propertyId } });
  const toast = useToast();
  const { properties } = useStore();
  const [done, setDone] = useState<string | null>(null);
  const [fail, setFail] = useState(false);
  const submit = async (d: VisitInput) => { setFail(false); try { const r = await bookVisit(d); setDone(r.id); toast("Visit requested"); reset(); } catch { setFail(true); } };
  const f = "w-full border border-line bg-white px-4 py-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70";
  const Err = ({ id, m }: { id: string; m?: string }) => m ? <p id={id} role="alert" className="mt-1 text-xs text-red-700">{m}</p> : null;

  if (done) return <div role="status" className="bg-white p-8"><h3 className="font-serif text-2xl">Visit requested</h3><p className="mt-2 text-sm text-slate">Reference {done}. An agent will confirm your slot by phone within one working day.</p><button type="button" className="mt-4 text-sm underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold" onClick={() => setDone(null)}>Book another visit</button></div>;

  return <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4 bg-white p-6" aria-label="Schedule a site visit">
    <div>
      <label htmlFor="visit-name" className="sr-only">Full name</label>
      <input id="visit-name" type="text" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "visit-name-err" : undefined} placeholder="Full name" className={f} {...register("name")} />
      <Err id="visit-name-err" m={errors.name?.message} />
    </div>
    <div>
      <label htmlFor="visit-email" className="sr-only">Email</label>
      <input id="visit-email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "visit-email-err" : undefined} placeholder="Email" className={f} {...register("email")} />
      <Err id="visit-email-err" m={errors.email?.message} />
    </div>
    <div>
      <label htmlFor="visit-phone" className="sr-only">Mobile number</label>
      <input id="visit-phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "visit-phone-err" : undefined} placeholder="Mobile number" className={f} {...register("phone")} />
      <Err id="visit-phone-err" m={errors.phone?.message} />
    </div>
    <div>
      <label htmlFor="visit-property" className="sr-only">Property</label>
      <select id="visit-property" aria-invalid={!!errors.propertyId} aria-describedby={errors.propertyId ? "visit-property-err" : undefined} className={f} {...register("propertyId")}>
        <option value="">Select a property</option>
        {properties.map(p => <option key={p.id} value={p.id}>{p.title}, {p.location.split(",")[0]}</option>)}
      </select>
      <Err id="visit-property-err" m={errors.propertyId?.message} />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label htmlFor="visit-date" className="sr-only">Visit date</label>
        <input id="visit-date" type="date" aria-invalid={!!errors.date} aria-describedby={errors.date ? "visit-date-err" : undefined} className={f} {...register("date")} />
        <Err id="visit-date-err" m={errors.date?.message} />
      </div>
      <div>
        <label htmlFor="visit-time" className="sr-only">Time slot</label>
        <select id="visit-time" aria-invalid={!!errors.time} aria-describedby={errors.time ? "visit-time-err" : undefined} className={f} {...register("time")}>
          <option value="">Time</option>
          {times.map(t => <option key={t}>{t}</option>)}
        </select>
        <Err id="visit-time-err" m={errors.time?.message} />
      </div>
    </div>
    <div>
      <label htmlFor="visit-message" className="sr-only">Message</label>
      <textarea id="visit-message" placeholder="Anything we should know? (optional)" rows={3} className={f} {...register("message")} />
    </div>
    {fail && <p role="alert" className="text-sm text-red-700">We couldn&apos;t send your request. Check your connection and try again.</p>}
    <button disabled={isSubmitting} className="w-full bg-matte py-3 text-sm font-medium text-ivory transition hover:bg-charcoal disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">{isSubmitting ? "Sending…" : "Schedule site visit"}</button>
  </form>;
}
