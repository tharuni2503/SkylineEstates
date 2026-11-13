"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { visitSchema, type VisitInput } from "@/lib/schemas";
import { bookVisit } from "@/services/visitService";
import { useToast } from "@/lib/toast";
import { useStore } from "@/lib/store";
const times=["10:00 AM","12:00 PM","3:00 PM","5:00 PM"];
export default function VisitForm({propertyId=""}:{propertyId?:string}){
 const {register,handleSubmit,reset,formState:{errors,isSubmitting}}=useForm<VisitInput>({resolver:zodResolver(visitSchema),defaultValues:{propertyId}});
 const toast=useToast();
 const {properties}=useStore();
 const [done,setDone]=useState<string|null>(null);
 const [fail,setFail]=useState(false);
 const submit=async(d:VisitInput)=>{setFail(false);try{const r=await bookVisit(d);setDone(r.id);toast("Visit requested");reset();}catch{setFail(true);}};
 const f="w-full border border-line bg-white px-4 py-3 text-sm";
 const Err=({m}:{m?:string})=>m?<p role="alert" className="mt-1 text-xs text-red-700">{m}</p>:null;
 if(done)return <div role="status" className="bg-white p-8"><h3 className="font-serif text-2xl">Visit requested</h3><p className="mt-2 text-sm text-slate">Reference {done}. An agent will confirm your slot by phone within one working day.</p><button className="mt-4 text-sm underline" onClick={()=>setDone(null)}>Book another visit</button></div>;
 return <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4 bg-white p-6">
  <div><input aria-label="Full name" placeholder="Full name" className={f} {...register("name")}/><Err m={errors.name?.message}/></div>
  <div><input aria-label="Email" placeholder="Email" className={f} {...register("email")}/><Err m={errors.email?.message}/></div>
  <div><input aria-label="Mobile number" placeholder="Mobile number" className={f} {...register("phone")}/><Err m={errors.phone?.message}/></div>
  <div><select aria-label="Property" className={f} {...register("propertyId")}><option value="">Select a property</option>{properties.map(p=><option key={p.id} value={p.id}>{p.title}, {p.location.split(",")[0]}</option>)}</select><Err m={errors.propertyId?.message}/></div>
  <div className="grid grid-cols-2 gap-3"><div><input type="date" aria-label="Visit date" className={f} {...register("date")}/><Err m={errors.date?.message}/></div>
   <div><select aria-label="Time slot" className={f} {...register("time")}><option value="">Time</option>{times.map(t=><option key={t}>{t}</option>)}</select><Err m={errors.time?.message}/></div></div>
  <textarea aria-label="Message" placeholder="Anything we should know? (optional)" rows={3} className={f} {...register("message")}/>
  {fail&&<p role="alert" className="text-sm text-red-700">We couldn't send your request. Check your connection and try again.</p>}
  <button disabled={isSubmitting} className="w-full bg-matte py-3 text-sm font-medium text-ivory transition hover:bg-charcoal disabled:opacity-60">{isSubmitting?"Sending…":"Schedule site visit"}</button>
 </form>;}

