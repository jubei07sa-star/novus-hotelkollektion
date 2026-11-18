# Teslimat durumu, riskler ve çıkış koşulları

## Tamamlanan örnek bileşenler

- 5 farklı örnek otel kimliği ve host bazlı render yaklaşımı.
- Responsive landing/oda/restoran/menü/düğün/kontakt/rezervasyon arayüzleri.
- Yerel örnek günlük menü API, editör ve JSON depolama.
- Noindex + disallow, host'a özel demo sitemap ve canonical kurgu.
- Örnek (doğrulanmamış) içerikle sınırlı Hotel/Restaurant/WebSite JSON-LD.

## Açık riskler

- `npm install`/build ve gerçek tarayıcı responsive görsel testi bu ortamda tamamlanamadı; yerelde test edilmeden PASS verilmez.
- Örnek Unsplash görselleri uzak ağ ister, üretimde lisans/gerçek otel doğruluğu zorunludur.
- Host bazlı uygulama production reverse proxy/edge testinden geçmedi.
- Menu API'si **yetkisiz local demo**: gerçek hostta çalışmamalı. Gerçek sistemde auth/CMS zorunlu.
- Diğer 4 otelin gerçek marka, URL, konum verileri ve Tanne gerçek içerik detayları bilinmiyor.
- GERÇEK ödeme/rezervasyon/üçüncü taraf PMS/GastroGuide API entegrasyonu yok.
- Düğün formu yalnızca etkileşim prototipi; gönderim yok.
- Demo hiç bir domainin kamu sitesi yerine geçmez.

## Hedeflenen sonraki karar sırası

1. Yerel `npm install`, `npm run build`, 5 host browser testini tamamla.
2. Sahipten 5 gerçek domain/otel kimliği, kullanım haklı fotoğraf envanteri ve mevcut hosting bilgisi al.
3. Odalar/PMS/GastroGuide doğrulama; restoran ve wedding içerik sözleşmesi.
4. CMS, RBAC, veritabanı, yayın onay mekanizması.
5. SEO/Schema/performans/legal kalite geçitleri ve ancak sonra ayrıca izinli staging/live.

**GATE: Demo QA geçmeden production geliştirme ve deployment kabul edilmemeli.**
