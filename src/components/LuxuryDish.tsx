import { ALLERGENS, type DailyDish } from "@/lib/daily-menu";
import "./luxury-menu.css";
export function LuxuryDish({dish,compact=false,hideCourse=false}:{dish:DailyDish;compact?:boolean;hideCourse?:boolean}){
 const Heading=hideCourse?"h4":"h3";
 const names=(ids?:string[])=>ALLERGENS.filter(([id])=>ids?.includes(id)).map(([,name])=>name).join(" · ");
 return <article className={"lux-dish "+(compact?"lux-dish-compact":"")}>
   <div className="lux-dish-top"><div>{!hideCourse&&<span className="lux-course">{dish.course||"Aus unserer Küche"}{dish.signature?" · Empfehlung der Küche":""}</span>}<Heading>{dish.title||"Ihr Gerichtname"}</Heading></div><strong>{dish.price||"– €"}</strong></div>
   <p>{dish.description}</p><div className="lux-tags">{dish.diet&&dish.diet!=="unspecified"&&<span className="lux-diet">{dish.diet==="vegan"?"Vegan":"Vegetarisch"}</span>}{dish.portion&&<span>{dish.portion}</span>}{dish.allergens?.length?<span>Enthält: {names(dish.allergens)}</span>:null}</div>
   <details className="lux-details"><summary>Zutaten & Allergeninformationen</summary><dl>
     {dish.ingredients&&<><dt>Zutaten & Zubereitung</dt><dd>{dish.ingredients}</dd></>}
     {dish.origin&&<><dt>Herkunft</dt><dd>{dish.origin}</dd></>}
     <dt>Enthaltene Allergene</dt><dd>{dish.allergens?.length?names(dish.allergens):"Keine Angaben hinterlegt. Bitte fragen Sie unser Serviceteam."}</dd>
     <dt>Mögliche Spuren</dt><dd>{dish.traces?.length?names(dish.traces):"Keine Angaben zu möglichen Spuren hinterlegt."}</dd>
     {dish.allergenDetail&&<><dt>Weitere Angaben</dt><dd>{dish.allergenDetail}</dd></>}
     {dish.pairing&&<><dt>Unsere Getränkeempfehlung</dt><dd>{dish.pairing}</dd></>}
   </dl><p className="lux-allergen-note">{dish.allergenConfirmed?"Angaben laut hinterlegter Rezeptur.":"Allergenangaben sind noch nicht abschließend bestätigt."} Bei Allergien sprechen Sie bitte vor der Bestellung mit unserem Serviceteam. Eine leere Auswahl ist keine Zusicherung der Allergenfreiheit.</p></details>
 </article>;
}
