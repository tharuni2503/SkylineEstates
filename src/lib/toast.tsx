"use client";
import { createContext, useCallback, useContext, useState } from "react";
const Ctx=createContext<(m:string)=>void>(()=>{});
export const useToast=()=>useContext(Ctx);
export function ToastProvider({children}:{children:React.ReactNode}){
 const [msgs,setMsgs]=useState<{id:number;t:string}[]>([]);
 const push=useCallback((t:string)=>{const id=Date.now();setMsgs(m=>[...m,{id,t}]);setTimeout(()=>setMsgs(m=>m.filter(x=>x.id!==id)),3500);},[]);
 return <Ctx.Provider value={push}>{children}<div role="status" aria-live="polite" className="fixed bottom-4 right-4 z-[60] space-y-2">{msgs.map(m=><p key={m.id} className="bg-matte px-4 py-3 text-sm text-ivory shadow-lg">{m.t}</p>)}</div></Ctx.Provider>;}
