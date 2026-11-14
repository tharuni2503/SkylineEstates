"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";
import { Menu, X, Bell, Heart, User, LogOut } from "lucide-react";

const links = [["Home", "/"], ["Properties", "/properties"], ["Locations", "/locations"], ["Projects", "/projects"], ["About Us", "/about"], ["Contact Us", "/contact"]];
const more = [["AI Assistant", "/ai-assistant"], ["Services", "/services"], ["Insights", "/blog"]];
const isOn = (path: string, h: string) => h === "/" ? path === "/" : path.startsWith(h);
const EASE: [number, number, number, number] = [.22, 1, .36, 1];

export default function Navbar() {
 const path = usePathname();
 const home = path === "/";
 const [scrolled, setScrolled] = useState(false);
 const { wishlist, account, signOut } = useStore();
 const [open, setOpen] = useState(false);
 const [bell, setBell] = useState(false);
 const bellRef = useRef<HTMLDivElement>(null);
 const menuButtonRef = useRef<HTMLButtonElement>(null);
 const menuRef = useRef<HTMLDivElement>(null);
 const roleHome: Record<string, string> = { buyer: "/dashboard", seller: "/dashboard", agent: "/dashboard", builder: "/builder", admin: "/admin" };
 const accountHome = account ? (roleHome[account.role] || "/dashboard") : "/login";

 useEffect(() => {
  const f = () => setScrolled(window.scrollY > 40);
  f();
  window.addEventListener("scroll", f, { passive: true });
  return () => window.removeEventListener("scroll", f);
 }, []);

 useEffect(() => { setOpen(false); setBell(false); }, [path]);

 useEffect(() => {
  if (!open) return;
  const k = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
  window.addEventListener("keydown", k);
  const prev = document.documentElement.style.overflow;
  document.documentElement.style.overflow = "hidden";
  // Move focus into the dialog; return it to the toggle when closed
  const first = menuRef.current?.querySelector<HTMLElement>("a,button");
  first?.focus();
  return () => {
   window.removeEventListener("keydown", k);
   document.documentElement.style.overflow = prev;
   menuButtonRef.current?.focus();
  };
 }, [open]);

 // Close the notifications panel on outside click / Escape
 useEffect(() => {
  if (!bell) return;
  const onClick = (e: MouseEvent) => { if (!bellRef.current?.contains(e.target as Node)) setBell(false); };
  const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setBell(false); };
  document.addEventListener("mousedown", onClick);
  document.addEventListener("keydown", onKey);
  return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("keydown", onKey); };
 }, [bell]);

 const solid = !home || scrolled || open;

 return (
   <>
     <header className={`fixed inset-x-0 top-0 z-50 text-ivory transition-all duration-500 ${solid ? "border-b border-ivory/10 bg-matte/90 shadow-[0_12px_40px_rgba(0,0,0,.45)] backdrop-blur-md" : "border-b border-transparent bg-gradient-to-b from-matte/70 to-transparent"}`}>
       <nav className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-5 sm:px-5 md:px-8" aria-label="Main">
         <Link href="/" aria-label="Skyline Estates home" className="shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"><Logo compact={scrolled} /></Link>
         <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
           <ul className="hidden items-center gap-5 xl:flex xl:gap-6">
             {links.map(([l, h]) => (
               <li key={h}><Link href={h} aria-current={isOn(path, h) ? "page" : undefined} className={`group relative py-1 text-[13px] transition hover:text-ivory ${isOn(path, h) ? "text-ivory" : "text-ivory/80"}`}>{l}<span className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-300 ${isOn(path, h) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} /></Link></li>
             ))}
           </ul>
           {account ? (
             <>
               <Link href={accountHome} className="hidden items-center gap-2 text-sm text-ivory/85 transition hover:text-ivory lg:flex" title={account.email}>
                 <span className="flex h-7 w-7 items-center justify-center rounded-full bg-beige/20 text-[10px] font-medium tracking-wide text-beige">{(account.name || "U").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}</span>
                 <span className="max-w-[8rem] truncate">{account.name}</span>
               </Link>
               <button type="button" onClick={() => { signOut(); setBell(false); }} className="hidden items-center gap-1.5 border border-ivory/25 px-4 py-2 text-xs font-medium tracking-[.12em] text-ivory/85 transition hover:border-ivory/50 hover:text-ivory lg:flex"><LogOut size={14} />SIGN OUT</button>
             </>
           ) : (
             <>
               <Link href="/login" className="hidden items-center gap-2 text-sm text-ivory/80 transition hover:text-ivory lg:flex"><User size={18} strokeWidth={1.5} />Account</Link>
               <Link href="/login" className="hidden bg-beige px-5 py-2 text-xs font-medium tracking-[.15em] text-matte transition hover:bg-ivory lg:block">SIGN IN</Link>
             </>
           )}
           <Link href="/wishlist" aria-label={`Saved properties (${wishlist.length})`} title="Wishlist" className="relative flex h-11 w-11 items-center justify-center rounded-full text-ivory/90 transition hover:bg-ivory/10 hover:text-ivory"><Heart size={18} strokeWidth={1.75} />{wishlist.length > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-beige px-1 text-[10px] font-semibold text-matte">{wishlist.length}</span>}</Link>
           <div className="relative" ref={bellRef}>
             <button aria-label="Notifications" aria-expanded={bell} aria-controls="notifications-panel" onClick={() => setBell(v => !v)} className="relative flex h-11 w-11 items-center justify-center rounded-full text-ivory/90 transition hover:bg-ivory/10 hover:text-ivory"><Bell size={18} strokeWidth={1.75} />{bell && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />}</button>
             {bell && (
               <div id="notifications-panel" role="dialog" aria-label="Notifications" className="absolute right-0 top-12 z-50 w-[min(17rem,calc(100vw-2rem))] overflow-hidden border border-line/60 bg-white text-sm text-charcoal shadow-[0_18px_44px_rgba(0,0,0,.22)]">
                 <p className="border-b border-line/60 bg-ivory px-4 py-2.5 text-[10px] font-medium uppercase tracking-[.22em] text-slate">Notifications</p>
                 <ul className="p-2"><li className="rounded-sm px-2.5 py-2 transition-colors hover:bg-ivory">New site visit request for Skyline Crest</li><li className="rounded-sm px-2.5 py-2 transition-colors hover:bg-ivory">Your listing was approved</li><li className="rounded-sm px-2.5 py-2 transition-colors hover:bg-ivory">2 new leads this week</li></ul>
                 <p className="border-t border-line/60 px-4 py-2 text-[10px] uppercase tracking-[.18em] text-slate/75">Demo notifications</p>
               </div>
             )}
           </div>
           <button ref={menuButtonRef} onClick={() => setOpen(v => !v)} aria-expanded={open} aria-controls="site-menu" aria-label={open ? "Close menu" : "Open menu"} className="flex min-h-[44px] items-center gap-2 rounded-sm px-2 py-2 text-sm text-ivory/90 transition hover:bg-ivory/10 hover:text-ivory lg:hidden">
             <span className="hidden md:inline">{open ? "Close" : "Menu"}</span>{open ? <X size={24} /> : <Menu size={24} />}
           </button>
         </div>
       </nav>

       <AnimatePresence>
         {open && (
           <motion.div id="site-menu" ref={menuRef} role="dialog" aria-modal="true" aria-label="Site menu" initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: .65, ease: [.76, 0, .24, 1] }} className="fixed inset-0 overflow-y-auto overscroll-contain bg-matte pt-16">
             <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_15%,rgba(216,195,165,.10),transparent_50%)]" aria-hidden="true" />
             <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl gap-10 px-5 py-10 md:grid-cols-[1.6fr_1fr] md:items-center">
               <ul>
                 {[...links, ...more].map(([l, h], i) => (
                   <li key={h} className="overflow-hidden border-b border-ivory/5 last:border-0">
                     <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ delay: .2 + i * .055, duration: .85, ease: EASE }}>
                       <Link href={h} onClick={() => setOpen(false)} aria-current={isOn(path, h) ? "page" : undefined} className={`block py-2 font-serif text-3xl leading-tight transition-colors hover:text-beige focus-visible:text-beige md:py-1 md:text-5xl ${isOn(path, h) ? "text-beige" : "text-ivory"}`}>{l}</Link>
                     </motion.div>
                   </li>
                 ))}
               </ul>
               <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .65, duration: .75 }} className="space-y-6 text-sm text-ivory/70">
                 <div className="flex flex-wrap gap-3">
                   {account ? (
                     <>
                       <Link href={accountHome} onClick={() => setOpen(false)} className="bg-beige px-6 py-3 text-matte transition hover:bg-ivory">{account.name} · {account.role}</Link>
                       <button type="button" onClick={() => { signOut(); setOpen(false); }} className="border border-ivory/40 px-6 py-3 text-ivory transition hover:bg-ivory hover:text-matte">Sign out</button>
                     </>
                   ) : (
                     <>
                       <Link href="/login" onClick={() => setOpen(false)} className="border border-ivory/40 px-6 py-3 text-ivory transition hover:bg-ivory hover:text-matte">Sign in</Link>
                       <Link href="/register" onClick={() => setOpen(false)} className="bg-beige px-6 py-3 text-matte transition hover:bg-ivory">Get started</Link>
                     </>
                   )}
                 </div>
                 <address className="space-y-1 not-italic text-ivory/70"><p className="text-[10px] uppercase tracking-[.3em] text-beige/60">Visit us</p><p>Financial District, Hyderabad 500032</p><p><a href="mailto:hello@skylineestates.in" className="underline decoration-beige/30 underline-offset-4 transition hover:text-ivory">hello@skylineestates.in</a> <span className="text-ivory/40">(demo)</span></p></address>
               </motion.div>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
     </header>
     {!home && <div className="h-16" aria-hidden="true" />}
   </>
 );
}
