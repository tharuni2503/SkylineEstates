"use client";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
export default function MaskReveal({children,className=""}:{children:React.ReactNode;className?:string}){
 const reduce=useReducedMotion();
 return <motion.div className={`overflow-hidden ${className}`} style={{contain:"paint"}} initial={reduce?false:{clipPath:"inset(0 100% 0 0)"}} whileInView={{clipPath:"inset(0 0% 0 0)"}} viewport={{once:true,margin:"-80px"}} transition={{duration:reduce?0:1.1,ease:[.22,1,.36,1] as [number,number,number,number]}}>
  <motion.div className="h-full w-full will-change-transform" initial={reduce?false:{scale:1.2}} whileInView={{scale:1}} viewport={{once:true,margin:"-80px"}} transition={{duration:reduce?0:1.4,ease:[.22,1,.36,1] as [number,number,number,number]}}>{children}</motion.div></motion.div>;}
