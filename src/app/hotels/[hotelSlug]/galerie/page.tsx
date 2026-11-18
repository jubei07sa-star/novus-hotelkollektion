import { KronePage } from "@/components/KroneSite";
import { hotelMetadata } from "@/lib/hotel-seo";
import { OchsenPage } from "@/components/OchsenSite";
import { WagenPage } from "@/components/WagenSite";
import { getHotel } from "@/lib/hotels";
import { AdlerGallery } from "@/components/AdlerSite";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TanneGalleryPage } from "@/components/TanneExtraPages";
type Props={params:Promise<{hotelSlug:string}>};
export async function generateMetadata({params}:{params:Promise<{hotelSlug:string}>}):Promise<Metadata>{return hotelMetadata((await params).hotelSlug,"galerie");}
export default async function Page({params}:Props){const h=getHotel((await params).hotelSlug);if(h?.slug==="krone-wiechs")return <KronePage section="galerie" hotel={h}/>;if(h?.slug==="ochsen-binzen")return <OchsenPage section="galerie" hotel={h}/>;if(h?.slug==="goldenen-wagen")return <WagenPage section="galerie" hotel={h}/>;if((await params).hotelSlug==="hotel-adler")return <AdlerGallery/>;if((await params).hotelSlug!=="landhotel-tanne")notFound();return <TanneGalleryPage/>;}
