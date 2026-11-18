import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Expand, Users } from "lucide-react";
import { DemoImage } from "@/components/DemoImage";
import { euro, getHotel, hotelPath, hotels } from "@/lib/hotels";

type Params = { params: Promise<{hotelSlug:string;roomSlug:string}> };
export function generateStaticParams(){return hotels.flatMap(h=>h.rooms.map(r=>({hotelSlug:h.slug,roomSlug:r.slug})));}
export async function generateMetadata({params}:Params):Promise<Metadata>{
 const {hotelSlug,roomSlug}=await params;const h=getHotel(hotelSlug);const room=h?.rooms.find(r=>r.slug===roomSlug);
 if(!h||!room)return {title:"Zimmer nicht gefunden"};
 return {title:`${room.name} – ${h.name}`,description:room.description,alternates:{canonical:hotelPath(h.slug,`zimmer/${room.slug}`)},openGraph:{images:[{url:room.image,alt:room.name}]}};
}
export default async function RoomDetail({params}:Params){
 const {hotelSlug,roomSlug}=await params;const h=getHotel(hotelSlug);const room=h?.rooms.find(r=>r.slug===roomSlug);
 if(["landhotel-tanne","hotel-adler","goldenen-wagen","ochsen-binzen","krone-wiechs"].includes(h?.slug||"")&&["klassik-doppelzimmer","komfort-zimmer","panorama-suite"].includes(roomSlug))redirect("/zimmer");
 if(!h||!room)notFound();
 return <main id="main-content" tabIndex={-1}><div className="container room-detail-top"><Link href="/zimmer" className="text-link"><ArrowLeft size={16}/> Alle Zimmer</Link><span className="eyebrow eyebrow--dark">RUHE & KOMFORT · DEMO</span><h1>{room.name}</h1><p>{room.description}</p></div>
   <div className="container"><div className="room-detail-hero image-wrap"><DemoImage src={room.image} alt={`Beispielhafte Aufnahme des ${room.name}`} priority sizes="100vw"/></div></div>
   <section className="container section-pad room-detail-content"><div><span className="eyebrow eyebrow--dark">IHRE AUSZEIT</span><h2>Ein Raum zum <em>Wohlfühlen.</em></h2><p>{room.description}</p><div className="room-facts"><span><Expand size={16}/> {room.area}</span><span><Users size={16}/> Maximal {room.occupancy} Gäste</span></div><h3 style={{marginTop:35}}>Ausstattung (Beispieldaten)</h3><p>{room.amenities.join(" · ")}</p></div>
    <aside><span className="eyebrow eyebrow--dark">AUFENTHALT PLANEN</span><h3 style={{fontFamily:"Georgia,serif",fontSize:30,marginTop:20}}>Ab {euro(room.priceFrom)} / Nacht</h3><p>Ausschließlich ein Beispielpreis. Kein tatsächliches Zimmerangebot und keine Live-Verfügbarkeit.</p><Link href={hotelPath(h.slug,"buchen")} className="button button-solid">Zimmer suchen <ArrowUpRight size={16}/></Link></aside></section></main>;
}
