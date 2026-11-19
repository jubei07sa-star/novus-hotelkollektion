import { cp, mkdir, readFile, writeFile, appendFile, rm, readdir, rename } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
const root = process.cwd();
const work = path.join(root, 'work', 'allinkl-build');
const release = process.env.ALLINKL_OUTPUT ? path.resolve(root,process.env.ALLINKL_OUTPUT) : path.join(root, 'dist-allinkl');
if(release!==path.join(root,'dist-allinkl')&&!release.startsWith(path.join(root,'work')+path.sep))throw Error('Output must be dist-allinkl or a dedicated directory under work');
const production = process.argv.includes('--production');
const selected = process.argv.find(v => v.startsWith('--site='))?.slice(7);
const source = JSON.parse(await readFile(path.resolve(root,process.env.ALLINKL_CONFIG || 'allinkl.sites.json'), 'utf8'));
const keys = Object.keys(source);
if (selected && !keys.includes(selected)) throw Error('Unknown site');
const origins = production ? source : Object.fromEntries(keys.map((key,i) => [key, `http://localhost:${3300+i}`]));
if (production) for (const origin of Object.values(origins)) {
  const url = new URL(origin);
  if (url.protocol !== 'https:' || /localhost|\.example$|\.invalid$/.test(url.hostname) || url.pathname !== '/') throw Error('Set all six approved HTTPS origins in allinkl.sites.json before a production build.');
}
async function remove(target) {
  const absolute = path.resolve(target);
  if (![work,release].some(base => absolute === base || absolute.startsWith(base + path.sep))) throw Error('Unsafe build cleanup path');
  await rm(absolute, {recursive:true,force:true});
}
await mkdir(work,{recursive:true}); await mkdir(release,{recursive:true});
const vars = ['NEXT_PUBLIC_SITE_URL','NEXT_PUBLIC_HOTEL_ORIGIN_TANNE','NEXT_PUBLIC_HOTEL_ORIGIN_ADLER','NEXT_PUBLIC_HOTEL_ORIGIN_WAGEN','NEXT_PUBLIC_HOTEL_ORIGIN_OCHSEN','NEXT_PUBLIC_HOTEL_ORIGIN_KRONE'];
const env = Object.fromEntries(keys.map((key,i)=>[vars[i],origins[key]]));
Object.assign(env,{NEXT_PUBLIC_BACKEND:'php',NEXT_PUBLIC_SHARED_PREVIEW:'false',NEXT_PUBLIC_INDEXABLE:String(production),NEXT_TELEMETRY_DISABLED:'1'});
async function wrapper(src,dest,slug) {
  const text = await readFile(src,'utf8');
  const importPath = '@/hotel-routes/' + path.relative(path.join(stage,'src','hotel-routes'),src).replaceAll('\\','/').replace(/\.tsx$/,'');
  const isLayout = path.basename(src)==='layout.tsx';
  const meta = text.includes('function generateMetadata');
  await mkdir(path.dirname(dest),{recursive:true});
  await writeFile(dest,`import Component${meta?', { generateMetadata as originalMetadata }':''} from ${JSON.stringify(importPath)};\nconst params=Promise.resolve({hotelSlug:${JSON.stringify(slug)}});\n${meta?'export async function generateMetadata(){return originalMetadata({params});}\n':''}export default function Page(${isLayout?'{children}:{children:React.ReactNode}':''}) {return <Component params={params}${isLayout?' children={children}':''}/>;}\n`);
}
let stage;
for (const site of keys.filter(key=>!selected||key===selected)) {
  stage = path.join(work,site); await remove(stage); await mkdir(stage,{recursive:true});
  await cp(path.join(root,'src'),path.join(stage,'src'),{recursive:true});
  await cp(path.join(root,'public'),path.join(stage,'public'),{recursive:true});
  for(const file of ['package.json','tsconfig.json','next-env.d.ts']) await cp(path.join(root,file),path.join(stage,file));
  // Staging is inside the checkout, so Node resolves the existing parent node_modules.
  await writeFile(path.join(stage,'next.config.ts'),`export default {output:'export',trailingSlash:true,images:{unoptimized:true},poweredByHeader:false,experimental:{cpus:2}};\n`);
  await remove(path.join(stage,'src','proxy.ts')); await remove(path.join(stage,'src','app','api'));
  await remove(path.join(stage,'src','app','robots.ts')); await remove(path.join(stage,'src','app','sitemap.ts'));
  await writeFile(path.join(stage,'src','app','manifest.ts'),(await readFile(path.join(stage,'src','app','manifest.ts'),'utf8'))+'\nexport const dynamic = "force-static";\n');
  const hotelRoutes=path.join(stage,'src','app','hotels','[hotelSlug]');
  await rename(hotelRoutes,path.join(stage,'src','hotel-routes'));
  await remove(path.join(stage,'src','app','hotels'));
  if(site!=='collection') {
    await remove(path.join(stage,'src','app','page.tsx'));
    await remove(path.join(stage,'src','app','verwaltung'));
    const group=path.join(stage,'src','app','(hotel)');
    const routes=path.join(stage,'src','hotel-routes');
    for(const filename of ['page.tsx','layout.tsx']) await wrapper(path.join(routes,filename),path.join(group,filename),site);
    for(const entry of await readdir(routes,{withFileTypes:true})) {
      if(!entry.isDirectory())continue;
      if(['wellness','seminare'].includes(entry.name)&&site!=='krone-wiechs')continue;
      if(['faq','fruehstueck-brunch'].includes(entry.name)&&site!=='landhotel-tanne')continue;
      for(const filename of ['page.tsx','layout.tsx']) {
        const src=path.join(routes,entry.name,filename);
        try{await readFile(src);}catch{continue;}
        await wrapper(src,path.join(group,entry.name,filename),site);
      }
    }
  }
  console.log(`Building ${site} (${production?'production':'preview'})`);
  await new Promise((resolve,reject)=>{
    const child=spawn(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'build','--webpack'],{cwd:stage,env:{...process.env,...env,STATIC_EXPORT_SITE:site},stdio:'inherit',windowsHide:true});
    child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(Error(`Build failed: ${site} (${code})`)));
  });
  const dest=path.join(release,site); await remove(dest);await cp(path.join(stage,'out'),dest,{recursive:true});
  const pages=[];
  async function scan(dir){for(const entry of await readdir(dir,{withFileTypes:true})){if(entry.name==='_next')continue;const file=path.join(dir,entry.name);if(entry.isDirectory())await scan(file);else if(entry.name==='index.html')pages.push('/'+path.relative(dest,path.dirname(file)).replaceAll('\\','/')+'/');}}
  await scan(dest);
  const routes=[...new Set(pages.map(v=>v.replaceAll('//','/')))].filter(v=>!v.startsWith('/verwaltung')&&!v.startsWith('/_not-found')&&v!=='/404/');
  await writeFile(path.join(dest,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route=>`<url><loc>${origins[site]}${route}</loc></url>`).join('')}</urlset>`);
  await writeFile(path.join(dest,'robots.txt'),production?`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /verwaltung/\nSitemap: ${origins[site]}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
  await mkdir(path.join(dest,'api'),{recursive:true});
  await cp(path.join(root,'server','public','index.php'),path.join(dest,'api','index.php'));
  await writeFile(path.join(dest,'api','site.php'),`<?php return ${JSON.stringify(site)};\n`);
  const host = new URL(origins[site]).host.replaceAll('.','\\.');
  await writeFile(path.join(dest,'.htaccess'),`Options -Indexes\nDirectoryIndex index.html\nErrorDocument 404 /404.html\n<IfModule mod_rewrite.c>\nRewriteEngine On\n${production?`RewriteCond %{HTTPS} !=on [OR]\nRewriteCond %{HTTP_HOST} !^${host}$ [NC]\nRewriteRule ^ ${origins[site]}%{REQUEST_URI} [R=301,L,NE]\n`:''}RewriteRule ^(?:private|work|src|node_modules)(?:/|$) - [F,L]\n</IfModule>\n<IfModule mod_headers.c>\nHeader always set X-Content-Type-Options "nosniff"\nHeader always set Referrer-Policy "strict-origin-when-cross-origin"\nHeader always set X-Frame-Options "SAMEORIGIN"\n${production?'':'Header always set X-Robots-Tag "noindex, nofollow"\n'}<FilesMatch "\\.html$">\nHeader set Cache-Control "public, max-age=0, must-revalidate"\n</FilesMatch>\n</IfModule>\n`);
  await writeFile(path.join(dest,'.user.ini'),'upload_max_filesize=10M\npost_max_size=12M\ndisplay_errors=Off\nlog_errors=On\n');
  await writeFile(path.join(dest,'_next','.htaccess'),'<IfModule mod_headers.c>\nHeader set Cache-Control "public, max-age=31536000, immutable"\n</IfModule>\n');
  await appendFile(path.join(dest,'.htaccess'),'<IfModule mod_deflate.c>\nAddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml\n</IfModule>\n');
  console.log(`${site}: ${routes.length} HTML pages exported`);
}
await cp(path.join(root,'server','private'),path.join(release,'private'),{recursive:true,filter:src=>!src.endsWith('config.php')});
await writeFile(path.join(release,'private','origins.json'),JSON.stringify(origins,null,2));
const sites=(await readdir(release)).filter(name=>keys.includes(name));
await writeFile(path.join(release,'BUILD.json'),JSON.stringify({production,builtAt:new Date().toISOString(),sites,origins},null,2));
console.log(`ALL-INKL package: ${release}. No deployment performed.`);
