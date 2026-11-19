"use client";
import { apiFetch, apiQuery, phpBackend } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Copy, LoaderCircle, X } from "lucide-react";
import type { DailyDish } from "@/lib/daily-menu";
import { draftFromMenu, isMenuDirty, preparedDishes, type CopyTarget, type MenuDraft } from "@/lib/menu-planning";

export type CopySource = { hotel: string; hotelName: string; day: string; dishes: DailyDish[]; dirty: boolean };
const shift = (day: string, n: number) => { const date = new Date(day + "T12:00:00Z"); date.setUTCDate(date.getUTCDate() + n); return date.toISOString().slice(0, 10); };
const mondayOf = (day: string) => shift(day, -((new Date(day + "T12:00:00Z").getUTCDay() + 6) % 7));
const dateLabel = (day: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("de-DE", { ...options, timeZone: "Europe/Berlin" }).format(new Date(day + "T12:00:00Z"));

export function MenuCopyDialog({ source, drafts, onClose, onCopy }: { source: CopySource; drafts: Record<string, MenuDraft>; onClose: () => void; onCopy: (dishes: DailyDish[], targets: CopyTarget[]) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const abort = useRef<AbortController | null>(null);
  const reviewTitle = useRef<HTMLHeadingElement>(null);
  const [week, setWeek] = useState(mondayOf(source.day));
  const [selected, setSelected] = useState<string[]>([]);
  const [targets, setTargets] = useState<CopyTarget[] | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const days = Array.from({ length: 7 }, (_, i) => shift(week, i));
  const conflicts = (targets || []).filter(target => target.draft.saved || isMenuDirty(target.draft));
  useEffect(() => { const element = dialog.current!; const previous = document.activeElement as HTMLElement | null; element.showModal(); return () => { abort.current?.abort(); element.close(); previous?.focus(); }; }, []);
  useEffect(() => { if (targets) reviewTitle.current?.focus(); }, [targets]);
  function toggle(day: string) { setSelected(previous => previous.includes(day) ? previous.filter(value => value !== day) : [...previous, day]); setError(""); }
  async function review() {
    setBusy(true); setError(""); setAccepted(false);
    const controller = new AbortController(); abort.current = controller;
    try {
      preparedDishes(source.hotel, source.day, source.dishes);
      const checked = await Promise.all([...selected].sort().map(async day => {
        const response = await fetch(apiQuery("demo-menu", `hotel=${encodeURIComponent(source.hotel)}&day=${day}`), { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw Error("Die Zielmenüs konnten nicht geprüft werden. Bitte erneut versuchen. Es wurde nichts kopiert.");
        const existing = draftFromMenu(await response.json());
        const local = drafts[source.hotel + ":" + day];
        return { day, draft: isMenuDirty(local) ? local : existing };
      }));
      if (!controller.signal.aborted) setTargets(checked);
    } catch (reason) { if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : "Bitte erneut versuchen."); }
    finally { if (!controller.signal.aborted) setBusy(false); }
  }
  return <dialog ref={dialog} className="mm-copy-dialog" aria-labelledby="copy-title" aria-describedby="copy-description" onCancel={event => { event.preventDefault(); onClose(); }}>
    <div className="mm-copy-header"><div><span className="mm-kicker">WENIGER TIPPEN. MEHR ZEIT FÜR DIE KÜCHE.</span><h2 id="copy-title">Menü kopieren</h2></div><button type="button" className="mm-icon-button" aria-label="Kopieren schließen" onClick={onClose}><X size={20}/></button></div>
    <div className="mm-copy-body">
      <p id="copy-description">Für {source.hotelName}. Gerichte, Preise, Zutaten und Allergene werden vollständig übernommen.</p>
      <div className="mm-copy-source"><Copy size={20}/><div><span>AUSGANGSMENÜ · {source.dirty ? "AKTUELLER ENTWURF" : "AKTUELLER STAND"}</span><strong>{dateLabel(source.day, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</strong><p>{source.dishes.length} {source.dishes.length === 1 ? "Gericht" : "Gerichte"} · {source.dishes.map(dish => dish.title || "Unbenanntes Gericht").join(" · ")}</p></div></div>
      {!targets ? <>
        <h3>Auf welche Tage?</h3><p>Wählen Sie einen oder mehrere Tage. Sie können auch in eine andere Woche wechseln.</p>
        <div className="mm-copy-week"><button type="button" className="mm-icon-button" aria-label="Kopieren: vorherige Woche" disabled={busy} onClick={() => setWeek(shift(week, -7))}><ChevronLeft size={18}/></button><strong>{dateLabel(week, { day: "numeric", month: "short" })} – {dateLabel(days[6], { day: "numeric", month: "short", year: "numeric" })}</strong><button type="button" className="mm-icon-button" aria-label="Kopieren: nächste Woche" disabled={busy} onClick={() => setWeek(shift(week, 7))}><ChevronRight size={18}/></button></div>
        <label className="mm-copy-date">Andere Woche auswählen<input type="date" aria-label="Zielwoche auswählen" value={week} disabled={busy} onChange={event => { const value = event.target.value; if (/^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value))) setWeek(mondayOf(value)); }}/></label>
        <div className="mm-copy-presets"><button type="button" disabled={busy} onClick={() => setSelected(days.slice(0,5).filter(day => day !== source.day))}>Mo–Fr auswählen</button><button type="button" disabled={busy} onClick={() => setSelected(days.filter(day => day !== source.day))}>Ganze Woche auswählen</button><button type="button" disabled={busy || !selected.length} onClick={() => setSelected([])}>Auswahl leeren</button></div>
        <fieldset className="mm-copy-days" disabled={busy}><legend>Zieltage auswählen</legend>{days.map(day => <label key={day} className={day === source.day ? "is-source" : selected.includes(day) ? "is-selected" : ""}><input type="checkbox" checked={selected.includes(day)} disabled={day === source.day || (selected.length >= 31 && !selected.includes(day))} onChange={() => toggle(day)} aria-label={"Kopieren auf " + dateLabel(day, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}/><span>{dateLabel(day, { weekday: "short" })}</span><strong>{dateLabel(day, { day: "2-digit", month: "2-digit" })}</strong><small>{day === source.day ? "Quelle" : selected.includes(day) ? "Ausgewählt" : "Auswählen"}</small></label>)}</fieldset>
        <p className="mm-copy-selection" aria-live="polite">{selected.length ? `${selected.length} ${selected.length === 1 ? "Tag ausgewählt" : "Tage ausgewählt"}` : "Noch kein Zieltag ausgewählt"}{selected.some(day => !days.includes(day)) && " · auch in anderen Wochen"}. Maximal 31 Tage pro Kopiervorgang.</p>
      </> : <>
        <h3 ref={reviewTitle} tabIndex={-1}>Auswahl prüfen · {targets.length} {targets.length === 1 ? "Tag" : "Tage"}</h3>
        <ul className="mm-copy-review">{targets.map(target => <li key={target.day}><div><strong>{dateLabel(target.day, { weekday: "short", day: "numeric", month: "long", year: "numeric" })}</strong><span>{isMenuDirty(target.draft) ? "Ungespeicherter Entwurf wird ersetzt" : target.draft.saved ? "Gespeichertes Menü wird als Entwurf ersetzt" : "Neuer Menüentwurf"}</span>{(target.draft.saved || isMenuDirty(target.draft)) && <small>Bisher: {target.draft.dishes.map(dish => dish.title || "Unbenanntes Gericht").join(" · ")}</small>}</div><span className="mm-copy-badge">{isMenuDirty(target.draft) || target.draft.saved ? "Ersetzen" : "Neu"}</span></li>)}</ul>
        {conflicts.length > 0 && <label className="mm-copy-confirm"><input type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)}/> <span>Ich möchte die vorhandenen Menüs oder Entwürfe an den {conflicts.length} markierten Tagen ersetzen. Gespeicherte Menüs bleiben bis zum Speichern unverändert.</span></label>}
        <div className="mm-copy-info"><Check size={18}/><p>Die Kopien werden zunächst als Entwürfe angelegt. Danach einzeln anpassen oder die Entwürfe der angezeigten Woche gemeinsam speichern. Das Ausgangsmenü bleibt unverändert.</p></div>
      </>}
      {error && <p className="mm-message mm-error" role="alert">{error}</p>}
    </div>
    <div className="mm-copy-footer"><button type="button" className="mm-secondary" onClick={() => targets ? setTargets(null) : onClose()} disabled={busy}>{targets ? <><ArrowLeft size={16}/> Zurück</> : "Abbrechen"}</button>{targets ? <button type="button" className="mm-primary" disabled={conflicts.length > 0 && !accepted} onClick={() => onCopy(preparedDishes(source.hotel, source.day, source.dishes), targets)}><Copy size={16}/> {targets.length} {targets.length === 1 ? "Entwurf anlegen" : "Entwürfe anlegen"}</button> : <button type="button" className="mm-primary" disabled={busy || !selected.length} onClick={review}>{busy ? <LoaderCircle size={16} className="spin"/> : <ArrowRight size={16}/>} {busy ? "Wird geprüft …" : "Auswahl prüfen"}</button>}</div>
  </dialog>;
}
