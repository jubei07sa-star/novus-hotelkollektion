import { tanne } from "./tanne";
import { adler, adlerPhotos } from "./adler";
import { wagen, wagenPhotos } from "./wagen";
import { ochsen, ochsenPhotos } from "./ochsen";
import { krone, kronePhotos } from "./krone";

export type HotelContact = {
  street: string; city: string; maps: string; email?: string; phone?: string; tel?: string;
  heading: string; intro: string; image: string; alt: string; arrival: string; tips: string[];
  hours: [string, string][]; upcoming?: boolean;
};
export const hotelContacts: Record<string, HotelContact> = {
  "landhotel-tanne": {
    street: tanne.street, city: tanne.city, maps: tanne.directions, email: tanne.email, phone: tanne.phone, tel: tanne.tel,
    heading: "Ihre Auszeit beginnt mit einem Gespräch.",
    intro: "Ein Zimmer zwischen den Reben, ein gemeinsamer Tisch oder ein Fest mit Ihren Liebsten: Erzählen Sie uns, was Sie in der Tanne vorhaben.",
    image: "/images/tanne/garden.webp", alt: "Gartenwirtschaft des Landhotels Tanne in Fischingen",
    arrival: "Unser Landhotel liegt in Fischingen im Markgräflerland. Über die B3 oder die A5, Ausfahrten Efringen-Kirchen und Eimeldingen, finden Sie zu uns.",
    tips: ["Kostenfreie Parkplätze direkt am Hotel", "Bahnhof Eimeldingen · ca. 3 km", "EuroAirport Basel Mulhouse Freiburg · ca. 15 km"],
    hours: [["Abendküche · Montag–Sonntag", "17:00–21:30 Uhr"], ["Samstagmittag", "Auf Anfrage"], ["Sonntagmittag", "11:30–14:00 Uhr"], ["Sonntagsbrunch · mit Reservierung", "10:00–12:30 Uhr"]],
  },
  "hotel-adler": {
    street: adler.street, city: adler.city, maps: adler.maps, email: adler.email, phone: adler.phone, tel: adler.tel,
    heading: "Ein offenes Ohr. Ein herzliches Willkommen.",
    intro: "Ob Übernachtung in Weil am Rhein, ein Abend in unserer Gaststube oder Ihre nächste Feier – wir freuen uns auf Ihre Fragen und Wünsche.",
    image: adlerPhotos[0].image, alt: adlerPhotos[0].alt,
    arrival: "Der Adler empfängt Sie in Weil am Rhein im Dreiländereck. Basel, das Elsass und das Markgräflerland liegen in der Umgebung.",
    tips: ["Hauptstraße 139 · Weil am Rhein", "Öffentliche Verkehrsmittel nur wenige Gehminuten entfernt", "Für Fragen zur Anreise rufen Sie uns gerne an."],
    hours: [["Mittagstisch · täglich", "11:30–14:00 Uhr"], ["Abendküche · täglich", "17:00–21:30 Uhr"]],
  },
  "goldenen-wagen": {
    street: wagen.street, city: wagen.city, maps: wagen.maps, email: wagen.email, phone: wagen.phone, tel: wagen.tel,
    heading: "Persönlich gefragt. Herzlich willkommen.",
    intro: "Sie planen eine Reise nach Maulburg oder möchten gemeinsam genießen? Teilen Sie uns Ihre Wünsche mit – wir helfen Ihnen gerne bei der Planung.",
    image: wagenPhotos[0].image, alt: wagenPhotos[0].alt,
    arrival: "Ihr Ziel ist der Goldene Wagen in Maulburg. Öffnen Sie den Hotelstandort für eine Route ab Ihrem Ausgangspunkt.",
    tips: ["Hüsingerstr. 2–4 · Maulburg", "Anreise und besondere Zimmerwünsche gerne persönlich abstimmen."],
    hours: [["Restaurant & Tischanfragen", "Aktuelle Zeiten bitte telefonisch oder per E-Mail erfragen."]],
  },
  "ochsen-binzen": {
    street: ochsen.street, city: ochsen.city, maps: ochsen.maps, upcoming: true,
    heading: "Gute Pläne beginnen mit einem Hallo.",
    intro: "Ein vertrauter Ort in Binzen, ein neues Kapitel: Teilen Sie uns Ihre Ideen für einen Aufenthalt, einen Restaurantbesuch oder einen besonderen Anlass mit.",
    image: ochsenPhotos[0].image, alt: ochsenPhotos[0].alt,
    arrival: "Der Ochsen liegt an der Hauptstraße in Binzen, im Markgräflerland zwischen Deutschland, Frankreich und der Schweiz.",
    tips: ["Hauptstraße 42 · Binzen", "Fragen zum neuen Betrieb beantworten wir bereits über WhatsApp."],
    hours: [["Ein neues Kapitel", "Starttermin und Restaurantzeiten folgen zum Betriebsstart."]],
  },
  "krone-wiechs": {
    street: krone.street, city: krone.city, maps: krone.maps, upcoming: true,
    heading: "Wir freuen uns auf Ihre Pläne.",
    intro: "Eine Auszeit im Südschwarzwald, entspannte Stunden oder ein gemeinsamer Anlass: Erzählen Sie uns, was Sie sich für die künftige Krone wünschen.",
    image: kronePhotos[0].image, alt: kronePhotos[0].alt,
    arrival: "Die Krone liegt am Rain in Schopfheim-Wiechs. Entdecken Sie den Hotelstandort und planen Sie Ihren Weg in den Südschwarzwald.",
    tips: ["Am Rain 6 · Schopfheim-Wiechs", "Caner Cavdar bereitet die nächste Betriebsphase vor.", "Die eigenen Kontakt- und Buchungswege folgen zum Start."],
    hours: [["Vorfreude auf den Neustart", "Öffnungszeiten und verbindliche Angebote folgen zum Betriebsstart."]],
  },
};
export function contactWhatsApp(name: string) {
  return "https://wa.me/4917621040296?text=" + encodeURIComponent(`Guten Tag! Ich komme von der Kontaktseite von ${name} und habe eine Frage zu Ihrem Haus. Können Sie mir bitte weiterhelfen? Vielen Dank!`);
}
