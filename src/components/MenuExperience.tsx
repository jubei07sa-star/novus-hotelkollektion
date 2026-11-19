"use client";
import { apiFetch, apiQuery, phpBackend } from "@/lib/api";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Info } from "lucide-react";
import type { Hotel } from "@/lib/hotels";
import { type DailySpecial, getDefaultSpecial } from "@/lib/daily-menu";
import { LuxuryDish } from "./LuxuryDish";
import { TanneDining } from "./TanneDining";
import { MenuPdf } from "./MenuPdf";
import { tanneMenu } from "@/lib/tanne-menu";
import "./menu-layout.css";

function formatDay(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {timeZone:"Europe/Berlin",year:"numeric",month:"2-digit",day:"2-digit"}).format(date);
}
function dayLabel(iso: string) {
  return new Intl.DateTimeFormat("de-DE", {timeZone:"Europe/Berlin",weekday:"long",day:"numeric",month:"long"}).format(new Date(`${iso}T12:00:00Z`));
}

export function MenuExperience({ hotel, dailyOnly=false }: { hotel: Hotel; dailyOnly?:boolean }) {
  const isTanne = hotel.slug === "landhotel-tanne";
  const sections = isTanne ? tanneMenu : hotel.menu;
  const [baseDay,setBaseDay] = useState("");
  useEffect(()=>{const day=formatDay(new Date());setBaseDay(day);setSelected(day);},[]);
  const days = useMemo(() => baseDay ? Array.from({length:7}, (_,i) => {
    const date = new Date(`${baseDay}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate()+i);
    return {iso:formatDay(date),day:new Intl.DateTimeFormat("de-DE",{timeZone:"Europe/Berlin",weekday:"short"}).format(date),date:new Intl.DateTimeFormat("de-DE",{timeZone:"Europe/Berlin",day:"2-digit",month:"2-digit"}).format(date)};
  }) : [], [baseDay]);
  const [selected, setSelected] = useState("");
  const [special, setSpecial] = useState<DailySpecial>({title:"",description:"",price:"",validOn:"",dishes:[]});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if(!selected)return;
    let mounted = true;
    let sequence = 0;
    const controller = new AbortController();
    setLoading(true);
    async function load() {
      const request = ++sequence;
      try {
        const result = await fetch(apiQuery("demo-menu", `hotel=${encodeURIComponent(hotel.slug)}&day=${encodeURIComponent(selected)}`),{cache:"no-store",signal:controller.signal});
        if (!result.ok) throw new Error("Demo-Menü nicht erreichbar");
        const data = await result.json() as {special:DailySpecial};
        if (mounted && request === sequence) setSpecial(data.special);
      } catch { if (mounted && request === sequence) setSpecial(phpBackend ? {title:"",description:"",price:"",validOn:selected,dishes:[]} : getDefaultSpecial(selected)); }
      finally { if (mounted && request === sequence) setLoading(false); }
    }
    void load();
    const onFocus = () => void load();
    window.addEventListener("focus",onFocus);
    return () => {mounted=false;controller.abort();window.removeEventListener("focus",onFocus);};
  }, [hotel.slug, selected]);
  const dishes = special.dishes || [special];

  return <div className={`menu-ui${(isTanne||dailyOnly)?" menu-ui--tanne":""}`}>
    {isTanne && <nav className="menu-section-nav" aria-label="Bereiche der Speisekarte">
      <a href="#tagesmenue">Tagesmenü</a>{sections.map((section,index)=><a href={`#karte-${index}`} key={section.title}>{section.title}</a>)}<a href="#festmenues">Festmenüs</a><a href="#restaurantzeiten">Öffnungszeiten & Brunch</a>
    </nav>}
    <section className="daily-special" id="tagesmenue" aria-labelledby="daily-menu-heading">
      <div className="daily-plan"><div className="daily-heading"><div><span className="eyebrow eyebrow--dark">TÄGLICH ANDERS</span><h2 id="daily-menu-heading">Unser Tagesmenü</h2><p>Kulinarische Ideen für Ihren Besuch. Das Angebot für Ihren Wunschtag stimmen Sie bitte mit uns ab.</p></div><CalendarDays size={26}/></div>
        <div className="daily-date-panel">{(isTanne||dailyOnly) && <p className="daily-selected-date">{selected?dayLabel(selected):"Aktuelle Woche"}</p>}<div className="day-picker" role="group" aria-label="Datum für Tagesgericht wählen">{days.map(day=><button type="button" className={`day-pill ${selected===day.iso?"day-pill--active":""}`} onClick={()=>{if(selected!==day.iso){setLoading(true);setSelected(day.iso);}}} key={day.iso} aria-label={dayLabel(day.iso)} aria-pressed={selected===day.iso}><span>{day.day}</span><strong>{day.date}</strong></button>)}</div></div>
      </div>
      <div className={`daily-dishes${dishes.length===1?" daily-dishes--single":""}`} aria-busy={loading}>{loading?<p className="menu-loading" role="status">Tagesmenü wird geladen …</p>:dishes.length===0?<p className="menu-loading">Für diesen Tag ist noch kein Tagesmenü hinterlegt. Bitte fragen Sie unser Restaurantteam.</p>:dishes.map((dish,index)=><LuxuryDish key={`${selected}-${index}`} dish={dish}/>)}</div>
      <p className="small-notice"><Info size={15}/> Menüideen zur Orientierung. Bitte bestätigen Sie Angebot, Preis und Allergene vor Ihrer Bestellung mit unserem Restaurantteam.</p>
    </section>
    {!dailyOnly&&<div className="full-menu"><div className="full-menu-heading"><div><span className="eyebrow eyebrow--dark">AUS UNSERER KÜCHE</span><h2>{isTanne?"À la carte":"Speisekarte"}</h2><p>{isTanne?"Aus unserer Weihnachtskarte · 24.–26. Dezember 2026":"Mit Liebe zum Detail und Freude am gemeinsamen Genuss."}</p></div><MenuPdf key={hotel.slug} slug={hotel.slug}/></div>
      {sections.map((section,index)=><section className="menu-section" id={`karte-${index}`} key={section.title} aria-labelledby={`karte-heading-${index}`}><div className="menu-category-heading"><h3 id={`karte-heading-${index}`}>{section.title}</h3>{isTanne&&<span aria-hidden="true">0{index+1}</span>}</div><div className="menu-section-dishes">{section.items.map(dish=><LuxuryDish key={dish.title} hideCourse={isTanne} dish={{...dish,course:section.title,diet:dish.tags?.includes("Vegetarisch")?"vegetarian":"unspecified"}}/>)}</div></section>)}
    </div>}
    {isTanne&&<TanneDining/>}
  </div>;
}

