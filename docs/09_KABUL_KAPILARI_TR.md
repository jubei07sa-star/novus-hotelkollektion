# Demo doğrulama matrisi ve üretim kabul kapıları

## ZIP / statik kontrol (GATE-D0)

- [ ] `node scripts/check-architecture.mjs` PASS.
- [ ] ZIP içinde `package.json`, `src/proxy.ts`, 5 bağımsız otel slug, oda detay rotaları, `README.md`, `docs/` mevcut.
- [ ] ZIP bütünlüğü `zipfile.testzip()` ve SHA256 ile doğrulandı.
- [ ] `node_modules` / `.next` / secret veya gerçek müşteri bilgisi paketlenmedi.

## Yerel çalışma (GATE-D1)

- [ ] `npm install` başarılı; lockfile oluşturulup bağımlılıklar kilitlendi.
- [ ] `npm run lint:types` PASS.
- [ ] `npm run build` PASS (yayın yapmaz).
- [ ] `npm run dev` çalışıyor; 5 `.localhost` alanında her biri farklı ana sayfa gösteriyor.
- [ ] Her domain `/restaurant`, `/speisekarte`, `/hochzeiten`, `/buchen`, `/zimmer/room-slug` doğru açılıyor.
- [ ] Mobil 360, 390, 430px; tablet 768px; masaüstü 1440px ekranlar: kesilme/yatay scroll yok.
- [ ] `localhost:3000/verwaltung` menü kaydet → ilgili otel domaininde menü güncelleniyor; başka otel etkilenmiyor.
- [ ] Booking yalnızca sahte sonuç dönüyor; fiyat/oda yanında demo uyarısı var; gerçek rezervasyon butonu kapalı.
- [ ] Wedding formu hiçbir e-posta/PII göndermez.
- [ ] Otele özel `sitemap.xml` yalnızca o domainin URL'lerini listeler.
- [ ] Her demo host `robots.txt` DISALLOW ve metadata `noindex`.

## Production tasarım / veri (GATE-P)

- [ ] Beş gerçek domain sahibi tarafından sağlandı, doğrulandı, SSL/redirect planı onaylandı.
- [ ] Beş otelin gerçek kimliği, adresi, fotoğraf ve marka hakları onaylandı.
- [ ] PMS/Booking Engine ve GastroGuide teknik entegrasyonu ayrı ayrı test edildi.
- [ ] CMS kullanıcı rollerinin **cross-tenant** read/write izolasyonu penetrasyon testinden geçti.
- [ ] Gerçek SEO içeriği, sitemap/canonical/structured data/Google Business profilleri ayrı domainlerde doğrulandı.
- [ ] Günlük menü yayın/expire/alerjen süreçleri restoran yetkilisince onaylandı.
- [ ] Hukuki sayfalar, privacy/consent ve erişilebilirlik geçitleri imzalandı.
- [ ] CWV ve kullanıcı yolculuğu performansı gerçek mobil testlerde kabul edildi.
- [ ] Yedekleme, disaster recovery, observability, güvenlik ve kontrollü shadow cutover planı onaylandı.

**Durum yorumu:** GATE-D0 dosya düzeyinde çalıştırılabilir; GATE-D1 ve GATE-P test edilmeden tamamlanmış sayılmaz. Veritabanı ve ticari iş akışları demo aşamasında hazırlanmış değildir.
