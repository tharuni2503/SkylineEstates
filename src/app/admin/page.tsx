"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Shield, Plus, Pencil, Trash2, ExternalLink, Star, BadgeCheck, LogOut } from "lucide-react";
import Panel from "@/components/admin/Panel";
import { useStore, type Account } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { downloadCsv } from "@/lib/csv";
import { inr } from "@/lib/format";
import type { Category, Listing, Property } from "@/types";

type View = "Website listings" | "Users" | "Agents" | "Builders" | "Leads" | "Reports" | "Analytics" | "Settings";

const categories: Category[] = ["Apartment", "Villa", "Independent House", "Residential Plot", "Commercial"];
const listings: Listing[] = ["Buy", "Rent"];
const chart = [{ m: "Jun", leads: 42 }, { m: "Jul", leads: 58 }, { m: "Aug", leads: 51 }, { m: "Sep", leads: 77 }, { m: "Oct", leads: 93 }];

type Draft = {
  title: string; location: string; address: string; price: string; listing: Listing; category: Category;
  bhk: string; bathrooms: string; areaSqft: string; image: string; description: string;
  furnishing: string; parking: string; contactPhone: string; agentId: string; amenities: string;
  featured: boolean; verified: boolean;
};

const emptyDraft = (): Draft => ({
  title: "", location: "", address: "", price: "", listing: "Buy", category: "Apartment",
  bhk: "3", bathrooms: "2", areaSqft: "", image: "", description: "",
  furnishing: "Unfurnished", parking: "1", contactPhone: "", agentId: "a1", amenities: "",
  featured: false, verified: false,
});

const draftFrom = (p: Property): Draft => ({
  title: p.title, location: p.location, address: p.address || "", price: String(p.price), listing: p.listing, category: p.category,
  bhk: String(p.bhk), bathrooms: String(p.bathrooms ?? 0), areaSqft: String(p.areaSqft), image: p.image, description: p.description || "",
  furnishing: p.furnishing || "Unfurnished", parking: p.parking || "1", contactPhone: p.contactPhone || "", agentId: p.agentId || "a1",
  amenities: (p.amenities || []).join(", "), featured: p.featured, verified: p.verified,
});

function toPayload(d: Draft): Omit<Property, "id" | "postedAt"> {
  const n = (v: string, fallback = 0) => { const x = Number(v); return Number.isFinite(x) ? x : fallback; };
  return {
    title: d.title.trim(), location: d.location.trim(), address: d.address.trim() || undefined, price: n(d.price),
    listing: d.listing, category: d.category, bhk: n(d.bhk), bathrooms: n(d.bathrooms),
    areaSqft: n(d.areaSqft), image: d.image.trim(), description: d.description.trim() || undefined,
    furnishing: d.furnishing.trim() || undefined, parking: d.parking.trim() || undefined, contactPhone: d.contactPhone.trim() || undefined,
    agentId: d.agentId.trim() || "a1", amenities: d.amenities.split(",").map((s) => s.trim()).filter(Boolean),
    featured: d.featured, verified: d.verified,
  };
}

