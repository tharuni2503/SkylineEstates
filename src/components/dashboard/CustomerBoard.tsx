"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, CalendarCheck2, Mail, Eye, Scale, Bell, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import PropertyCard from "@/components/properties/PropertyCard";
import RecommendedForYou from "@/components/properties/RecommendedForYou";
import { inr } from "@/lib/format";
import type { VisitRow } from "@/types";

const readLocal = <T,>(k: string, d: T): T => { try { const v = window.localStorage.getItem(k); return v ? JSON.parse(v) as T : d; } catch { return d; } };

export default function CustomerBoard() {
  const router = useRouter();
  const toast = useToast();
  const { properties, wishlist, compare, toggleWish, toggleCompare, clearCompare, account, updateAccount, signOut } = useStore();
  const [tab, setTab] = useState("Overview");
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [visits, setVisits] = useState<VisitRow[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [readNotes, setReadNotes] = useState<string[]>([]);

  const displayName = account?.name || "Aarav Sharma";
  const email = account?.email || "demo@skylineestates.in";
  const initials = displayName.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  useEffect(() => {
    setRecentIds(readLocal<string[]>("skyline.recent", []));
    const local = readLocal<any[]>("skyline.visitReqs", []);
    const sample: VisitRow[] = [
      { id: "sv-1", name: displayName, propertyId: "p3", date: "2026-11-03", time: "3:00 PM", status: "Completed" },
      { id: "sv-2", name: displayName, propertyId: "p1", date: "2026-11-14", time: "12:00 PM", status: "Pending" },
    ];
    setVisits([...local.map((r) => ({ id: r.id, name: r.name, propertyId: r.propertyId, date: r.date, time: r.time, status: r.status ?? "Pending" })), ...sample]);
    const localInq = readLocal<any[]>("skyline.inquiryLog", []);
    const sampleInq = [
      { id: "sq-1", propertyId: "p1", message: "Is the price negotiable, and is parking included?", createdAt: "2026-10-30", status: "Awaiting reply" },
      { id: "sq-2", propertyId: "p6", message: "Please share the floor plan and payment schedule.", createdAt: "2026-10-27", status: "Replied (demo)" },
    ];
    setEnquiries([...localInq.map(r => ({ ...r, status: "Sent (demo)" })), ...sampleInq]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saved = properties.filter(p => wishlist.includes(p.id));
  const comparing = properties.filter(p => compare.includes(p.id));
  const recent = recentIds.map(id => properties.find(p => p.id === id)).filter(Boolean) as typeof properties;
  const upcoming = visits.filter(v => v.status === "Pending" || v.status === "Confirmed");
  const notifications = [
    { id: "n1", text: upcoming[0] ? `Site visit for ${properties.find(p => p.id === upcoming[0].propertyId)?.title ?? "a shortlisted residence"} is ${upcoming[0].status.toLowerCase()}.` : "No upcoming visits — book one from any listing.", when: "Today" },
    { id: "n2", text: saved.length ? `${saved.length} saved ${saved.length === 1 ? "property" : "properties"} — compare them side by side.` : "Save properties you like to revisit them quickly.", when: "This week" },
    { id: "n3", text: enquiries[0] ? "An advisor will respond to your latest enquiry (demo)." : "Send an enquiry from a property page to track it here.", when: "Demo" },
  ];
  const unread = notifications.filter(n => !readNotes.includes(n.id)).length;

  const tabs = ["Overview", "Saved", "Compare", "Site visits", "Enquiries", "Recently viewed", "Notifications", "Profile"];

  const stats: [string, number, any][] = [
    ["Saved properties", saved.length, Heart],
    ["In comparison", comparing.length, Scale],
    ["Visits scheduled", upcoming.length, CalendarCheck2],
    ["Enquiries sent", enquiries.length, Mail],
  ];

  return (
    <div className="bg-ivory/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-5 md:py-12">
        <p className="text-[10px] uppercase tracking-[.3em] text-[#9c7f56]">My Skyline</p>
        <div className="mt-1 flex flex-wrap items-start justify-between gap-3 border-b border-line/70 pb-5">
          <div>
            <h1 className="font-serif text-4xl text-matte">Welcome back, <em className="italic text-[#9c7f56]">{displayName.split(" ")[0]}.</em></h1>
            <p className="mt-1.5 text-sm text-slate">{email} · Demo dashboard — sample data and actions stored in this browser only.</p>
          </div>
          <button onClick={() => { signOut(); toast("Signed out"); router.push("/login"); }} className="mt-1 border border-line px-5 py-2.5 text-[10px] font-medium uppercase tracking-[.18em] text-matte transition hover:border-matte hover:bg-matte hover:text-ivory">Sign out</button>
        </div>

        <div className="mt-6 md:grid md:grid-cols-[auto_1fr] md:gap-8">
          <nav aria-label="Customer dashboard" className="mb-6 md:mb-0">
            <div role="tablist" aria-orientation="vertical" className="flex gap-2 overflow-x-auto border-b border-line pb-2 md:w-56 md:flex-col md:overflow-visible md:border-0 md:pb-0">
              {tabs.map(t => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`shrink-0 whitespace-nowrap border px-3 py-2.5 text-left text-xs transition md:w-full md:text-sm ${tab === t ? "border-matte bg-matte font-medium text-ivory md:bg-white md:text-matte" : "border-transparent text-slate hover:border-line hover:bg-white"}`}>{t}{t === "Notifications" && unread > 0 ? <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-beige px-1.5 text-[10px] font-semibold text-matte">{unread}</span> : null}</button>)}
            </div>
          </nav>

          <div>
            {tab === "Overview" && (
              <>
                <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                  {stats.map(([label, value, Icon]) => (
                    <div key={label} className="group border border-line/70 bg-white p-4 shadow-[0_8px_24px_rgba(17,17,17,.035)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(17,17,17,.07)] sm:p-5">
                      <div className="flex items-center justify-between"><span className="flex h-9 w-9 items-center justify-center bg-ivory"><Icon size={17} className="text-[#9c7f56]" /></span><span className="text-[9px] uppercase tracking-[.14em] text-slate">Your activity</span></div>
                      <p className="mt-4 font-serif text-3xl tabular-nums text-matte">{value}</p>
                      <p className="mt-1 text-[10px] font-medium uppercase tracking-[.16em] text-slate">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border border-line/70 bg-white p-4 shadow-[0_8px_24px_rgba(17,17,17,.035)] sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-[10px] font-medium uppercase tracking-[.22em] text-[#9c7f56]">Your activity</p><h2 className="mt-1 font-serif text-xl text-matte">Recent updates</h2></div><span className="border border-line px-2.5 py-1 text-[9px] uppercase tracking-[.14em] text-slate">Browser demo</span></div>
                  <ul className="mt-3 divide-y divide-line/60 text-sm">
                    {upcoming.slice(0, 2).map(v => (
                      <li key={v.id} className="flex flex-wrap items-center justify-between gap-2 py-3"><span className="text-charcoal/90">Site visit for <Link href={`/property/${v.propertyId}`} className="font-medium underline underline-offset-4 decoration-beige/60 hover:text-matte">{properties.find(p => p.id === v.propertyId)?.title ?? "your shortlisted residence"}</Link></span><span className="text-xs text-slate">{v.date} · {v.time} · <span className="text-[#9c7f56]">{v.status}</span></span></li>
                    ))}
                    {enquiries.slice(0, 2).map((e, i) => (
                      <li key={e.id ?? i} className="flex flex-wrap items-center justify-between gap-2 py-3"><span className="line-clamp-1 text-charcoal/90">“{e.message}”</span><span className="text-xs text-slate">{e.createdAt}</span></li>
                    ))}
                    {upcoming.length + enquiries.length === 0 && <li className="py-4 text-slate">Nothing yet — browse the collection and save a few favourites.</li>}
                  </ul>
                </div>
                <RecommendedForYou />
              </>
            )}

            {tab === "Saved" && (
              <>
                <div className="flex items-center justify-between gap-3"><p className="text-sm text-slate"><span className="font-medium text-matte">{saved.length}</span> {saved.length === 1 ? "property" : "properties"} saved</p><Link href="/properties" className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[.18em] text-[#9c7f56] hover:text-matte">Add more <ArrowRight size={12} /></Link></div>
                {saved.length === 0 ? <div className="mt-4 border border-line/70 bg-white p-10 text-center"><p className="font-serif text-2xl text-matte">Nothing saved yet</p><p className="mt-1.5 text-sm text-slate">Tap the heart on any listing to keep it here.</p><Link href="/properties" className="mt-4 inline-block bg-matte px-6 py-3 text-[10px] font-medium uppercase tracking-[.18em] text-ivory hover:bg-charcoal">Browse properties</Link></div>
                : <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{saved.map(p => <PropertyCard key={p.id} p={p} titleAs="h2" saved onToggle={toggleWish} compared={compare.includes(p.id)} onCompare={toggleCompare} />)}</div>}
              </>
            )}

            {tab === "Compare" && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate">Comparing <span className="font-medium text-matte">{comparing.length}</span> of 4</p>{comparing.length > 0 && <button className="text-[10px] font-medium uppercase tracking-[.18em] text-slate underline underline-offset-4 hover:text-matte" onClick={clearCompare}>Clear comparison</button>}</div>
                {comparing.length === 0 ? <div className="mt-4 border border-line/70 bg-white p-10 text-center"><p className="font-serif text-2xl text-matte">Nothing to compare</p><p className="mt-1.5 text-sm text-slate">Add two or more listings — or ask the assistant for suggestions.</p><Link href="/ai-assistant" className="mt-4 inline-flex items-center gap-2 bg-matte px-6 py-3 text-[10px] font-medium uppercase tracking-[.18em] text-ivory hover:bg-charcoal"><Sparkles size={12} />Ask the assistant</Link></div>
                : <div className="mt-4 overflow-x-auto border border-line/70 bg-white p-4 sm:p-5"><table className="w-full min-w-[640px] text-left text-sm"><tbody>{([["Property", (p: any) => p.title], ["Price", (p: any) => inr(p.price)], ["Location", (p: any) => p.location], ["Type", (p: any) => p.category], ["Area", (p: any) => `${p.areaSqft.toLocaleString()} sq ft`], ["BHK", (p: any) => p.bhk ?? "—"], ["Verified", (p: any) => p.verified ? "Yes" : "No"], ["Amenities", (p: any) => p.amenities.slice(0, 3).join(", ") || "—"]] as [string, (p: any) => string][]).map(([k, fn]) => <tr key={k} className="border-t border-line align-top"><th className="sticky left-0 whitespace-nowrap bg-white py-3 pr-4 text-[10px] font-medium uppercase tracking-[.12em] text-slate">{k}</th>{comparing.map(p => <td key={p.id} className="min-w-[10rem] border-b border-line/50 py-3 pr-4 align-top text-charcoal">{fn(p)}</td>)}</tr>)}</tbody></table></div>}
              </>
            )}

            {tab === "Site visits" && (
              <>
                <p className="text-sm text-slate">Requests you've made for site visits — your agent will confirm by phone (demo data stored locally).</p>
                <div className="mt-4 overflow-x-auto border border-line/70 bg-white"><table className="w-full min-w-[620px] text-left text-sm"><thead className="text-slate"><tr><th className="px-4 py-2.5 font-normal">Property</th><th>Date</th><th>Time</th><th>Status</th></tr></thead><tbody>{visits.map(v => { const p = properties.find(x => x.id === v.propertyId); return <tr key={v.id} className="border-t border-line"><td className="px-4 py-3"><Link href={p ? `/property/${p.id}` : "/properties"} className="font-medium hover:underline">{p?.title ?? "Listing removed"}</Link></td><td>{v.date}</td><td>{v.time}</td><td><span className={`inline-flex items-center gap-1.5 ${v.status === "Pending" ? "text-amber-800" : v.status === "Confirmed" ? "text-emerald-800" : "text-slate"}`}><span className={`h-1.5 w-1.5 rounded-full ${v.status === "Pending" ? "bg-amber-500" : v.status === "Confirmed" ? "bg-emerald-600" : "bg-slate/50"}`} />{v.status}</span></td></tr>; })}</tbody></table>{visits.length === 0 && <p className="p-6 text-center text-sm text-slate">No visits yet. Book one from any listing — it appears here.</p>}</div>
              </>
            )}

            {tab === "Enquiries" && (
              <>
                <p className="text-sm text-slate">Your enquiry history (demo). Responses are illustrative — not connected to a backend.</p>
                <ul className="mt-4 divide-y divide-line border border-line/70 bg-white">
                  {enquiries.map((e, i) => { const p = properties.find(x => x.id === e.propertyId); return (
                    <li key={e.id ?? i} className="flex flex-wrap items-start gap-4 px-4 py-4">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-matte text-ivory"><Mail size={15} /></span>
                      <div className="min-w-0 flex-1"><p className="text-sm text-charcoal/90">“{e.message}”</p><p className="mt-1.5 text-xs text-slate">{p ? <Link href={`/property/${p.id}`} className="underline underline-offset-4 decoration-beige/60 hover:text-matte">{p.title}</Link> : "General enquiry"} · {e.createdAt} · <span className="text-[#9c7f56]">{e.status || "Sent (demo)"}</span></p></div>
                    </li>
                  ); })}
                  {enquiries.length === 0 && <li className="p-8 text-center text-sm text-slate">No enquiries yet. Use “Send property enquiry” on any listing.</li>}
                </ul>
              </>
            )}

            {tab === "Recently viewed" && (
              <>
                <p className="text-sm text-slate"><Eye size={13} className="mr-1 inline text-[#9c7f56]" />Homes you opened recently (stored in this browser).</p>
                {recent.length === 0 ? <div className="mt-4 border border-line/70 bg-white p-10 text-center"><p className="font-serif text-2xl text-matte">Nothing viewed yet</p><Link href="/properties" className="mt-4 inline-block bg-matte px-6 py-3 text-[10px] font-medium uppercase tracking-[.18em] text-ivory hover:bg-charcoal">Explore properties</Link></div>
                : <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{recent.map(p => <PropertyCard key={p.id} p={p} titleAs="h2" saved={wishlist.includes(p.id)} onToggle={toggleWish} compared={compare.includes(p.id)} onCompare={toggleCompare} />)}</div>}
              </>
            )}

            {tab === "Notifications" && (
              <div className="border border-line/70 bg-white">
                <div className="flex items-center justify-between border-b border-line/60 px-5 py-4"><div><p className="text-[11px] uppercase tracking-[.26em] text-[#9c7f56]">Notifications</p><p className="mt-1 text-sm text-slate">Demo alerts based on your local activity.</p></div><button onClick={() => { setReadNotes(notifications.map(n => n.id)); toast("All marked as read"); }} className="text-[10px] font-medium uppercase tracking-[.16em] text-slate underline underline-offset-4 hover:text-matte">Mark all read</button></div>
                <ul className="divide-y divide-line/60">
                  {notifications.map(n => {
                    const read = readNotes.includes(n.id);
                    return <li key={n.id} className={`flex items-start gap-3 px-5 py-4 ${read ? "opacity-70" : ""}`}><span className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${read ? "bg-line/60 text-slate" : "bg-matte text-ivory"}`}>{read ? <CheckCircle2 size={14} /> : <Bell size={14} />}</span><div className="flex-1"><p className="text-sm text-charcoal/90">{n.text}</p><p className="mt-1 text-xs text-slate">{n.when}</p></div><button onClick={() => setReadNotes(r => r.includes(n.id) ? r : [...r, n.id])} className="text-xs text-slate underline underline-offset-4 hover:text-matte">{read ? "Read" : "Mark read"}</button></li>;
                  })}
                </ul>
              </div>
            )}

            {tab === "Profile" && (
              <div className="max-w-xl">
                <div className="border border-line/70 bg-white p-6 shadow-[0_10px_30px_rgba(17,17,17,.04)]">
                  <div className="flex items-center gap-4 border-b border-line/70 pb-5">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-matte font-serif text-lg text-ivory">{initials}</span>
                    <div><p className="font-serif text-2xl text-matte">{displayName}</p><p className="text-sm text-slate">{email}</p><p className="mt-1 text-[11px] uppercase tracking-[.18em] text-[#9c7f56]">Buyer account · demo profile</p></div>
                  </div>
                  <form className="mt-5 space-y-4" onSubmit={e => { e.preventDefault(); const fd = new FormData(e.currentTarget); const name = String(fd.get("name") || "").trim(); const phone = String(fd.get("phone") || "").trim(); if (name && account) updateAccount({ name, phone }); toast("Profile saved (browser demo)"); }}>
                    <label className="block text-sm text-slate">Full name<input name="name" key={displayName} defaultValue={displayName} className="mt-1.5 w-full border border-line bg-white px-4 py-2.5 text-charcoal outline-none transition focus:border-beige focus:ring-2 focus:ring-beige/20" /></label>
                    <label className="block text-sm text-slate">Email<input value={email} readOnly className="mt-1.5 w-full border border-line bg-ivory/50 px-4 py-2.5 text-slate" /></label>
                    <label className="block text-sm text-slate">Phone<input name="phone" key={account?.phone || "p"} defaultValue={account?.phone || ""} placeholder="Add a contact number (demo)" className="mt-1.5 w-full border border-line bg-white px-4 py-2.5 text-charcoal outline-none transition focus:border-beige focus:ring-2 focus:ring-beige/20" /></label>
                    <p className="text-xs text-slate">Edits are saved locally in this browser for demonstration only — no account is created on a server.</p>
                    <div className="flex flex-wrap gap-3 pt-2"><button className="bg-matte px-6 py-2.5 text-[11px] font-medium tracking-[.18em] text-ivory transition hover:bg-charcoal">SAVE PROFILE</button><button type="button" onClick={() => { signOut(); toast("Signed out"); router.push("/login"); }} className="border border-line px-6 py-2.5 text-[11px] font-medium tracking-[.18em] text-matte transition hover:border-beige">SIGN OUT</button></div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
