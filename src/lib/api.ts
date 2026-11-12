import axios from "axios";
// Set NEXT_PUBLIC_API_URL and NEXT_PUBLIC_USE_MOCK=false to switch to the real backend.
export const USE_MOCK=process.env.NEXT_PUBLIC_USE_MOCK!=="false";
export const api=axios.create({baseURL:process.env.NEXT_PUBLIC_API_URL??"http://localhost:5000/api",timeout:10000});
api.interceptors.request.use(c=>{
 if(typeof window!=="undefined"){const t=window.localStorage.getItem("token");if(t)c.headers.Authorization=`Bearer ${t}`;}
 return c;});
