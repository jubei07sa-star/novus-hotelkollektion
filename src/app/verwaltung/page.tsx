"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, ChevronLeft, ChevronRight, Eye, LoaderCircle, Plus, Save, Trash2, UtensilsCrossed, FileUp, PenLine, Building2, Undo2, Copy, CalendarDays } from "lucide-react";
import { hotels, hotelHomeUrl } from "@/lib/hotels";
import { type DailyDish, type DailySpecial } from "@/lib/daily-menu";
import "./menu-manager.css";
import { DishDetailsEditor } from "@/components/DishDetailsEditor";
import { LuxuryDish } from "@/components/LuxuryDish";
import { MenuPdf } from "@/components/MenuPdf";
import { MenuJsonImport } from "@/components/MenuJsonImport";
import { validDishDetails } from "@/lib/daily-menu";
import "./dashboard-design.css";
import { MenuCopyDialog, type CopySource } from "@/components/MenuCopyDialog";
import { copyMenuDrafts, draftFromMenu, isMenuDirty, preparedDishes, weekDrafts, type MenuDraft } from "@/lib/menu-planning";
import "./menu-copy.css";

function today(){return new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Berlin",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());}
function shift(day:string,n:number){const d=new Date(day+"T12:00:00Z");d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
function label(day:string,options:Intl.DateTimeFormatOptions){return new Intl.DateTimeFormat("de-DE",{...options,timeZone:"Europe/Berlin"}).format(new Date(day+"T12:00:00Z"));}
type Draft=MenuDraft;
const sharedPreview=process.env.NEXT_PUBLIC_SHARED_PREVIEW==="true";
export default function AdminPage(){
  const [slug,setSlug]=useState(hotels[0].slug),[day,setDay]=useState(today);
  const [drafts,setDrafts]=useState<Record<string,Draft>>({});
  const [busy,setBusy]=useState(false),[loading,setLoading]=useState(true);
  const [error,setError]=useState(""),[notice,setNotice]=useState(""),[retry,setRetry]=useState(0);
  const [section,setSection]=useState<"menu"|"files">("menu");
  const [view,setView]=useState<"edit"|"preview">("edit");
  const [undo,setUndo]=useState<{key:string;dishes:DailyDish[]}|null>(null);
  const [focusDish,setFocusDish]=useState<number|null>(null);
  const [copySource,setCopySource]=useState<CopySource|null>(null);
  const [weekStatus,setWeekStatus]=useState<{hotel:string;week:string;error:boolean;text:string}|null>(null);
  const cache=useRef(drafts);cache.current=drafts;
  const key=slug+":"+day,draft=drafts[key],hotel=hotels.find(h=>h.slug===slug)!;
  const dirty=isMenuDirty(draft);
  const pending=Object.values(drafts).filter(isMenuDirty).length;
  const monday=shift(day,-((new Date(day+"T12:00:00Z").getUTCDay()+6)%7));
  const days=Array.from({length:7},(_,i)=>shift(monday,i));
  const pendingWeek=weekDrafts(drafts,slug,days);
  const otherDays=Object.entries(drafts).filter(([id,value])=>id.startsWith(slug+":")&&!days.includes(id.split(":")[1])&&isMenuDirty(value)).map(([id])=>id.split(":")[1]).sort();
  useEffect(()=>{
    const controller=new AbortController();
    const missing=Array.from({length:7},(_,i)=>shift(monday,i)).filter(date=>!cache.current[slug+":"+date]);
    void Promise.all(missing.map(async date=>{
      try{const response=await fetch("/api/demo-menu?hotel="+encodeURIComponent(slug)+"&day="+date,{cache:"no-store",signal:controller.signal});if(!response.ok)return;const entry=draftFromMenu(await response.json());if(!controller.signal.aborted)setDrafts(previous=>previous[slug+":"+date]?previous:{...previous,[slug+":"+date]:entry});}catch{}
    }));
    return()=>controller.abort();
  },[slug,monday]);
  useEffect(()=>{if(focusDish!==null){document.getElementById("dish-title-"+focusDish)?.focus();setFocusDish(null);}},[focusDish]);
  useEffect(()=>{
    setError("");setNotice("");
    if(cache.current[key]){setLoading(false);return;}
    const controller=new AbortController();setLoading(true);
    fetch("/api/demo-menu?hotel="+encodeURIComponent(slug)+"&day="+day,{cache:"no-store",signal:controller.signal})
      .then(async response=>{if(!response.ok)throw Error();return response.json() as Promise<{special:DailySpecial;saved:boolean}>;})
      .then(data=>{if(controller.signal.aborted)return;const dishes=data.special.dishes||[{title:data.special.title,description:data.special.description,price:data.special.price}];setDrafts(prev=>({...prev,[key]:{dishes,baseline:JSON.stringify(dishes),saved:data.saved}}));})
      .catch(()=>{if(!controller.signal.aborted)setError("Das Menü konnte nicht geladen werden. Bitte erneut versuchen.");})
      .finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    return()=>controller.abort();
  },[key,slug,day,retry]);
  useEffect(()=>{if(!pending)return;const warn=(event:BeforeUnloadEvent)=>{event.preventDefault();event.returnValue="";};window.addEventListener("beforeunload",warn);return()=>window.removeEventListener("beforeunload",warn);},[pending]);
  function edit(dishes:DailyDish[]){setDrafts(prev=>({...prev,[key]:{...prev[key],dishes}}));setNotice("");setError("");setUndo(null);}
  function update(index:number,field:keyof DailyDish,value:string){edit(draft.dishes.map((d,i)=>i===index?{...d,[field]:value}:d));}
  async function save(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();if(!draft||busy||sharedPreview)return;
    const form=event.currentTarget;
    if(!form.checkValidity()){setView("edit");setError("Bitte Gerichtname und Preis prüfen. Pflichtfelder sind mit * gekennzeichnet.");requestAnimationFrame(()=>form.reportValidity());return;}
    const invalidDish=draft.dishes.findIndex(d=>!validDishDetails(d));
    if(invalidDish!==-1){setView("edit");requestAnimationFrame(()=>{const details=form.querySelectorAll<HTMLDetailsElement>(".dish-editor-details")[invalidDish];if(details){details.open=true;details.querySelector("summary")?.focus();}});setError("Bitte die Allergenangaben prüfen: Getreide- und Nussarten ergänzen und Ernährungsweise mit den enthaltenen Allergenen abgleichen.");return;}
    const dishes=draft.dishes.map(d=>({...d,title:d.title.trim(),description:d.description.trim(),price:Number(d.price.replace("€","").trim().replace(",",".")).toFixed(2).replace(".",",")+" €"}));
    setBusy(true);setError("");setNotice("");
    try{const response=await fetch("/api/demo-menu",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({hotel:slug,day,special:{...dishes[0],dishes,validOn:day}})});if(!response.ok)throw Error();setDrafts(prev=>({...prev,[key]:{dishes,baseline:JSON.stringify(dishes),saved:true}}));setNotice("Gespeichert. Das Tagesmenü für "+label(day,{day:"numeric",month:"long"})+" ist auf der lokalen Hotelseite sichtbar.");}
    catch{setError("Speichern fehlgeschlagen. Ihre Änderungen bleiben hier erhalten. Bitte erneut versuchen.");}finally{setBusy(false);}
  }
  async function saveWeek(){
    if(busy||!pendingWeek.length||sharedPreview)return;
    const entries:{day:string;dishes:DailyDish[]}[]=[];
    for(const entry of pendingWeek){
      try{entries.push({day:entry.day,dishes:preparedDishes(slug,entry.day,entry.draft.dishes)});}
      catch(reason){setDay(entry.day);setView("edit");setSection("menu");setWeekStatus({hotel:slug,week:monday,error:true,text:label(entry.day,{weekday:"long",day:"numeric",month:"long"})+": "+(reason instanceof Error?reason.message:"Bitte die Gerichte prüfen.")+" Es wurde noch kein Menü gespeichert."});return;}
    }
    setBusy(true);setError("");setNotice("");setUndo(null);
    const failed:string[]=[];let saved=0;
    for(const entry of entries){
      setWeekStatus({hotel:slug,week:monday,error:false,text:`Wochenmenüs werden gespeichert: ${saved+failed.length+1} von ${entries.length} …`});
      try{const response=await fetch("/api/demo-menu",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({hotel:slug,day:entry.day,special:{...entry.dishes[0],dishes:entry.dishes,validOn:entry.day}})});if(!response.ok)throw Error();setDrafts(previous=>({...previous,[slug+":"+entry.day]:{dishes:entry.dishes,baseline:JSON.stringify(entry.dishes),saved:true}}));saved++;}catch{failed.push(entry.day);}
    }
    setWeekStatus({hotel:slug,week:monday,error:failed.length>0,text:failed.length?`${saved} Menüs gespeichert. Nicht gespeichert: ${failed.map(date=>label(date,{day:"2-digit",month:"2-digit"})).join(", ")}. Diese Entwürfe bleiben erhalten; bitte erneut speichern.`:`${saved} ${saved===1?"Tagesmenü":"Tagesmenüs"} gespeichert. Die Menüs dieser Woche sind auf der lokalen Hotelseite verfügbar.`});
    setBusy(false);
  }
  return <main id="main-content" tabIndex={-1} className="mm-shell">
    <aside className="mm-sidebar">
      <Link href="/" className="mm-logo"><span>H</span><div>HOTELKOLLEKTION<small>MEIN ARBEITSPLATZ</small></div></Link>
      <div className="mm-nav-label">GASTFREUNDSCHAFT PLANEN</div>
      <button type="button" className="mm-nav-active" onClick={()=>setSection("menu")}><UtensilsCrossed size={18}/> Menüplanung</button>
      <div className="mm-nav-label mm-houses-label">UNSERE FÜNF HÄUSER</div>
      <nav className="mm-houses" aria-label="Hotel wechseln">{hotels.map((h,i)=><button type="button" key={h.slug} aria-pressed={slug===h.slug} disabled={busy} onClick={()=>setSlug(h.slug)}><span>0{i+1}</span><div><strong>{["Tanne","Adler","Goldener Wagen","Ochsen","Krone"][i]}</strong><small>{h.region.split(" · ")[0]}</small></div>{slug===h.slug&&<Check size={15}/>}</button>)}</nav>
      <div className="mm-side-note"><span className="mm-dot"/> Alles an einem Ort<p>Gerichte planen. Details pflegen. Gäste begeistern.</p></div>
      <Link className="mm-nav-link" href="/"><ArrowLeft size={16}/> Zur Hotelübersicht</Link>
    </aside>
    <div className="mm-workspace">
      <header className="mm-topbar"><span>Arbeitsplatz <span>/</span> Menüplanung</span><Link href="/" className="mm-overview-link">Hotelübersicht <ArrowUpRight size={15}/></Link></header>
      <div className="mm-content">
        {sharedPreview&&<p className="mm-message" role="note">Ansicht zur Abstimmung: Gerichte, Allergene, JSON-Import und das Kopieren auf andere Tage können Sie hier ausprobieren. Änderungen bleiben nur bis zum Verlassen dieser Seite erhalten. Speichern und PDF-Upload sind in dieser Online-Ansicht nicht freigeschaltet.</p>}
        <div className="mm-title"><div><span className="mm-kicker">GUT GEPLANT. FRISCH SERVIERT.</span><h1>Gute Küche. Gut geplant.</h1><p>Ein Haus wählen. Einen Tag planen. Ein gutes Menü gestalten.</p></div><span className="mm-count"><Building2 size={18}/>{hotels.length} Häuser · eine Übersicht</span></div>
        <section className="mm-context" aria-label="Hotel und Tag auswählen">
          <div className="mm-context-top"><label><span className="mm-step">01</span> Für welches Haus?<select aria-label="Hotel auswählen" disabled={busy} value={slug} onChange={e=>setSlug(e.target.value)}>{hotels.map(h=><option key={h.slug} value={h.slug}>{h.name}</option>)}</select></label><div className="mm-hotel-info"><span>{hotel.region}</span><strong>{hotel.restaurantName}</strong><a href={hotelHomeUrl(slug)+"/speisekarte"} target="_blank" rel="noopener noreferrer">Speisekarte ansehen <ArrowUpRight size={15}/></a></div></div>
          <div className="mm-calendar-heading"><span><span className="mm-step">02</span> Für welchen Tag?</span><div><button type="button" disabled={busy} aria-label="Vorherige Woche" onClick={()=>setDay(shift(day,-7))}><ChevronLeft size={18}/></button><strong>{label(monday,{day:"2-digit",month:"2-digit"})} – {label(days[6],{day:"2-digit",month:"2-digit"})}</strong><button type="button" disabled={busy} aria-label="Nächste Woche" onClick={()=>setDay(shift(day,7))}><ChevronRight size={18}/></button><button type="button" className="mm-today" disabled={busy} onClick={()=>setDay(today())}>Heute</button><input aria-label="Datum auswählen" type="date" required disabled={busy} value={day} onChange={e=>{if(e.target.value&&/^\d{4}-\d{2}-\d{2}$/.test(e.target.value))setDay(e.target.value);}}/></div></div>
          <div className="mm-days">{days.map(d=>{const entry=drafts[slug+":"+d];const changed=isMenuDirty(entry);return <button type="button" key={d} disabled={busy} aria-label={label(d,{weekday:"long",day:"numeric",month:"long",year:"numeric"})} aria-pressed={day===d} onClick={()=>setDay(d)} className={day===d?"is-selected":""}><span>{label(d,{weekday:"short"})}</span><strong>{label(d,{day:"2-digit",month:"2-digit"})}</strong><small>{changed?"Entwurf":entry?.saved?"Gespeichert":d===today()?"Heute":"Menü planen"}</small></button>;})}</div>
        </section>
        <section className="mm-week-tools" aria-label="Menüs kopieren und Woche speichern"><div><span className="mm-kicker">EINMAL PLANEN. MEHRFACH GENIESSEN.</span><h2>Die Woche leichter machen.</h2><p>{pendingWeek.length?`${pendingWeek.length} ${pendingWeek.length===1?"offener Entwurf":"offene Entwürfe"} in dieser Woche.`:"Ein Tagesmenü auf andere Tage übertragen und bei Bedarf anpassen."}</p>{otherDays.length>0&&<button type="button" className="mm-other-week" disabled={busy} onClick={()=>setDay(otherDays[0])}>{otherDays.length} weitere Entwürfe · nächste offene Woche <ArrowUpRight size={14}/></button>}</div><div className="mm-week-actions"><button type="button" className="mm-secondary" disabled={busy||loading||!draft} onClick={()=>setCopySource({hotel:slug,hotelName:hotel.name,day,dishes:JSON.parse(JSON.stringify(draft.dishes)),dirty})}><Copy size={17}/> Menü auf andere Tage kopieren</button><button type="button" className="mm-primary" disabled={sharedPreview||busy||!pendingWeek.length} onClick={saveWeek}>{busy?<LoaderCircle size={17} className="spin"/>:<CalendarDays size={17}/>} Wochenentwürfe speichern{pendingWeek.length>0?` (${pendingWeek.length})`:""}</button></div></section>
        {weekStatus?.hotel===slug&&weekStatus.week===monday&&<div className={"mm-message mm-week-status "+(weekStatus.error?"mm-error":"mm-success")} role={weekStatus.error?"alert":"status"}>{weekStatus.text}</div>}
        <div className="mm-section-switch" role="group" aria-label="Arbeitsbereich auswählen"><button type="button" aria-pressed={section==="menu"} onClick={()=>setSection("menu")}><UtensilsCrossed size={17}/> Tagesmenü{dirty&&<span className="mm-unsaved-dot" aria-label="Ungespeicherte Änderungen"/>}</button><button type="button" aria-pressed={section==="files"} onClick={()=>setSection("files")}><FileUp size={17}/> PDF & JSON</button></div>
        <div hidden={section!=="menu"}>
          <div className="mm-editor-heading" id="editor"><div><span className="mm-step">03</span><div><h2>Was servieren wir?</h2><p>{hotel.restaurantName} · {label(day,{weekday:"long",day:"numeric",month:"long"})}</p></div></div><div className="mm-view-switch" role="group" aria-label="Editoransicht"><button type="button" aria-pressed={view==="edit"} onClick={()=>setView("edit")}><PenLine size={15}/> Bearbeiten</button><button type="button" aria-pressed={view==="preview"} onClick={()=>setView("preview")}><Eye size={15}/> Vorschau</button></div></div>
          {error&&<div className="mm-message mm-error" role="alert">{error} {!draft&&<button type="button" onClick={()=>setRetry(v=>v+1)}>Erneut laden</button>}</div>}
          {notice&&<div className="mm-message mm-success" role="status"><Check size={18}/>{notice}</div>}
          {loading?<div className="mm-loading" role="status"><LoaderCircle className="spin"/> Menü wird geladen …</div>:draft&&<form onSubmit={save} noValidate>
            <div className="mm-edit-grid" data-view={view}>
              <div className="mm-dishes"><div className="mm-card-title"><div><h3>Ihre Tagesgerichte</h3><p>Name und Preis genügen. Feine Details machen den Unterschied.</p></div><span>{draft.dishes.length} / 12</span></div>
                {undo?.key===key&&<div className="mm-undo" role="status">Gericht entfernt.<button type="button" onClick={()=>edit(undo.dishes)}><Undo2 size={14}/> Rückgängig</button></div>}
                <fieldset disabled={busy}>{draft.dishes.map((dish,index)=><section className="mm-dish-editor" key={index} aria-label={"Gericht "+(index+1)}><div className="mm-dish-heading"><span>GERICHT {String(index+1).padStart(2,"0")}</span><button type="button" aria-label={"Gericht "+(index+1)+" entfernen"} disabled={draft.dishes.length===1} onClick={()=>{const previous=draft.dishes;edit(draft.dishes.filter((_,i)=>i!==index));setUndo({key,dishes:previous});}}><Trash2 size={16}/></button></div>
                  <div className="mm-dish-row"><label>Gerichtname *<input id={"dish-title-"+index} aria-label={"Gerichtname "+(index+1)} required maxLength={100} value={dish.title} onChange={e=>update(index,"title",e.target.value)} placeholder="z. B. Kürbisrisotto" pattern={".*\\S.*"}/></label><label>Preis (€) *<input aria-label={"Preis "+(index+1)} required inputMode="decimal" pattern={"[0-9]{1,4}([,.][0-9]{1,2})?\\s*€?"} title="Preis eingeben, z. B. 16,90" value={dish.price} onChange={e=>update(index,"price",e.target.value)} placeholder="16,90"/></label></div>
                  <label>Beschreibung <small>optional</small><textarea aria-label={"Beschreibung "+(index+1)} maxLength={240} rows={2} value={dish.description} onChange={e=>update(index,"description",e.target.value)} placeholder="Zutaten, Beilagen und Besonderheiten …"/><span className="mm-character-count">{dish.description.length}/240</span></label>
                  <DishDetailsEditor dish={dish} index={index} onChange={patch=>edit(draft.dishes.map((d,i)=>i===index?{...d,...patch}:d))}/>
                </section>)}</fieldset>
                <button type="button" className="mm-add" disabled={busy||draft.dishes.length>=12} onClick={()=>{edit([...draft.dishes,{title:"",description:"",price:""}]);setFocusDish(draft.dishes.length);}}><Plus size={18}/> Gericht hinzufügen</button>
              </div>
              <aside className="mm-preview"><div className="mm-preview-heading"><Eye size={17}/><span>SO SIEHT ES DER GAST</span><small>{dirty?"Entwurf":draft.saved?"Gespeichert":"Vorlage"}</small></div><div className="mm-menu-paper"><span className="mm-kicker">{hotel.restaurantName}</span><UtensilsCrossed size={24}/><h2>Unser Tagesmenü</h2><p className="mm-menu-date">{label(day,{weekday:"long",day:"numeric",month:"long"})}</p><div className="mm-menu-rule"/>{draft.dishes.map((dish,i)=><LuxuryDish key={i} dish={{...dish,title:dish.title||"Ihr neues Gericht",price:dish.price||"–"}} compact/>)}<div className="mm-menu-bottom">Mit Freude gekocht. Gemeinsam genießen.</div></div><p className="mm-preview-hint">Die Vorschau aktualisiert sich beim Schreiben. Mit „Menü speichern“ übernehmen Sie Ihre Änderungen.</p></aside>
            </div>
            {section==="menu"&&<div className="mm-savebar"><div><span className={"mm-status "+(dirty?"is-dirty":"")}><span className="mm-dot"/>{dirty?"Änderungen noch nicht gespeichert":draft.saved?"Alle Änderungen gespeichert":"Vorlage bereit zum Bearbeiten"}</span><small>{hotel.restaurantName+" · "+label(day,{day:"2-digit",month:"2-digit",year:"numeric"})}{pending>1?" · "+pending+" offene Entwürfe":""}</small></div><div className="mm-save-actions"><button type="button" className="mm-secondary" disabled={busy||!dirty} onClick={()=>{setDrafts(previous=>({...previous,[key]:{...previous[key],dishes:JSON.parse(previous[key].baseline),planned:false}}));setUndo(null);setError("");setNotice("");}}>Verwerfen</button><button type="submit" className="mm-primary" disabled={sharedPreview||busy||(!dirty&&draft.saved)}>{busy?<LoaderCircle size={17} className="spin"/>:<Save size={17}/>} {busy?"Wird gespeichert …":"Menü speichern"}</button></div></div>}
          </form>}
        </div>
        <div hidden={section!=="files"} className="mm-files-panel"><div className="mm-files-intro"><span className="mm-kicker">DATEIEN & VORLAGEN</span><h2>Einfach übernehmen.</h2><p>PDFs gehören zum ausgewählten Haus. Ein JSON-Import gilt für den gewählten Tag.</p></div><MenuPdf key={slug} slug={slug} editable/><MenuJsonImport key={key} hotel={slug} hotelName={hotel.name} day={day} dishes={draft?.dishes} dirty={dirty} disabled={busy||loading||!draft} onImport={dishes=>{edit(dishes);setSection("menu");setView("edit");setNotice("Menü als Entwurf übernommen. Bitte Gerichte prüfen und speichern.");requestAnimationFrame(()=>document.getElementById("editor")?.scrollIntoView({block:"start"}));}}/>{error&&!draft&&<div role="alert" className="mm-message mm-error">{error}<button type="button" onClick={()=>setRetry(v=>v+1)}>Erneut laden</button></div>}</div>
        <p className="mm-footnote">Entwürfe bleiben beim Wechsel von Hotel oder Tag erhalten, bis Sie die Seite verlassen. {sharedPreview?"In dieser Online-Ansicht werden keine Änderungen gespeichert.":"Gespeicherte Menüs bleiben lokal erhalten."}</p>
      </div>
    </div>
    {copySource&&<MenuCopyDialog source={copySource} drafts={drafts} onClose={()=>setCopySource(null)} onCopy={(dishes,targets)=>{
      setDrafts(previous=>copyMenuDrafts(previous,copySource.hotel,copySource.day,dishes,targets));
      const first=targets[0].day;const week=shift(first,-((new Date(first+"T12:00:00Z").getUTCDay()+6)%7));
      setWeekStatus({hotel:copySource.hotel,week,error:false,text:`${targets.length} ${targets.length===1?"Menü als Entwurf kopiert":"Menüs als Entwürfe kopiert"}. Gerichte bei Bedarf anpassen und anschließend die Wochenentwürfe speichern.`});
      setDay(first);setSection("menu");setView("edit");setUndo(null);setCopySource(null);
    }}/>}
  </main>;
}
