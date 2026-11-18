# 5 bağımsız domain · tek paylaşılan mühendislik altyapısı

**Kritik gereksinim:** Kullanıcıya görünen her otel kendi bağımsız alan adına sahiptir. Google için 5 ayrı index/canonical/site graph vardır. Ortak `/hotels/otel-1/...` path'i kamu site mimarisi **değildir**; Next.js iç yönlendirme hedefidir.

## Yerel örnek

| Yerel host | İç Next.js rewrite | Görünen URL |
|---|---|---|
| landhotel-tanne.localhost:3000 | `/hotels/landhotel-tanne` | `/` |
| landhotel-tanne.localhost:3000 | `/hotels/landhotel-tanne/zimmer` | `/zimmer` |
| hotel-am-see.localhost:3000 | `/hotels/hotel-am-see/restaurant` | `/restaurant` |
| waldhof-retreat.localhost:3000 | `/hotels/waldhof-retreat/speisekarte` | `/speisekarte` |

Next.js 16 `src/proxy.ts` gelen `Host` bilgisine göre içeriği yönlendirir. Host tanınmıyorsa sadece **geliştirici seçme paneli** görünür. Tarayıcı adresindeki domain/path korunur. Otel public menüsünde diğer otelin site içeriği **gösterilmez**.

## Önerilen üretim topolojisi

- **Monorepo / tek bileşen kütüphanesi**, per-domain routing, ayrı build/release opsiyonu ve merkezi çok kiracılı CMS.
- Otel bazında zorunlu `hotel_id`: içerik, medya, müşteri, CRM, fiyat, restoran, menü ve organizasyon verilerinin değişmez sınırı.
- İstenirse **5 bağımsız deployment** aynı koddan üretilebilir; arıza izolasyonu ve farklı yayın ritimleri sağlar. Ortak uygulamada tek arıza potansiyel olarak beş oteli etkiler.
- CMS her tenant için farklı yayın kontrolüne sahip olmalıdır; bir otelin `draft` içeriği başka otelin domainine çıkmamalı.
- Login → yetki → tenant scope hem API hem veritabanında doğrulanmalı; sadece frontend gizleme yeterli değil.
- Medya yolu: otel bazında klasör/bucket namespace; yanlış otel görseli ve alt metin karışması engellenmeli.

## DNS/SSL/SEO ayrıcalıkları

Beş gerçek domainin her birinin ayrı TLS sertifikası, Search Console Domain property, SEO kanoniği, `robots.txt`, sitemap, Hreflang (gerçek dil versiyonu varsa), logo, favicon, Organization/Hotel entity id ve analiz mülkü/segmenti olacaktır. Grupla ilişkili oldukları bilinse bile birbirleri adına sahte `sameAs` veya `parentOrganization` kurulmaz.

## Yerel adres uyarısı

`.localhost` alt alanları demo içindir. Kullanıcı gerçek 5 domaini daha sonra verir. `NEXT_PUBLIC_HOTEL_ORIGIN_*` değişkenleri onaylı domainlerle doldurulursa `getHotelByHostname` onları tanıyacak şekilde yapılandırılmıştır; gerçek deploy için proxy/domain, sitemap/robots ve önbellek bütünlüğü ayrıca test edilmelidir.
