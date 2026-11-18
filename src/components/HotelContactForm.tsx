"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BedDouble, CalendarHeart, Check, Copy, Mail, MessageSquare, ShieldCheck, Sparkles, Users, UtensilsCrossed } from "lucide-react";
import { contactSummary, contactTopics, emptyContact, validateContact, type ContactErrors, type ContactFields, type ContactTopic } from "@/lib/contact-form";
import { emitHotelEvent, publicPagePath } from "@/lib/hotel-events";

const topicIcons = { general: MessageSquare, room: BedDouble, restaurant: UtensilsCrossed, event: CalendarHeart, wellness: Sparkles, meeting: Users };
const fieldLabels: Record<keyof ContactFields, string> = { name: "Ihr Name", email: "E-Mail-Adresse", phone: "Telefon", message: "Ihre Nachricht", arrival: "Anreise", departure: "Abreise", date: "Datum", time: "Uhrzeit", people: "Personen" };
export function HotelContactForm({ slug, hotelName, email }: { slug: string; hotelName: string; email?: string }) {
  const [topic, setTopic] = useState<ContactTopic>("general");
  const [fields, setFields] = useState<ContactFields>({ ...emptyContact });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [preview, setPreview] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const summary = useRef<HTMLDivElement>(null);
  const prefix = `contact-${slug}-`;
  const topics = slug === "krone-wiechs" ? contactTopics : contactTopics.slice(0, 4);
  function change(field: keyof ContactFields, value: string) { setFields(previous => ({ ...previous, [field]: value })); setErrors(previous => ({ ...previous, [field]: undefined })); setCopyMessage(""); }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validateContact(fields, topic); setErrors(next);
    const first = Object.keys(next)[0];
    if (first) { requestAnimationFrame(() => document.getElementById(prefix + first)?.focus()); return; }
    setPreview(true); setCopyMessage("");
    emitHotelEvent({ event: "contact_form_preview", hotel_slug: slug, hotel_name: hotelName, page_path: publicPagePath(location.pathname), interaction_method: "form", event_version: 1 });
    requestAnimationFrame(() => summary.current?.focus());
  }
  function attributes(field: keyof ContactFields) { return { id: prefix + field, value: fields[field], "aria-label": fieldLabels[field], "aria-invalid": !!errors[field], "aria-describedby": errors[field] ? prefix + field + "-error" : undefined, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => change(field, event.target.value) }; }
  function error(field: keyof ContactFields) { return errors[field] ? <span className="hc-field-error" id={prefix + field + "-error"}>{errors[field]}</span> : null; }
  async function copy() {
    try { await navigator.clipboard.writeText(contactSummary(hotelName, topic, fields)); setCopyMessage("Anfrage kopiert. Sie können den Text in eine E-Mail einfügen."); }
    catch { setCopyMessage("Automatisches Kopieren ist hier nicht verfügbar. Bitte markieren und kopieren Sie den Text in der Zusammenfassung."); }
  }
  return <section id="kontaktformular" className="hc-form-card" aria-labelledby="contact-form-title">
    <div className="hc-form-heading"><span className="eyebrow eyebrow--dark">IHRE NACHRICHT AN {hotelName}</span><h2 id="contact-form-title">Was dürfen wir<br/>für Sie tun?</h2><p>Ein paar Angaben genügen. Bereiten Sie Ihre Anfrage in Ruhe vor.</p></div>
    {preview ? <div ref={summary} tabIndex={-1} className="hc-review" aria-labelledby="contact-review-title"><div className="hc-review-label"><Check size={20}/><span>ANFRAGE VORBEREITET</span></div><h3 id="contact-review-title">Alles richtig?</h3><p className="hc-unsent">Ihre Nachricht wurde noch nicht gesendet. Der direkte Formularversand ist derzeit nicht verfügbar.</p><pre>{contactSummary(hotelName, topic, fields)}</pre><div className="hc-review-actions"><button type="button" className="hc-submit" onClick={copy}><Copy size={17}/> Anfrage kopieren</button>{email && <a href={`mailto:${email}`} className="hc-email-action"><Mail size={17}/> E-Mail-Programm öffnen</a>}</div><p className="hc-review-note">{email ? "Fügen Sie den kopierten Text in Ihre E-Mail ein und senden Sie diese selbst ab." : "Für einen persönlichen Kontakt nutzen Sie bitte unseren WhatsApp-Link. Es wurde nichts an das Hotel übertragen."} Eine Reservierung entsteht erst nach gesonderter Bestätigung.</p>{copyMessage && <p className="hc-copy-status" role="status">{copyMessage}</p>}<button type="button" className="hc-back" onClick={() => { setPreview(false); requestAnimationFrame(() => document.getElementById(prefix + "name")?.focus()); }}><ArrowLeft size={16}/> Angaben bearbeiten</button></div> : <form onSubmit={submit} noValidate>
      <fieldset className="hc-topics"><legend>Worum geht es?</legend><div role="group" aria-label="Anliegen auswählen">{topics.map(([id, label]) => { const Icon = topicIcons[id]; return <button key={id} type="button" aria-pressed={topic === id} onClick={() => { setTopic(id); setErrors({}); }}><Icon size={18}/><span>{label}</span></button>; })}</div></fieldset>
      {Object.values(errors).some(Boolean) && <p className="hc-form-error" role="alert">Bitte prüfen Sie die markierten Angaben.</p>}
      <div className="hc-fields"><label htmlFor={prefix + "name"}>Ihr Name <span>*</span><input {...attributes("name")} autoComplete="name" required maxLength={100} placeholder="Vor- und Nachname"/>{error("name")}</label><label htmlFor={prefix + "email"}>E-Mail-Adresse <span>*</span><input {...attributes("email")} type="email" autoComplete="email" inputMode="email" required maxLength={180} placeholder="name@beispiel.de"/>{error("email")}</label><label className="hc-phone" htmlFor={prefix + "phone"}>Telefon <small>optional</small><input {...attributes("phone")} type="tel" autoComplete="tel" inputMode="tel" maxLength={40} placeholder="Für eine persönliche Rückfrage"/></label></div>
      {topic !== "general" && <fieldset className="hc-visit"><legend>{topic === "room" ? "Ihre Reisedaten" : "Ihr Wunschtermin"} <small>optional</small></legend><div className="hc-fields">{topic === "room" ? <><label htmlFor={prefix + "arrival"}>Anreise<input {...attributes("arrival")} type="date"/></label><label htmlFor={prefix + "departure"}>Abreise<input {...attributes("departure")} type="date" min={fields.arrival || undefined}/>{error("departure")}</label></> : <><label htmlFor={prefix + "date"}>Datum<input {...attributes("date")} type="date"/></label>{topic === "restaurant" && <label htmlFor={prefix + "time"}>Uhrzeit<input {...attributes("time")} type="time"/></label>}</>}<label htmlFor={prefix + "people"}>Personen<input {...attributes("people")} type="number" inputMode="numeric" min={1} max={999} placeholder="z. B. 2"/>{error("people")}</label></div><p>Wunschdaten sind unverbindlich und noch keine Verfügbarkeitszusage.</p></fieldset>}
      <label className="hc-message" htmlFor={prefix + "message"}>Ihre Nachricht <span>*</span><textarea {...attributes("message")} required rows={5} minLength={10} maxLength={2000} placeholder={topic === "general" ? "Was möchten Sie über unser Haus wissen?" : "Erzählen Sie uns von Ihren Plänen und besonderen Wünschen …"}/>{error("message")}<small className="hc-counter">{fields.message.length} / 2000</small></label>
      <div className="hc-privacy"><ShieldCheck size={18}/><p>Ihre Angaben bleiben in dieser geöffneten Seite. Es erfolgt derzeit kein Versand und keine Speicherung. Mehr dazu in unserer <Link href="/datenschutz">Datenschutzerklärung</Link>.</p></div>
      <div className="hc-form-bottom"><button type="submit" className="hc-submit">Anfrage prüfen <ArrowRight size={18}/></button><span>* Pflichtfelder<br/>Noch kein Direktversand</span></div>
    </form>}
  </section>;
}
