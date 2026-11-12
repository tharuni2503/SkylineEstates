"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { useState, useEffect } from "react";
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
  const roleHome: Record<string, string> = { buyer: "/properties", seller: "/dashboard", agent: "/dashboard", builder: "/builder", admin: "/admin" };
  const accountHome = account ? (roleHome[account.role] || "/dashboard") : "/login";

  useEffect(() => { const f = () => setScrolled(window.scrollY > 40); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  useEffect(() => { setOpen(false); setBell(false); }, [path]);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", k);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.documentElement.style.overflow = prev; };
  }, [open]);

  const solid = !home || scrolled || open;
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 text-ivory transition-all duration-500 ${solid ? "bg-matte/90 backdrop-blur-md" : "bg-gradient-to-b from-matte/60 to-transparent"}`}>
        <nav className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between gap-5 px-5 md:px-8" aria-label="Main">
          <Link href="/" aria-label="Skyline Estates home"><Logo compact={scrolled} /></Link>
          <div className="flex items-center gap-4 md:gap-6">
            <ul className="hidden items-center gap-6 lg:flex">
              {links.map(([l, h]) => (
                <li key={h}><Link href={h} aria-current={isOn(path, h) ? "page" : undefined} className={`group relative py-1 text-sm transition hover:text-ivory ${isOn(path, h) ? "text-ivory" : "text-ivory/80"}`}>{l}<span className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-300 ${isOn(path, h) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} /></Link></li>
              ))}
            </ul>
            {account ? (
              <>
                <Link href={accountHome} className="hidden items-center gap-2 text-sm text-ivory/85 transition hover:text-ivory lg:flex" title={account.email}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-beige/20 text-[10px] font-medium tracking-wide text-beige">{(account.name || "U").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}</span>
                  <span className="max-w-[8rem] truncate">{account.name}</span>
                </Link>
                <button type="button" onClick={() => { signOut(); setBell(false); }} className="hidden items-center gap-1.5 border border-ivory/25 px-4 py-2 text-xs font-medium tracking-[.12em] text-ivory/85 transition hover:border-ivory/45 hover:text-ivory lg:flex"><LogOut size={14} />SIGN OUT</button>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden items-center gap-2 text-sm text-ivory/80 transition hover:text-ivory lg:flex"><User size={18} strokeWidth={1.5} />Account</Link>
                <Link href="/login" className="hidden bg-beige px-5 py-2 text-xs font-medium tracking-[.15em] text-matte transition hover:bg-ivory lg:block">SIGN IN</Link>
              </>
            )}
            <Link href="/wishlist" aria-label={`Saved properties (${wishlist.length})`} className="relative"><Heart size={18} />{wishlist.length > 0 && <span className="absolute -right-2 -top-2 rounded-full bg-beige px-1.5 text-[10px] text-matte">{wishlist.length}</span>}</Link>
            <div className="relative">
              <button aria-label="Notifications" aria-expanded={bell} onClick={() => setBell(!bell)}><Bell size={18} /></button>
              {bell && <ul className="absolute right-0 top-8 z-50 w-[min(16rem,calc(100vw-2.5rem))] bg-white p-3 text-sm text-charcoal shadow"><li className="pb-2 text-xs uppercase tracking-widest text-slate">Sample notifications (demo data)</li><li className="py-1">New site visit request for Skyline Crest</li><li className="py-1">Your listing was approved</li><li className="py-1">2 new leads this week</li></ul>}
            </div>
            <button onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="site-menu" aria-label={open ? "Close menu" : "Open menu"} className="flex items-center gap-2 text-sm lg:hidden">
              <span className="hidden md:inline">{open ? "Close" : "Menu"}</span>{open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div id="site-menu" role="dialog" aria-modal="true" aria-label="Site menu" initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: .7, ease: [.76, 0, .24, 1] }} className="fixed inset-0 overflow-y-auto bg-matte pt-16">
              <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl gap-10 px-5 py-10 md:grid-cols-[1.6fr_1fr] md:items-center">
                <ul>
                  {[...links, ...more].map(([l, h], i) => (
                    <li key={h} className="overflow-hidden">
                      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ delay: .25 + i * .06, duration: .9, ease: EASE }}>
                        <Link href={h} onClick={() => setOpen(false)} aria-current={isOn(path, h) ? "page" : undefined} className={`block py-1 font-serif text-3xl transition-colors hover:text-beige md:text-5xl ${isOn(path, h) ? "text-beige" : "text-ivory"}`}>{l}</Link>
                      </motion.div>
                    </li>
                  ))}
                </ul>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .7, duration: .8 }} className="space-y-6 text-sm text-ivory/70">
                  <div className="flex flex-wrap gap-4">
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
                  <address className="space-y-1 not-italic"><p>Financial District, Hyderabad 500032</p><p>hello@skylineestates.in</p></address>
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
