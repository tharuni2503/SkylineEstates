// Demo agent directory — replace with a real advisor roster when the backend exists.
export type Agent = { id: string; name: string; role: string; area: string; phone: string; email: string; rating: number; reviews: number; deals: number; years: number };

export const agents: Agent[] = [
 { id: "a1", name: "Lakshmi Prasad", role: "Senior advisor", area: "Gachibowli", phone: "+91 98765 00001", email: "lakshmi@skylineestates.in", rating: 4.9, reviews: 86, deals: 142, years: 9 },
 { id: "a2", name: "Imran Siddiqui", role: "Advisor", area: "Narsingi", phone: "+91 98765 00002", email: "imran@skylineestates.in", rating: 4.8, reviews: 64, deals: 118, years: 7 },
 { id: "a3", name: "Meghana Rao", role: "Investment desk", area: "Tellapur", phone: "+91 98765 00003", email: "meghana@skylineestates.in", rating: 4.8, reviews: 51, deals: 96, years: 11 },
 { id: "a4", name: "Check with Skyline", role: "Client desk", area: "Financial District", phone: "+91 40 0000 0000", email: "hello@skylineestates.in", rating: 4.7, reviews: 40, deals: 80, years: 6 },
];

export const fallbackAgent: Agent = agents[0];
