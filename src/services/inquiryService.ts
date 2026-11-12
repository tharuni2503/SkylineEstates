import type { ContactInput } from "@/lib/schemas";
import type { CreateInquiryResponse } from "@/types/api";
import { api, USE_MOCK } from "@/lib/api";
export async function sendInquiry(input:ContactInput&{propertyId?:string}):Promise<{id:string}>{
 if(USE_MOCK){await new Promise(r=>setTimeout(r,600));return {id:`i${Date.now()}`};}
 const res=await api.post<CreateInquiryResponse>("/inquiries",input);
 return {id:res.data.data.id};
}
