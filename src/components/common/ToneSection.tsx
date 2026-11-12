"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
export default function ToneSection({from,to,textFrom,textTo,className="",children}:{from:string;to:string;textFrom:string;textTo:string;className?:string;children:React.ReactNode}){
 const ref=useRef<HTMLElement>(null);const reduce=useReducedMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:["start end","start 40%"]});
 const bg=useTransform(scrollYProgress,[0,1],[from,to]);const color=useTransform(scrollYProgress,[0,1],[textFrom,textTo]);
 return <motion.section ref={ref} style={reduce?{backgroundColor:to,color:textTo}:{backgroundColor:bg,color}} className={`relative ${className}`}>{children}</motion.section>;}
