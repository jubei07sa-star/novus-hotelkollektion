# Beş bağımsız otel sitesi — ALL-INKL statik + PHP/MySQL

Tüm ziyaretçi arayüzleri Almancadır. Güncel hedef: tasarımı ortak Next.js kaynaklarından üretip ALL-INKL'e altı ayrı statik site olarak yüklemek; menü, PDF ve kontakt işlemlerini PHP/MySQL ile çalıştırmak. Node.js yalnızca geliştirme ve çıktı üretmek için gerekir. Kurulum, SEO ve bakım yönergesi: [docs/ALL-INKL.md](docs/ALL-INKL.md).

`npm run build:allinkl` yerel test paketi, `npm run build:allinkl:production` onaylı domainlerle canlı paket üretir. İkisi de yayınlama yapmaz. Test paketleri Google'a kapalıdır; canlı pakette halka açık sayfalar indexlenebilir, yönetim sayfası kapalı kalır. Novus Global domaini belirlenene kadar canlı paket üretimi bilerek durdurulur.

Mevcut Vercel önizlemesi bu yerel değişikliklerle güncellenmedi. Aşağıdaki 3000-port adresleri eski Next.js geliştirme önizlemesidir; PHP/MySQL akışlarını test etmek için statik çıktılar PHP sunucusunda açılmalıdır.

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
- Menü yönetimi: otel/gün, alerjenler, JSON içe/dışa aktarma, günler arasında kopyalama ve PDF. ALL-INKL paketinde oturum ve CSRF kontrolüyle MySQL'e/PDF deposuna kaydedilir. Eski Node geliştirme modunda `data/` dosyaları korunur.
- WhatsApp: +49 176 21040296. Almanca hazırlanmış mesajda otel ve konum bulunur; ziyaretçi kendi WhatsApp uygulamasında gönderir.
- Ochsen yeni Novus Global GmbH işletmesi için hazırlanmıştır. Eski işletmeci, fiyatlar, saatler ve rezervasyon hesabı kullanılmaz. Rezervasyon sayfası kendi rezervasyon formunu oluşturmaz.
- Tanne ve Adler rezervasyonları resmî dış portallara bağlantı verir. Wagen telefon/e-posta üzerinden yönlendirir.
- Kontakt formu: PHP doğrulaması, spam sınırı ve MySQL kayıt; ALL-INKL yerel posta hizmetine aktarım. Gerçek posta adresleri ve teslim kontrolü canlı kurulumda tamamlanmalıdır.
- Çerez/yerel depolama: `hotel-privacy-v1`, 180 gün; PHP form ve panel için gerekli HttpOnly/SameSite oturumu. Her origin ayrıdır. Analiz veya reklam servisine veri gönderilmez.
- Impressum, Datenschutz, Barrierefreiheit, Buchung & rechtliche Hinweise ve her zaman erişilebilir Cookie-Einstellungen bağlantıları vardır.

- Krone: wellness ve seminer sayfaları, 16 fotoğraf ve özgün logo; eski işletmeci iletişimi ve rezervasyon koşulları taşınmaz. Ayrıntılar: `docs/KRONE-CONTENT.md`.

## Yayından önce

Bu proje üretim için hukuki uygunluk belgesi değildir. `docs/LEGAL-RELEASE.md` dosyasında doğrulanan kaynaklar, mevcut teknik davranış ve canlı yayına özgü eksik bilgiler listelenir. Hosting, gerçek rezervasyon/veri saklama süreçleri, işletmecinin VSBG açıklaması, BFSG kapsamı, belge erişilebilirliği ve fotoğraf kullanım hakları tamamlanmalıdır.

## Paylaşılan Vercel önizlemesi

Tek proje, koleksiyon ve beş otel için ayrı Vercel adresleri kullanır. `NEXT_PUBLIC_SITE_URL` koleksiyona, beş `NEXT_PUBLIC_HOTEL_ORIGIN_*` değişkeni otel adreslerine ayarlanır. `NEXT_PUBLIC_SHARED_PREVIEW=true` yalnızca örnek menü okumalarını açar; sunucudaki menü/PDF yazma engellerini kaldırmaz. Panelde düzenleme ve kopyalama geçici olarak denenebilir; kayıt ve PDF yükleme kapalıdır. Gerçek menü dosyaları, yüklenen PDF’ler, ortam sırları ve geçici çalışma dosyaları depoya dahil edilmez. SMTP ve gerçek rezervasyon işlemleri bağlı değildir.
