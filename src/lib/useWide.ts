import { useEffect, useState } from "react";
export function useWide(){const [w,setW]=useState(false);
 useEffect(()=>{const m=window.matchMedia("(min-width:768px)");const f=()=>setW(m.matches);f();m.addEventListener("change",f);return ()=>m.removeEventListener("change",f);},[]);
 return w;}
