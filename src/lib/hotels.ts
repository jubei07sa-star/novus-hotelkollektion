import { kronePhotos } from "./krone";
export type Room = {
  slug: string;
  name: string;
  description: string;
  image: string;
  area: string;
  occupancy: number;
  amenities: string[];
  priceFrom: number;
};

export type MenuDish = { title: string; description: string; price: string; tags?: string[] };
export type MenuSection = { title: string; items: MenuDish[] };
export type Hotel = {
  slug: string;
  name: string;
  eyebrow: string;
  tagline: string;
  subtitle: string;
  region: string;
  type: string;
  accent: string;
  dark: string;
  heroImage: string;
  restaurantImage: string;
  weddingImage: string;
  roomImage: string;
  description: string;
  featureLine: string;
  restaurantName: string;
  restaurantCopy: string;
  weddingCopy: string;
  rooms: Room[];
  menu: MenuSection[];
  isIllustrative: boolean;
  restaurantBookingUrl?: string;
  canonicalDomain?: string;
};

const sampleMenu: MenuSection[] = [
  {
    title: "Vorspeisen",
    items: [
      { title: "Saisonale Gemüsesuppe", description: "Kräuteröl · knuspriges Brot", price: "8,50 €", tags: ["Vegetarisch"] },
      { title: "Bunter Blattsalat", description: "Hausdressing · geröstete Kerne", price: "10,90 €", tags: ["Vegetarisch"] }
    ]
  },
  {
    title: "Hauptgerichte",
    items: [
      { title: "Geschmorte Rinderbäckchen", description: "Kartoffelpüree · Wurzelgemüse", price: "26,90 €" },
      { title: "Gebratenes Zanderfilet", description: "Rahmwirsing · Petersilienkartoffeln", price: "25,50 €" },
      { title: "Waldpilz-Risotto", description: "Parmesan · frische Kräuter", price: "19,90 €", tags: ["Vegetarisch"] }
    ]
  },
  {
    title: "Desserts",
    items: [
      { title: "Warmer Apfelcrumble", description: "Vanilleeis", price: "8,90 €" },
      { title: "Mousse au Chocolat", description: "Beerenkompott", price: "9,50 €" }
    ]
  }
];

