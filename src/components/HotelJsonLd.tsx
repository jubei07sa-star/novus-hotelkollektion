import { krone } from "@/lib/krone";
import { ochsen } from "@/lib/ochsen";
import { wagen } from "@/lib/wagen";
import { adler } from "@/lib/adler";
import { tanne } from "@/lib/tanne";
import { hotelHomeUrl, type Hotel } from "@/lib/hotels";
import { hotelLogos } from "@/lib/hotel-seo";

/** Only verified hotel facts: no demo offers, invented ratings, star awards or opening hours. */
export function HotelJsonLd({hotel}:{hotel:Hotel}){
  const origin=hotelHomeUrl(hotel.slug);
  const isKrone=hotel.slug==="krone-wiechs";
  const isOchsen=hotel.slug==="ochsen-binzen";
  const info=hotel.slug==="hotel-adler"?adler:hotel.slug==="goldenen-wagen"?wagen:tanne;
  const address=isKrone?{streetAddress:krone.street,postalCode:"79650",addressLocality:"Schopfheim-Wiechs"}:isOchsen?{streetAddress:ochsen.street,postalCode:"79589",addressLocality:"Binzen"}:hotel.slug==="hotel-adler"?{streetAddress:adler.street,postalCode:"79576",addressLocality:"Weil am Rhein"}:hotel.slug==="goldenen-wagen"?{streetAddress:wagen.street,postalCode:"79689",addressLocality:"Maulburg"}:{streetAddress:tanne.street,postalCode:"79592",addressLocality:"Fischingen"};
  const contact={address:{"@type":"PostalAddress",...address,addressCountry:"DE"},...(!isOchsen&&!isKrone?{telephone:info.phone,email:info.email,sameAs:info.website}:{})};
  const map=isKrone?krone.maps:isOchsen?ochsen.maps:hotel.slug==="hotel-adler"?adler.maps:hotel.slug==="goldenen-wagen"?wagen.maps:tanne.directions;
  const logo=new URL(hotelLogos[hotel.slug],origin).href;
  const graph={"@context":"https://schema.org","@graph":[
    {"@type":"Organization","@id":origin+"/#operator",name:"Novus Global GmbH",vatID:"DE309495391",address:{"@type":"PostalAddress",streetAddress:"Dorfstraße 31",postalCode:"79592",addressLocality:"Fischingen",addressCountry:"DE"},contactPoint:{"@type":"ContactPoint",telephone:"+49 176 21040296",contactType:"customer service",availableLanguage:"de"}},
    {"@type":"Hotel","@id":origin+"/#hotel",name:hotel.name,url:origin+"/",description:hotel.description,...contact,hasMap:map,logo,image:[hotel.heroImage,hotel.roomImage].map(i=>new URL(i,origin).href),parentOrganization:{"@id":origin+"/#operator"},containsPlace:{"@id":origin+"/restaurant#restaurant"},...(hotel.slug==="hotel-adler"?{numberOfRooms:30}:isOchsen?{numberOfRooms:25}:{})},
    {"@type":"Restaurant","@id":origin+"/restaurant#restaurant",name:hotel.restaurantName,url:origin+"/restaurant",description:hotel.restaurantCopy,...contact,hasMap:map,image:new URL(hotel.restaurantImage,origin).href,logo,containedInPlace:{"@id":origin+"/#hotel"},parentOrganization:{"@id":origin+"/#operator"},...(["landhotel-tanne","hotel-adler"].includes(hotel.slug)?{hasMenu:origin+"/speisekarte"}:{})},
    {"@type":"WebSite","@id":origin+"/#website",name:hotel.name,url:origin+"/",inLanguage:"de-DE",publisher:{"@id":origin+"/#operator"},about:{"@id":origin+"/#hotel"}}
  ]};
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(graph).replace(/</g,"\\u003c")}}/>;
}
