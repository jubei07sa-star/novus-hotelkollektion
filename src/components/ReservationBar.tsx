"use client";
import { useState } from "react";
import { ArrowRight, BedDouble, UtensilsCrossed } from "lucide-react";
import { getHotel, hotels, hotelHomeUrl } from "@/lib/hotels";
import { reservationTarget, type ReservationMode } from "@/lib/reservations";
import { emitHotelEvent, publicPagePath } from "@/lib/hotel-events";

export function ReservationBar({hotelSlug}:{hotelSlug?:string}){
  const [slug,setSlug]=useState(hotelSlug||hotels[0].slug);
  const [mode,setMode]=useState<ReservationMode>("room");
  const hotel=getHotel(hotelSlug||slug)!;
  const target=reservationTarget(hotel.slug,mode);
  const href=!hotelSlug&&target.href.startsWith("/")?hotelHomeUrl(hotel.slug)+target.href:target.href;
  return <section id="reservieren" className="reservation-section" aria-label="Zimmer oder Restaurantbesuch planen"><div className="reservation-bar">
    <div className="reservation-modes" role="group" aria-label="Art der Reservierung"><button type="button" aria-pressed={mode==="room"} onClick={()=>setMode("room")}><BedDouble size={17}/> Übernachten</button><button type="button" aria-pressed={mode==="table"} onClick={()=>setMode("table")}><UtensilsCrossed size={17}/> Tisch</button></div>
    {hotelSlug?<div className="reservation-house"><small>IHRE ZEIT BEI UNS</small><strong>{hotel.name}</strong></div>:<label className="reservation-house"><small>HAUS AUSWÄHLEN</small><select aria-label="Hotel für Reservierung auswählen" value={slug} onChange={e=>setSlug(e.target.value)}>{hotels.map(h=><option value={h.slug} key={h.slug}>{h.name}</option>)}</select></label>}
    <a className="reservation-go" href={href} data-hotel-event={target.event} target={target.external?"_blank":undefined} rel={target.external?"noopener noreferrer":undefined} onClick={()=>{if(!hotelSlug)emitHotelEvent({event:target.event,hotel_slug:hotel.slug,hotel_name:hotel.name,page_path:publicPagePath(location.pathname),interaction_method:target.external?"portal":href.startsWith("mailto:")?"email":"navigation",event_version:1});}}>{target.label}<ArrowRight size={18}/></a>
  </div><p className="reservation-note" aria-live="polite">{target.note}</p></section>;
}

export function HotelActionDock({hotelSlug}:{hotelSlug:string}){
  const room=reservationTarget(hotelSlug,"room"),table=reservationTarget(hotelSlug,"table");
  return <nav className="hotel-action-dock" aria-label="Schnell reservieren"><a href={room.href} data-hotel-event={room.event} target={room.external?"_blank":undefined} rel={room.external?"noopener noreferrer":undefined} aria-label={room.label}><BedDouble size={17}/><span>Zimmer</span></a><a href={table.href} data-hotel-event={table.event} target={table.external?"_blank":undefined} rel={table.external?"noopener noreferrer":undefined} aria-label={table.label}><UtensilsCrossed size={17}/><span>Tisch</span></a></nav>;
}
