import type { Metadata } from "next";
import { headers } from "next/headers";
import { getHotelByHostname, hotelHomeUrl } from "@/lib/hotels";
import { HotelHeader } from "./HotelHeader";
import { HotelFooter } from "./HotelFooter";
import { LegalContent, legalTitles, type LegalKind } from "./LegalContent";
import { LegalFooterLinks } from "./LegalFooterLinks";
import { HotelJsonLd } from "./HotelJsonLd";
import { hotelImageAlts } from "@/lib/hotel-seo";
const descriptions:Record<LegalKind,string>={impressum:"Anbieter, Unternehmensanschrift, Kontakt und Registerangaben der Novus Global GmbH.",datenschutz:"Informationen zu Verantwortlichem, lokalem Speicher, Kontaktwegen, externen Diensten und Ihren Datenschutzrechten.",barrierefreiheit:"Informationen zur Bedienbarkeit, bekannten Grenzen und Kontaktmöglichkeiten bei Barrieren.","rechtliche-hinweise":"Informationen zu Anfragen, Reservierungen, Preisen, Stornierung und Allergenangaben auf dieser Website."};
export async function legalMetadata(kind:LegalKind):Promise<Metadata>{
  const hotel=getHotelByHostname((await headers()).get("host")||"");
  const origin=hotel?hotelHomeUrl(hotel.slug):process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000";
  const title=`${legalTitles[kind]} | ${hotel?.name||"Hotelkollektion"}`,description=`${hotel?.name||"Hotelkollektion"}: ${descriptions[kind]}`,url=`${origin}/${kind}`;
  const image=hotel?{url:new URL(hotel.heroImage,origin).href,alt:hotelImageAlts[hotel.slug].hero}:undefined;
  return {title:{absolute:title},description,alternates:{canonical:url},openGraph:{title,description,url,locale:"de_DE",type:"website",images:image?[image]:[]},twitter:{card:"summary",title,description}};
}
export async function LegalPage({kind}:{kind:LegalKind}){
  const hotel=getHotelByHostname((await headers()).get("host")||"");
  const origin=hotel?hotelHomeUrl(hotel.slug):process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000",url=`${origin}/${kind}`;
  const data={"@context":"https://schema.org","@type":"WebPage","@id":url+"#webpage",url,name:`${legalTitles[kind]} | ${hotel?.name||"Hotelkollektion"}`,description:descriptions[kind],inLanguage:"de-DE",...(hotel?{isPartOf:{"@id":origin+"/#website"}}:{})};
  return <div className="hotel-shell">{hotel&&<><HotelJsonLd hotel={hotel}/><HotelHeader hotel={hotel}/></>}<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,"\\u003c")}}/><LegalContent hotel={hotel} kind={kind}/>{hotel?<HotelFooter hotel={hotel}/>:<LegalFooterLinks/>}</div>;
}
