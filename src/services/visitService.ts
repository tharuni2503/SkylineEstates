import type { VisitInput } from "@/lib/schemas";
import type { CreateSiteVisitResponse } from "@/types/api";
import { api, USE_MOCK } from "@/lib/api";

/** Stash mock submissions so the dashboards in this browser can show them. */
export function stashLocal(key: string, row: unknown) {
 if (typeof window === "undefined") return;
 try {
  const prev = JSON.parse(window.localStorage.getItem(key) ?? "[]");
  window.localStorage.setItem(key, JSON.stringify([row, ...prev].slice(0, 30)));
 } catch {}
}

export async function bookVisit(input:VisitInput):Promise<{id:string}>{
 if(USE_MOCK){
  await new Promise(r=>setTimeout(r,700));
  const id=`v${Date.now()}`;
  stashLocal("skyline.visitReqs",{id,name:input.name,propertyId:input.propertyId,date:input.date,time:input.time,message:input.message??"",status:"Pending",createdAt:new Date().toISOString().slice(0,10)});
  return {id};
 }
 const res=await api.post<CreateSiteVisitResponse>("/site-visits",input);
 return {id:res.data.data.id};
}
