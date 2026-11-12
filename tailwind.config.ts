import type { Config } from "tailwindcss";
export default { content:["./src/**/*.{ts,tsx}"], theme:{extend:{colors:{matte:"#111111",beige:"#D8C3A5",gold:"#C9A66B",ivory:"#F8F5F0",charcoal:"#222222",slate:"#6B7280",line:"#E5E7EB"},
fontFamily:{serif:["var(--font-playfair)","serif"],sans:["var(--font-poppins)","sans-serif"]}}},plugins:[]} satisfies Config;
