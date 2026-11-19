import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=(p)=>readFileSync(path.join(root,p),"utf8");
const required=["package.json","src/proxy.ts","src/lib/hotels.ts","src/lib/daily-menu.ts","src/app/sitemap.ts","src/app/robots.ts","src/app/hotels/[hotelSlug]/layout.tsx","src/app/hotels/[hotelSlug]/zimmer/[roomSlug]/page.tsx","src/app/api/demo-availability/route.ts","src/app/api/demo-menu/route.ts","src/app/verwaltung/page.tsx","README.md"];
let failed=0;
function test(label,success){ console.log(`${success?"PASS":"FAIL"} ${label}`);if(!success)failed++;}
for(const file of required)test(`Dosya mevcut: ${file}`,existsSync(path.join(root,file)));
const hotels=read("src/lib/hotels.ts");
const slugs=["landhotel-tanne","hotel-adler","goldenen-wagen","ochsen-binzen","krone-wiechs"];
for(const slug of slugs)test(`5 otelden biri: ${slug}`,new RegExp(`slug:[ ]*"${slug}"`).test(hotels));
const proxy=read("src/proxy.ts"),sitemap=read("src/app/sitemap.ts"),layout=read("src/app/hotels/[hotelSlug]/layout.tsx"),rootLayout=read("src/app/layout.tsx");
test("URL tenant mapping ayrı host üzerinden",proxy.includes("getHotelByHostname")&&proxy.includes("NextResponse.rewrite"));
test("Otel site içi URL /zimmer yapısında",hotels.includes('section ? `/${section.replace('));
test("Cross hotel link explicit origin",hotels.includes("hotelHomeUrl"));
test("Sitemap hosta özel",sitemap.includes("getHotelByHostname")&&sitemap.includes("hotelHomeUrl")&&!sitemap.includes("hotels.flatMap"));
test("Otel canonical ayrı origin",layout.includes("hotelHomeUrl")&&layout.includes("metadataBase:new URL(domain)"));
test("Indexierung nur nach expliziter Freigabe",rootLayout.includes('process.env.NEXT_PUBLIC_INDEXABLE === "true"'));
test("Demo robots global disallow",read("src/app/robots.ts").includes('disallow:"/"'));
test("GastroGuide otel odası için kullanılmıyor",hotels.includes("reservierung.gastroguide.de")&&!read("src/components/BookingExperience.tsx").includes("gastroguide"));
test("Menu API development only",read("src/app/api/demo-menu/route.ts").includes('NODE_ENV!=="production"'));
test("Düğün formu veri göndermez",!read("src/components/WeddingInquiry.tsx").includes("fetch("));
test("Oda detail route var",read("src/app/hotels/[hotelSlug]/zimmer/[roomSlug]/page.tsx").includes("RoomDetail"));
test("Beş yerel URL README",slugs.every(s=>read("README.md").includes(`http://${s}.localhost:3000`)));
test("Kaynak dizini gizli secrets barındırmıyor",!existsSync(path.join(root,".env.local"))&&!existsSync(path.join(root,".env")));
console.log(`\nResult: ${failed===0?"PASS":"FAIL"} (${failed} failed)`);
process.exitCode=failed?1:0;
