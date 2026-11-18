import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getHotelByHostname } from "@/lib/hotels";

/** Each local hotel domain exposes its own brand name and theme. */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const h = await headers();
  const hotel = getHotelByHostname(h.get("host") || "");
  return {
    name: hotel ? `${hotel.name}` : "Hotelkollektion",
    short_name: hotel ? hotel.name.slice(0, 18) : "Hotelkollektion",
    description: hotel ? hotel.subtitle : "Fünf Hotels im Markgräflerland und Dreiländereck",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f5ef",
    theme_color: hotel?.dark || "#17322e"
  };
}
