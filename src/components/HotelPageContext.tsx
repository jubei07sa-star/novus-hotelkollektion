import Link from "next/link";
import type { Hotel } from "@/lib/hotels";
import { hotelHomeUrl } from "@/lib/hotels";
import { getHotelSeo, sectionNames, type HotelSection } from "@/lib/hotel-seo";
export function HotelPageContext({hotel,section}:{hotel:Hotel;section:HotelSection}){
  const {title,description,image,alt,url}=getHotelSeo(hotel,section),origin=hotelHomeUrl(hotel.slug);
  const breadcrumbs={"@type":"BreadcrumbList","@id":url+"#breadcrumb",itemListElement:[{"@type":"ListItem",position:1,name:hotel.name,item:origin+"/"},...(section==="home"?[]:[{"@type":"ListItem",position:2,name:sectionNames[section],item:url}])]};
  const graph={"@context":"https://schema.org","@graph":[{"@type":section==="kontakt"?"ContactPage":section==="galerie"?"CollectionPage":"WebPage","@id":url+"#webpage",url,name:title,description,inLanguage:"de-DE",isPartOf:{"@id":origin+"/#website"},about:{"@id":origin+"/#hotel"},primaryImageOfPage:{"@id":url+"#primaryimage"},...(section==="home"?{}:{breadcrumb:{"@id":url+"#breadcrumb"}})},{"@type":"ImageObject","@id":url+"#primaryimage",contentUrl:new URL(image,origin).href,caption:alt,inLanguage:"de-DE"},...(section==="home"?[]:[breadcrumbs])]};
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(graph).replace(/</g,"\\u003c")}}/>{section!=="home"&&<nav className="container hotel-breadcrumbs" aria-label="Brotkrümelnavigation"><Link href="/">{hotel.name}</Link><span aria-hidden="true">/</span><span aria-current="page">{sectionNames[section]}</span></nav>}</>;
}
