import { notFound } from "next/navigation";
import { getHotel } from "@/lib/hotels";
import { hotelMetadata } from "@/lib/hotel-seo";
import { KronePage } from "@/components/KroneSite";
import { HotelPageContext } from "@/components/HotelPageContext";
type Props={params:Promise<{hotelSlug:string}>};
export async function generateMetadata({params}:Props){return hotelMetadata((await params).hotelSlug,"seminare");}
export default async function Page({params}:Props){const hotel=getHotel((await params).hotelSlug);if(hotel?.slug!=="krone-wiechs")notFound();return <><HotelPageContext hotel={hotel} section="seminare"/><KronePage hotel={hotel} section="seminare"/></>;}
