import { NextRequest, NextResponse } from "next/server";
import { getHotelByHostname, hotelHomeUrl } from "@/lib/hotels";

/**
 * Five independent public websites. The local preview index lives only on localhost:3000.
 * http://landhotel-tanne.localhost:3000/zimmer is internally rendered by
 * /hotels/landhotel-tanne/zimmer without exposing a shared public URL structure.
 */
export function proxy(request: NextRequest) {
  const hotel = getHotelByHostname(request.headers.get("host") || "");
  if (!hotel) return NextResponse.next();
  const path = request.nextUrl.pathname;
  if(["hotel-am-see.localhost","waldhof-retreat.localhost","stadthaus-boutique.localhost"].includes((request.headers.get("host")||"").split(":")[0]))return NextResponse.redirect(new URL(path+request.nextUrl.search,hotelHomeUrl(hotel.slug)));
  if (path.startsWith("/_next/") || path.startsWith("/api/") || path.startsWith("/images/") || path.startsWith("/fonts/") ||
    path === "/robots.txt" || path === "/sitemap.xml" || path === "/manifest.webmanifest" ||
    path === "/favicon.ico" || path === "/impressum" || path === "/datenschutz" || path === "/barrierefreiheit" || path === "/rechtliche-hinweise") return NextResponse.next();
  if (path.startsWith("/hotels/") || path.startsWith("/verwaltung")) return NextResponse.redirect(new URL("/", request.url));
  const url = request.nextUrl.clone();
  url.pathname = `/hotels/${hotel.slug}${path === "/" ? "" : path}`;
  return NextResponse.rewrite(url);
}

export const config = { matcher: ["/((?!_next/static|_next/image).*)"] };
