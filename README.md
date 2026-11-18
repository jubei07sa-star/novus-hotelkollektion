# Beş bağımsız otel sitesi — yerel demo

Tüm ziyaretçi arayüzleri Almancadır. Yerel geliştirme ve Caner Bey için paylaşılan Vercel önizlemesi. Kaynak kod Jubei hesabındaki özel GitHub deposunda tutulur; gerçek otel domainleri henüz taşınmaz. `noindex` ve robots engeli aktiftir.

| Otel | Yerel önizleme |
| --- | --- |
| Landhotel Tanne | http://landhotel-tanne.localhost:3000 |
| Hotel Adler | http://hotel-adler.localhost:3000 |
| Goldener Wagen | http://goldenen-wagen.localhost:3000 |
| Ochsen Binzen | http://ochsen-binzen.localhost:3000 |
| Krone Wiechs | http://krone-wiechs.localhost:3000 |

Ana koleksiyon: http://localhost:3000 — Yönetim: http://localhost:3000/verwaltung.
Eski örnek domainler ilgili gerçek otellere yönlendirilir. Beşinci otel Krone Wiechs, Caner Cavdar’ın gelecekteki işletmesi için hazırlanmıştır.

## Çalıştırma ve doğrulama

`npm run dev` yerel sunucuyu başlatır. `npm run lint:types`, `npm run build` ve `node scripts/check-architecture.mjs` proje kontrolleridir. Build yayınlama yapmaz.

## Mevcut davranış

- Beş otelin gerçek fotoğraf ve logoları yerel dosyalardadır.
- Menü yönetimi: otel ve gün seçimi, ayrıntılı alerjenler, JSON içe aktarma, PDF yükleme. Menü verileri `data/` altında korunur. API yazmaları yalnızca geliştirme ortamında açıktır.
- WhatsApp: +49 176 21040296. Almanca hazırlanmış mesajda otel ve konum bulunur; ziyaretçi kendi WhatsApp uygulamasında gönderir.
- Ochsen yeni Novus Global GmbH işletmesi için hazırlanmıştır. Eski işletmeci, fiyatlar, saatler ve rezervasyon hesabı kullanılmaz. Planlama formu yalnızca yerel sonuç gösterir.
- Tanne ve Adler rezervasyonları resmî dış portallara bağlantı verir. Wagen telefon/e-posta üzerinden yönlendirir.
- Çerez/yerel depolama: yalnızca kullanıcının gerekli tercih seçimi; `hotel-privacy-v1`, sürüm 1, 180 gün. Her origin ayrıdır. İzleme ve gömülü üçüncü taraf yoktur; tercih gelecekteki hizmetlere izin vermez.
- Impressum, Datenschutz, Barrierefreiheit, Buchung & rechtliche Hinweise ve her zaman erişilebilir Cookie-Einstellungen bağlantıları vardır.

- Krone: wellness ve seminer sayfaları, 16 fotoğraf ve özgün logo; eski işletmeci iletişimi ve rezervasyon koşulları taşınmaz. Ayrıntılar: `docs/KRONE-CONTENT.md`.

## Yayından önce

Bu proje üretim için hukuki uygunluk belgesi değildir. `docs/LEGAL-RELEASE.md` dosyasında doğrulanan kaynaklar, mevcut teknik davranış ve canlı yayına özgü eksik bilgiler listelenir. Hosting, gerçek rezervasyon/veri saklama süreçleri, işletmecinin VSBG açıklaması, BFSG kapsamı, belge erişilebilirliği ve fotoğraf kullanım hakları tamamlanmalıdır.

## Paylaşılan Vercel önizlemesi

Tek proje, koleksiyon ve beş otel için ayrı Vercel adresleri kullanır. `NEXT_PUBLIC_SITE_URL` koleksiyona, beş `NEXT_PUBLIC_HOTEL_ORIGIN_*` değişkeni otel adreslerine ayarlanır. `NEXT_PUBLIC_SHARED_PREVIEW=true` yalnızca örnek menü okumalarını açar; sunucudaki menü/PDF yazma engellerini kaldırmaz. Panelde düzenleme ve kopyalama geçici olarak denenebilir; kayıt ve PDF yükleme kapalıdır. Gerçek menü dosyaları, yüklenen PDF’ler, ortam sırları ve geçici çalışma dosyaları depoya dahil edilmez. SMTP ve gerçek rezervasyon işlemleri bağlı değildir.
