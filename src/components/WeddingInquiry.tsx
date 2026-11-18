"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";

export function WeddingInquiry({ hotelName }: { hotelName: string }) {
  const [submitted, setSubmitted] = useState(false);
  function onSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSubmitted(true); }
  if (submitted) return <div className="form-success" role="status"><CheckCircle2 size={36}/><h3>Ihre Demo-Anfrage wurde angezeigt.</h3><p>Dies ist nur eine Vorschau. Ihre Angaben wurden nicht übermittelt oder gespeichert.</p><button className="button button-outline" type="button" onClick={() => setSubmitted(false)}>Weitere Anfrage testen</button></div>;
  return <form className="inquiry-form" onSubmit={onSubmit}><span className="eyebrow eyebrow--dark">IHR BESONDERER TAG</span><h2>Erzählen Sie uns von Ihren Plänen.</h2><p>Testen Sie die Anfrage für {hotelName}. Dieses Demo-Formular versendet keine Daten.</p>
    <div className="form-grid"><label>Ihr Name<input type="text" name="name" minLength={2} required placeholder="Vor- und Nachname"/></label><label>E-Mail-Adresse<input type="email" name="email" required placeholder="name@beispiel.de"/></label><label>Wunschtermin<input type="date" name="date" required/></label><label>Gästezahl<select name="guests" required defaultValue=""><option value="" disabled>Bitte wählen</option><option>Bis 30 Gäste</option><option>30–60 Gäste</option><option>60–100 Gäste</option><option>Über 100 Gäste</option></select></label></div>
    <label>Ihre Wünsche<textarea rows={4} name="message" placeholder="Was stellen Sie sich für Ihre Feier vor?"/></label>
    <p className="small-notice"><ShieldAlert size={15}/> Demo: Kein echter Versand, keine Speicherung und keine Kontaktaufnahme.</p><button className="button button-solid" type="submit">Demo-Anfrage ansehen <ArrowRight size={17}/></button>
  </form>;
}
