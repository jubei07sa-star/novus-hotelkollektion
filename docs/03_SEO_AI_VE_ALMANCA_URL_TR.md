# SEO, arama motorları ve AI görünürlüğü

## URL planı (her domain için aynı iskelet, fakat ayrı markalar)

```
https://hotel-1.example/                         -> Otel ana sayfa
https://hotel-1.example/zimmer                   -> Odalar listesi
https://hotel-1.example/zimmer/zimmername        -> Her gerçek oda tipi
https://hotel-1.example/restaurant               -> Halka açık restoran
https://hotel-1.example/speisekarte              -> Kalıcı menü / güncel menü
https://hotel-1.example/hochzeiten               -> Düğün mekânı ve teklif
https://hotel-1.example/kontakt                  -> Gerçek iletişim
https://hotel-1.example/impressum                -> Hukuki bildirim
https://hotel-1.example/datenschutz              -> Gizlilik
```

İsimlendirmeler basit, Almanca ve anlamlı olmalıdır. Restoran için `tagesmenue` bağımsız sayfa gerekiyorsa sabit adres + tarihli geçerlilik kullanılır; her gün otomatik olarak onlarca eski URL indekslenmez. Oda detay slug'ı yalnızca oda tipi/kategori için kullanılır, stok ve tarih parametresi canonical içinde yer almaz. `utm_*` canonical değildir.

## SERP ve AI discovery ilkeleri

- Sadece schema eklemek Google sıralamasını veya AI yanıtlarında yer almayı **garanti etmez**.
- Her otelin gerçek NAP (Name-Address-Phone), ulaşım, check-in/out, ödeme, erişilebilirlik, otopark, kahvaltı, çevre, iklim ve menü bilgileri açık, güncel ve çelişkisiz olmalı.
- Resmî markalı içerik, restoran menüsü, düğün salonu detayları, konum bağlamı ve görsel kanıt önemli. Boilerplate kopya içerik 5 domain arasında bölünmemeli.
- Her sitede benzersiz title, H1, meta description, OG image, kendi URL canonical, botların HTML'de okuyabildiği metin ve dahili bağlantılar bulunmalı.
- Google Business Profile eşleştirmesi her otel/restoran entity için bağımsız doğrulanmalı. Güvenilir OTA/dizin bilgileri gerçek verilerle tutarlı olmalı.
- Güncel Search Central dokümanları esas alınmalı; `llms.txt` varsa deneysel/isteğe bağlı ek dosya, Google görünürlük koşulu değil.
- AI sistemlerinin okuyabilmesi için kritik bilgiler JS etkileşimine bağımlı bırakılmamalı. Ana metinler server-rendered HTML'de bulunmalı. Günlük menü örneği bu demoda tarayıcıdan fetch edilip çizilir; üretimde SSR/ISR/CMS ile bot tarafından okunabilir hale getirilmeli.

## Schema.org entity modeli

Yalnızca gerçek veri için `Hotel`, `Restaurant`, `WebSite`, `BreadcrumbList`, ve işlevleri doğruysa `FAQPage` değil normal HTML FAQ uygulanır. Otel odası detaylarına `HotelRoom`/`Accommodation` yalnızca doğrulanmış niteliklerle; `Offer` yalnızca gerçek ve güncel canlı fiyat/para birimi/uygunluk varsa. Düğün hizmeti için `Service` açıklaması mümkün ama bunu yanlış `Event` etkinliği gibi modellememeli.

### Örnek kavramsal JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "Hotel",
  "@id": "https://hotel-1.example/#hotel",
  "name": "HOTELIN ONAYLI ADI",
  "url": "https://hotel-1.example/",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ONAYLI ADRES",
    "addressLocality": "SEHIR",
    "postalCode": "POSTA KODU",
    "addressCountry": "DE"
  }
}
```

**Önemli:** JSON-LD placeholder değerleri yayınlanamaz; adres ve odalar gerçeğe uygun olmalıdır. Demo JSON-LD, gerçek geodata veya fiyat iddiası içermeyecek şekilde sınırlı tutuldu.

## Sitemap indexleme kapısı

- Demo: `robots.txt` herkesi engeller; tüm sayfalarda `noindex` vardır. Bu bilinçli güvenliktir.
- Production: HER host kendi `sitemap.xml`'inde sadece kendi domain URL'lerini listeler. 5 otelin URL'leri tek sitemap'te karıştırılmaz.
- Kendi domain canonical ve JSON-LD `@id` kontrolü yapılır; `http`, `www`, `/` kuralları mutlak ve tutarlı olmalı.
- Google Rich Results Test ve Schema Markup Validator ayrı test edilmelidir; rich result gösterimi kesin değildir.

## Araçlar

Google Search Console her domain, PageSpeed Insights/Core Web Vitals, Rich Results Test, Schema Markup Validator, URL Inspection, log analiz ve gerçek arama/rezervasyon KPI panelleri.
