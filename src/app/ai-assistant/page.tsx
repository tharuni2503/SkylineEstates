"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { filterProperties } from "@/services/propertyService";
import { useStore } from "@/lib/store";
import type { Property } from "@/types";
import { inr } from "@/lib/format";
type Msg={role:"user"|"assistant";text:string;results?:Property[]};
const prompts=["Show me 3 BHK properties under ₹1 Crore near IT hubs","Villas in Kokapet","2 BHK apartments for rent","Villas with a swimming pool"];
// Replace askAssistant with a call to the Python AI service later.
async function askAssistant(q:string,list:Property[]):Promise<Msg>{
 await new Promise(r=>setTimeout(r,900));
 const bhk=q.match(/(\d)\s*bhk/i)?.[1]; const cr=q.match(/under\s*₹?\s*([\d.]+)\s*(crore|cr|lakh|l)/i);
 const max=cr?Number(cr[1])*(/cr/i.test(cr[2])?1e7:1e5):undefined;
 const catMap:[RegExp,Property["category"]][]=[[/villa/i,"Villa"],[/apartment|flat/i,"Apartment"],[/house/i,"Independent House"],[/plot|land/i,"Residential Plot"],[/commercial|office/i,"Commercial"]];
 const cat=catMap.find(([re])=>re.test(q))?.[1]??"All";
 let r=filterProperties(list,{bhk:bhk?Number(bhk):undefined,maxPrice:max,listing:/rent/i.test(q)?"Rent":undefined,category:cat});
 const IT=["Gachibowli","Financial District","Kondapur","Madhapur","Kokapet"];
 const known=["Gachibowli","Kokapet","Narsingi","Financial District","Kondapur","Madhapur","Tellapur","Miyapur"];
 const loc=known.find(l=>q.toLowerCase().includes(l.toLowerCase()));
 if(loc) r=r.filter(p=>p.location.includes(loc));
 else if(/it\s*(hub|park|corridor)|near work|tech/i.test(q)) r=r.filter(p=>IT.some(l=>p.location.includes(l)));
 const am=([["pool","Swimming Pool"],["gym","Gym"],["clubhouse","Clubhouse"],["parking","Covered Parking"],["security","Security"],["garden","Landscaped Garden"],["ev charging","EV Charging"],["power backup","Power Backup"]] as [string,string][]).filter(([k])=>q.toLowerCase().includes(k)).map(([,v])=>v);
 if(am.length) r=r.filter(p=>am.every(a=>p.amenities.includes(a)));
 return r.length?{role:"assistant",text:`I found ${r.length} matching ${r.length>1?"properties":"property"}.`,results:r.slice(0,3)}:{role:"assistant",text:"Nothing matches that yet. Try a higher budget or a different area."};
}
export default function Assistant(){
 const {properties}=useStore();
 const [msgs,setMsgs]=useState<Msg[]>([]); const [text,setText]=useState(""); const [busy,setBusy]=useState(false); const end=useRef<HTMLDivElement>(null);
 useEffect(()=>{end.current?.scrollIntoView({behavior:"smooth"});},[msgs,busy]);
 const send=async(q:string)=>{if(!q.trim()||busy)return;setText("");setMsgs(m=>[...m,{role:"user",text:q}]);setBusy(true);const a=await askAssistant(q,properties);setMsgs(m=>[...m,a]);setBusy(false);};
 return <div className="mx-auto flex min-h-[80vh] max-w-3xl flex-col px-5 py-10">
  <div className="flex items-center justify-between"><h1 className="font-serif text-4xl">Property assistant</h1>{msgs.length>0&&<button className="text-sm underline" onClick={()=>setMsgs([])}>Clear conversation</button>}</div>
  <div className="mt-6 flex-1 space-y-4" aria-live="polite">
   {msgs.length===0&&<div className="space-y-2"><p className="text-slate">Describe what you're looking for, or start with one of these.</p>{prompts.map(p=><button key={p} onClick={()=>send(p)} className="block w-full border border-line bg-white p-3 text-left text-sm hover:border-beige">{p}</button>)}</div>}
   {msgs.map((m,i)=><div key={i} className={m.role==="user"?"text-right":""}><p className={`inline-block max-w-[85%] px-4 py-3 text-sm ${m.role==="user"?"bg-matte text-ivory":"bg-white"}`}>{m.text}</p>
    {m.results&&<div className="mt-3 grid gap-3 sm:grid-cols-3">{m.results.map(p=><Link key={p.id} href={`/property/${p.id}`} className="bg-white p-3 text-left text-sm hover:shadow"><p className="font-serif text-base">{p.title}</p><p className="text-slate">{p.bhk} BHK · {p.location.split(",")[0]}</p><p className="mt-1 font-medium">{inr(p.price)}</p></Link>)}</div>}</div>)}
   {busy&&<p className="text-sm text-slate">Searching listings…</p>}<div ref={end}/></div>
  <form onSubmit={e=>{e.preventDefault();send(text);}} className="mt-6 flex gap-2"><input aria-label="Ask the assistant" value={text} onChange={e=>setText(e.target.value)} placeholder="Ask about homes, budgets or areas" className="flex-1 border border-line bg-white px-4 py-3 text-sm"/><button disabled={busy} className="bg-matte px-6 text-sm text-ivory disabled:opacity-60">Send</button></form></div>;}
