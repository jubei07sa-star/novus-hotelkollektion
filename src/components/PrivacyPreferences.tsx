"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ShieldCheck, X } from "lucide-react";

const KEY="hotel-privacy-v1";
const VERSION=1;
const DAYS=180;
export function PrivacySettingsButton(){return <button type="button" className="privacy-settings-link" onClick={()=>window.dispatchEvent(new Event("hotel:privacy-open"))}>Cookie-Einstellungen</button>;}
export function PrivacyPreferences(){
  const [show,setShow]=useState(false),[notice,setNotice]=useState("");
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    function restore(){try{const raw=localStorage.getItem(KEY);const value=raw?JSON.parse(raw):null;const valid=value?.version===VERSION&&value?.mode==="necessary"&&Number.isFinite(value?.expiresAt)&&value.expiresAt>Date.now()&&value.expiresAt<=Date.now()+DAYS*86400000;if(!valid){if(raw)localStorage.removeItem(KEY);setShow(true);}else setShow(false);}catch{setShow(true);}}
    function open(){setNotice("");dialog.current?.showModal();}
    function sync(e:StorageEvent){if(e.key===KEY||e.key===null)restore();}
    restore();window.addEventListener("hotel:privacy-open",open);window.addEventListener("storage",sync);
    return()=>{window.removeEventListener("hotel:privacy-open",open);window.removeEventListener("storage",sync);};
  },[]);
  function save(){try{localStorage.setItem(KEY,JSON.stringify({version:VERSION,mode:"necessary",savedAt:Date.now(),expiresAt:Date.now()+DAYS*86400000}));setNotice("");setShow(false);dialog.current?.close();}catch{setNotice("Ihr Browser erlaubt das Speichern nicht. Es bleiben ausschließlich notwendige Funktionen aktiv; dieser Hinweis kann beim nächsten Besuch wieder erscheinen.");setShow(false);dialog.current?.close();}}
  function reset(){try{localStorage.removeItem(KEY);setNotice("Die gespeicherte Auswahl wurde gelöscht. Optionale Dienste bleiben ausgeschaltet.");setShow(true);}catch{setNotice("Die Auswahl konnte nicht gelöscht werden. Prüfen Sie die Speichereinstellungen Ihres Browsers.");}}
  return <>
    {show&&<section className="privacy-banner" aria-label="Datenschutz und Cookies"><div className="privacy-banner-title"><ShieldCheck size={22}/><h2>Ihre Privatsphäre zählt.</h2></div><p>Diese Website nutzt keine Analyse- oder Werbe-Cookies. Wir speichern nur Ihre Auswahl für diesen Hinweis für 180 Tage auf Ihrem Gerät. Karten, Buchungsportale und WhatsApp öffnen sich erst über einen Link.</p><div className="privacy-actions"><button type="button" onClick={save}>Nur notwendige verwenden</button><button type="button" onClick={()=>dialog.current?.showModal()}>Details & Einstellungen</button></div><div className="privacy-links"><Link href="/datenschutz">Datenschutz</Link><Link href="/impressum">Impressum</Link></div></section>}
    <dialog ref={dialog} className="privacy-dialog" aria-labelledby="privacy-title" aria-describedby="privacy-description"><button className="privacy-close" type="button" aria-label="Cookie-Einstellungen schließen" onClick={()=>dialog.current?.close()}><X size={22}/></button><ShieldCheck size={27}/><h2 id="privacy-title">Cookie-Einstellungen</h2><p id="privacy-description">Zurzeit sind ausschließlich notwendige Funktionen vorhanden. Für Analyse, Werbung oder eingebettete Drittanbieter werden keine Einwilligungen eingeholt, weil diese Dienste nicht eingesetzt werden.</p><div className="privacy-category"><strong>Notwendige Einstellungen</strong><span>Immer aktiv</span><p>Ihre Auswahl wird im lokalen Browserspeicher unter „hotel-privacy-v1“ abgelegt. Anbieter: Novus Global GmbH. Zweck: diesen Hinweis nicht bei jedem Besuch erneut anzeigen. Dauer: 180 Tage; danach wird die Auswahl beim nächsten Aufruf erneuert. Gilt nur für diese Internetadresse.</p></div><div className="privacy-category"><strong>Analyse & Werbung</strong><span>Nicht eingesetzt</span><p>Keine Besucheranalyse, Werbeprofile, Pixel oder eingebetteten Karten. Die Auswahl gibt keine Freigabe für künftig hinzugefügte Dienste.</p></div><div className="privacy-actions"><button type="button" onClick={save}>Nur notwendige verwenden</button><button type="button" onClick={reset}>Gespeicherte Auswahl löschen</button></div>{notice&&<p role="status" className="privacy-status">{notice}</p>}<div className="privacy-links"><Link href="/datenschutz" onClick={()=>dialog.current?.close()}>Datenschutz</Link><Link href="/impressum" onClick={()=>dialog.current?.close()}>Impressum</Link></div></dialog>
    {notice&&!show&&<p className="privacy-storage-notice" role="status">{notice}</p>}
  </>;
}
