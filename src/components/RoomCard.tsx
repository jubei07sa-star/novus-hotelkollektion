import Link from "next/link";
import { ArrowUpRight, Users, Expand } from "lucide-react";
import type { Hotel, Room } from "@/lib/hotels";
import { euro, hotelPath } from "@/lib/hotels";
import { DemoImage } from "./DemoImage";

export function RoomCard({ hotel, room }: { hotel: Hotel; room: Room }) {
  return (
    <article className="room-card">
      <Link className="room-media image-wrap" href={hotelPath(hotel.slug, `zimmer/${room.slug}`)} aria-label={`${room.name} ansehen`}>
        <DemoImage src={room.image} alt={`Beispielbild für ${room.name} – ${hotel.name}`}/><span className="image-tag">ZIMMER-DEMO</span>
      </Link>
      <div className="room-card-content"><div className="room-facts"><span><Expand size={14}/> {room.area}</span><span><Users size={14}/> Bis {room.occupancy} Gäste</span></div>
        <h3><Link href={hotelPath(hotel.slug, `zimmer/${room.slug}`)}>{room.name}</Link></h3>
        <p>{room.description}</p>
        <div className="room-card-bottom"><span>Ab <strong>{euro(room.priceFrom)}</strong> <small>/ Nacht · Demo-Preis</small></span><Link href={hotelPath(hotel.slug, `zimmer/${room.slug}`)} className="round-arrow" aria-label={`${room.name} entdecken`}><ArrowUpRight size={20}/></Link></div>
      </div>
    </article>
  );
}
