"use client";
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { properties as seed } from "@/data/properties";
import type { Property } from "@/types";
import type { Role } from "@/lib/schemas";
export type Account = { name: string; email: string; role: Role; phone?: string };
const K={p:"skyline.properties",w:"skyline.wishlist",c:"skyline.compare",a:"skyline.account"};
interface Store{properties:Property[];ready:boolean;hydrated:boolean;wishlist:string[];compare:string[];account:Account|null;
 toggleWish:(id:string)=>void;toggleCompare:(id:string)=>void;clearCompare:()=>void;
 add:(p:Omit<Property,"id"|"postedAt">)=>void;update:(id:string,patch:Partial<Property>)=>void;remove:(id:string)=>void;
 setAccount:(a:Account)=>void;updateAccount:(patch:Partial<Account>)=>void;signOut:()=>void}
const Ctx=createContext<Store|null>(null);
export const useStore=()=>{const s=useContext(Ctx);if(!s)throw new Error("useStore must be used inside StoreProvider");return s;};
const read=<T,>(k:string,d:T):T=>{try{const v=typeof window!=="undefined"?window.localStorage.getItem(k):null;return v?JSON.parse(v) as T:d;}catch{return d;}};
const asProps=(v:unknown):Property[]=>Array.isArray(v)&&v.length&&typeof (v[0] as any)?.id==="string"?v as Property[]:seed;
export function StoreProvider({children}:{children:React.ReactNode}){
 const [properties,setProps]=useState<Property[]>(seed);const [wishlist,setW]=useState<string[]>([]);const [compare,setC]=useState<string[]>([]);const [account,setAcc]=useState<Account|null>(null);const [ready,setReady]=useState(false);const [hydrated,setHydrated]=useState(false);
 const hydratedRef=useRef(false);
 useEffect(()=>{
  try{
    setProps(asProps(read(K.p,seed)));
    const w=read<unknown[]>(K.w,[]); setW(Array.isArray(w)?w.filter((x):x is string=>typeof x==="string"):[]);
    const c=read<unknown[]>(K.c,[]); setC(Array.isArray(c)?c.filter((x):x is string=>typeof x==="string").slice(0,4):[]);
    const a=read<unknown>(K.a,null); setAcc(a&&typeof a==="object"&&a!==null&&"email"in (a as any)?a as Account:null);
  }catch{}
  hydratedRef.current=true;
  setHydrated(true);
  setReady(true);
 },[]);
 useEffect(()=>{if(!hydratedRef.current)return;try{window.localStorage.setItem(K.p,JSON.stringify(properties));window.localStorage.setItem(K.w,JSON.stringify(wishlist));window.localStorage.setItem(K.c,JSON.stringify(compare));if(account)window.localStorage.setItem(K.a,JSON.stringify(account));else window.localStorage.removeItem(K.a);}catch{}},[properties,wishlist,compare,account]);
 const toggleWish=useCallback((id:string)=>setW(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]),[]);
 const toggleCompare=useCallback((id:string)=>setC(s=>s.includes(id)?s.filter(x=>x!==id):s.length<4?[...s,id]:s),[]);
 const add=useCallback((p:Omit<Property,"id"|"postedAt">)=>setProps(l=>[{...p,id:`p${Date.now()}`,postedAt:new Date().toISOString().slice(0,10)},...l]),[]);
 const update=useCallback((id:string,patch:Partial<Property>)=>setProps(l=>l.map(p=>p.id===id?{...p,...patch}:p)),[]);
 const remove=useCallback((id:string)=>{setProps(l=>l.filter(p=>p.id!==id));setW(s=>s.filter(x=>x!==id));setC(s=>s.filter(x=>x!==id));},[]);
 const setAccount=useCallback((a:Account)=>setAcc(a),[]);
 const updateAccount=useCallback((patch:Partial<Account>)=>setAcc(s=>s?{...s,...patch}:s),[]);
 const signOut=useCallback(()=>{setAcc(null);try{window.localStorage.removeItem("token");window.localStorage.removeItem(K.a);}catch{}},[]);
 return <Ctx.Provider value={{properties,ready,hydrated,wishlist,compare,account,toggleWish,toggleCompare,clearCompare:()=>setC([]),add,update,remove,setAccount,updateAccount,signOut}}>{children}</Ctx.Provider>;}