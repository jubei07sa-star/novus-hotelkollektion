import { NextRequest, NextResponse } from "next/server";
import { getHotel, getHotelByHostname } from "@/lib/hotels";

export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  const params=request.nextUrl.searchParams;
  const hotel=getHotel(params.get("hotel")||"");
  const scoped=getHotelByHostname(request.headers.get("host")||"");
  if(scoped && hotel?.slug !== scoped.slug) return NextResponse.json({error:"Hotel mismatch"},{status:403});
  const arrival=params.get("arrival")||"";
  const departure=params.get("departure")||"";
  const guests=Number(params.get("guests")||2);
  if(!hotel||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(arrival)||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(departure)||!Number.isInteger(guests)||guests<1||guests>4){return NextResponse.json({error:"Invalid demo search"},{status:400});}
  const start=Date.parse(`${arrival}T12:00:00Z`),end=Date.parse(`${departure}T12:00:00Z`);
  if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start||(end-start)>30*86400000){return NextResponse.json({error:"Invalid date range"},{status:400});}
  const nights=Math.round((end-start)/86400000);
  const results=hotel.rooms.map((room,i)=>({roomSlug:room.slug, available:guests<=room.occupancy,quotePerNight:room.priceFrom+(i*0)}));
  return NextResponse.json({mode:"demo",hotel:hotel.slug,arrival,departure,nights,results,disclaimer:"Simulated availability only; no live inventory, booking or payment."},{headers:{"Cache-Control":"no-store"}});
}
