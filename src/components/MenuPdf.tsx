"use client";
import { useEffect, useRef, useState } from "react";
import { FileText, Upload, Download } from "lucide-react";
export function MenuPdf({slug,editable=false}:{slug:string;editable?:boolean}) {
  const [available,setAvailable]=useState(false),[file,setFile]=useState<File|null>(null),[busy,setBusy]=useState(false),[message,setMessage]=useState(""),[error,setError]=useState("");
  const input=useRef<HTMLInputElement>(null);
  const url="/api/menu-pdf?hotel="+encodeURIComponent(slug);
  useEffect(()=>{const controller=new AbortController();setAvailable(false);const load=()=>fetch(url,{signal:controller.signal,cache:"no-store"}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(d=>{if(!controller.signal.aborted)setAvailable(d.available);}).catch(()=>{});void load();window.addEventListener("focus",load);return()=>{controller.abort();window.removeEventListener("focus",load);};},[url]);
  const sharedPreview=process.env.NEXT_PUBLIC_SHARED_PREVIEW==="true";
  async function upload(){
    if(!file||sharedPreview)return;setBusy(true);setError("");setMessage("");
    try{const form=new FormData();form.append("file",file);const response=await fetch(url,{method:"POST",body:form});const result=await response.json();if(!response.ok)throw Error(result.error);setAvailable(true);setFile(null);if(input.current)input.current.value="";setMessage("PDF gespeichert. Sie ist auf der Speisekartenseite dieses Hotels verfügbar.");}
    catch(e){setError(e instanceof Error?e.message:"Upload fehlgeschlagen.");}finally{setBusy(false);}
  }
  if(!editable)return available?<a className="menu-pdf-download" href={url+"&file=1"}><Download size={19}/> Speisekarte als PDF herunterladen</a>:null;
  return <section className="mm-pdf" aria-label="Speisekarte als PDF"><div className="mm-pdf-heading"><FileText size={25}/><div><h2>Ihre Speisekarte als PDF</h2><p>Für das ausgewählte Hotel · unabhängig vom Tagesmenü</p></div></div><p>Speisekarte, Weinkarte oder saisonales Menü als fertige PDF. Eine Datei pro Hotel; ein neuer Upload ersetzt die bisherige PDF.</p><div className="mm-pdf-actions"><label className="mm-pdf-input">PDF auswählen<span className="mm-pdf-select">Datei auswählen</span><span className="mm-pdf-filename">{file?.name||"Noch keine Datei ausgewählt"}</span><input ref={input} type="file" accept=".pdf,application/pdf" disabled={busy||sharedPreview} onChange={e=>{const selected=e.target.files?.[0];setError("");setMessage("");if(selected&&(!selected.name.toLowerCase().endsWith(".pdf")||selected.size>10*1024*1024)){setFile(null);e.target.value="";setError("Bitte eine PDF-Datei bis 10 MB auswählen.");}else setFile(selected||null);}}/></label><button type="button" className="mm-primary" disabled={sharedPreview||!file||busy} onClick={upload}><Upload size={16}/>{busy?"Wird hochgeladen …":available?"PDF ersetzen":"PDF hochladen"}</button>{available&&<a href={url+"&file=1"}><Download size={16}/> Aktuelle PDF herunterladen</a>}</div><small>{sharedPreview?"PDF-Uploads sind in dieser Online-Ansicht nicht freigeschaltet.":"PDF · maximal 10 MB"}</small>{message&&<p className="mm-message mm-success" role="status">{message}</p>}{error&&<p className="mm-message mm-error" role="alert">{error}</p>}</section>;
}
