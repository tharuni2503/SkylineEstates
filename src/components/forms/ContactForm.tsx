"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/schemas";
import { sendInquiry } from "@/services/inquiryService";
import { useToast } from "@/lib/toast";
export default function ContactForm({propertyId,propertyTitle}:{propertyId?:string;propertyTitle?:string}={}){
 const {register,handleSubmit,reset,formState:{errors,isSubmitting}}=useForm<ContactInput>({resolver:zodResolver(contactSchema),defaultValues:propertyTitle?{message:`I'm interested in ${propertyTitle}. Please share more details.`}:undefined});
 const toast=useToast(); const [fail,setFail]=useState(false);
 const submit=async(d:ContactInput)=>{setFail(false);try{await sendInquiry({...d,...(propertyId&&{propertyId})});toast("Message sent. We'll reply within one working day.");reset({name:"",email:"",phone:"",message:propertyTitle?`I'm interested in ${propertyTitle}. Please share more details.`:""});}catch{setFail(true);}};
 const c="w-full border border-line bg-white px-4 py-3 text-sm";
 const Err=({m}:{m?:string})=>m?<p role="alert" className="mt-1 text-xs text-red-700">{m}</p>:null;
 return <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4 bg-white p-6">
  <div><input aria-label="Full name" placeholder="Full name" className={c} {...register("name")}/><Err m={errors.name?.message}/></div>
  <div><input aria-label="Email" placeholder="Email" className={c} {...register("email")}/><Err m={errors.email?.message}/></div>
  <div><input aria-label="Mobile number" placeholder="Mobile number" className={c} {...register("phone")}/><Err m={errors.phone?.message}/></div>
  <div><textarea aria-label="Message" placeholder="How can we help?" rows={4} className={c} {...register("message")}/><Err m={errors.message?.message}/></div>
  {fail&&<p role="alert" className="text-sm text-red-700">We couldn't send your message. Check your connection and try again.</p>}
  <button disabled={isSubmitting} className="w-full bg-matte py-3 text-sm text-ivory disabled:opacity-60">{isSubmitting?"Sending…":propertyId?"Send property enquiry":"Send message"}</button></form>;}
