"use client";
import Board from "@/components/dashboard/Board";
import CustomerBoard from "@/components/dashboard/CustomerBoard";
import AgentBoard from "@/components/dashboard/AgentBoard";
import { useStore } from "@/lib/store";

/** Role-aware dashboard: buyers see "My Skyline", agents see the advisor board,
 *  and everyone else keeps the existing seller dashboard. */
export default function Dashboard() {
 const { account } = useStore();
 const role = account?.role;
 if (role === "buyer") return <CustomerBoard />;
 if (role === "agent") return <AgentBoard />;
 return <Board role="seller" />;
}
