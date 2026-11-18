"use client";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function OchsenInquiry({initialType="Zimmer",additionalTypes=[]}:{initialType?:string;additionalTypes?:string[]}) {
  const [type,setType]=useState(initialType);
  const [date,setDate]=useState("");
  const [departure,setDeparture]=useState("");
  const [guests,setGuests]=useState("2");
  const [complete,setComplete]=useState(false);
  const [error,setError]=useState("");
  const displayDate=(value:string)=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))?new Intl.DateTimeFormat("de-DE",{dateStyle:"long"}).format(new Date(`${value}T12:00:00`)):"–";
  const today=new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Berlin",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
  function change(){setComplete(false);setError("");}
  return <form className="ochsen-inquiry" onChange={change} onSubmit={event=>{event.preventDefault();const data=new FormData(event.currentTarget);const start=String(data.get("arrival")||""),end=String(data.get("departure")||"");const valid=(value:string)=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;if(!valid(start)||start<today||(type==="Zimmer"&&(!valid(end)||end<=start))){setError("Bitte wählen Sie einen gültigen Termin. Die Abreise muss nach der Anreise liegen.");setComplete(false);return;}setDate(start);setDeparture(end);setComplete(true);}}>
    <span className="eyebrow eyebrow--dark">IHREN BESUCH PLANEN</span>
    <h2>Was haben Sie vor?</h2><p>Stellen Sie Ihren Wunschaufenthalt zusammen. Die Planung bleibt zunächst auf Ihrem Gerät; eine Reservierung entsteht dadurch nicht.</p>
    <div className="ochsen-form-grid">
      <label>Ihr Anliegen<select value={type} onChange={e=>setType(e.target.value)}>{["Zimmer","Restaurant","Feier",...additionalTypes].map(item=><option key={item}>{item}</option>)}</select></label>
      <label>{type==="Zimmer"?"Anreise":"Wunschtermin"}<input name="arrival" type="date" min={today} required value={date} onChange={e=>{setDate(e.target.value);if(departure<=e.target.value)setDeparture("");}}/></label>
      {type==="Zimmer"&&<label>Abreise<input name="departure" type="date" min={date?new Date(new Date(`${date}T12:00:00Z`).getTime()+86400000).toISOString().slice(0,10):today} required value={departure} onChange={e=>setDeparture(e.target.value)}/></label>}
      <label>Personen<input type="number" min="1" max="100" required value={guests} onChange={e=>setGuests(e.target.value)}/></label>
    </div>
    <label className="ochsen-message">Ihre Wünsche<textarea rows={3} maxLength={2000} placeholder="Zimmerwunsch, Anlass oder besondere Wünsche …"/></label>
    <button className="button button-solid" type="submit">Planung ansehen <ArrowRight size={16}/></button>
    {error&&<p role="alert" className="error-message">{error}</p>}
    {complete&&<div className="ochsen-inquiry-result" role="status"><Check size={20}/><div><strong>Ihre Planung im Überblick</strong><p>{type} · {displayDate(date)}{type==="Zimmer"?` bis ${displayDate(departure)}`:""} · {guests} {guests==="1"?"Person":"Personen"}</p><small>Noch keine Reservierung. Für die persönliche Abstimmung erreichen Sie uns über WhatsApp.</small></div></div>}
  </form>;
}
