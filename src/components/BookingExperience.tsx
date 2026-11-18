"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, CircleAlert, Info, LoaderCircle, Users } from "lucide-react";
import type { Hotel } from "@/lib/hotels";
import { euro, hotelPath } from "@/lib/hotels";
import { DemoImage } from "./DemoImage";

interface AvailabilityResponse { mode: "demo"; hotel: string; arrival: string; departure: string; nights: number; results: {roomSlug: string; available: boolean; quotePerNight: number}[] }

function todayOffset(days: number): string {const d = new Date(); d.setDate(d.getDate()+days); return [d.getFullYear(), String(d.getMonth()+1).padStart(2,"0"), String(d.getDate()).padStart(2,"0")].join("-");}

export function BookingExperience({ hotel, initialArrival, initialDeparture, initialGuests }: { hotel: Hotel; initialArrival?: string; initialDeparture?: string; initialGuests?: string }) {
  const [arrival, setArrival] = useState(initialArrival && /^\d{4}-\d{2}-\d{2}$/.test(initialArrival) ? initialArrival : todayOffset(1));
  const [departure, setDeparture] = useState(initialDeparture && /^\d{4}-\d{2}-\d{2}$/.test(initialDeparture) ? initialDeparture : todayOffset(3));
  const [guests, setGuests] = useState(initialGuests && /^[1-4]$/.test(initialGuests) ? initialGuests : "2");
  const [result, setResult] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState("");

  const load = useCallback(async () => {
    if (!arrival || !departure || departure <= arrival) {setError("Das Abreisedatum muss nach der Anreise liegen.");setResult(null);return;}
    setLoading(true);setError("");setResult(null);setSelected("");
    try {
      const response = await fetch(`/api/demo-availability?hotel=${encodeURIComponent(hotel.slug)}&arrival=${encodeURIComponent(arrival)}&departure=${encodeURIComponent(departure)}&guests=${encodeURIComponent(guests)}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Die Demo-Suche ist nicht verfügbar.");
      setResult(await response.json() as AvailabilityResponse);
    } catch {setError("Die Demo-Verfügbarkeit konnte nicht geladen werden.");}
    finally {setLoading(false);}
  }, [arrival, departure, guests, hotel.slug]);

  useEffect(() => { void load(); }, [load]);
  const selectedRoom = hotel.rooms.find(room => room.slug === selected);
  const quote = result?.results.find(item=>item.roomSlug===selected);

  return <div className="booking-page-ui">
    <div className="booking-heading"><span className="eyebrow eyebrow--dark">ZIMMERRESERVIERUNG · INTERAKTIVE DEMO</span><h1>Ihre Auszeit beginnt hier.</h1><p>Wählen Sie Ihren Aufenthalt und entdecken Sie unsere Beispielzimmer. Dies ist keine verbindliche Verfügbarkeitsabfrage.</p></div>
    <div className="booking-layout"><div><div className="booking-search"><div className="booking-form-grid"><label>Anreise<input type="date" min={todayOffset(0)} value={arrival} onChange={e=>setArrival(e.target.value)}/></label><label>Abreise<input type="date" min={arrival || todayOffset(1)} value={departure} onChange={e=>setDeparture(e.target.value)}/></label><label>Gäste<select value={guests} onChange={e=>setGuests(e.target.value)}><option value="1">1 Person</option><option value="2">2 Personen</option><option value="3">3 Personen</option><option value="4">4 Personen</option></select></label><button className="button button-solid" type="button" disabled={loading} onClick={()=>void load()}>{loading ? <LoaderCircle size={16} className="spin"/> : <ArrowRight size={16}/>} Suchen</button></div></div>
      {error && <p role="alert" className="error-message"><CircleAlert size={17}/>{error}</p>}
      <div className="booking-results-title"><h2>Zimmeroptionen</h2><span>{result ? `${result.nights} Nächte · ${guests} Gäste` : "Beispielangebote"}</span></div>
      <div className="booking-result-list">{hotel.rooms.map(room => {const row = result?.results.find(item=>item.roomSlug===room.slug); const available = row?.available && Number(guests)<=room.occupancy; return <article className={`bookable-room ${selected===room.slug?"bookable-room--selected":""}`} key={room.slug}><div className="image-wrap bookable-room-image"><DemoImage src={room.image} alt={`Beispielfoto: ${room.name}`}/></div><div className="bookable-room-copy"><h3>{room.name}</h3><p>{room.description}</p><span className="room-meta"><Users size={14}/> Bis {room.occupancy} Gäste · {room.area}</span><div className="bookable-room-bottom"><span className="booking-price">Ab {euro(row?.quotePerNight ?? room.priceFrom)} <small>/ Nacht</small></span><button className={`button ${selected===room.slug?"button-solid":"button-outline"}`} disabled={!result || !available} onClick={()=>setSelected(room.slug)}>{selected===room.slug ? <>Ausgewählt <Check size={15}/></> : available ? "Auswählen" : "Nicht verfügbar"}</button></div></div></article>;})}</div>
    </div>
      <aside className="booking-summary"><span className="eyebrow eyebrow--dark">IHRE AUSWAHL</span><h2>Auf einen Blick</h2><div className="summary-line"><span>Hotel</span><strong>{hotel.name}</strong></div><div className="summary-line"><span>Anreise</span><strong>{arrival}</strong></div><div className="summary-line"><span>Abreise</span><strong>{departure}</strong></div><div className="summary-line"><span>Personen</span><strong>{guests}</strong></div>{selectedRoom && <><hr/><div className="summary-line"><span>Zimmer</span><strong>{selectedRoom.name}</strong></div><div className="summary-line"><span>Beispiel-Gesamtpreis</span><strong>{euro((quote?.quotePerNight || selectedRoom.priceFrom)*(result?.nights || 1))}</strong></div></>}
        <p className="summary-note"><Info size={16}/> Keine echten Bestände, Preise, Reservierungen oder Zahlungen. Die Suche simuliert eine Anfrage an ein Buchungssystem.</p>
        <button className="button button-solid summary-disabled" disabled type="button">Verbindlich buchen (Demo deaktiviert)</button>
        <Link className="text-link summary-contact" href={hotelPath(hotel.slug,"kontakt")}>Kontakt zum Hotel <ArrowRight size={15}/></Link>
      </aside></div>
  </div>;
}