export const hotels: Hotel[] = [
  {
    slug: "landhotel-tanne",
    name: "Landhotel & Restaurant Tanne",
    eyebrow: "FISCHINGEN · MARKGRÄFLERLAND",
    tagline: "Ankommen. Aufatmen. Genießen.",
    subtitle: "Landhotel, Restaurant und Gartenwirtschaft in Fischingen im Markgräflerland – nahe Basel, der Schweiz und dem Elsass.",
    region: "Fischingen · Markgräflerland",
    type: "Landhotel & Restaurant",
    accent: "#a48b67",
    dark: "#17322e",
    heroImage: "/images/tanne/vineyards.webp",
    restaurantImage: "/images/tanne/dining.webp",
    weddingImage: "/images/tanne/wedding.webp",
    roomImage: "/images/tanne/room.webp",
    description: "Landhotel und Restaurant in Fischingen im Markgräflerland. Entspannen, saisonal essen und gemeinsam feiern – nahe Basel und dem Elsass.",
    featureLine: "Zimmer · Restaurant · Gartenwirtschaft · Sonntagsbrunch",
    restaurantName: "Restaurant Tanne",
    restaurantCopy: "Saisonale Küche mit badischen Spezialitäten und türkischen Einflüssen. Genießen Sie im Restaurant, im Kaminzimmer oder in der Gartenwirtschaft.",
    weddingCopy: "Hochzeiten und Familienfeiern im Markgräflerland: Gartenempfang, freie Trauung auf der Terrasse und festliches Essen mit persönlicher Menüplanung.",
    rooms: [],
    menu: sampleMenu,
    isIllustrative: true,
    restaurantBookingUrl: "https://reservierung.gastroguide.de/Landhotel%20%26%20Restaurant%20Tanne/297462"
  },
  {
    slug: "hotel-adler",
    name: "Hotel & Restaurant Adler",
    eyebrow: "WEIL AM RHEIN · DREILÄNDERECK",
    tagline: "Gastfreundschaft mit Tradition.",
    subtitle: "Hotel, Restaurant und Feste im Dreiländereck – willkommen im Adler in Weil am Rhein.",
    region: "Weil am Rhein · Dreiländereck", type: "Hotel & Restaurant",
    accent: "#ae8a57", dark: "#4b2929",
    heroImage: "/images/optimized/adler-asset-07-d8e64031f281.webp", restaurantImage: "/images/optimized/adler-asset-10-ff3d5f8e8c84.webp",
    weddingImage: "/images/optimized/adler-asset-13-b375743d9366.webp", roomImage: "/images/optimized/adler-asset-09-d322b5677581.webp",
    description: "30 klimatisierte Gästezimmer, eine gemütliche Gaststube und Gartenwirtschaft in Weil am Rhein. Basel und das Elsass liegen in der Umgebung.",
    featureLine: "30 Gästezimmer · Restaurant · Spatzenkeller",
    restaurantName: "Restaurant Adler", restaurantCopy: "Gutbürgerliche Küche und wechselnde Menüs in der Gaststube und bei schönem Wetter im Hof.",
    weddingCopy: "Feiern im Gasthaus oder Spatzenkeller mit persönlich abgestimmtem Menü und Bewirtung.",
    restaurantBookingUrl: "https://reservierung.gastroguide.de/Hotel%20Restaurant%20Adler/294140",
    rooms: [], menu: [], isIllustrative: false
  },
  {
    slug: "goldenen-wagen", name: "Hotel zum Goldenen Wagen",
    eyebrow: "MAULBURG · HERZLICH WILLKOMMEN", tagline: "Einfach ankommen. Herzlich willkommen.",
    subtitle: "Gemütliche Zimmer und persönliche Gastfreundschaft im Hotel zum Goldenen Wagen in Maulburg.",
    region: "Maulburg", type: "Hotel & Restaurant", accent: "#b39653", dark: "#514329",
    heroImage: "/images/optimized/wagen-asset-04-e28f313683fc.webp", restaurantImage: "/images/optimized/wagen-asset-05-965658b2d730.webp",
    weddingImage: "/images/optimized/wagen-asset-04-e28f313683fc.webp", roomImage: "/images/optimized/wagen-asset-06-1aad6f3f913c.webp",
    description: "Ein Hotel in Maulburg mit gemütlichen Zimmern, familiärer Atmosphäre und persönlichem Service.",
    featureLine: "Zimmer · Frühstück · Persönliche Gastfreundschaft",
    restaurantName: "Goldener Wagen", restaurantCopy: "Frühstück und Restaurant im Goldenen Wagen. Aktuelle Angebote und Öffnungszeiten bitte direkt beim Hotel erfragen.",
    weddingCopy: "Besondere Anlässe und Übernachtungen für Ihre Gäste individuell mit dem Hotel planen.",
    rooms: [], menu: [], isIllustrative: false
  },
  {
    slug: "ochsen-binzen", name: "Ochsen Hotel & Restaurant",
    eyebrow: "BINZEN · MARKGRÄFLERLAND", tagline: "Ein vertrauter Ort. Ein neues Kapitel.",
    subtitle: "Zimmer, Restaurant und besondere Begegnungen in Binzen im Markgräflerland. Entdecken Sie das neue Kapitel im Ochsen.",
    region: "Binzen · Markgräflerland", type: "Hotel & Restaurant", accent: "#a17b48", dark: "#482f31",
    heroImage: "/images/ochsen/exterior.webp", restaurantImage: "/images/optimized/ochsen-martinfrick-1767-1-f1aadd97c5bb.webp",
    weddingImage: "/images/optimized/ochsen-martinfrick-1798-87e836af632e.webp", roomImage: "/images/optimized/ochsen-martinfrick-1758-1-e178d34e8089.webp",
    description: "Ein traditionsreiches Haus in Binzen mit 25 Gästezimmern, Restaurant und Terrasse im Markgräflerland.",
    featureLine: "25 Gästezimmer · Restaurant · Terrasse",
    restaurantName: "Restaurant Ochsen", restaurantCopy: "Warme Holztöne, gedeckte Tische und ein besonderer Rahmen für gemeinsame Genussmomente in Binzen.",
    weddingCopy: "Familienfeste und besondere Anlässe im Ochsen – mit Raum für persönliche Wünsche.",
    rooms: [], menu: [], isIllustrative: false
  },
  {
    slug:"krone-wiechs", name:"Hotel Restaurant Krone", eyebrow:"WIECHS · SÜDSCHWARZWALD", tagline:"Ein wenig Ruhe. Ein Stück Schwarzwald.",
    subtitle:"Zimmer, Restaurant und Wellness in Schopfheim-Wiechs. Ein neues Kapitel für die Krone im Südschwarzwald.",
    region:"Schopfheim-Wiechs · Südschwarzwald", type:"Hotel · Restaurant · Wellness", accent:"#a38b57", dark:"#384236",
    heroImage:kronePhotos[0].image, roomImage:kronePhotos[1].image, restaurantImage:kronePhotos[7].image, weddingImage:kronePhotos[10].image,
    description:"Die Krone in Schopfheim-Wiechs: Zimmer im Haupthaus und Landhaus Brunhilde, Restaurant, Wellnessbereich und Räume für besondere Anlässe.",
    featureLine:"Zimmer · Restaurant · Wellness · Seminare", restaurantName:"Restaurant Krone", restaurantCopy:"Panoramaraum und Terrasse mit Blick ins Grüne – ein Rahmen für gemeinsame Genussmomente im Südschwarzwald.",
    weddingCopy:"Besondere Anlässe im Panoramaraum oder in rustikalem Ambiente persönlich planen.", rooms:[], menu:[], isIllustrative:false
  },

];

