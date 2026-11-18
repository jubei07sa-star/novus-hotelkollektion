"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, Users } from "lucide-react";
import { hotelPath } from "@/lib/hotels";

function dateOffset(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

export function BookingBar({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const router = useRouter();
  const [arrival, setArrival] = useState(() => dateOffset(1));
  const [departure, setDeparture] = useState(() => dateOffset(3));
  const [guests, setGuests] = useState("2");
  const [error, setError] = useState("");
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!arrival || !departure || departure <= arrival) { setError("Bitte wählen Sie ein gültiges Abreisedatum."); return; }
    setError("");
    router.push(`${hotelPath(slug, "buchen")}?anreise=${encodeURIComponent(arrival)}&abreise=${encodeURIComponent(departure)}&gaeste=${guests}`);
  }
  return (
    <form className={`bookingbar ${compact ? "bookingbar--compact" : ""}`} onSubmit={search}>
      <div className="booking-field"><label htmlFor={`arrival-${slug}`}><CalendarDays size={17}/> Anreise</label><input id={`arrival-${slug}`} aria-label="Anreisedatum" required type="date" min={dateOffset(0)} value={arrival} onChange={e => setArrival(e.target.value)}/></div>
      <div className="booking-field"><label htmlFor={`departure-${slug}`}><CalendarDays size={17}/> Abreise</label><input id={`departure-${slug}`} aria-label="Abreisedatum" required type="date" min={arrival || dateOffset(1)} value={departure} onChange={e => setDeparture(e.target.value)}/></div>
      <div className="booking-field"><label htmlFor={`guests-${slug}`}><Users size={17}/> Gäste</label><select id={`guests-${slug}`} value={guests} onChange={e=>setGuests(e.target.value)}><option value="1">1 Person</option><option value="2">2 Personen</option><option value="3">3 Personen</option><option value="4">4 Personen</option></select></div>
      <button type="submit" className="button button-solid booking-action">Verfügbarkeit prüfen <ArrowRight size={18}/></button>
      {error && <p className="booking-error" role="alert">{error}</p>}
    </form>
  );
}
