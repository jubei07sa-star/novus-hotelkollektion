import { headers } from "next/headers";
import { getHotel, getHotelByHostname } from "./hotels";

// In ALL-INKL exports the brand is fixed at build time, never guessed in the browser.
export async function currentHotel() {
  if (process.env.STATIC_EXPORT_SITE) return getHotel(process.env.STATIC_EXPORT_SITE);
  return getHotelByHostname((await headers()).get("host") || "");
}
