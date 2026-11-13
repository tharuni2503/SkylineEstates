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
export const metadata:Metadata={
  metadataBase: new URL("https://skylineestates.vercel.app"),
  title: { default: "Skyline Estates — Find Your Perfect Space", template: "%s | Skyline Estates" },
  description: "A premium, cinematic real-estate experience across Hyderabad — explore curated residences, compare options, and plan visits with clarity. Demonstration frontend.",
  applicationName: "Skyline Estates",
  openGraph: {
    title: "Skyline Estates — Find Your Perfect Space",
    description: "A premium, cinematic real-estate experience across Hyderabad. Demonstration frontend with curated sample listings.",
    url: "https://skylineestates.vercel.app",
    siteName: "Skyline Estates",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skyline Estates — Find Your Perfect Space",
    description: "Premium real-estate discovery across Hyderabad. Demonstration frontend.",
  },
  robots: { index: true, follow: true },
};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en" className={`${playfair.variable} ${poppins.variable}`}><body><a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:bg-beige focus:px-4 focus:py-2 focus:text-matte">Skip to content</a><ToastProvider><StoreProvider><Intro/><Navbar/><main id="main">{children}</main><Footer/><SiteScrollEffects/></StoreProvider></ToastProvider></body></html>;}
