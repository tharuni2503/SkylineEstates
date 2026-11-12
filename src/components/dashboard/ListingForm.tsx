"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listingSchema, type ListingInput } from "@/lib/schemas";
const cats=["Apartment","Villa","Independent House","Residential Plot","Commercial"] as const;
const amen=["Clubhouse","Swimming Pool","Gym","Power Backup","Covered Parking","Security","Landscaped Garden","EV Charging"];
export default function ListingForm({defaults,noun,onSaved}:{defaults?:Partial<ListingInput>;noun:string;onSaved:(d:ListingInput,image?:string)=>void}){
 const {register,handleSubmit,reset,formState:{errors}}=useForm<ListingInput>({resolver:zodResolver(listingSchema),defaultValues:{category:"Apartment",listing:"Buy",furnishing:"Unfurnished",parking:"1",amenities:[],...defaults}});
 const [ok,setOk]=useState(false);const [img,setImg]=useState<string>();const [imgErr,setImgErr]=useState("");
 const c="w-full border border-line bg-white px-4 py-3 text-sm";
 const E=({k}:{k:keyof ListingInput})=>errors[k]?<p role="alert" className="mt-1 text-xs text-red-700">{errors[k]?.message as string}</p>:null;
 const L=({t}:{t:string})=><label className="text-xs text-slate">{t}</label>;
 const pick=(f?:File)=>{setImgErr("");if(!f)return;if(f.size>500000){setImgErr("Choose an image under 500 KB for this demo.");return;}const r=new FileReader();r.onload=()=>setImg(r.result as string);r.readAsDataURL(f);};
 return <form noValidate onSubmit={handleSubmit(d=>{onSaved(d,img);setOk(true);if(!defaults)reset();})} className="max-w-3xl space-y-8">
  <fieldset className="grid gap-4 sm:grid-cols-2"><legend className="mb-3 font-serif text-xl">Basics</legend>
   <div className="sm:col-span-2"><L t={`${noun} name`}/><input className={c} {...register("title")}/><E k="title"/></div>
   <div><L t="Category"/><select className={c} {...register("category")}>{cats.map(x=><option key={x}>{x}</option>)}</select></div>
   <div><L t="Transaction"/><select className={c} {...register("listing")}><option value="Buy">Sale</option><option value="Rent">Rent</option></select></div>
   <div className="sm:col-span-2"><L t="Description"/><textarea rows={4} className={c} {...register("description")}/><E k="description"/></div></fieldset>
  <fieldset className="grid gap-4 sm:grid-cols-2"><legend className="mb-3 font-serif text-xl">Location and price</legend>
   <div><L t="Locality"/><input className={c} {...register("location")}/><E k="location"/></div>
   <div><L t="Street address"/><input className={c} {...register("address")}/><E k="address"/></div>
   <div><L t="Price (₹)"/><input className={c} {...register("price")}/><E k="price"/></div>
   <div><L t="Area (sq ft)"/><input className={c} {...register("areaSqft")}/><E k="areaSqft"/></div></fieldset>
  <fieldset className="grid gap-4 sm:grid-cols-3"><legend className="mb-3 font-serif text-xl">Details</legend>
   <div><L t="BHK"/><input className={c} {...register("bhk")}/><E k="bhk"/></div>
   <div><L t="Bathrooms"/><input className={c} {...register("bathrooms")}/><E k="bathrooms"/></div>
   <div><L t="Parking"/><select className={c} {...register("parking")}>{["None","1","2","3+"].map(x=><option key={x}>{x}</option>)}</select></div>
   <div className="sm:col-span-3"><L t="Furnishing"/><select className={c} {...register("furnishing")}>{["Unfurnished","Semi-furnished","Furnished"].map(x=><option key={x}>{x}</option>)}</select></div></fieldset>
  <fieldset><legend className="mb-3 font-serif text-xl">Amenities</legend><div className="grid gap-2 sm:grid-cols-2">{amen.map(a=><label key={a} className="flex items-center gap-2 text-sm"><input type="checkbox" value={a} {...register("amenities")}/>{a}</label>)}</div></fieldset>
  <fieldset><legend className="mb-3 font-serif text-xl">Photo and contact</legend>
   <input type="file" accept="image/*" aria-label="Property photo" onChange={e=>pick(e.target.files?.[0])} className="text-sm"/>{imgErr&&<p role="alert" className="mt-1 text-xs text-red-700">{imgErr}</p>}
   {img&&<img src={img} alt="Selected property" className="mt-3 h-32 object-cover"/>}
   <div className="mt-4 max-w-xs"><L t="Contact phone"/><input className={c} {...register("contactPhone")}/><E k="contactPhone"/></div></fieldset>
  <div><button className="bg-matte px-8 py-3 text-sm text-ivory">Save {noun.toLowerCase()}</button>{ok&&<span role="status" className="ml-4 text-sm text-slate">Saved. It will appear after admin approval.</span>}</div></form>;}
