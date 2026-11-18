import { KronePage } from "@/components/KroneSite";
import { hotelMetadata } from "@/lib/hotel-seo";
import { OchsenPage } from "@/components/OchsenSite";
import { WagenPage } from "@/components/WagenSite";
import { AdlerRooms } from "@/components/AdlerSite";
import type { Metadata } from "next";
import { TanneRooms } from "@/components/TanneSite";
import { notFound } from "next/navigation";
import { getHotel, hotelPath } from "@/lib/hotels";
import { RoomCard } from "@/components/RoomCard";
import { DemoImage } from "@/components/DemoImage";

type P = {params:Promise<{hotelSlug:string}>};
export async function generateMetadata({params}:{params:Promise<{hotelSlug:string}>}):Promise<Metadata>{return hotelMetadata((await params).hotelSlug,"zimmer");}
export default async function Rooms({params}:P){const h=getHotel((await params).hotelSlug); if(!h)notFound();if(h?.slug==="krone-wiechs")return <KronePage section="zimmer" hotel={h}/>;if(h.slug==="ochsen-binzen")return <OchsenPage section="zimmer" hotel={h}/>;if(h.slug==="goldenen-wagen")return <WagenPage section="zimmer" hotel={h}/>;if(h.slug==="hotel-adler")return <AdlerRooms/>;if(h.slug==="landhotel-tanne")return <TanneRooms/>;return <main id="main-content" tabIndex={-1}><section className="subhero"><div className="subhero-photo image-wrap"><DemoImage src={h.roomImage} alt="Hotelzimmer – beispielhafte Hotelfotografie" priority sizes="100vw"/></div><div className="subhero-shade"/><div className="container subhero-content"><span className="eyebrow eyebrow--light">ANKOMMEN & BLEIBEN</span><h1>Zimmer & Suiten</h1><p>Räume für Ihre ganz persönliche Auszeit.</p></div></section><section className="section-pad"><div className="container"><div className="section-heading"><div><span className="eyebrow eyebrow--dark">UNSERE ZIMMER</span><h2>Ihr Rückzugsort.</h2><p>Genießen Sie Komfort und eine Atmosphäre zum Wohlfühlen.</p></div></div><div className="room-grid">{h.rooms.map(room=><RoomCard key={room.slug} hotel={h} room={room}/>)}</div><p className="demo-disclaimer">Alle abgebildeten Zimmer, Ausstattungen und Preise sind Beispieldaten; sie sind nicht als tatsächliches Angebot zu verstehen.</p></div></section></main>;}
