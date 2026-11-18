# Kapsam, konumlandırma ve karar kayıtları

**Karar:** ACCEPT_WITH_PATCH. Tek kod tabanı ve merkezi editör önerilebilir; **tek otel sitesi, tek kamu domaini veya SEO otoritesi paylaşımı yoktur.** 5 ayrı işletme adı ve 5 ayrı URL vardır. Müşteri her otelin kendi sitesinde kalarak oda, restoran ve düğün hizmetlerini bulur. Merkezi önizleme paneli yalnızca geliştirici aracıdır.

## Çalışma akışları

1. **Oda konaklaması:** otel odası arama → tarih/kişi → fiyat/müsaitlik doğrulaması (demo simülasyon) → ileride gerçek PMS/booking engine → güvenli ödeme.
2. **Halka açık restoran:** menü/kategoriler/alerjen/çalışma saatleri → günlük menü → masa rezervasyon bağlantısı. Otel konuğu olmak şart değil.
3. **Düğün ve etkinlik:** mekân/konsept/kapasite/görsel galeri → teklif talep formu → ileride satış CRM görev kaydı → teklife dönüştürme.
4. **Merkezi içerik:** grup yöneticisi 5 siteyi görebilir; her otel editörü sadece kendi hotel_id kapsamında düzenleme yapar (demoda yetkilendirme yapılmamıştır).

## Kanıtlı ve varsayımsal veri ayrımı

- Kullanıcının bildirdiği: **5 farklı otel**, tek yönetim, **her otelin kendine ait URL'si**, Alman pazarı, Almanca içerik, restoranların kamuya açık olması, düğün organizasyonu ve günlük değişen yemek menüleri.
- Bilinen sistem linki: `https://reservierung.gastroguide.de/Landhotel%20%26%20Restaurant%20Tanne/297462` (restoran rezervasyonu; oda motoru olduğu kabul edilmemeli).
- Prototip kimliği: Landhotel & Restaurant Tanne; diğer dört otel **tamamen uydurma örnek** olarak temsil ediliyor. Dört gerçek işletme adı, domaini, adresi verilmedi.
- Almanya hosting sağlayıcısı, mevcut PMS/channel manager, gerçek fiyat/kapasite, işletme adresleri ve yasal sorumlular henüz belli değil.

## Out of scope (demo)

Gerçek rezervasyon yazma, stok/OTA senkronu, ticari fiyatların doğrulanması, ödeme, e-posta gönderimi, gerçek yönetici giriş sistemi, GDPR uyum beyanı, canlıya alma, domain değişimi, Google Search Console mülkleri kurma, git push.

## Exit condition

Beş gerçek domain/marka bilgisi, host desteği, PMS contract, içerik sorumluları, gizlilik/çerez kapsamı onaylandığında production tasarımına geçilir. Tüm araçların test edilmediği demo PASS sayılmaz.