function AdminGate({ onDemo }: { onDemo: () => void }) {
  const router = useRouter();
  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[#f6f2eb] px-5 py-16">
      <div className="mx-auto max-w-lg border border-line/70 bg-white p-8 shadow-[0_20px_60px_rgba(17,17,17,.08)]">
        <div className="flex items-center gap-3"><Shield className="text-[#9c7f56]" /><p className="text-[11px] tracking-[.32em] text-slate">ADMIN ACCESS</p></div>
        <h1 className="mt-4 font-serif text-4xl text-matte">Manage Skyline Estates</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate">Sign in with an admin account to add, edit, feature, verify, or remove listings. Changes save locally and update the website views (properties, projects, locations, details).</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button type="button" onClick={onDemo} className="bg-matte px-6 py-3 text-[11px] font-medium tracking-[.18em] text-ivory transition hover:bg-charcoal">USE DEMO ADMIN ACCOUNT</button>
          <button type="button" onClick={() => router.push("/login")} className="border border-line px-6 py-3 text-[11px] font-medium tracking-[.18em] text-matte transition hover:border-beige">GO TO SIGN IN</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm text-slate"><span className="mb-1.5 block text-[11px] font-medium tracking-[.12em]">{label.toUpperCase()}</span>{children}</label>;
}
const inputCls = "w-full border border-line bg-white px-3.5 py-2.5 text-sm text-charcoal outline-none transition focus:border-beige focus:ring-2 focus:ring-beige/20";

function ListingForm({ draft, setDraft, onSubmit, onCancel, submitLabel }: { draft: Draft; setDraft: (d: Draft) => void; onSubmit: () => void; onCancel: () => void; submitLabel: string }) {
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft({ ...draft, [k]: v });
  return (
    <form className="border border-line/70 bg-[#fdfaf8] p-5" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title"><input className={inputCls} value={draft.title} onChange={(e) => set("title", e.target.value)} required /></Field>
        <Field label="Location (area, city)"><input className={inputCls} value={draft.location} onChange={(e) => set("location", e.target.value)} placeholder="Gachibowli, Hyderabad" required /></Field>
        <Field label="Address"><input className={inputCls} value={draft.address} onChange={(e) => set("address", e.target.value)} /></Field>
        <Field label="Image URL"><input className={inputCls} value={draft.image} onChange={(e) => set("image", e.target.value)} placeholder="https://..." required /></Field>
        <Field label="Price (₹, number)"><input className={inputCls} type="number" min={0} value={draft.price} onChange={(e) => set("price", e.target.value)} required /></Field>
        <Field label="Area (sq ft)"><input className={inputCls} type="number" min={0} value={draft.areaSqft} onChange={(e) => set("areaSqft", e.target.value)} required /></Field>
        <Field label="Listing"><select className={inputCls} value={draft.listing} onChange={(e) => set("listing", e.target.value as Listing)}>{listings.map((l) => <option key={l} value={l}>{l}</option>)}</select></Field>
        <Field label="Category"><select className={inputCls} value={draft.category} onChange={(e) => set("category", e.target.value as Category)}>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select></Field>
        <Field label="BHK"><input className={inputCls} type="number" min={0} value={draft.bhk} onChange={(e) => set("bhk", e.target.value)} /></Field>
        <Field label="Bathrooms"><input className={inputCls} type="number" min={0} value={draft.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} /></Field>
        <Field label="Furnishing"><input className={inputCls} value={draft.furnishing} onChange={(e) => set("furnishing", e.target.value)} /></Field>
        <Field label="Parking"><input className={inputCls} value={draft.parking} onChange={(e) => set("parking", e.target.value)} /></Field>
        <Field label="Contact phone"><input className={inputCls} value={draft.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} /></Field>
        <Field label="Agent ID"><input className={inputCls} value={draft.agentId} onChange={(e) => set("agentId", e.target.value)} /></Field>
        <div className="md:col-span-2"><Field label="Amenities (comma separated)"><input className={inputCls} value={draft.amenities} onChange={(e) => set("amenities", e.target.value)} placeholder="Clubhouse, Swimming Pool, Security" /></Field></div>
        <div className="md:col-span-2"><Field label="Description"><textarea className={inputCls} rows={3} value={draft.description} onChange={(e) => set("description", e.target.value)} /></Field></div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-5 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={draft.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured (shows on Projects)</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={draft.verified} onChange={(e) => set("verified", e.target.checked)} /> Verified</label>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button className="bg-matte px-6 py-2.5 text-[11px] font-medium tracking-[.18em] text-ivory transition hover:bg-charcoal">{submitLabel}</button>
        <button type="button" onClick={onCancel} className="border border-line px-6 py-2.5 text-[11px] font-medium tracking-[.18em] text-matte transition hover:border-beige">CANCEL</button>
      </div>
    </form>
  );
}

export default function Admin() {
  const router = useRouter();
  const toast = useToast();
  const { properties, ready, account, add, update, remove, setAccount, signOut } = useStore();
  const [view, setView] = useState<View>("Website listings");
  const [q, setQ] = useState("");
  const [del, setDel] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft());

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return properties;
    return properties.filter((p) => `${p.title} ${p.location} ${p.category} ${p.listing}`.toLowerCase().includes(s));
  }, [properties, q]);

  const demoAdmin = () => {
    const a: Account = { name: "Site Admin", email: "admin@skylineestates.in", role: "admin" };
    setAccount(a);
    toast("Signed in as admin (demo). You can now update the website.");
  };

  if (!ready) return <div className="min-h-screen bg-ivory p-8"><div className="mx-auto max-w-6xl animate-pulse space-y-4"><div className="h-10 w-64 bg-line/60" /><div className="h-64 bg-line/40" /></div></div>;
  if (account?.role !== "admin") return <AdminGate onDemo={demoAdmin} />;

  const startNew = () => { setDraft(emptyDraft()); setEditing("new"); };
  const startEdit = (p: Property) => { setDraft(draftFrom(p)); setEditing(p.id); };
  const save = () => {
    if (!draft.title.trim() || !draft.location.trim() || !draft.image.trim() || !draft.price) { toast("Title, location, image, and price are required."); return; }
    const payload = toPayload(draft);
    if (editing === "new") { add(payload); toast("Listing added — the website is updated."); }
    else if (editing) { update(editing, payload); toast("Listing updated — the website is updated."); }
    setEditing(null);
  };

  return (
    <div className="min-h-screen bg-white md:grid md:grid-cols-[230px_1fr]">
      <nav aria-label="Admin" className="bg-charcoal p-5 text-sm text-ivory/80 md:min-h-screen">
        <p className="font-serif text-lg text-ivory">Admin</p>
        <p className="mt-1 text-[11px] text-ivory/55">{account.name}</p>
        <ul className="mt-5 flex gap-4 overflow-x-auto md:block md:space-y-2.5">
          {(["Website listings", "Users", "Agents", "Builders", "Leads", "Reports", "Analytics", "Settings"] as View[]).map((v) => (
            <li key={v}><button onClick={() => setView(v)} aria-current={view === v} className={`whitespace-nowrap transition ${view === v ? "text-beige" : "hover:text-ivory"}`}>{v}</button></li>
          ))}
        </ul>
        <button type="button" onClick={() => { signOut(); router.push("/login"); }} className="mt-8 inline-flex items-center gap-2 text-[11px] tracking-[.14em] text-ivory/55 transition hover:text-ivory"><LogOut size={14} />SIGN OUT</button>
      </nav>

      <section className="p-6 md:p-8">
        {view !== "Website listings" ? <Panel name={view} /> : (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl text-matte">Website listings</h1>
                <p className="mt-1 max-w-2xl text-sm text-slate">Add, edit, feature, verify, or remove properties. Changes save to this browser and update the website (Properties, Projects, Locations, and detail pages).</p>
              </div>
              <button type="button" onClick={startNew} className="inline-flex items-center gap-2 bg-matte px-5 py-2.5 text-[11px] font-medium tracking-[.16em] text-ivory transition hover:bg-charcoal"><Plus size={15} /> ADD LISTING</button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-4">
              {[ ["Total", properties.length], ["Featured", properties.filter((p) => p.featured).length], ["Verified", properties.filter((p) => p.verified).length], ["Buy / Rent", `${properties.filter((p) => p.listing === "Buy").length} / ${properties.filter((p) => p.listing === "Rent").length}`] ].map(([k, v]) => (
                <div key={String(k)} className="border border-line/70 p-4"><p className="text-xs uppercase tracking-[.14em] text-slate">{k}</p><p className="mt-1 font-serif text-3xl text-matte">{v}</p></div>
              ))}
            </div>

            <div className="mt-6 border border-line/50 bg-white p-3"><p className="mb-2 text-[11px] uppercase tracking-[.14em] text-slate">Leads overview (demo)</p><div className="h-40"><ResponsiveContainer width="100%" height="100%"><BarChart data={chart}><XAxis dataKey="m" /><YAxis /><Tooltip /><Bar dataKey="leads" fill="#D8C3A5" /></BarChart></ResponsiveContainer></div></div>

            {editing && (
              <div className="mt-8">
                <h2 className="mb-3 font-serif text-2xl text-matte">{editing === "new" ? "Add a listing" : "Edit listing"}</h2>
                <ListingForm draft={draft} setDraft={setDraft} onSubmit={save} onCancel={() => setEditing(null)} submitLabel={editing === "new" ? "ADD TO WEBSITE" : "SAVE CHANGES"} />
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <input aria-label="Search listings" placeholder="Search title, location, category…" value={q} onChange={(e) => setQ(e.target.value)} className="w-full max-w-sm border border-line px-4 py-2.5 text-sm outline-none focus:border-beige" />
              <button className="text-sm underline decoration-beige/50 underline-offset-4" onClick={() => downloadCsv("website-listings.csv", [["Title", "Location", "Category", "Listing", "Price", "Featured", "Verified", "ID"], ...rows.map((p) => [p.title, p.location, p.category, p.listing, String(p.price), p.featured ? "Yes" : "No", p.verified ? "Yes" : "No", p.id])])}>Download CSV</button>
            </div>

            <div className="mt-4 overflow-x-auto border border-line/70">
              <table className="w-full min-w-[920px] text-left text-sm">
                <thead className="bg-ivory/60 text-slate"><tr><th className="px-4 py-3 font-medium">Property</th><th className="px-3 py-3 font-medium">Type</th><th className="px-3 py-3 font-medium">Price</th><th className="px-3 py-3 font-medium">Status</th><th className="px-3 py-3 font-medium">Website actions</th></tr></thead>
                <tbody>
                  {rows.map((p) => (
                    <tr key={p.id} className="border-t border-line/70 align-top">
                      <td className="px-4 py-3">
                        <p className="font-medium text-matte">{p.title}</p>
                        <p className="mt-0.5 text-xs text-slate">{p.location}</p>
                        <p className="mt-0.5 text-[11px] text-slate/80">ID: {p.id}</p>
                      </td>
                      <td className="px-3 py-3 text-slate">{p.listing} · {p.category}{p.bhk ? ` · ${p.bhk} BHK` : ""}</td>
                      <td className="px-3 py-3">{inr(p.price)}{p.listing === "Rent" ? <span className="text-slate">/mo</span> : null}</td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => { update(p.id, { featured: !p.featured }); toast(p.featured ? "Removed from featured (Projects updated)." : "Marked featured (Projects updated)."); }} className={`inline-flex items-center gap-1 border px-2 py-1 text-[11px] transition ${p.featured ? "border-amber-300 bg-amber-50 text-amber-900" : "border-line text-slate hover:border-beige"}`}><Star size={12} /> {p.featured ? "Featured" : "Feature"}</button>
                          <button type="button" onClick={() => { update(p.id, { verified: !p.verified }); toast(p.verified ? "Verification removed." : "Marked verified."); }} className={`inline-flex items-center gap-1 border px-2 py-1 text-[11px] transition ${p.verified ? "border-emerald-300 bg-emerald-50 text-emerald-900" : "border-line text-slate hover:border-beige"}`}><BadgeCheck size={12} /> {p.verified ? "Verified" : "Verify"}</button>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-3">
                          <button type="button" onClick={() => startEdit(p)} className="inline-flex items-center gap-1 underline decoration-line underline-offset-4 hover:decoration-beige"><Pencil size={13} /> Edit</button>
                          <Link href={`/property/${p.id}`} className="inline-flex items-center gap-1 underline decoration-line underline-offset-4 hover:decoration-beige"><ExternalLink size={13} /> View</Link>
                          <button type="button" onClick={() => setDel(p.id)} className="inline-flex items-center gap-1 text-red-800 underline decoration-red-200 underline-offset-4 hover:decoration-red-500"><Trash2 size={13} /> Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-slate">No listings match your search.</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {del && (
        <div role="dialog" aria-modal="true" aria-label="Delete listing" className="fixed inset-0 z-50 flex items-center justify-center bg-matte/60 p-4">
          <div className="w-full max-w-md border border-line bg-white p-6 shadow-[0_24px_70px_rgba(17,17,17,.22)]">
            <p className="font-serif text-2xl text-matte">Delete this listing?</p>
            <p className="mt-2 text-sm text-slate">It will be removed from saved website data and disappear from Properties/Projects/Locations views on this browser.</p>
            <div className="mt-6 flex gap-3">
              <button className="bg-red-800 px-5 py-2.5 text-[11px] font-medium tracking-[.16em] text-white transition hover:bg-red-900" onClick={() => { remove(del); setDel(null); toast("Listing deleted — website updated."); }}>DELETE</button>
              <button className="border border-line px-5 py-2.5 text-[11px] font-medium tracking-[.16em] text-matte" onClick={() => setDel(null)}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
