import { KronePage } from "@/components/KroneSite";
import { hotelMetadata } from "@/lib/hotel-seo";
import { OchsenPage } from "@/components/OchsenSite";
import { WagenPage } from "@/components/WagenSite";
import { AdlerBooking } from "@/components/AdlerSite";
import type { Metadata } from "next";
import { TanneReservation } from "@/components/TanneSite";
import { notFound } from "next/navigation";
import { getHotel,hotelPath } from "@/lib/hotels";
import { BookingExperience } from "@/components/BookingExperience";

type P={params:Promise<{hotelSlug:string}>, searchParams:Promise<{anreise?:string;abreise?:string;gaeste?:string;anliegen?:string}>};
export async function generateMetadata({params}:{params:Promise<{hotelSlug:string}>}):Promise<Metadata>{return hotelMetadata((await params).hotelSlug,"buchen");}
export default async function Booking({params,searchParams}:P){const h=getHotel((await params).hotelSlug);if(!h)notFound();if(h.slug==="krone-wiechs"){const inquiry=(await searchParams).anliegen;const types:Record<string,string>={zimmer:"Zimmer",restaurant:"Restaurant",wellness:"Wellness",feier:"Feier",seminar:"Seminar"};return <KronePage section="buchen" hotel={h} initialInquiry={types[inquiry||""]||"Zimmer"}/>;}if(h.slug==="ochsen-binzen"){const inquiry=(await searchParams).anliegen;return <OchsenPage section="buchen" hotel={h} initialInquiry={inquiry==="restaurant"?"Restaurant":"Zimmer"}/>;}if(h.slug==="goldenen-wagen")return <WagenPage section="buchen" hotel={h}/>;if(h.slug==="hotel-adler")return <AdlerBooking/>;if(h.slug==="landhotel-tanne")return <TanneReservation/>;const s=await searchParams;return <main id="main-content" tabIndex={-1} className="inner-page"><section className="container section-pad"><BookingExperience hotel={h} initialArrival={s.anreise} initialDeparture={s.abreise} initialGuests={s.gaeste}/></section></main>;}
