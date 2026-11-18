"use client";
import { ALLERGENS, COURSES, type DailyDish } from "@/lib/daily-menu";
export function DishDetailsEditor({dish,onChange,index}:{dish:DailyDish;onChange:(patch:Partial<DailyDish>)=>void;index:number}){
  function toggle(field:"allergens"|"traces",id:string){
    const other=field==="allergens"?"traces":"allergens";
    onChange({[field]:(dish[field]||[]).includes(id)?dish[field]!.filter(a=>a!==id):[...(dish[field]||[]),id],[other]:(dish[other]||[]).filter(a=>a!==id),allergenConfirmed:false});
  }
  return <details className="dish-editor-details"><summary>Details & Allergene <span>{dish.allergenConfirmed?"Angaben erfasst":"Angaben offen"}</span></summary><div className="dish-detail-fields">
    <div className="mm-dish-row"><label>Menügang<select value={dish.course||"Hauptgang"} onChange={e=>onChange({course:e.target.value})}>{COURSES.map(c=><option key={c}>{c}</option>)}</select></label><label>Ernährungsweise<select value={dish.diet||"unspecified"} onChange={e=>onChange({diet:e.target.value as DailyDish["diet"]})}><option value="unspecified">Keine Angabe</option><option value="vegetarian">Vegetarisch</option><option value="vegan">Vegan</option></select></label></div>
    <label>Zutaten & Zubereitung<textarea maxLength={500} rows={3} value={dish.ingredients||""} onChange={e=>onChange({ingredients:e.target.value,allergenConfirmed:false})} placeholder="Rezeptur, Sauce, Garnitur und verwendete Zutaten"/></label>
    <div className="mm-dish-row"><label>Herkunft<input maxLength={500} value={dish.origin||""} onChange={e=>onChange({origin:e.target.value})} placeholder="Nur bestätigte Herkunft"/></label><label>Portion<input maxLength={500} value={dish.portion||""} onChange={e=>onChange({portion:e.target.value})} placeholder="z. B. 220 g"/></label></div>
    <label>Getränkeempfehlung<input maxLength={500} value={dish.pairing||""} onChange={e=>onChange({pairing:e.target.value})} placeholder="Passender Wein oder alkoholfreie Begleitung"/></label>
    <label className="dish-check"><input type="checkbox" checked={!!dish.signature} onChange={e=>onChange({signature:e.target.checked})}/> Empfehlung der Küche</label>
    <div className="allergen-editor"><h4>Allergenangaben</h4><p>„Enthält“ für Zutaten, „Spuren“ für mögliche Kreuzkontakte. Nicht ausgewählt bedeutet nicht allergenfrei.</p><div className="allergen-row allergen-row-head"><span>Allergen</span><span>Enthält</span><span>Spuren</span></div>{ALLERGENS.map(([id,name])=><div className="allergen-row" key={id}><span>{name}</span><label className="allergen-toggle"><input type="checkbox" aria-label={name+" enthalten, Gericht "+(index+1)} checked={!!dish.allergens?.includes(id)} onChange={()=>toggle("allergens",id)}/></label><label className="allergen-toggle"><input type="checkbox" aria-label={name+" als Spuren, Gericht "+(index+1)} checked={!!dish.traces?.includes(id)} onChange={()=>toggle("traces",id)}/></label></div>)}</div>
    <label>Genaue Getreide- / Nussarten & Hinweise<textarea maxLength={500} rows={2} value={dish.allergenDetail||""} onChange={e=>onChange({allergenDetail:e.target.value,allergenConfirmed:false})} placeholder="z. B. Weizen, Gerste; Mandeln, Walnüsse. Sulfite: relevante Konzentration prüfen."/></label>
    <label className="dish-check"><input type="checkbox" checked={!!dish.allergenConfirmed} onChange={e=>onChange({allergenConfirmed:e.target.checked})}/> Allergenangaben anhand der Rezeptur geprüft</label>
    <p className="dish-help">Bei Gluten oder Schalenfrüchten bitte die konkrete Art angeben. Ernährungsweise und Allergene müssen zusammenpassen.</p>
  </div></details>;
}
