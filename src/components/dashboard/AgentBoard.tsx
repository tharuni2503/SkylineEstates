"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Users, CalendarCheck2, Building2, TrendingUp, Check, PhoneCall, ArrowRight, ClipboardList, Clock3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { leads as seedLeads, monthly, visits as seedVisits, inquiries as seedInquiries } from "@/data/dashboard";
import type { LeadStatus } from "@/types";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { inr } from "@/lib/format";

const statuses: LeadStatus[] = ["New", "Contacted", "Visit scheduled", "Closed"];
const readLocal = <T,>(k: string, d: T): T => { try { const v = window.localStorage.getItem(k); return v ? JSON.parse(v) as T : d; } catch { return d; } };

type FollowUp = { id: string; leadId: string; note: string; due: string; done: boolean };

export default function AgentBoard() {
  const router = useRouter();
  const toast = useToast();
  const { properties, account, updateAccount, signOut, wishlist } = useStore();
  const [tab, setTab] = useState("Overview");
  const [leads, setLeads] = useState(seedLeads);
  const [leadFilter, setLeadFilter] = useState<LeadStatus | "All">("All");
  const [visits, setVisits] = useState<any[]>(seedVisits);
  const [replied, setReplied] = useState<string[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>(seedInquiries);
  const [followUps, setFollowUps] = useState<FollowUp[]>([
    { id: "f1", leadId: "l1", note: "Call to confirm budget range and preferred towers", due: "2026-11-14", done: false },
    { id: "f2", leadId: "l2", note: "Share floor plan and payment schedule by email", due: "2026-11-15", done: false },
    { id: "f3", leadId: "l3", note: "Confirm site-visit parking and meeting point", due: "2026-11-13", done: true },
  ]);
  const [newFollow, setNewFollow] = useState({ leadId: "l1", note: "", due: "2026-11-16" });

  const displayName = account?.name || "Lakshmi Prasad";
  const email = account?.email || "lakshmi@skylineestates.in";
  const initials = displayName.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const myListings = properties.filter(p => p.agentId === "a1");

  useEffect(() => {
    const localVisits = readLocal<any[]>("skyline.visitReqs", []);
    setVisits([...localVisits.map(r => ({ id: r.id, name: r.name, propertyId: r.propertyId, date: r.date, time: r.time, status: r.status ?? "Pending" })), ...seedVisits]);
    const localInq = readLocal<any[]>("skyline.inquiryLog", []);
    setEnquiries([...localInq, ...seedInquiries]);
  }, []);

  const openLeads = leads.filter(l => l.status !== "Closed").length;
  const pendingVisits = visits.filter(v => v.status === "Pending").length;
  const visibleLeads = leadFilter === "All" ? leads : leads.filter(l => l.status === leadFilter);
  const pendingFollowUps = followUps.filter(f => !f.done);

  const tabs = ["Overview", "Leads", "Follow-ups", "Enquiries", "Site visits", "Assigned properties", "Performance", "Recent activity", "Profile"];

  const confirmVisit = (id: string) => { setVisits(vs => vs.map(v => v.id === id ? { ...v, status: "Confirmed" } : v)); toast("Visit confirmed (demo)"); };
  const cancelVisit = (id: string) => { setVisits(vs => vs.map(v => v.id === id ? { ...v, status: "Cancelled" } : v)); toast("Visit marked as cancelled (demo)"); };

  const stats: [string, string | number, any][] = [
    ["Open leads", openLeads, Users],
    ["Follow-ups due", pendingFollowUps.length, ClipboardList],
    ["Visits to confirm", pendingVisits, CalendarCheck2],
    ["Assigned properties", myListings.length, Building2],
  ];

  const activity = [
    { id: "a1", when: "Today", text: `${pendingVisits} site visit${pendingVisits === 1 ? "" : "s"} awaiting confirmation` },
    { id: "a2", when: "Today", text: `${enquiries.filter(e => !replied.includes(e.id)).length} enquiries awaiting a reply` },
    { id: "a3", when: "This week", text: `${leads.filter(l => l.status === "New").length} new leads added to pipeline` },
    { id: "a4", when: "This week", text: `${followUps.filter(f => f.done).length} follow-ups completed (demo)` },
  ];

  return (
    <div className="bg-[#f6f2eb]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-5 md:py-12">
        <p className="text-[10px] uppercase tracking-[.3em] text-[#9c7f56]">Skyline advisors</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3 border-b border-line/70 pb-5">
          <div>
            <h1 className="font-serif text-4xl text-matte">Agent <em className="italic text-[#9c7f56]">dashboard.</em></h1>
            <p className="mt-1.5 text-sm text-slate">{email} · Demo dashboard — sample data and actions stored in this browser only.</p>
          </div>
          <div className="flex items-center gap-3">
            <button aria-label="Notifications" className="relative rounded-full border border-line bg-white p-2.5 text-charcoal transition hover:text-matte" onClick={() => toast(`${pendingVisits} pending visits · ${pendingFollowUps.length} follow-ups due (demo)`)}><Bell size={18} />{(pendingVisits + pendingFollowUps.length) > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-beige text-[9px] font-semibold text-matte">{pendingVisits + pendingFollowUps.length}</span>}</button>
            <button onClick={() => { signOut(); toast("Signed out"); router.push("/login"); }} className="border border-line bg-white px-5 py-2.5 text-[10px] font-medium uppercase tracking-[.18em] text-matte transition hover:border-matte">Sign out</button>
          </div>
        </div>

        <div className="mt-6 md:grid md:grid-cols-[auto_1fr] md:gap-8">
          <nav aria-label="Agent dashboard" className="mb-6 md:mb-0">
            <div role="tablist" aria-orientation="vertical" className="flex flex-wrap gap-x-5 gap-y-2 border-b border-line md:flex-col md:flex-nowrap md:gap-1 md:border-0 md:w-52">
              {tabs.map(t => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`whitespace-nowrap pb-3 text-left text-sm transition md:px-3 md:py-2.5 ${tab === t ? "border-b-2 border-matte font-medium text-matte md:border-b-0 md:bg-white" : "text-slate hover:text-matte"}`}>{t}</button>)}
            </div>
          </nav>

          <div>
            {tab === "Overview" && (
              <>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {stats.map(([label, value, Icon]) => (
                    <div key={label} className="border border-line/70 bg-white p-4">
                      <Icon size={17} className="text-[#9c7f56]" />
                      <p className="mt-2 font-serif text-2xl tabular-nums text-matte">{value}</p>
                      <p className="text-[9px] uppercase tracking-[.18em] text-slate">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border border-line/70 bg-white p-5">
                  <p className="text-[11px] uppercase tracking-[.26em] text-[#9c7f56]">Enquiries · last 5 months (sample)</p>
                  <div className="mt-3 h-48"><ResponsiveContainer><BarChart data={monthly}><XAxis dataKey="m" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="v" name="Enquiries" fill="#D8C3A5" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></div>
                </div>
                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <div className="border border-line/70 bg-matte p-5 text-ivory">
                    <p className="text-[11px] uppercase tracking-[.26em] text-beige/85">Today's priorities</p>
                    <ul className="mt-3 space-y-2 text-sm text-ivory/85">
                      <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold" />Confirm {pendingVisits} pending site {pendingVisits === 1 ? "visit" : "visits"}</li>
                      <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold" />Complete {pendingFollowUps.length} follow-ups</li>
                      <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold" />Reply to {enquiries.filter(e => !replied.includes(e.id)).length} enquiries</li>
                    </ul>
                  </div>
                  <div className="border border-line/70 bg-white p-5">
                    <p className="text-[11px] uppercase tracking-[.26em] text-[#9c7f56]">Recent activity</p>
                    <ul className="mt-3 space-y-2 text-sm">{activity.map(a => <li key={a.id} className="flex items-start gap-2"><Clock3 size={14} className="mt-0.5 text-[#9c7f56]" /><span><span className="text-charcoal/90">{a.text}</span> <span className="text-xs text-slate">· {a.when}</span></span></li>)}</ul>
                  </div>
                </div>
              </>
            )}

            {tab === "Leads" && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-slate"><span className="font-medium text-matte">{visibleLeads.length}</span> {visibleLeads.length === 1 ? "lead" : "leads"}{leadFilter !== "All" ? ` · ${leadFilter}` : ""} · update status to track the pipeline (demo)</p>
                  <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter leads">{(["All", ...statuses] as const).map(s => <button key={s} aria-pressed={leadFilter === s} onClick={() => setLeadFilter(s)} className={`h-8 border px-3 text-[10px] font-medium uppercase tracking-[.16em] transition ${leadFilter === s ? "border-matte bg-matte text-ivory" : "border-line bg-white text-slate hover:text-matte"}`}>{s}</button>)}</div>
                </div>
                <div className="mt-4 overflow-x-auto border border-line/70 bg-white"><table className="w-full min-w-[640px] text-left text-sm"><thead className="text-slate"><tr><th className="px-4 py-2.5 font-normal">Name</th><th>Phone</th><th>Property</th><th>Status</th></tr></thead><tbody>{visibleLeads.map(l => <tr key={l.id} className="border-t border-line"><td className="px-4 py-3 font-medium">{l.name}</td><td><span className="inline-flex items-center gap-1.5 text-slate"><PhoneCall size={13} />{l.phone} <span className="text-[10px] uppercase tracking-[.12em] text-slate/60">(demo)</span></span></td><td className="max-w-[14rem]"><span className="line-clamp-1">{properties.find(p => p.id === l.propertyId)?.title ?? "—"}</span></td><td><select aria-label={`Status for ${l.name}`} value={l.status} onChange={e => setLeads(ls => ls.map(x => x.id === l.id ? { ...x, status: e.target.value as LeadStatus } : x))} className="border border-line bg-white px-2 py-1.5 text-xs text-charcoal focus:border-beige focus:outline-none">{statuses.map(s => <option key={s}>{s}</option>)}</select></td></tr>)}</tbody>{visibleLeads.length === 0 && <tbody><tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-slate">No leads match this filter.</td></tr></tbody>}</table></div>
              </>
            )}

            {tab === "Follow-ups" && (
              <>
                <p className="text-sm text-slate">Track follow-up tasks for your leads (demo — stored in this view only).</p>
                <form className="mt-4 grid gap-3 border border-line/70 bg-white p-4 sm:grid-cols-[1fr_1.6fr_auto_auto]" onSubmit={e => { e.preventDefault(); if (!newFollow.note.trim()) { toast("Add a follow-up note"); return; } setFollowUps(fs => [{ id: `f${Date.now()}`, leadId: newFollow.leadId, note: newFollow.note.trim(), due: newFollow.due, done: false }, ...fs]); setNewFollow({ ...newFollow, note: "" }); toast("Follow-up added (demo)"); }}>
                  <label className="text-xs text-slate">Lead<select value={newFollow.leadId} onChange={e => setNewFollow({ ...newFollow, leadId: e.target.value })} className="mt-1 w-full border border-line px-3 py-2 text-sm text-charcoal">{leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></label>
                  <label className="text-xs text-slate">Note<input value={newFollow.note} onChange={e => setNewFollow({ ...newFollow, note: e.target.value })} placeholder="e.g. Call back after sharing brochure" className="mt-1 w-full border border-line px-3 py-2 text-sm text-charcoal" /></label>
                  <label className="text-xs text-slate">Due<input type="date" value={newFollow.due} onChange={e => setNewFollow({ ...newFollow, due: e.target.value })} className="mt-1 w-full border border-line px-3 py-2 text-sm text-charcoal" /></label>
                  <button className="self-end bg-matte px-5 py-2.5 text-[11px] font-medium tracking-[.16em] text-ivory hover:bg-charcoal">ADD</button>
                </form>
                <ul className="mt-4 divide-y divide-line border border-line/70 bg-white">
                  {followUps.map(f => {
                    const lead = leads.find(l => l.id === f.leadId);
                    return <li key={f.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-4"><div><p className={`text-sm ${f.done ? "text-slate line-through" : "text-charcoal/90"}`}>{f.note}</p><p className="mt-1 text-xs text-slate">{lead?.name ?? "Lead"} · Due {f.due}</p></div><button onClick={() => { setFollowUps(fs => fs.map(x => x.id === f.id ? { ...x, done: !x.done } : x)); toast(f.done ? "Marked pending (demo)" : "Marked done (demo)"); }} className={`inline-flex h-8 items-center gap-1.5 border px-3 text-[10px] font-medium uppercase tracking-[.16em] transition ${f.done ? "border-matte bg-matte text-ivory" : "border-line text-charcoal hover:border-matte"}`}>{f.done && <Check size={11} />}{f.done ? "Done" : "Mark done"}</button></li>;
                  })}
                </ul>
              </>
            )}

            {tab === "Enquiries" && (
              <>
                <p className="text-sm text-slate">Messages from buyers and tenants — newest first (demo).</p>
                <ul className="mt-4 divide-y divide-line border border-line/70 bg-white">
                  {enquiries.map((i: any) => <li key={i.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-4"><div className="min-w-0 max-w-2xl"><p className="font-medium text-matte">{i.name} <span className="font-normal text-slate">on {properties.find(p => p.id === i.propertyId)?.title}</span></p><p className="mt-1 text-sm text-charcoal/85">{i.message}</p><p className="mt-1.5 text-xs text-slate">{i.email ?? ""}{i.phone ? ` · ${i.phone}` : ""}{i.createdAt ? ` · ${i.createdAt}` : ""}</p></div><button className={`inline-flex h-8 shrink-0 items-center gap-1.5 border px-3 text-[10px] font-medium uppercase tracking-[.16em] transition ${replied.includes(i.id) ? "border-matte bg-matte text-ivory" : "border-line text-charcoal hover:border-matte"}`} onClick={() => { setReplied(r => r.includes(i.id) ? r.filter(x => x !== i.id) : [...r, i.id]); toast(replied.includes(i.id) ? "Marked unreplied (demo)" : "Marked as replied (demo)"); }}>{replied.includes(i.id) && <Check size={11} />}{replied.includes(i.id) ? "Replied" : "Mark replied"}</button></li>)}
                  {enquiries.length === 0 && <li className="p-8 text-center text-sm text-slate">No enquiries yet.</li>}
                </ul>
              </>
            )}

            {tab === "Site visits" && (
              <>
                <p className="text-sm text-slate">Visits customers requested at your listings. Confirm or cancel — one tap (demo).</p>
                <div className="mt-4 overflow-x-auto border border-line/70 bg-white"><table className="w-full min-w-[680px] text-left text-sm"><thead className="text-slate"><tr><th className="px-4 py-2.5 font-normal">Visitor</th><th>Property</th><th>When</th><th>Status</th><th>Action</th></tr></thead><tbody>{visits.map(v => { const p = properties.find(x => x.id === v.propertyId); return <tr key={v.id} className="border-t border-line"><td className="px-4 py-3">{v.name}</td><td className="max-w-[14rem]"><span className="line-clamp-1">{p?.title ?? "—"}</span></td><td className="whitespace-nowrap">{v.date} · {v.time}</td><td><span className={`${v.status === "Pending" ? "text-amber-800" : v.status === "Confirmed" ? "text-emerald-800" : "text-slate"}`}>{v.status}</span></td><td className="whitespace-nowrap space-x-3">{v.status === "Pending" ? <><button onClick={() => confirmVisit(v.id)} className="text-xs font-medium text-emerald-800 underline underline-offset-4">Confirm</button><button onClick={() => cancelVisit(v.id)} className="text-xs font-medium text-red-800 underline underline-offset-4">Cancel</button></> : <span className="text-xs text-slate">—</span>}</td></tr>; })}</tbody></table></div>
              </>
            )}

            {tab === "Assigned properties" && (
              <>
                <p className="text-sm text-slate">Properties assigned to you, with indicative lead interest (sample).</p>
                <div className="mt-4 overflow-x-auto border border-line/70 bg-white"><table className="w-full min-w-[640px] text-left text-sm"><thead className="text-slate"><tr><th className="px-4 py-2.5 font-normal">Property</th><th>Price</th><th>Leads</th><th>Status</th></tr></thead><tbody>{myListings.map(p => <tr key={p.id} className="border-t border-line"><td className="px-4 py-3"><Link href={`/property/${p.id}`} className="font-medium hover:underline">{p.title}</Link><span className="block text-xs text-slate">{p.location}</span></td><td className="tabular-nums">{inr(p.price)}</td><td className="tabular-nums">{leads.filter(l => l.propertyId === p.id).length}</td><td>{p.verified ? <span className="text-xs font-medium text-emerald-800">Verified</span> : <span className="text-xs text-slate">Reviewing</span>}</td></tr>)}</tbody></table></div>
                <Link href="/properties" className="mt-4 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[.18em] text-[#9c7f56] hover:text-matte">Open collection <ArrowRight size={12} /></Link>
              </>
            )}

            {tab === "Performance" && (
              <>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[["Response time", "Same day (sample)"], ["Leads closed", `${leads.filter(l => l.status === "Closed").length} of ${leads.length}`], ["Visits completed", String(visits.filter(v => v.status === "Completed").length)]].map(([k, v]) => <div key={k} className="border border-line/70 bg-white p-5"><p className="text-[10px] uppercase tracking-[.2em] text-slate">{k}</p><p className="mt-1.5 font-serif text-2xl text-matte">{v}</p></div>)}
                </div>
                <div className="mt-6 border border-line/70 bg-white p-5"><p className="text-[11px] uppercase tracking-[.26em] text-[#9c7f56]">Views per listing (sample)</p><div className="mt-3 h-56"><ResponsiveContainer><BarChart data={myListings.slice(0, 8).map(p => ({ n: p.title.split(" ").slice(0, 2).join(" "), views: 18 + ((wishlist.length * 7 + p.title.length * 13) % 46) }))}><XAxis dataKey="n" tick={{ fontSize: 10 }} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="views" name="Views" fill="#111111" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
              </>
            )}

            {tab === "Recent activity" && (
              <div className="border border-line/70 bg-white p-5">
                <p className="text-[11px] uppercase tracking-[.26em] text-[#9c7f56]">Recent activity feed</p>
                <ul className="mt-4 divide-y divide-line/60">
                  {activity.map(a => <li key={a.id} className="flex items-start gap-3 py-3"><span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-ivory text-[#9c7f56]"><Clock3 size={15} /></span><div><p className="text-sm text-charcoal/90">{a.text}</p><p className="mt-1 text-xs text-slate">{a.when} · demo</p></div></li>)}
                  <li className="flex items-start gap-3 py-3"><span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-ivory text-[#9c7f56]"><TrendingUp size={15} /></span><div><p className="text-sm text-charcoal/90">Pipeline conversion at {leads.length ? Math.round(leads.filter(l => l.status === "Closed").length / leads.length * 100) : 0}% this period (sample)</p><p className="mt-1 text-xs text-slate">Performance snapshot · demo</p></div></li>
                </ul>
              </div>
            )}

            {tab === "Profile" && (
              <div className="max-w-xl">
                <div className="border border-line/70 bg-white p-6 shadow-[0_10px_30px_rgba(17,17,17,.04)]">
                  <div className="flex items-center gap-4 border-b border-line/70 pb-5">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-matte font-serif text-lg text-ivory">{initials}</span>
                    <div><p className="font-serif text-2xl text-matte">{displayName}</p><p className="text-sm text-slate">{email}</p><p className="mt-1 text-[11px] uppercase tracking-[.18em] text-[#9c7f56]">Senior advisor · Gachibowli · demo profile</p></div>
                  </div>
                  <form className="mt-5 space-y-4" onSubmit={e => { e.preventDefault(); const fd = new FormData(e.currentTarget); const name = String(fd.get("name") || "").trim(); const phone = String(fd.get("phone") || "").trim(); if (name && account) updateAccount({ name, phone }); toast("Profile saved (browser demo)"); }}>
                    <label className="block text-sm text-slate">Full name<input name="name" key={displayName} defaultValue={displayName} className="mt-1.5 w-full border border-line bg-white px-4 py-2.5 text-charcoal outline-none transition focus:border-beige focus:ring-2 focus:ring-beige/20" /></label>
                    <label className="block text-sm text-slate">Phone<input name="phone" key={account?.phone || "p"} defaultValue={account?.phone || ""} placeholder="Add a contact number (demo)" className="mt-1.5 w-full border border-line bg-white px-4 py-2.5 text-charcoal outline-none transition focus:border-beige focus:ring-2 focus:ring-beige/20" /></label>
                    <label className="block text-sm text-slate">Email<input value={email} readOnly className="mt-1.5 w-full border border-line bg-ivory/50 px-4 py-2.5 text-slate" /></label>
                    <p className="text-xs text-slate">Edits are saved locally in this browser for demonstration only.</p>
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
