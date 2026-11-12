import type { VisitInput } from "@/lib/schemas";
import type { CreateSiteVisitResponse } from "@/types/api";
import { api, USE_MOCK } from "@/lib/api";
export async function bookVisit(input:VisitInput):Promise<{id:string}>{
 if(USE_MOCK){await new Promise(r=>setTimeout(r,700));return {id:`v${Date.now()}`};}
 const res=await api.post<CreateSiteVisitResponse>("/site-visits",input);
 return {id:res.data.data.id};
}
