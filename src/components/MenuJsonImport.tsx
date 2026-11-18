"use client";
import { useRef, useState } from "react";
import { Braces, Check, Download, Upload } from "lucide-react";
import { type DailyDish } from "@/lib/daily-menu";
import { MENU_JSON_LIMIT, menuDocument, menuTemplate, menuFormat, parseMenuJson, type MenuDocument } from "@/lib/menu-json";
import "./menu-json.css";

function download(value:MenuDocument,name:string){
  const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)+"\n"],{type:"application/json;charset=utf-8"}));
  const link=document.createElement("a");link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function MenuJsonImport({hotel,hotelName,day,dishes,dirty,disabled,onImport}:{hotel:string;hotelName:string;day:string;dishes?:DailyDish[];dirty:boolean;disabled:boolean;onImport:(dishes:DailyDish[])=>void}){
  const [text,setText]=useState(""),[name,setName]=useState(""),[error,setError]=useState(""),[preview,setPreview]=useState<MenuDocument|null>(null),[reading,setReading]=useState(false),[accepted,setAccepted]=useState(false),[notice,setNotice]=useState("");
  const sequence=useRef(0);
  function reset(value:string){setText(value);setPreview(null);setError("");setNotice("");setAccepted(false);}
  async function choose(file?:File){
    const current=++sequence.current;reset("");setName(file?.name||"");setReading(false);
    if(!file)return;
    if(!file.name.toLowerCase().endsWith(".json")||file.size>MENU_JSON_LIMIT){setError("Bitte eine .json-Datei bis 256 KB auswählen.");return;}
    setReading(true);
    try{const content=await file.text();if(sequence.current===current)setText(content);}
    catch{if(sequence.current===current)setError("Die Datei konnte nicht gelesen werden.");}
    finally{if(sequence.current===current)setReading(false);}
  }
  function validate(){try{setPreview(parseMenuJson(text,hotel,day));setError("");setNotice("");setAccepted(false);}catch(e){setPreview(null);setError(e instanceof Error?e.message:"Import fehlgeschlagen.");}}
  function exportCurrent(){if(!dishes)return;try{const doc=parseMenuJson(JSON.stringify(menuDocument(hotel,day,dishes)),hotel,day);download(doc,`menue-${hotel}-${day}.json`);setError("");}catch(e){setError("Export nicht möglich: "+(e instanceof Error?e.message:"Bitte Gerichte prüfen."));}}
  return <section className="mm-json" aria-label="Menü als JSON importieren">
    <div className="mm-json-title"><Braces size={24}/><div><h2>Menü als JSON importieren</h2><p>Eine Datei. Ein Tagesmenü. Alle Details.</p></div><span>FORMAT V1</span></div>
    <div className="mm-json-target"><strong>{hotelName}</strong><span>{day.split("-").reverse().join(".")} · bis zu 12 Gerichte · max. 256 KB</span></div>
    <p>Vorlage herunterladen, Gerichte ergänzen und Datei prüfen. Der Import ersetzt die Gerichte dieses Tages zunächst als Entwurf. Erst „Menü speichern“ übernimmt sie auf die Hotelseite.</p>
    <div className="mm-json-actions"><button type="button" className="mm-secondary" onClick={()=>download(menuTemplate(hotel,day),`menue-vorlage-${hotel}-${day}.json`)}><Download size={16}/> Vorlage herunterladen</button><button type="button" className="mm-secondary" disabled={disabled||!dishes} onClick={exportCurrent}><Download size={16}/> Aktuelles Menü exportieren</button></div>
    <div className="mm-json-upload"><label className="mm-pdf-input">JSON-Datei auswählen<span className="mm-pdf-select"><Upload size={16}/> Datei auswählen</span><span className="mm-pdf-filename">{reading?"Datei wird gelesen …":name||"Noch keine Datei ausgewählt"}</span><input aria-label="JSON-Datei auswählen" type="file" accept=".json,application/json" disabled={disabled||reading} onChange={e=>{void choose(e.target.files?.[0]);e.target.value="";}}/></label><button type="button" className="mm-primary" disabled={disabled||reading||!text.trim()} onClick={validate}>JSON prüfen & voranzeigen</button></div>
    <details className="mm-json-paste"><summary>JSON direkt einfügen</summary><label>JSON-Inhalt<textarea aria-label="JSON-Inhalt" rows={8} spellCheck={false} maxLength={MENU_JSON_LIMIT} disabled={disabled||reading} value={text} placeholder={'{ "version": 1, "hotel": "…", "date": "…", "currency": "EUR", "dishes": [] }'} onChange={e=>{sequence.current++;setName("");reset(e.target.value);}}/></label></details>
    {error&&<p role="alert" className="mm-message mm-error">{error}</p>}
    {notice&&<p role="status" className="mm-message mm-success">{notice}</p>}
    {preview&&<div className="mm-json-preview"><h3><Check size={18}/> Datei geprüft · {preview.dishes.length} {preview.dishes.length===1?"Gericht":"Gerichte"}</h3><ul>{preview.dishes.map((dish,i)=><li key={i}><div><strong>{dish.title}</strong><span>{dish.course||"Ohne Menügang"} · {dish.allergens?.length||0} Allergene · {dish.allergenConfirmed?"Rezeptur als geprüft markiert":"Allergenprüfung offen"}</span></div><b>{dish.price}</b></li>)}</ul><p>Alle Zutaten, Allergenangaben und weiteren Details werden übernommen und sind anschließend im Editor prüfbar.</p>{dirty&&<label className="mm-json-confirm"><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)}/> Meine ungespeicherten Gerichte für diesen Tag durch den Import ersetzen.</label>}<div className="mm-json-actions"><button type="button" className="mm-primary" disabled={disabled||(dirty&&!accepted)} onClick={()=>{onImport(preview.dishes);setPreview(null);setNotice("Als Entwurf übernommen. Bitte im Editor prüfen und mit „Menü speichern“ abschließen.");}}>Als Entwurf übernehmen</button><button type="button" className="mm-secondary" onClick={()=>setPreview(null)}>Abbrechen</button></div></div>}
    <details className="mm-json-help"><summary>Format & erlaubte Werte</summary><p><b>Pflichtfelder:</b> version: 1, hotel: „{hotel}“, date: „{day}“, currency: „EUR“, dishes: Liste mit 1–12 Gerichten. Hotel und Datum müssen zur Auswahl passen.</p><p><b>Je Gericht:</b> title (bis 100 Zeichen), price als Text, z. B. „19,90“ oder „19.90“. description ist optional (bis 240 Zeichen).</p><p><b>Weitere Textfelder:</b> ingredients, origin, portion, pairing, allergenDetail (je bis 500 Zeichen). course: {menuFormat.courses.join(", ")}. diet: unspecified, vegetarian oder vegan. signature und allergenConfirmed: true oder false.</p><p><b>allergens / traces:</b> Listen mit den folgenden Kennungen; keine Dopplungen oder Überschneidungen. Leere Listen bedeuten nicht allergenfrei.</p><dl>{menuFormat.allergens.map(([id,label])=><div key={id}><dt>{id}</dt><dd>{label}</dd></div>)}</dl><p>Bei bestätigten Angaben zu Gluten oder Schalenfrüchten die konkrete Getreide- bzw. Nussart in allergenDetail ergänzen. Keine Kommentare oder zusätzlichen Felder im JSON verwenden. Format: UTF-8.</p></details>
  </section>;
}
