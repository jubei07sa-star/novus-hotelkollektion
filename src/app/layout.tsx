import { PrivacyPreferences } from "@/components/PrivacyPreferences";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./hospitality-design.css";

const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: { default: "Hotelkollektion | Willkommen", template: "%s | Hotelverbund" },
  description: "Fünf Häuser im Markgräflerland und Dreiländereck bis zum Südschwarzwald: Zimmer, Restaurant und besondere Anlässe.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  applicationName: "Hotelkollektion",
  openGraph: { locale: "de_DE", type: "website", siteName: "Hotelkollektion" }
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#182d29" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de"><head><link rel="preload" href="/fonts/jost-latin-v20.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head><body>{children}<PrivacyPreferences/></body></html>;
}
