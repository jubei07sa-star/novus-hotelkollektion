import { hotelMetadata } from "@/lib/hotel-seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TanneFaqPage } from "@/components/TanneExtraPages";
type Props={params:Promise<{hotelSlug:string}>};
export async function generateMetadata({params}:{params:Promise<{hotelSlug:string}>}):Promise<Metadata>{return hotelMetadata((await params).hotelSlug,"faq");}
export default async function Page({params}:Props){if((await params).hotelSlug!=="landhotel-tanne")notFound();return <TanneFaqPage/>;}
