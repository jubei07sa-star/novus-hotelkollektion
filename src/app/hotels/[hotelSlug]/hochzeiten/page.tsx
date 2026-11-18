import { KronePage } from "@/components/KroneSite";
import { hotelMetadata } from "@/lib/hotel-seo";
import { OchsenPage } from "@/components/OchsenSite";
import { WagenPage } from "@/components/WagenSite";
import { AdlerWeddings } from "@/components/AdlerSite";
import type { Metadata } from "next";
import { TanneWeddings } from "@/components/TanneSite";
import { notFound } from "next/navigation";
import { Heart, Sparkles, Wine } from "lucide-react";
import { getHotel,hotelPath } from "@/lib/hotels";
import { DemoImage } from "@/components/DemoImage";
import { WeddingInquiry } from "@/components/WeddingInquiry";

type P={params:Promise<{hotelSlug:string}>};
export async function generateMetadata({params}:{params:Promise<{hotelSlug:string}>}):Promise<Metadata>{return hotelMetadata((await params).hotelSlug,"hochzeiten");}
export default async function Weddings({params}:P){const h=getHotel((await params).hotelSlug);if(!h)notFound();if(h?.slug==="krone-wiechs")return <KronePage section="hochzeiten" hotel={h}/>;if(h.slug==="ochsen-binzen")return <OchsenPage section="hochzeiten" hotel={h}/>;if(h.slug==="goldenen-wagen")return <WagenPage section="hochzeiten" hotel={h}/>;if(h.slug==="hotel-adler")return <AdlerWeddings/>;if(h.slug==="landhotel-tanne")return <TanneWeddings/>;return <main id="main-content" tabIndex={-1}><section className="subhero subhero--wedding"><div className="subhero-photo image-wrap"><DemoImage src={h.weddingImage} alt="Romantische Hochzeitsdekoration als Beispielmotiv" priority sizes="100vw"/></div><div className="subhero-shade"/><div className="container subhero-content"><span className="eyebrow eyebrow--light">HOCHZEITEN & BESONDERE ANLÄSSE</span><h1>Für immer beginnt hier.</h1><p>Feiern Sie Ihre Geschichte an einem besonderen Ort.</p></div></section><section className="section-pad"><div className="container wedding-intro"><span className="eyebrow eyebrow--dark">IHR TAG. IHR MOMENT.</span><h2>Ein Fest, das <em>zu Ihnen passt.</em></h2><p>{h.weddingCopy}</p></div><div className="container wedding-features"><div><Heart size={30}/><h3>Persönlich geplant</h3><p>Raum für Ihre Wünsche und Vorstellungen.</p></div><div><Wine size={30}/><h3>Gemeinsam genießen</h3><p>Kulinarische Angebote rund um Ihre Feier.</p></div><div><Sparkles size={30}/><h3>Besondere Atmosphäre</h3><p>Ein emotionaler Rahmen für bleibende Erinnerungen.</p></div></div></section><section className="wedding-inquiry-block"><div className="wedding-inquiry-photo image-wrap"><DemoImage src={h.weddingImage} alt="Beispielmotiv Hochzeitsfeier"/></div><div className="wedding-inquiry-content"><WeddingInquiry hotelName={h.name}/></div></section></main>;}
