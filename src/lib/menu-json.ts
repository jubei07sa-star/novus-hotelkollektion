import { ALLERGENS, COURSES, type DailyDish, validDishDetails } from "./daily-menu";

export const MENU_JSON_LIMIT = 256 * 1024;
export type MenuDocument = { version: 1; hotel: string; date: string; currency: "EUR"; dishes: DailyDish[] };
const fields = ["title","description","price","course","ingredients","origin","portion","pairing","diet","signature","allergens","traces","allergenDetail","allergenConfirmed"];
function record(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function fail(message: string): never { throw new Error(message); }
function onlyKeys(value: Record<string,unknown>, allowed: string[], context: string) {
  const unknown = Object.keys(value).find(key => !allowed.includes(key));
  if (unknown) fail(`${context}: unbekanntes Feld „${unknown}“. Bitte die Vorlage verwenden.`);
}
export function parseMenuJson(text: string, hotel: string, date: string): MenuDocument {
  if (new TextEncoder().encode(text).length > MENU_JSON_LIMIT) fail("Die JSON-Datei darf maximal 256 KB groß sein.");
  let value: unknown;
  try { value = JSON.parse(text.replace(/^\uFEFF/, "")); } catch { fail("Die Datei enthält kein gültiges JSON. Bitte Anführungszeichen und Kommas prüfen."); }
  if (!record(value)) fail("Das Menü muss ein JSON-Objekt sein. Bitte die Vorlage verwenden.");
  onlyKeys(value,["version","hotel","date","currency","dishes"],"Menü");
  if (value.version !== 1) fail("Nicht unterstützte Formatversion. Erwartet wird version: 1.");
  if (value.hotel !== hotel) fail(`Das Hotel in der Datei passt nicht zur Auswahl. Erwartet: ${hotel}. Bitte das passende Hotel auswählen.`);
  if (typeof value.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value.date) || !Number.isFinite(Date.parse(value.date+"T12:00:00Z")) || new Date(value.date+"T12:00:00Z").toISOString().slice(0,10) !== value.date) fail("date muss ein gültiges Datum im Format JJJJ-MM-TT sein.");
  if (value.date !== date) fail(`Das Datum in der Datei passt nicht zur Auswahl. Erwartet: ${date}. Bitte den passenden Tag auswählen.`);
  if (value.currency !== "EUR") fail("Als Währung ist nur currency: „EUR“ möglich.");
  if (!Array.isArray(value.dishes) || value.dishes.length < 1 || value.dishes.length > 12) fail("dishes muss zwischen 1 und 12 Gerichte enthalten.");
  const dishes = value.dishes.map((item:unknown,index:number):DailyDish => {
    const context=`Gericht ${index+1}`;
    if (!record(item)) fail(`${context}: ein Objekt mit title und price wird benötigt.`);
    onlyKeys(item,fields,context);
    if (typeof item.title !== "string" || !item.title.trim() || item.title.length > 100) fail(`${context}: title muss 1–100 Zeichen enthalten.`);
    if (item.description !== undefined && (typeof item.description !== "string" || item.description.length > 240)) fail(`${context}: description darf maximal 240 Zeichen enthalten.`);
    if (typeof item.price !== "string" || !/^\d{1,4}(?:[.,]\d{1,2})?\s*€?$/.test(item.price.trim())) fail(`${context}: price als Text eingeben, z. B. „19,90“. Maximal 9999,99 €.`);
    const dish = {...item, title:item.title.trim(),description:((item.description as string|undefined)||"").trim(),price:Number(item.price.replace("€","").trim().replace(",",".")).toFixed(2).replace(".",",")+" €"} as DailyDish;
    if (!validDishDetails(dish)) fail(`${context}: Details oder Allergene sind ungültig. Erlaubte Werte laut Formathilfe verwenden; „Enthält“ und „Spuren“ dürfen sich nicht überschneiden. Ernährungsweise prüfen und bei bestätigtem Gluten/Nüssen die genaue Art ergänzen.`);
    return dish;
  });
  return { version:1, hotel, date, currency:"EUR", dishes };
}
export function menuDocument(hotel:string,date:string,dishes:DailyDish[]):MenuDocument {return {version:1,hotel,date,currency:"EUR",dishes};}
export function menuTemplate(hotel:string,date:string):MenuDocument {
  return menuDocument(hotel,date,[{
    title:"Beispiel: Saisonales Risotto",description:"Beispielgericht – vor Verwendung an Ihre Rezeptur anpassen",price:"19,90",
    course:"Hauptgang",ingredients:"Beispielrezeptur: Reis, Gemüse, Butter, Parmesan, Sojasauce (mit Weizen)",origin:"",portion:"Eine Portion",pairing:"Apfelsaftschorle",
    diet:"vegetarian",signature:false,allergens:["milk","soy","gluten"],traces:[],allergenDetail:"Weizen; Angaben anhand der tatsächlichen Rezeptur prüfen.",allergenConfirmed:false
  }]);
}
export const menuFormat = {allergens:ALLERGENS,courses:COURSES};
