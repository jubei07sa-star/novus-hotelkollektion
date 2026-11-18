"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { DemoImage } from "./DemoImage";
const tannePhotos=[
  {image:"room",category:"Zimmer",caption:"Ein Zimmer zum Ankommen",alt:"Doppelbett, Sitzbereich und Holzfußboden in einem Tanne-Zimmer"},
  {image:"room3",category:"Zimmer",caption:"Helle Räume unter dem Dach",alt:"Helles Zimmer mit Bett und Schreibtisch im Dachgeschoss"},
  {image:"room4",category:"Zimmer",caption:"Einblicke in die Zimmer",alt:"Dachzimmer mit Bett, Spiegel und Fernseher"},
  {image:"room2",category:"Zimmer",caption:"Das eigene Bad",alt:"Badezimmer mit Dusche und Waschbecken"},
  {image:"dining",category:"Restaurant",caption:"Gemeinsam am Tisch",alt:"Gäste stoßen beim Essen im Restaurant Tanne an"},
  {image:"cuisine",category:"Restaurant",caption:"Aus unserer Küche",alt:"Fleischgericht mit Kartoffeln und Gemüse"},
  {image:"brunch",category:"Restaurant",caption:"Sonntag am Buffet",alt:"Brunchbuffet mit warmen und kalten Speisen"},
  {image:"garden",category:"Garten",caption:"Sommer in der Gartenwirtschaft",alt:"Gartentische unter Sonnenschirmen"},
  {image:"terrace",category:"Garten",caption:"Ein Platz auf der Terrasse",alt:"Sonnige Terrasse am Landhotel Tanne"},
  {image:"wedding",category:"Feiern",caption:"Ein festlicher Rahmen",alt:"Festtafel mit weißen Blumen und Kerzen"},
  {image:"celebration",category:"Feiern",caption:"Besondere Augenblicke",alt:"Hochzeitsinspiration mit Braut auf der Terrasse"},
  {image:"entrance",category:"Hotel",caption:"Herzlich willkommen",alt:"Empfangsglocke und Zimmerschlüssel an der Rezeption"}
];
export function TanneGallery({photos=tannePhotos}:{photos?:{image:string;category:string;caption:string;alt:string}[]}={}){
  const [category,setCategory]=useState("Alle"),[selected,setSelected]=useState<number|null>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  const items=category==="Alle"?photos:photos.filter(p=>p.category===category);
  const current=selected===null?null:items[selected];
  useEffect(()=>{if(selected!==null&&!dialog.current?.open)dialog.current?.showModal();},[selected]);
  function move(direction:number){setSelected(i=>i===null?null:(i+direction+items.length)%items.length);}
  return <><div className="tanne-gallery-filters" role="group" aria-label="Galerie filtern">{["Alle",...new Set(photos.map(p=>p.category))].map(label=><button type="button" key={label} aria-pressed={category===label} onClick={()=>setCategory(label)}>{label}</button>)}</div><p className="tanne-gallery-count" role="status">{items.length} Aufnahmen · zum Vergrößern auswählen</p><div className="tanne-gallery-grid">{items.map((photo,index)=><figure key={photo.image}><button type="button" className="image-wrap" aria-label={`Foto vergrößern: ${photo.caption}`} onClick={()=>setSelected(index)}><DemoImage src={photo.image.startsWith("/")?photo.image:`/images/tanne/${photo.image}.webp`} alt={photo.alt} sizes="(max-width:600px) 100vw, (max-width:1000px) 50vw, 33vw"/><span><Expand size={18}/></span></button><figcaption><small>{photo.category}</small>{photo.caption}</figcaption></figure>)}</div>
  <dialog ref={dialog} className="tanne-lightbox" aria-label="Fotoansicht" aria-describedby="tanne-photo-caption" onClose={()=>setSelected(null)} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}} onKeyDown={e=>{if(e.key==="ArrowRight"){e.preventDefault();move(1);}if(e.key==="ArrowLeft"){e.preventDefault();move(-1);}}}>
    <button type="button" className="tanne-lightbox-close" aria-label="Fotoansicht schließen" onClick={()=>dialog.current?.close()}><X size={23}/></button>
    {current&&<><div className="tanne-lightbox-photo image-wrap"><DemoImage key={current.image} src={current.image.startsWith("/")?current.image:`/images/tanne/${current.image}.webp`} alt={current.alt} className="tanne-full-photo" sizes="95vw" priority/></div><div className="tanne-lightbox-bar"><button type="button" aria-label="Vorheriges Foto" onClick={()=>move(-1)}><ArrowLeft size={20}/></button><p id="tanne-photo-caption">{current.caption}<small>{selected!+1} / {items.length}</small></p><button type="button" aria-label="Nächstes Foto" onClick={()=>move(1)}><ArrowRight size={20}/></button></div></>}
  </dialog></>;
}
