import { NextRequest, NextResponse } from "next/server";
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { getHotel, getHotelByHostname } from "@/lib/hotels";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const root = path.join(process.cwd(), "data", "menu-pdfs");
const limit = 10 * 1024 * 1024;
function allowed(req: NextRequest, slug: string) {
  const host = (req.headers.get("host") || "").split(":")[0];
  const hotel = getHotelByHostname(host);
  return process.env.NODE_ENV !== "production" && (host === "localhost" || host === "127.0.0.1" || host.endsWith(".localhost")) && getHotel(slug) && (!hotel || hotel.slug === slug);
}
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("hotel") || "";
  if (!allowed(req, slug) && process.env.NEXT_PUBLIC_SHARED_PREVIEW === "true" && getHotel(slug)) {
    return req.nextUrl.searchParams.has("file") ? new NextResponse(null, {status:404}) : NextResponse.json({available:false}, {headers:{"Cache-Control":"no-store"}});
  }
  if (!allowed(req, slug)) return NextResponse.json({error:"Nicht verfügbar."}, {status:403});
  let pdf: Buffer;
  try { pdf = await readFile(path.join(root, slug + ".pdf")); }
  catch { return req.nextUrl.searchParams.has("file") ? new NextResponse(null,{status:404}) : NextResponse.json({available:false}); }
  if (!req.nextUrl.searchParams.has("file")) return NextResponse.json({available:true,name:"Speisekarte – "+getHotel(slug)!.name+".pdf",size:pdf.length}, {headers:{"Cache-Control":"no-store"}});
  return new NextResponse(new Uint8Array(pdf),{headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="speisekarte-${slug}.pdf"`,"Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Content-Security-Policy":"sandbox"}});
}
export async function POST(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("hotel") || "";
  if (!allowed(req,slug)) return NextResponse.json({error:"Nicht verfügbar."},{status:403});
  if (Number(req.headers.get("content-length")) > limit + 65536) return NextResponse.json({error:"Die PDF darf maximal 10 MB groß sein."},{status:413});
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File) || !file.name.toLowerCase().endsWith(".pdf") || (file.type && file.type !== "application/pdf") || file.size > limit || file.size < 8) return NextResponse.json({error:"Bitte eine PDF-Datei bis 10 MB auswählen."},{status:400});
    const data = Buffer.from(await file.arrayBuffer());
    if (data.subarray(0,5).toString() !== "%PDF-" || !data.subarray(-1024).toString().includes("%%EOF")) return NextResponse.json({error:"Diese Datei ist keine gültige PDF-Datei."},{status:400});
    await mkdir(root,{recursive:true});
    const temp = path.join(root,slug+"-"+randomUUID()+".tmp");
    await writeFile(temp,data);
    await rename(temp,path.join(root,slug+".pdf"));
    return NextResponse.json({ok:true});
  } catch { return NextResponse.json({error:"Die PDF konnte nicht gespeichert werden. Bitte erneut versuchen."},{status:500}); }
}
