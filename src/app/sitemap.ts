import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getHotelByHostname, hotelHomeUrl } from "@/lib/hotels";

/** Each hotel's domain gets only ITS OWN sitemap URLs. No network-wide index. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const hotel = getHotelByHostname(h.get("host") || "");
  if (!hotel) return [];
  const origin = hotelHomeUrl(hotel.slug);
  const routes = [...(hotel.slug==="krone-wiechs"?["wellness","seminare"]:[]),"", "zimmer", ...hotel.rooms.map(r => `zimmer/${r.slug}`), "restaurant", "speisekarte", "hochzeiten", "kontakt", "buchen", ...(["hotel-adler","goldenen-wagen","ochsen-binzen","krone-wiechs"].includes(hotel.slug)?["galerie","impressum","datenschutz","barrierefreiheit","rechtliche-hinweise"]:[]), ...(hotel.slug==="landhotel-tanne"?["galerie","fruehstueck-brunch","faq","impressum","datenschutz","barrierefreiheit","rechtliche-hinweise"]:[])];
  return routes.map((route) => ({url: `${origin}/${route}`, changeFrequency: route === "speisekarte" ? "daily" : "monthly", priority: route === "" ? 1 : .7 }));
}
