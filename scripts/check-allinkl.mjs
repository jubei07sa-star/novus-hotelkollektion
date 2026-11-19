import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(process.cwd(),process.argv[2] || 'dist-allinkl');
const build=JSON.parse(await readFile(path.join(root,'BUILD.json'),'utf8'));
let count=0,links=0,assets=0;
for(const [site,origin] of Object.entries(build.origins)){
 if(build.sites&&!build.sites.includes(site))continue;
 const dir=path.join(root,site);const sitemap=await readFile(path.join(dir,'sitemap.xml'),'utf8');
 const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
 const titles=new Set();
 for(const url of urls){
  assert(url.startsWith(origin+'/'));const route=new URL(url).pathname;
  const html=await readFile(path.join(dir,decodeURI(route),'index.html'),'utf8');
  const title=html.match(/<title>(.*?)<\/title>/)?.[1];assert(title&&title.length>10,`${site}${route}: title`);assert(!titles.has(title),`${site}: duplicate title`);titles.add(title);
  assert(html.includes('<html lang="de"'),`${site}${route}: German lang`);
  assert(/<h1[ >]/.test(html),`${site}${route}: H1`);
  assert(/<meta name="description" content="[^"]{40,}"/.test(html),`${site}${route}: description`);
  const canonical=html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert(canonical&&canonical.replace(/\/$/,'')===url.replace(/\/$/,''),`${site}${route}: canonical ${canonical}`);
  assert(!/\/_next\/image\?/.test(html),`${site}${route}: runtime image dependency`);
  assert(build.production?!/content="noindex/.test(html):/content="noindex/.test(html),`${site}${route}: indexing`);
  for(const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g))JSON.parse(m[1]);
  for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
   const value=m[1].replaceAll('&amp;','&');if(/^(mailto:|tel:|data:)/.test(value))continue;
   let u;try{u=new URL(value,url);}catch{continue;}
   const other=Object.keys(build.origins).find(k=>build.origins[k]===u.origin);if(!other||(build.sites&&!build.sites.includes(other)))continue;
   if(u.pathname.startsWith('/api/'))continue;
   const destination=path.join(root,other,decodeURI(u.pathname));
   let exists=false;try{const info=await stat(destination);exists=info.isDirectory()?!!(await stat(path.join(destination,'index.html'))):info.isFile();}catch{}
   assert(exists,`${site}${route}: missing ${value}`);links++;
   if(/\.(woff2|webp|png|jpe?g|svg|css|js)$/.test(u.pathname))assets++;
  }
  count++;
 }
 const robots=await readFile(path.join(dir,'robots.txt'),'utf8');assert(build.production?robots.includes(`Sitemap: ${origin}/sitemap.xml`):robots.includes('Disallow: /'));
 if(site==='collection'){const admin=await readFile(path.join(dir,'verwaltung/index.html'),'utf8');assert(admin.includes('noindex'));}
}
console.log(`PASS: ${count} HTML pages; ${links} local references (${assets} assets); metadata, canonicals, sitemaps, German language and index policy.`);