export function getHotel(slug: string): Hotel | undefined {
  return hotels.find((hotel) => hotel.slug === slug);
}

/** Hotel-local URLs: each hotel is an independent website with its own domain. */
export function hotelPath(_slug: string, section = ""): string {
  return section ? `/${section.replace(/^\/+/, "")}` : "/";
}

/** Concrete domain mapping is DEMO ONLY until the operator supplies approved domains. */
export function hotelHomeUrl(slug: string): string {
  const mapped: Record<string, string | undefined> = {
    "landhotel-tanne": process.env.NEXT_PUBLIC_HOTEL_ORIGIN_TANNE,
    "hotel-adler": process.env.NEXT_PUBLIC_HOTEL_ORIGIN_ADLER,
    "goldenen-wagen": process.env.NEXT_PUBLIC_HOTEL_ORIGIN_WAGEN,
    "ochsen-binzen": process.env.NEXT_PUBLIC_HOTEL_ORIGIN_OCHSEN,
    "krone-wiechs": process.env.NEXT_PUBLIC_HOTEL_ORIGIN_KRONE
  };
  return (mapped[slug] || `http://${slug}.localhost:3000`).replace(/\/$/, "");
}

export function getHotelByHostname(rawHost: string): Hotel | undefined {
  const hostname = rawHost.trim().toLowerCase().split(":")[0];
  if(hostname === "hotel-am-see.localhost") return hotels.find(h=>h.slug==="hotel-adler");
  if(hostname === "waldhof-retreat.localhost") return hotels.find(h=>h.slug==="goldenen-wagen");
  if(hostname === "stadthaus-boutique.localhost") return hotels.find(h=>h.slug==="ochsen-binzen");
  return hotels.find((hotel) => {
    const configured = new URL(hotelHomeUrl(hotel.slug)).hostname.toLowerCase();
    return hostname === configured;
  });
}

export function euro(value: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

export function germanyDate(date: Date): string {
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "long", timeZone: "Europe/Berlin" }).format(date);
}

/** The collection lives on its own origin, outside the individual hotel domains. */
export const hotelCollectionUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "")}/#hotels`;

