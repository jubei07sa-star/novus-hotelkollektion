import { krone } from "@/lib/krone";
import { hotelImageAlts } from "@/lib/hotel-seo";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getHotel, hotelHomeUrl } from "@/lib/hotels";
import { HotelHeader } from "@/components/HotelHeader";
import { HotelFooter } from "@/components/HotelFooter";
import { HotelJsonLd } from "@/components/HotelJsonLd";
import "@/components/tanne-site.css";
import { TanneExplore } from "@/components/TanneExtraPages";

type Props = { children: React.ReactNode; params: Promise<{hotelSlug: string}> };
export async function generateMetadata({ params }: {params: Promise<{hotelSlug: string}>}): Promise<Metadata> {
  const {hotelSlug}=await params; const hotel=getHotel(hotelSlug);
  if (!hotel) return {title:"Hotel nicht gefunden"};
  const domain = hotelHomeUrl(hotel.slug);
  return {metadataBase:new URL(domain),title:hotel.slug==="landhotel-tanne"?{default:hotel.name,template:"%s | Landhotel Tanne"}:hotel.name,description:hotel.subtitle,
    ...(hotel.slug==="krone-wiechs"?{icons:{icon:krone.logo}}:{}),
    ...(hotel.slug==="ochsen-binzen"?{icons:{icon:"/images/ochsen/ochsen_binzen_L.png"}}:{}),
    ...(hotel.slug==="goldenen-wagen"?{icons:{icon:"/images/wagen/asset-01.jpeg"}}:{}),
    ...(hotel.slug==="hotel-adler"?{icons:{icon:"/images/adler/asset-01.png"}}:{}),
    ...(hotel.slug==="landhotel-tanne"?{icons:{icon:"/images/tanne/icon.png",apple:"/images/tanne/icon.png"}}:{}),alternates:{canonical:domain+"/"},openGraph:{siteName:hotel.name,title:hotel.name,url:domain+"/",description:hotel.subtitle,images:[{url:hotel.heroImage,alt:hotelImageAlts[hotel.slug].hero}]} };
}
export default async function HotelLayout({ children, params }: Props) {
  const {hotelSlug}=await params;const hotel=getHotel(hotelSlug);if(!hotel)notFound();
  return <div className="hotel-shell" style={{"--accent":hotel.accent,"--forest":hotel.dark} as CSSProperties}>
    <HotelJsonLd hotel={hotel}/><HotelHeader hotel={hotel}/>{children}{hotel.slug==="landhotel-tanne"&&<TanneExplore/>}<HotelFooter hotel={hotel}/>
  </div>;
}
