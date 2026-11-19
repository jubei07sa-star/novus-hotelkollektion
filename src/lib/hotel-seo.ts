import type { Metadata } from "next";
import { krone, kronePhotos } from "./krone";
import { getHotel, hotelHomeUrl, type Hotel } from "./hotels";

export type HotelSection="home"|"zimmer"|"restaurant"|"speisekarte"|"hochzeiten"|"kontakt"|"buchen"|"galerie"|"faq"|"fruehstueck-brunch"|"wellness"|"seminare";
export const sectionNames:Record<HotelSection,string>={home:"Startseite",zimmer:"Zimmer & Suiten",restaurant:"Restaurant",speisekarte:"Speisekarte",hochzeiten:"Feiern & Anlässe",kontakt:"Kontakt & Anreise",buchen:"Besuch planen",galerie:"Bildergalerie",faq:"Fragen & Antworten","fruehstueck-brunch":"Frühstück & Brunch",wellness:"Wellness & Hallenbad",seminare:"Seminare & Tagungen"};
type Entry=[string,string];
const copy:Record<string,Partial<Record<HotelSection,Entry>>>={
  "krone-wiechs":{
    home:["Hotel Restaurant Krone in Wiechs | Ein Stück Schwarzwald","Die Krone in Schopfheim-Wiechs: Entdecken Sie Zimmer, Restaurant und Wellness im Südschwarzwald. Ein neues Kapitel mit Caner Cavdar entsteht."],
    zimmer:["Zimmer & Landhaus Brunhilde | Krone Schopfheim-Wiechs","Einzelzimmer, Doppelzimmer und Ferienwohnung: Lernen Sie die Wohnbereiche der Krone und das Landhaus Brunhilde in Schopfheim-Wiechs kennen."],
    restaurant:["Restaurant & Terrasse in Wiechs | Hotel Krone","Ein gemeinsamer Tisch mit Blick ins Grüne: Entdecken Sie Panoramaraum und Terrasse der Krone. Das neue Restaurantangebot folgt zum Betriebsstart."],
    speisekarte:["Die neue Speisekarte entsteht | Restaurant Krone Wiechs","Kulinarische Ideen für die Krone in Wiechs. Die verbindliche Karte mit Preisen und Allergeninformationen folgt zum Start des neuen Restaurantbetriebs."],
    wellness:["Wellness & Hallenbad in Wiechs | Hotel Krone","Einblicke in das Schwarzwald-Wellness-Haus der Krone: Saunen, Ruheräume, Hallenbad und Wellness-Loft. Neue Angebote werden zum Betriebsstart vorgestellt."],
    seminare:["Seminare & Tagungen in Schopfheim-Wiechs | Krone","Raum für neue Perspektiven: Entdecken Sie den hellen Tagungsraum der Krone in Wiechs und planen Sie erste Wünsche für Ihr Seminar im Südschwarzwald."],
    hochzeiten:["Hochzeit & Familienfeier in Wiechs | Hotel Krone","Panoramaraum, Terrasse und rustikales Ambiente: Entdecken Sie die Krone als Rahmen für besondere Anlässe. Planungen für den neuen Betrieb persönlich abstimmen."],
    kontakt:["Kontakt & Anreise | Krone Schopfheim-Wiechs","Ihr Weg zur Krone: Am Rain 6 in Schopfheim-Wiechs. Routenplanung und WhatsApp-Kontakt für Fragen zur neuen Betriebsphase mit Caner Cavdar."],
    buchen:["Ihren Aufenthalt in Wiechs planen | Hotel Krone","Zimmer, Restaurant, Wellness oder eine Feier in der Krone: Stellen Sie Ihre Wünsche unverbindlich zusammen. Buchbare Angebote folgen zum Betriebsstart."],
    galerie:["Bilder aus Hotel, Restaurant & Wellness | Krone Wiechs","Lernen Sie die Krone in Schopfheim-Wiechs kennen: Originalaufnahmen von Zimmern, Restaurant, Wellnesshaus, Hallenbad und Veranstaltungsräumen."]
  },
  "landhotel-tanne":{
    home:["Landhotel Tanne in Fischingen | Hotel & Restaurant bei Basel","Ihre Auszeit im Markgräflerland: Zimmer, badisch-türkische Küche, Gartenwirtschaft und Sonntagsbrunch im Landhotel Tanne in Fischingen bei Basel."],
    zimmer:["Zimmer in Fischingen bei Basel | Landhotel Tanne","Gut schlafen in der Tanne: Zimmer mit eigenem Bad, kostenfreie Parkplätze und Frühstück im Haus. Entdecken Sie Ihren Aufenthalt in Fischingen."],
    restaurant:["Restaurant in Fischingen | Tanne & Gartenwirtschaft","Zu Tisch in der Tanne: badische Spezialitäten, türkische Einflüsse und saisonale Ideen. Restaurant, Kaminzimmer und Gartenwirtschaft in Fischingen."],
    speisekarte:["Speisekarte & Tagesmenü | Restaurant Tanne Fischingen","Entdecken Sie die Tanne-Karte, saisonale Festmenüs und das Tagesmenü. Mit Zutaten, Allergenhinweisen und Informationen zum Restaurantbesuch."],
    hochzeiten:["Hochzeit & Familienfeier in Fischingen | Landhotel Tanne","Feiern Sie in der Tanne: Gartenempfang, Terrasse und festliches Essen im Markgräflerland. Räume, Menü und Übernachtungen persönlich mit uns planen."],
    kontakt:["Kontakt & Anreise nach Fischingen | Landhotel Tanne","So erreichen Sie das Landhotel Tanne: Dorfstraße 31 in Fischingen. Telefon, E-Mail, WhatsApp und Routenplanung für Ihren Besuch im Markgräflerland."],
    buchen:["Zimmer oder Tisch reservieren | Landhotel Tanne","Planen Sie Ihre Zeit in der Tanne: Zimmerverfügbarkeit im Hotelportal prüfen oder einen Tisch reservieren. Bei Fragen sind wir persönlich für Sie da."],
    galerie:["Zimmer, Restaurant & Garten in Bildern | Landhotel Tanne","Lernen Sie die Tanne in Fischingen kennen: echte Einblicke in Zimmer, Restaurant, Gartenwirtschaft und den Rahmen für Ihre Feier."],
    faq:["Häufige Fragen zu Ihrem Aufenthalt | Landhotel Tanne","Antworten zu Zimmern, Anreise, Parken, Restaurant und Sonntagsbrunch im Landhotel Tanne. Bereiten Sie Ihren Besuch in Fischingen entspannt vor."],
    "fruehstueck-brunch":["Sonntagsbrunch in Fischingen | Landhotel Tanne","Sonntags gemeinsam genießen: Brunch in der Tanne von 10 bis 12:30 Uhr auf Reservierung. Alle Informationen zu Buffet, Preisen und Hotelfrühstück."]
  },
  "hotel-adler":{
    home:["Hotel Adler in Weil am Rhein | Übernachten & Genießen","Willkommen im Adler in Weil am Rhein: 30 klimatisierte Gästezimmer, gemütliche Gaststube und Gartenwirtschaft. Ihr Haus im Dreiländereck bei Basel."],
    zimmer:["Klimatisierte Zimmer in Weil am Rhein | Hotel Adler","Eine gute Nacht im Dreiländereck: Entdecken Sie die 30 klimatisierten Gästezimmer im Adler. Aktuelle Angebote und Verfügbarkeit im Zimmerportal prüfen."],
    restaurant:["Restaurant Adler in Weil am Rhein | Gaststube & Garten","Gutbürgerlich genießen im Adler: Gaststube, Gartenwirtschaft und wechselnde Menüs in Weil am Rhein. Auch ohne Übernachtung herzlich willkommen."],
    speisekarte:["Speisekarten & saisonale Menüs | Restaurant Adler","Was darf es sein? Entdecken Sie die Speisekarten des Adler in Weil am Rhein, saisonale Angebote und Ideen für wechselnde Tagesgerichte."],
    hochzeiten:["Feiern im Adler & Spatzenkeller | Weil am Rhein","Hochzeit, Geburtstag oder Betriebsfeier in Weil am Rhein: Lernen Sie Adler und Spatzenkeller kennen und stimmen Sie Ihre Feier persönlich mit uns ab."],
    kontakt:["Kontakt & Anreise | Hotel Adler Weil am Rhein","Ihr Weg zum Adler in Weil am Rhein: Hauptstraße 139, Telefon, E-Mail und Routenplanung. Fragen zu Zimmern, Restaurant oder einer Feier? Sprechen Sie uns an."],
    buchen:["Zimmer & Tisch reservieren | Hotel Adler Weil am Rhein","Ein Zimmer für Ihre Reise oder ein Tisch für einen guten Abend: Öffnen Sie die offiziellen Reservierungsportale des Hotel & Restaurant Adler."],
    galerie:["Bilder aus Hotel & Restaurant | Adler Weil am Rhein","Einblicke in den Adler: Entdecken Sie klimatisierte Gästezimmer, Gaststube und das Ambiente des Hauses in Weil am Rhein in unserer Bildergalerie."]
  },
  "goldenen-wagen":{
    home:["Hotel zum Goldenen Wagen in Maulburg | Willkommen","Ankommen und sich willkommen fühlen: Entdecken Sie gemütliche Zimmer und persönliche Gastfreundschaft im Hotel zum Goldenen Wagen in Maulburg."],
    zimmer:["Zimmer in Maulburg anfragen | Hotel zum Goldenen Wagen","Ein Rückzugsort für Ihre Reise: Sehen Sie die Zimmer des Goldenen Wagens in Maulburg und fragen Sie Ausstattung, Frühstück und aktuelle Preise direkt an."],
    restaurant:["Frühstück & Restaurant in Maulburg | Goldener Wagen","Zeit für einen gemeinsamen Tisch im Goldenen Wagen. Erfragen Sie aktuelle Frühstücksangebote, Restaurantzeiten und Tischmöglichkeiten direkt beim Hotel."],
    speisekarte:["Speisekarte & Tagesmenü | Goldener Wagen","Informationen zur aktuellen Karte im Goldenen Wagen in Maulburg und Ideen für Tagesgerichte. Angebote, Preise und Allergene direkt beim Hotel erfragen."],
    hochzeiten:["Besondere Anlässe & Gästezimmer | Goldener Wagen Maulburg","Sie planen einen besonderen Anlass in Maulburg? Fragen Sie Möglichkeiten für Ihre Feier und Übernachtungen für Ihre Gäste im Goldenen Wagen an."],
    kontakt:["Kontakt & Anreise nach Maulburg | Goldener Wagen","So finden Sie den Goldenen Wagen: Hüsingerstraße 2–4 in Maulburg. Direkter Kontakt per Telefon, E-Mail und WhatsApp sowie Routenplanung zum Hotel."],
    buchen:["Zimmer oder Tisch anfragen | Hotel zum Goldenen Wagen","Ihr Aufenthalt beginnt mit einer Anfrage: Kontaktieren Sie den Goldenen Wagen zu Reisedaten, Zimmerwünschen oder einem Tisch im Restaurant."],
    galerie:["Zimmer & Hotel in Bildern | Goldener Wagen Maulburg","Lernen Sie den Goldenen Wagen in Maulburg kennen: Originalbilder der Zimmer, Aufenthaltsbereiche und besonderen Details des Hauses."]
  },
  "ochsen-binzen":{
    home:["Ochsen in Binzen | Ein neues Kapitel für Hotel & Restaurant","Ein vertrauter Ort im Markgräflerland: Entdecken Sie Zimmer, Restaurant und Terrasse des Ochsen in Binzen. Ein neues Kapitel unter Novus Global GmbH."],
    zimmer:["Zimmer & Ochsen-Suite in Binzen | Hotel Ochsen","25 Gästezimmer vom Einzelzimmer bis zur Ochsen-Suite: Entdecken Sie das Haus in Binzen. Informationen und Bilder für die Planung Ihres künftigen Aufenthalts."],
    restaurant:["Restaurant Ochsen in Binzen | Vorfreude auf Genuss","Ein gemütlicher Tisch in Binzen: Lernen Sie Restaurant und Terrasse des Ochsen kennen. Die neue Speisekarte und Restaurantzeiten werden noch bekannt gegeben."],
    speisekarte:["Neue Speisekarte in Vorbereitung | Restaurant Ochsen Binzen","Vorfreude auf die neue Ochsen-Karte: Entdecken Sie die Menüideen für Binzen. Tagesgerichte sind Beispiele; verbindliche Angebote folgen zum Betriebsstart."],
    hochzeiten:["Feiern & besondere Anlässe in Binzen | Ochsen","Gemeinsam etwas Schönes planen: Entdecken Sie das Ambiente im Ochsen in Binzen und stellen Sie erste Wünsche für Ihre Feier unverbindlich zusammen."],
    kontakt:["Kontakt & Anreise zum Ochsen | Binzen im Markgräflerland","Der Ochsen liegt an der Hauptstraße 42 in Binzen. Planen Sie Ihre Anreise und stellen Sie Fragen zum neuen Betrieb bequem über WhatsApp."],
    buchen:["Ihren Besuch im Ochsen Binzen planen | Ochsen","Zimmer, Restaurantbesuch oder Feier im Ochsen: Stellen Sie Ihre Wünsche unverbindlich zusammen. Der neue Buchungsservice folgt zum Betriebsstart."],
    galerie:["Bilder aus dem Ochsen | Hotel & Restaurant in Binzen","Ein Haus mit Charakter: Entdecken Sie Zimmer, Restaurant und das historische Wirtshausschild des Ochsen in Binzen auf Originalaufnahmen."]
  }
};
export const hotelImageAlts:Record<string,{hero:string;room:string;restaurant:string;wedding:string}>={
  "krone-wiechs":{hero:kronePhotos[0].alt,room:kronePhotos[1].alt,restaurant:kronePhotos[7].alt,wedding:kronePhotos[10].alt},
  "landhotel-tanne":{hero:"Sonnenlicht zwischen Weinreben – Markgräflerland-Motiv der Tanne",room:"Doppelbett und Sitzbereich in einem Zimmer des Landhotels Tanne",restaurant:"Gemeinsames Essen im Restaurant Tanne in Fischingen",wedding:"Festlich gedeckter Tisch mit Blumen und Kerzen in der Tanne"},
  "hotel-adler":{hero:"Außenansicht des Hotel & Restaurant Adler in Weil am Rhein",room:"Helles Zimmer mit Doppelbett und Etagenbett im Hotel Adler",restaurant:"Gedeckte Tische im Restaurant Adler",wedding:"Holzbalken und gedeckte Tische im Restaurant Adler"},
  "goldenen-wagen":{hero:"Abendliche Außenansicht des Hotels zum Goldenen Wagen in Maulburg",room:"Zwei Betten mit Leselampen im Goldenen Wagen",restaurant:"Luftaufnahme des Goldenen Wagens und seiner Umgebung in Maulburg",wedding:"Außenansicht des Goldenen Wagens am Abend"},
  "ochsen-binzen":{hero:"Terrasse und beleuchtete Fassade des Ochsen in Binzen am Abend",room:"Helles Doppelzimmer mit Holzmöbeln im Ochsen in Binzen",restaurant:"Restaurant Ochsen mit Holzbalken und roten Polsterstühlen",wedding:"Gedeckter Tisch im Restaurant Ochsen in Binzen"}
};
export const hotelLogos:Record<string,string>={"krone-wiechs":krone.logo,"landhotel-tanne":"/images/tanne/logo.png","hotel-adler":"/images/adler/logo-reference.png","goldenen-wagen":"/images/wagen/asset-01.jpeg","ochsen-binzen":"/images/ochsen/ochsen_binzen_L.png"};
export function getHotelSeo(hotel:Hotel,section:HotelSection="home"){
  const [title,description]=copy[hotel.slug]?.[section]||[`${sectionNames[section]} | ${hotel.name}`,hotel.description];
  const imageType=section==="zimmer"||section==="buchen"?"room":section==="restaurant"||section==="speisekarte"||section==="fruehstueck-brunch"?"restaurant":section==="hochzeiten"?"wedding":"hero";
  const kroneExtra=hotel.slug==="krone-wiechs"?(section==="wellness"?kronePhotos[11]:section==="seminare"?kronePhotos[15]:undefined):undefined;
  const image=kroneExtra?.image||(section==="fruehstueck-brunch"?"/images/tanne/brunch.webp":hotel[`${imageType}Image`]);
  const alt=kroneExtra?.alt||(section==="fruehstueck-brunch"?"Buffet zum Sonntagsbrunch im Landhotel Tanne":hotelImageAlts[hotel.slug][imageType]);
  return {title,description,image,alt,url:`${hotelHomeUrl(hotel.slug)}/${section==="home"?"":section+"/"}`};
}
export function hotelMetadata(slug:string,section:HotelSection="home"):Metadata{
  const hotel=getHotel(slug);if(!hotel)return {title:"Hotel nicht gefunden"};
  const {title,description,image,alt,url}=getHotelSeo(hotel,section);
  return {title:{absolute:title},description,alternates:{canonical:url},openGraph:{type:"website",locale:"de_DE",siteName:hotel.name,title,description,url,images:[{url:new URL(image,hotelHomeUrl(slug)).href,alt}]},twitter:{card:"summary_large_image",title,description,images:[{url:new URL(image,hotelHomeUrl(slug)).href,alt}]}};
}
