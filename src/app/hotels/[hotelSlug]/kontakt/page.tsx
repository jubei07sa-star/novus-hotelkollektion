import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HotelContactPage } from "@/components/HotelContactPage";
import { getHotel } from "@/lib/hotels";
import { hotelMetadata } from "@/lib/hotel-seo";

type Props = { params: Promise<{ hotelSlug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return hotelMetadata((await params).hotelSlug, "kontakt");
}
export default async function Contact({ params }: Props) {
  const hotel = getHotel((await params).hotelSlug);
  if (!hotel) notFound();
  return <HotelContactPage hotel={hotel}/>;
}
