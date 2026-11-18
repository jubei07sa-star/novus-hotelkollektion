import { KronePage } from "@/components/KroneSite";
import { HotelPageContext } from "@/components/HotelPageContext";
import { hotelMetadata } from "@/lib/hotel-seo";
import { OchsenPage } from "@/components/OchsenSite";
import { WagenPage } from "@/components/WagenSite";
import { AdlerHome } from "@/components/AdlerSite";
import Link from "next/link";
import { TanneHome } from "@/components/TanneSite";
import type { Metadata } from "next";
import { ArrowDown, ArrowRight, ArrowUpRight, Flower2, Leaf, UtensilsCrossed } from "lucide-react";
import { getHotel, hotelPath, hotels } from "@/lib/hotels";
import { notFound } from "next/navigation";
import { DemoImage } from "@/components/DemoImage";
import { BookingBar } from "@/components/BookingBar";
import { RoomCard } from "@/components/RoomCard";
import { SectionHeading } from "@/components/SectionHeading";

export function generateStaticParams(){return hotels.map(h=>({hotelSlug:h.slug}));}
export async function generateMetadata({params}:{params:Promise<{hotelSlug:string}>}):Promise<Metadata>{return hotelMetadata((await params).hotelSlug,"home");}
export default async function HotelHome({params}:{params:Promise<{hotelSlug:string}>}){
  const {hotelSlug}=await params; const hotel=getHotel(hotelSlug); if(!hotel) notFound();if(hotel.slug==="krone-wiechs")return <><HotelPageContext hotel={hotel} section="home"/><KronePage hotel={hotel}/></>;if(hotel.slug==="ochsen-binzen")return <><HotelPageContext hotel={hotel} section="home"/><OchsenPage section="home" hotel={hotel}/></>;if(hotel.slug==="goldenen-wagen")return <><HotelPageContext hotel={hotel} section="home"/><WagenPage hotel={hotel}/></>;if(hotel.slug==="hotel-adler")return <><HotelPageContext hotel={hotel} section="home"/><AdlerHome/></>; if(hotel.slug==="landhotel-tanne")return <><HotelPageContext hotel={hotel} section="home"/><TanneHome/></>;
  return <main id="main-content" tabIndex={-1}>
    <section className="hero hotel-hero"><div className="hero-media image-wrap"><DemoImage src={hotel.heroImage} alt={`Atmosphärisches Demo-Hotelbild für ${hotel.name}`} priority sizes="100vw"/></div><div className="hero-overlay"/><div className="container hero-content"><span className="eyebrow eyebrow--light"><span className="eyebrow-rule"/>{hotel.eyebrow}</span><h1>{hotel.tagline}</h1><p>{hotel.subtitle}</p><div className="hero-buttons"><Link href={hotelPath(hotel.slug,"zimmer")} className="button button-cream">Zimmer entdecken <ArrowUpRight size={18}/></Link><Link href={hotelPath(hotel.slug,"restaurant")} className="hero-link">Restaurant erleben <ArrowRight size={18}/></Link></div></div><div className="hero-sidecopy">EIN BESONDERER ORT <span>—</span> DEUTSCHLAND</div><a href="#willkommen" className="scroll-indicator" aria-label="Zum Inhalt scrollen"><ArrowDown size={17}/></a></section>
    <div className="container bookingbar-holder"><BookingBar slug={hotel.slug}/></div>
    <section id="willkommen" className="intro-section section-pad"><div className="container intro-grid"><div className="intro-aside"><span className="eyebrow eyebrow--dark">HERZLICH WILLKOMMEN</span><span className="line-ornament"/></div><div><h2>Ein bisschen mehr <em>Zeit für das Wesentliche.</em></h2><p>{hotel.description}</p><span className="feature-line">{hotel.featureLine}</span></div><div className="intro-decoration"><Flower2 size={102} strokeWidth={0.6}/></div></div></section>
    <section className="section-pad rooms-section"><div className="container"><SectionHeading eyebrow="BLEIBEN & WOHLFÜHLEN" title="Zimmer mit Charakter." description="Ein guter Tag beginnt mit einer erholsamen Nacht. Finden Sie Ihren persönlichen Lieblingsplatz." href={hotelPath(hotel.slug,"zimmer")} action="Alle Zimmer ansehen"/><div className="room-grid">{hotel.rooms.map(room=><RoomCard hotel={hotel} room={room} key={room.slug}/>)}</div></div></section>
    <section className="editorial-section"><div className="editorial-image image-wrap"><DemoImage src={hotel.restaurantImage} alt={`Atmosphärisches Restaurantbild – ${hotel.restaurantName}`} sizes="(max-width: 900px) 100vw, 50vw"/></div><div className="editorial-text"><div className="editorial-inner"><UtensilsCrossed size={25} strokeWidth={1.2}/><span className="eyebrow eyebrow--dark">KULINARIK FÜR ALLE</span><h2>Genuss, der <em>in Erinnerung bleibt.</em></h2><p>{hotel.restaurantCopy}</p><div className="editorial-actions"><Link href={hotelPath(hotel.slug,"restaurant")} className="button button-dark">Restaurant entdecken <ArrowUpRight size={17}/></Link><Link href={hotelPath(hotel.slug,"speisekarte")} className="text-link">Zur Speisekarte <ArrowRight size={16}/></Link></div></div></div></section>
    <section className="experience-strip"><div className="container experience-inner"><div><Leaf size={24}/><h3>Persönlich</h3><p>Gastlichkeit mit besonderem Gespür.</p></div><div><UtensilsCrossed size={24}/><h3>Genussvoll</h3><p>Gute Zeit beginnt am gemeinsamen Tisch.</p></div><div><Flower2 size={24}/><h3>Unvergesslich</h3><p>Ein Rahmen für besondere Anlässe.</p></div></div></section>
    <section className="wedding-preview section-pad"><div className="container wedding-preview-grid"><div className="wedding-preview-copy"><span className="eyebrow eyebrow--dark">FESTE, DIE BLEIBEN</span><h2>Für die Momente, <em>die alles bedeuten.</em></h2><p>{hotel.weddingCopy}</p><Link className="button button-outline" href={hotelPath(hotel.slug,"hochzeiten")}>Hochzeiten & Feiern <ArrowUpRight size={18}/></Link></div><div className="wedding-image image-wrap"><DemoImage src={hotel.weddingImage} alt="Romantische Hochzeitsfeier – illustratives Beispielbild" sizes="(max-width: 900px) 100vw, 55vw"/></div></div></section>
    <section className="closing-cta"><div className="container"><span className="eyebrow eyebrow--light">WIR FREUEN UNS AUF SIE</span><h2>Manche Orte bleiben <em>im Herzen.</em></h2><p>Entdecken Sie Ihren nächsten besonderen Aufenthalt.</p><Link href={hotelPath(hotel.slug,"buchen")} className="button button-cream">Aufenthalt planen <ArrowUpRight size={17}/></Link></div></section>
  </main>;
}
