import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const secrets=JSON.parse(await fs.readFile('work/runtime/test-secrets.json','utf8'));
const base='http://127.0.0.1:3300/api/index.php?endpoint=';
let cookie='',csrf='',checks=0;
async function call(endpoint,method='GET',body,token=true,origin=base){
 const headers={};if(cookie)headers.Cookie=cookie;if(token&&csrf)headers['X-CSRF-Token']=csrf;
 if(body&&!(body instanceof FormData)){headers['Content-Type']='application/json';body=JSON.stringify(body);}
 const r=await fetch(origin+endpoint,{method,headers,body});const next=r.headers.get('set-cookie');if(next)cookie=next.split(';')[0];return r;
}
async function status(promise,code){const r=await promise;assert.equal(r.status,code,await r.clone().text());checks++;return r;}
const menu={hotel:'landhotel-tanne',day:'2026-11-20',special:{dishes:[{title:'Testmenü Kürbisrisotto',description:'Nur lokaler Funktionstest',price:'19,90 €',diet:'vegetarian',allergens:['milk'],traces:['soy'],allergenConfirmed:true}]}};
await status(call('menu','PUT',menu),401);
let session=await (await status(call('session'),200)).json();csrf=session.csrf;
assert(session.testMode,'API tests may only run against the explicitly configured LOCAL mail sink.');
await status(call('login','POST',{email:'admin@example.com',password:secrets.admin},false),403);
await status(call('login','POST',{email:'admin@example.com',password:secrets.admin}),200);
session=await (await call('session')).json();csrf=session.csrf;assert(session.authenticated);
await status(call('menu','PUT',menu,false),403);
await status(call('menu','PUT',{...menu,day:'2026-02-30'}),400);
await status(call('menu','PUT',{...menu,special:{dishes:[{...menu.special.dishes[0],diet:'vegan'}]}}),400);
await status(call('menu','PUT',menu),200);
const stored=await (await status(call('menu&hotel=landhotel-tanne&day=2026-11-20'),200)).json();assert.equal(stored.special.dishes[0].title,menu.special.dishes[0].title);
await status(call('menu','PUT',{...menu,day:'2026-11-21'}),200);
await status(call('menu&hotel=hotel-adler&day=2026-11-20','GET',undefined,true,'http://127.0.0.1:3301/api/index.php?endpoint='),403);
await status(call('menu','PUT',menu,true,'http://127.0.0.1:3301/api/index.php?endpoint='),403);
const invalid=new FormData();invalid.append('file',new Blob(['<html>not a pdf</html>'],{type:'application/pdf'}),'menu.pdf');
await status(call('pdf&hotel=landhotel-tanne','POST',invalid),400);
const pdf='%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n';
const form=new FormData();form.append('file',new Blob([pdf],{type:'application/pdf'}),'menu.pdf');
await status(call('pdf&hotel=landhotel-tanne','POST',form),200);
const download=await status(call('pdf&hotel=landhotel-tanne&file=1'),200);assert.equal(await download.text(),pdf);assert.match(download.headers.get('content-disposition'),/attachment/);
await status(call('menu&hotel=landhotel-tanne&day=2026-11-21','DELETE'),200);
const empty=await (await call('menu&hotel=landhotel-tanne&day=2026-11-21')).json();assert(!empty.saved&&empty.special.dishes.length===0);
await status(call('logout','POST'),200);await status(call('menu','PUT',menu),401);
cookie='';csrf='';session=await (await call('session')).json();csrf=session.csrf;
const contact={hotel:'landhotel-tanne',name:'Local Test',email:'guest@example.com',phone:'',topic:'general',message:'Dies ist nur ein lokaler Test. Keine echte Anfrage.',website:''};
await status(call('contact','POST',contact,false),403);
await status(call('contact','POST',{...contact,email:'bad\r\nBcc: attacker@example.com'}),400);
await status(call('contact','POST',{...contact,website:'spam'}),400);
await status(call('contact','POST',contact),200);
await status(call('contact','POST',contact),200);
await status(call('contact','POST',contact),200);
await status(call('contact','POST',contact),429);
assert((await fs.readdir('work/runtime/storage/mail')).length>0);
console.log(`PASS: ${checks} API assertions: session/CSRF, authorization, tenant isolation, menu persistence/copy/delete, allergens, PDF upload/download, contact saved with LOCAL mail sink (no email sent).`);
