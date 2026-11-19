import { hotelMetadata } from "@/lib/hotel-seo";
import { getHotel } from "@/lib/hotels";
import { notFound } from "next/navigation";
import { ExternalReservations } from "@/components/ExternalReservations";
export async function generateMetadata({params}:{params:Promise<{hotelSlug:string}>}){return hotelMetadata((await params).hotelSlug,"buchen");}
export default async function Booking({params}:{params:Promise<{hotelSlug:string}>}){const hotel=getHotel((await params).hotelSlug);if(!hotel)notFound();return <ExternalReservations hotel={hotel}/>;}
