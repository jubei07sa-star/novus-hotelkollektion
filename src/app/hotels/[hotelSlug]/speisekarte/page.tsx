import { KronePage } from "@/components/KroneSite";
import { hotelMetadata } from "@/lib/hotel-seo";
import { OchsenPage } from "@/components/OchsenSite";
import { WagenPage } from "@/components/WagenSite";
import { AdlerMenu } from "@/components/AdlerSite";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHotel, hotelPath } from "@/lib/hotels";
import { MenuExperience } from "@/components/MenuExperience";

type P={params:Promise<{hotelSlug:string}>};
export async function generateMetadata({params}:{params:Promise<{hotelSlug:string}>}):Promise<Metadata>{return hotelMetadata((await params).hotelSlug,"speisekarte");}
export default async function MenuPage({params}:P){const h=getHotel((await params).hotelSlug);if(!h)notFound();if(h?.slug==="krone-wiechs")return <KronePage section="speisekarte" hotel={h}/>;if(h.slug==="ochsen-binzen")return <OchsenPage section="speisekarte" hotel={h}/>;if(h.slug==="goldenen-wagen")return <WagenPage section="speisekarte" hotel={h}/>;if(h.slug==="hotel-adler")return <AdlerMenu hotel={h}/>;return <main id="main-content" tabIndex={-1} className={h.slug==="landhotel-tanne"?"inner-page tanne-menu-page":"inner-page"}><section className="page-heading container"><span className="eyebrow eyebrow--dark">FRISCH AUF DEN TISCH</span><h1>Speisekarte & Tagesmenü</h1><p>Was darf es heute sein? Entdecken Sie die Karte des Restaurants Tanne in Fischingen, festliche Menüs und Ideen für Ihren nächsten Restaurantbesuch.</p></section><section className="container section-pad-top"><MenuExperience hotel={h}/></section></main>;}

