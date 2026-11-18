import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { getHotel } from "@/lib/hotels";
import { type DailySpecial, getDefaultSpecial, validDishDetails } from "@/lib/daily-menu";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const location=path.join(process.cwd(),"data","demo-menus.json");
type MenuEntries=Record<string,DailySpecial>;
function localOnly(req:NextRequest){const host=(req.headers.get("host")||"").split(":")[0];return host==="localhost"||host.endsWith(".localhost")||host==="127.0.0.1";}
function validDate(date:string){return /^\d{4}-\d{2}-\d{2}$/.test(date)&&Number.isFinite(Date.parse(`${date}T00:00:00Z`))&&new Date(`${date}T00:00:00Z`).toISOString().slice(0,10)===date;}
function key(slug:string,day:string){return `${slug}:${day}`;}
async function load():Promise<MenuEntries>{try{const json=await readFile(location,"utf8");return JSON.parse(json) as MenuEntries;}catch{return {};}}
async function save(data:MenuEntries){await mkdir(path.dirname(location),{recursive:true});await writeFile(location,JSON.stringify(data,null,2)+"\n","utf8");}
function allowed(req:NextRequest){return localOnly(req)&&process.env.NODE_ENV!=="production";}
export async function GET(req:NextRequest){const sharedPreview=process.env.NEXT_PUBLIC_SHARED_PREVIEW==="true";if(!allowed(req)&&!sharedPreview)return NextResponse.json({error:"Local demo only"},{status:403});
 const slug=req.nextUrl.searchParams.get("hotel")||"",day=req.nextUrl.searchParams.get("day")||"";
 if(!getHotel(slug)||!validDate(day))return NextResponse.json({error:"Invalid hotel/date"},{status:400});
 if(!allowed(req))return NextResponse.json({special:getDefaultSpecial(day),saved:false,mode:"preview"},{headers:{"Cache-Control":"no-store"}});
 const entries=await load();return NextResponse.json({special:entries[key(slug,day)]||getDefaultSpecial(day),saved:!!entries[key(slug,day)],mode:"demo"},{headers:{"Cache-Control":"no-store"}});
}
export async function PUT(req:NextRequest){if(!allowed(req))return NextResponse.json({error:"Local demo only"},{status:403});
 let body:{hotel?:string;day?:string;special?:Partial<DailySpecial>};try{body=await req.json();}catch{return NextResponse.json({error:"Invalid JSON"},{status:400});}
 const slug=body.hotel||"",day=body.day||"",special=body.special;
 if(!getHotel(slug)||!validDate(day)||!special||typeof special.title!=="string"||!special.title.trim()||special.title.length>100||typeof special.description!=="string"||special.description.length>240||typeof special.price!=="string"||special.price.length>30)return NextResponse.json({error:"Invalid menu"},{status:400});
 const dishes=special.dishes;
 if(dishes!==undefined&&(!Array.isArray(dishes)||dishes.length<1||dishes.length>12||dishes.some(d=>!d||!validDishDetails(d)||typeof d.title!=="string"||!d.title.trim()||d.title.length>100||typeof d.description!=="string"||d.description.length>240||typeof d.price!=="string"||!/^\d{1,4}(?:[.,]\d{1,2})?\s*€?$/.test(d.price.trim()))))return NextResponse.json({error:"Bitte Gerichte und Preise prüfen."},{status:400});
 const entries=await load();entries[key(slug,day)]={title:special.title,description:special.description,price:special.price,validOn:day,...(dishes?{dishes}: {})};await save(entries);
 return NextResponse.json({ok:true,mode:"demo"},{headers:{"Cache-Control":"no-store"}});
}
export async function DELETE(req:NextRequest){if(!allowed(req))return NextResponse.json({error:"Local demo only"},{status:403});
 const slug=req.nextUrl.searchParams.get("hotel")||"",day=req.nextUrl.searchParams.get("day")||"";
 if(!getHotel(slug)||!validDate(day))return NextResponse.json({error:"Invalid hotel/date"},{status:400});
 const entries=await load();delete entries[key(slug,day)];await save(entries);return NextResponse.json({ok:true,mode:"demo"});
}
