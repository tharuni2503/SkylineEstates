import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { ToastProvider } from "@/lib/toast";
import { StoreProvider } from "@/lib/store";
import Intro from "@/components/home/Intro";
import Footer from "@/components/layout/Footer";
import SiteScrollEffects from "@/components/common/SiteScrollEffects";
const playfair=Playfair_Display({subsets:["latin"],variable:"--font-playfair"});
const poppins=Poppins({subsets:["latin"],weight:["300","400","500","600"],variable:"--font-poppins"});
export const metadata:Metadata={title:"Skyline Estates — Find Your Perfect Space",description:"Premium properties across Hyderabad."};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en" className={`${playfair.variable} ${poppins.variable}`}><body><a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:bg-beige focus:px-4 focus:py-2 focus:text-matte">Skip to content</a><ToastProvider><StoreProvider><Intro/><Navbar/><main id="main">{children}</main><Footer/><SiteScrollEffects/></StoreProvider></ToastProvider></body></html>;}
