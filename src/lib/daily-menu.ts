export const ALLERGENS = [
  ["gluten","Glutenhaltiges Getreide"],["crustaceans","Krebstiere"],["eggs","Eier"],["fish","Fisch"],
  ["peanuts","Erdnüsse"],["soy","Soja"],["milk","Milch & Milchprodukte (inkl. Laktose)"],
  ["nuts","Schalenfrüchte"],["celery","Sellerie"],["mustard","Senf"],["sesame","Sesam"],
  ["sulphites","Schwefeldioxid & Sulfite"],["lupin","Lupinen"],["molluscs","Weichtiere"]
] as const;
export const COURSES = ["Vorspeise","Hauptgang","Dessert","Beilage","Getränk"] as const;
export type DailyDish = {
  title: string; description: string; price: string;
  course?: string; ingredients?: string; origin?: string; portion?: string; pairing?: string;
  diet?: "unspecified"|"vegetarian"|"vegan"; signature?: boolean;
  allergens?: string[]; traces?: string[]; allergenDetail?: string; allergenConfirmed?: boolean;
};
export function validDishDetails(d:DailyDish):boolean {
  const ids:string[]=ALLERGENS.map(a=>a[0]);
  const lists=[d.allergens,d.traces];
  if(lists.some(list=>list!==undefined&&(!Array.isArray(list)||list.length>14||list.some(id=>typeof id!=="string"||!ids.includes(id))||new Set(list).size!==list.length)))return false;
  if(d.allergens?.some(a=>d.traces?.includes(a)))return false;
  if(d.course!==undefined&&!(COURSES as readonly string[]).includes(d.course))return false;
  if(d.diet!==undefined&&!["unspecified","vegetarian","vegan"].includes(d.diet))return false;
  if([d.signature,d.allergenConfirmed].some(v=>v!==undefined&&typeof v!=="boolean"))return false;
  if([d.ingredients,d.origin,d.portion,d.pairing,d.allergenDetail].some(v=>v!==undefined&&(typeof v!=="string"||v.length>500)))return false;
  if(d.allergenConfirmed&&d.allergens?.some(a=>a==="gluten"||a==="nuts")&&!d.allergenDetail?.trim())return false;
  if(d.diet==="vegan"&&d.allergens?.some(a=>["milk","eggs","fish","crustaceans","molluscs"].includes(a)))return false;
  if(d.diet==="vegetarian"&&d.allergens?.some(a=>["fish","crustaceans","molluscs"].includes(a)))return false;
  return true;
}
export type DailySpecial = DailyDish & { validOn: string; dishes?: DailyDish[] };

const demoDailySpecials = [
  ["Hausgemachte Maultaschen", "Mit geschmälzten Zwiebeln und kleinem Salat", "16,90 €"],
  ["Saisonaler Gemüseauflauf", "Mit Kräuterrahm und Ofenkartoffeln", "15,50 €"],
  ["Rindergulasch nach Hausart", "Serviettenknödel und Marktgemüse", "19,90 €"],
  ["Gebackenes Fischfilet", "Kartoffelsalat und Zitronen-Dip", "18,50 €"],
  ["Frische Pasta des Tages", "Gemüse, Olivenöl und Parmesan", "16,50 €"],
  ["Sonntagsbraten", "Beilage nach Saison", "23,90 €"],
  ["Pilzrahmgeschnetzeltes", "Hausgemachte Spätzle", "17,90 €"]
];

export function getDefaultSpecial(day: string): DailySpecial {
  const index = new Date(`${day}T12:00:00`).getDay();
  const [title, description, price] = demoDailySpecials[index];
  return { title, description, price, validOn: day };
}

