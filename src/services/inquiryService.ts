import type { ContactInput } from "@/lib/schemas";
import type { CreateInquiryResponse } from "@/types/api";
import { api, USE_MOCK } from "@/lib/api";
import { stashLocal } from "@/services/visitService";
export async function sendInquiry(input:ContactInput&{propertyId?:string}):Promise<{id:string}>{
 if(USE_MOCK){await new Promise(r=>setTimeout(r,600));const id=`i${Date.now()}`;stashLocal("skyline.inquiryLog",{id,name:input.name,propertyId:input.propertyId,email:input.email,phone:input.phone,message:input.message,createdAt:new Date().toISOString().slice(0,10)});return {id};}
 const res=await api.post<CreateInquiryResponse>("/inquiries",input);
 return {id:res.data.data.id};
}
