"use client";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
export default function WordReveal({text,className="",as="h2"}:{text:string;className?:string;as?:"h1"|"h2"|"h3"|"p"}){
 const reduce=useReducedMotion();const Tag=as;
 return <Tag className={className} aria-label={text}>{text.split(" ").map((w,i)=><span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom"><motion.span className="inline-block" initial={reduce?false:{y:"110%"}} whileInView={{y:0}} viewport={{once:true,margin:"-60px"}} transition={{duration:reduce?0:.8,delay:reduce?0:i*.07,ease:[.22,1,.36,1] as [number,number,number,number]}}>{w}&nbsp;</motion.span></span>)}</Tag>;}
