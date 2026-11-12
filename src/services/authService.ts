import type { AuthInput, Role } from "@/lib/schemas";
import { api, USE_MOCK } from "@/lib/api";
// Demo only: no real authentication. Replace with JWT endpoints when the backend exists.
export async function login(i:AuthInput):Promise<{role:Role}>{
 if(USE_MOCK){await new Promise(r=>setTimeout(r,500));return {role:i.role??"buyer"};}
 const res=await api.post<{data:{role:Role;token:string}}>("/auth/login",i);
 window.localStorage.setItem("token",res.data.data.token);return {role:res.data.data.role};
}
export async function registerUser(i:AuthInput):Promise<{role:Role}>{
 if(USE_MOCK){await new Promise(r=>setTimeout(r,500));return {role:i.role??"buyer"};}
 const res=await api.post<{data:{role:Role}}>("/auth/register",i);return {role:res.data.data.role};
}
export async function forgotPassword(email:string):Promise<void>{
 if(USE_MOCK){await new Promise(r=>setTimeout(r,500));return;}
 await api.post("/auth/forgot-password",{email});
}
