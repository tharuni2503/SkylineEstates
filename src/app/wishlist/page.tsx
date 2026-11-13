"use client";
import SectionHead from "@/components/common/SectionHead";
import Link from "next/link";
import { useStore } from "@/lib/store";
import PropertyCard from "@/components/properties/PropertyCard";
import RecommendedForYou from "@/components/properties/RecommendedForYou";
export default function Wishlist(){const {properties,wishlist,toggleWish,compare,toggleCompare}=useStore();const items=properties.filter(p=>wishlist.includes(p.id));
 return <div className="mx-auto max-w-7xl px-5 py-12"><SectionHead as="h1" eyebrow="Wishlist" title="Saved *properties.*"/>
 {items.length===0?<div className="py-16 text-center"><p className="text-slate">You haven't saved any properties yet. Tap the heart on a listing to keep it here.</p><Link href="/properties" className="mt-6 inline-block bg-matte px-8 py-3 text-sm text-ivory">Browse properties</Link></div>
 :<div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map(p=><PropertyCard key={p.id} p={p} titleAs="h2" saved onToggle={toggleWish} compared={compare.includes(p.id)} onCompare={toggleCompare}/>)}</div>}
 <RecommendedForYou/></div>;}
