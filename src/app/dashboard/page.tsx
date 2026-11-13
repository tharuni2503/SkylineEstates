"use client";
import Board from "@/components/dashboard/Board";
import CustomerBoard from "@/components/dashboard/CustomerBoard";
import AgentBoard from "@/components/dashboard/AgentBoard";
import { useStore } from "@/lib/store";

/** Role-aware dashboard: buyers see "My Skyline", agents see the advisor board,
 *  and everyone else keeps the existing seller dashboard.
 *  Waits for client hydration so a restored buyer/agent account never flashes the seller view. */
export default function Dashboard() {
 const { account, hydrated } = useStore();
 if (!hydrated) {
  return (
   <div className="bg-ivory/30">
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-5 md:py-14" aria-busy="true" aria-live="polite">
     <div className="h-3 w-28 animate-pulse rounded bg-line/60" />
     <div className="mt-4 h-10 w-64 animate-pulse rounded bg-line/60" />
     <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 animate-pulse border border-line/60 bg-white" />)}
     </div>
     <p className="mt-6 text-sm text-slate">Loading your dashboard…</p>
    </div>
   </div>
  );
 }
 const role = account?.role;
 if (role === "buyer") return <CustomerBoard />;
 if (role === "agent") return <AgentBoard />;
 return <Board role="seller" />;
}
