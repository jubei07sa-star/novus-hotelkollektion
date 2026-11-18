"use client";
import { WhatsAppButton } from "./WhatsAppButton";
import { HotelEvents } from "./HotelEvents";
import { HotelActionDock } from "./ReservationBar";
import { usePathname } from "next/navigation";
import { publicPagePath } from "@/lib/hotel-events";
import { wagen } from "@/lib/wagen";
import { adler } from "@/lib/adler";


import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Menu, X } from "lucide-react";
import type { Hotel } from "@/lib/hotels";
import { hotelPath, hotelCollectionUrl } from "@/lib/hotels";
import { Brand } from "./Brand";
import { tanne } from "@/lib/tanne";

export function HotelHeader({ hotel }: { hotel: Hotel }) {
  const [open, setOpen] = useState(false);
  const [scrolled,setScrolled]=useState(false);
  const isHome=publicPagePath(usePathname())==="/";
  useEffect(()=>{const update=()=>setScrolled(window.scrollY>48);update();window.addEventListener("scroll",update,{passive:true});return()=>window.removeEventListener("scroll",update);},[]);
  const menuButton = useRef<HTMLButtonElement>(null);
  const links = [
    [hotel.slug==="landhotel-tanne"?"Zimmer":"Zimmer & Suiten", "zimmer"],
    ["Restaurant", "restaurant"],
    ...(hotel.slug==="krone-wiechs"?[["Wellness", "wellness"] as const]:[]),
    ["Speisekarte", "speisekarte"],
    [["goldenen-wagen","ochsen-binzen","krone-wiechs"].includes(hotel.slug)?"Feiern & Anlässe":"Hochzeiten & Feiern", "hochzeiten"],
    ...(["landhotel-tanne","hotel-adler","goldenen-wagen","ochsen-binzen","krone-wiechs"].includes(hotel.slug)?[["Galerie","galerie"] as const]:[])
  ] as const;
  return <><HotelEvents slug={hotel.slug} name={hotel.name}/><a className="skip-link" href="#main-content">Zum Inhalt springen</a>
    <div className={`utilitybar${isHome?" utilitybar--home":""}`}><div className="container utilitybar-inner"><span>{hotel.slug==="landhotel-tanne"?<a href={tanne.tel}>Fischingen · {tanne.phone}</a>:hotel.slug==="hotel-adler"?<a href={adler.tel}>Weil am Rhein · {adler.phone}</a>:hotel.slug==="goldenen-wagen"?<a href={wagen.tel}>Maulburg · {wagen.phone}</a>:hotel.slug==="krone-wiechs"?"Schopfheim-Wiechs · Ein neues Kapitel":hotel.slug==="ochsen-binzen"?"Binzen · Ein neues Kapitel":"Gastfreundschaft neu entdecken"}</span><div className="utilitybar-links"><a href={hotelCollectionUrl}>Unsere weiteren Hotels <ArrowUpRight size={13}/></a><Link href="/kontakt">Kontakt <ArrowUpRight size={13}/></Link></div></div></div>
    <header className={`site-header${hotel.slug==="krone-wiechs"?" site-header--krone":""}${isHome?" site-header--home":""}${isHome&&!scrolled&&!open?" site-header--overlay":""}`} onKeyDown={e=>{if(e.key==="Escape"&&open){setOpen(false);menuButton.current?.focus();}}}><div className="container header-inner"><Brand hotel={hotel}/>
      <nav className="desktop-nav" aria-label="Hauptnavigation">{links.map(([label, section])=><Link key={section} href={hotelPath(hotel.slug,section)}>{label}</Link>)}</nav>
      <div className="header-actions"><Link className="button button-solid header-book" href={hotelPath(hotel.slug,"buchen")}><CalendarDays size={16}/> {["ochsen-binzen","krone-wiechs"].includes(hotel.slug)?"Besuch planen":hotel.slug==="goldenen-wagen"?"Zimmer anfragen":"Zimmer buchen"}</Link>
        <button ref={menuButton} className="mobile-menu-toggle" aria-label={open?"Menü schließen":"Menü öffnen"} aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setOpen(!open)}>{open?<X size={24}/>:<Menu size={24}/>}</button></div>
    </div><nav id="mobile-navigation" className={`mobile-nav ${open?"mobile-nav--open":""}`} aria-label="Mobilnavigation">
      {links.map(([label,section])=><Link key={section} href={hotelPath(hotel.slug,section)} onClick={()=>setOpen(false)}>{label}<ArrowUpRight size={16}/></Link>)}
      {hotel.slug==="landhotel-tanne"&&<><Link href="/fruehstueck-brunch" onClick={()=>setOpen(false)}>Frühstück & Brunch <ArrowUpRight size={16}/></Link><Link href="/faq" onClick={()=>setOpen(false)}>Häufige Fragen <ArrowUpRight size={16}/></Link></>}
      {hotel.slug==="krone-wiechs"&&<Link href="/seminare" onClick={()=>setOpen(false)}>Seminare & Tagungen <ArrowUpRight size={16}/></Link>}
      <Link href="/buchen" onClick={()=>setOpen(false)}>{["ochsen-binzen","krone-wiechs"].includes(hotel.slug)?"Besuch planen":hotel.slug==="goldenen-wagen"?"Zimmer anfragen":"Zimmer buchen"} <CalendarDays size={16}/></Link>
      <Link href="/kontakt" onClick={()=>setOpen(false)}>Kontakt <ArrowUpRight size={16}/></Link>
      <a href={hotelCollectionUrl} onClick={()=>setOpen(false)}>Unsere weiteren Hotels <ArrowUpRight size={16}/></a>
    </nav></header><WhatsAppButton hotel={hotel}/><HotelActionDock hotelSlug={hotel.slug}/>
  </>;
}


