"use client";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
export default function DepthReveal({children}:{children:React.ReactNode}){
 const reduce=useReducedMotion();
 return <motion.div initial={reduce?false:{opacity:0,y:60}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-80px"}} transition={{duration:reduce?0:.9,ease:[.22,1,.36,1] as [number,number,number,number]}}>{children}</motion.div>;}
