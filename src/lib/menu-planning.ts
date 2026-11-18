import { validDishDetails, type DailyDish, type DailySpecial } from "./daily-menu";
import { menuDocument, parseMenuJson } from "./menu-json";

export type MenuDraft = { dishes: DailyDish[]; baseline: string; saved: boolean; planned?: boolean };
export type CopyTarget = { day: string; draft: MenuDraft };
export function isMenuDirty(draft?: MenuDraft) {
  return !!draft && (!!draft.planned || JSON.stringify(draft.dishes) !== draft.baseline);
}
export function draftFromMenu(data: { special: DailySpecial; saved: boolean }): MenuDraft {
  const dishes = data.special.dishes || [{ title: data.special.title, description: data.special.description, price: data.special.price }];
  return { dishes, baseline: JSON.stringify(dishes), saved: data.saved };
}
export function preparedDishes(hotel: string, day: string, dishes: DailyDish[]) {
  if (!dishes.length || dishes.length > 12) throw Error("Bitte 1 bis 12 Gerichte anlegen.");
  dishes.forEach((dish, index) => {
    const prefix = `Gericht ${index + 1}: `;
    if (!dish.title.trim() || dish.title.length > 100) throw Error(prefix + "Bitte einen Gerichtnamen mit höchstens 100 Zeichen eingeben.");
    if (!/^\d{1,4}(?:[.,]\d{1,2})?\s*€?$/.test(dish.price.trim())) throw Error(prefix + "Bitte einen gültigen Preis eingeben, zum Beispiel 19,90.");
    if (dish.description.length > 240) throw Error(prefix + "Die Beschreibung darf höchstens 240 Zeichen enthalten.");
    if (!validDishDetails(dish)) throw Error(prefix + "Bitte Details, Allergenangaben und Ernährungsweise prüfen. Bei bestätigten Gluten- oder Nussangaben die genaue Art ergänzen.");
  });
  return parseMenuJson(JSON.stringify(menuDocument(hotel, day, dishes)), hotel, day).dishes;
}
export function copyMenuDrafts(current: Record<string, MenuDraft>, hotel: string, sourceDay: string, dishes: DailyDish[], targets: CopyTarget[]) {
  const next = { ...current };
  for (const target of targets) {
    if (target.day === sourceDay) continue;
    next[hotel + ":" + target.day] = {
      ...target.draft,
      dishes: JSON.parse(JSON.stringify(dishes)) as DailyDish[],
      planned: true,
    };
  }
  return next;
}
export function weekDrafts(drafts: Record<string, MenuDraft>, hotel: string, days: string[]) {
  return days.filter(day => isMenuDirty(drafts[hotel + ":" + day])).map(day => ({ day, draft: drafts[hotel + ":" + day] }));
}
