import { KroneFooter } from "./KroneSite";
import { OchsenFooter } from "./OchsenSite";
import { WagenFooter } from "./WagenSite";
import { AdlerFooter } from "./AdlerSite";
import Link from "next/link";
import { Instagram, Mail, MapPin } from "lucide-react";
import type { Hotel } from "@/lib/hotels";
import { hotelPath, hotelCollectionUrl } from "@/lib/hotels";
import { Brand } from "./Brand";
import { TanneFooter } from "./TanneFooter";

export function HotelFooter({ hotel }: { hotel: Hotel }) {
  if(hotel.slug==="krone-wiechs")return <KroneFooter hotel={hotel}/>;
  if(hotel.slug==="ochsen-binzen")return <OchsenFooter hotel={hotel}/>;
  if(hotel.slug==="goldenen-wagen")return <WagenFooter hotel={hotel}/>;
  if(hotel.slug==="hotel-adler")return <AdlerFooter hotel={hotel}/>;
  if(hotel.slug==="landhotel-tanne")return <TanneFooter hotel={hotel}/>;
  return <footer className="footer"><div className="container footer-main">
    <div className="footer-lead"><Brand hotel={hotel} light/><p>Gute Erinnerungen beginnen mit einem besonderen Ort.</p><span className="footer-social"><Instagram size={19}/><Mail size={19}/></span></div>
    <div><h3>Entdecken</h3><a href={hotelCollectionUrl}>Unsere weiteren Hotels</a><Link href={hotelPath(hotel.slug,"zimmer")}>Zimmer & Suiten</Link><Link href={hotelPath(hotel.slug,"restaurant")}>Restaurant</Link><Link href={hotelPath(hotel.slug,"speisekarte")}>Speisekarte</Link><Link href={hotelPath(hotel.slug,"hochzeiten")}>Hochzeiten & Feiern</Link></div>
    <div><h3>Planen</h3><Link href={hotelPath(hotel.slug,"buchen")}>Zimmer suchen</Link><Link href={hotelPath(hotel.slug,"kontakt")}>Kontakt & Anfrage</Link><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link></div>
    <div><h3>{hotel.restaurantName}</h3><Link href="/restaurant">Restaurant für Tagesgäste</Link><Link href="/speisekarte">Aktuelle Speisekarte</Link><Link href="/hochzeiten">Hochzeitsanfrage</Link></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} {hotel.name}</span><span><MapPin size={13}/> Standortdaten als Platzhalter</span><span><Link href="/impressum">Impressum</Link> · <Link href="/datenschutz">Datenschutz</Link></span></div>
  </footer>;
}

