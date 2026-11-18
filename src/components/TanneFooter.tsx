import { LegalFooterLinks } from "./LegalFooterLinks";
import Link from "next/link";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { hotelCollectionUrl, type Hotel } from "@/lib/hotels";
import { tanne } from "@/lib/tanne";
import { Brand } from "./Brand";
export function TanneFooter({hotel}:{hotel:Hotel}){return <footer className="footer"><div className="container footer-main">
  <div className="footer-lead"><Brand hotel={hotel} light/><p>Gastlichkeit im Markgräflerland.<br/>Schöne Zeiten in Fischingen.</p><a href={tanne.website} target="_blank" rel="noopener noreferrer" className="tanne-source-link">Offizielle Hotelwebsite <ArrowUpRight size={13}/></a></div>
  <div><h3>Die Tanne entdecken</h3><a href={hotelCollectionUrl}>Unsere weiteren Hotels</a><Link href="/zimmer">Unsere Zimmer</Link><Link href="/restaurant">Restaurant & Garten</Link><Link href="/speisekarte">Speisekarte</Link><Link href="/fruehstueck-brunch">Frühstück & Brunch</Link><Link href="/galerie">Bildergalerie</Link><Link href="/hochzeiten">Hochzeiten & Feiern</Link></div>
  <div><h3>Wir freuen uns auf Sie</h3><Link href="/buchen">Zimmer & Tisch reservieren</Link><Link href="/kontakt">Kontakt & Anreise</Link><Link href="/faq">Häufige Fragen</Link><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link></div>
  <div className="tanne-footer-contact"><h3>Landhotel Tanne</h3><a href={tanne.directions} target="_blank" rel="noopener noreferrer"><MapPin size={14}/> {tanne.street}<br/>{tanne.city}</a><a href={tanne.tel}><Phone size={14}/> {tanne.phone}</a><a href={`mailto:${tanne.email}`}><Mail size={14}/> {tanne.email}</a></div>
  </div><LegalFooterLinks/><div className="container footer-bottom"><span>© {new Date().getFullYear()} {tanne.name}</span><span>Fischingen · Markgräflerland</span><Link href="/kontakt">Dorfstraße 31 · 79592 Fischingen</Link></div></footer>;}

