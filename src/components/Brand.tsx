import { krone } from "@/lib/krone";
import Link from "next/link";
import Image from "next/image";
import type { Hotel } from "@/lib/hotels";
import { hotelPath } from "@/lib/hotels";

export function Brand({ hotel, light = false }: { hotel: Hotel; light?: boolean }) {
  if(hotel.slug==="krone-wiechs")return <Link className={`brand krone-brand ${light?"brand--light":""}`} href="/" aria-label={`${hotel.name} Startseite`}><Image src={krone.logo} alt="Hotel Restaurant Krone" width={150} height={150} unoptimized/></Link>;
  if(hotel.slug==="ochsen-binzen")return <Link className={`brand ochsen-brand ${light?"brand--light":""}`} href="/" aria-label={`${hotel.name} Startseite`}><Image src="/images/ochsen/ochsen_binzen_L.png" alt="Ochsen Hotel-Restaurant" width={400} height={180} unoptimized/></Link>;
  if(hotel.slug==="landhotel-tanne")return <Link className={`brand tanne-brand ${light?"brand--light":""}`} href="/" aria-label={`${hotel.name} Startseite`}><Image src="/images/tanne/logo.png" alt="Landhotel Tanne" width={150} height={49} unoptimized/></Link>;
  if(hotel.slug==="hotel-adler")return <Link className={`brand adler-brand ${light?"brand--light":""}`} href="/" aria-label={`${hotel.name} Startseite`}><Image src="/images/adler/logo-reference.png" alt="" width={105} height={99} unoptimized/><span className="brand-words"><strong>ADLER</strong><small>HOTEL & RESTAURANT</small></span></Link>;
  if(hotel.slug==="goldenen-wagen")return <Link className={`brand wagen-brand ${light?"brand--light":""}`} href="/" aria-label={`${hotel.name} Startseite`}><Image src="/images/wagen/asset-01.jpeg" alt="" width={192} height={192} unoptimized/><span className="brand-words"><strong>GOLDENER WAGEN</strong><small>HOTEL · MAULBURG</small></span></Link>;
  const primary = hotel.name.split(" ")[0];
  return (
    <Link className={`brand ${light ? "brand--light" : ""}`} href={hotelPath(hotel.slug)} aria-label={`${hotel.name} Startseite`}>
      <span className="brand-emblem" aria-hidden="true"><span>H</span><small>✧</small></span>
      <span className="brand-words"><strong>{primary.toUpperCase()}</strong><small>{hotel.type.toUpperCase()}</small></span>
    </Link>
  );
}
