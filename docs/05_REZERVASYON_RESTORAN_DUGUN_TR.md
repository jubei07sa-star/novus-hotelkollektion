# Ticari modüller — üç ayrı müşteri akışı

## A. Otel rezervasyonu

Müşteri: check-in/check-out, yetişkin/çocuk, oda sayısı, oda tipi, fiyat/koşullar → gerçek zamanlı envanter teyidi → ödeme/garanti → rezervasyon onayı/iptal. **Demo** sadece tarihe ve kişi sayısına göre simüle uygunluk döndürür ve hiç kayıt veya ödeme oluşturmaz.

Gerçek PMS/booking engine kararı bekliyor. Bağlantı seçenekleri: desteklenen PMS API, yetkili booking widget veya hosted checkout. Envanter/fiyat kaynağının **tek otoritesi** tanımlanmadan ödeme veya rezervasyon yazma açılmaz. OTA Channel Manager çift rezervasyon riskinde kritiktir. Hold/lock, idempotency, retry, webhooks, fiyat/vergiler, iptal kuralları ve PII veri saklama tasarlanmalıdır.

## B. Halka açık restoran

Otel müşterisi olma şartı olmadan restoran, menü, saatler, rezervasyon; farklı tarih/öğün için menü. GastroGuide örneği masa rezervasyonuna yönlendirir; oda rezervasyonuyla karıştırılmaz. Entegrasyon kapasitesi kesinleşene kadar güvenli dış bağlantı, `rel="noopener noreferrer"`, açık etiket.

**Menü içerik türleri:** kalıcı Speisekarte, Tagesgericht, Wochenmenü, sezonluk menü, özel etkinlik menüsü, içecek, alerjen listesi. Her öğede hotel_id, menu_id, fiyat, para birimi, uygunluk tarihi/saati, vergiler, içerik, alerjenler, onay durumu ve sürüm bulunur. Eski menü otomatik expired olur; tarihsiz eski fiyat gösterilmez. Tatil/kapalı gün hataları önlenir.

Demo merkezi yönetim API'si `localhost:3000/verwaltung` üzerinden her otelin örnek günlük menüsünü değiştirir; veri aynı Next sunucusunun yerel JSON dosyasında tutulur. **Yetki yok**. Üretimde CMS, güvenli roller, yayın onayı, restaurant schedule, log, allergen approval şart.

## C. Düğün / organizasyon

Otelin mekân kimliği + gerçek fotoğraflar + kapasite/oturma düzeni/konaklama bağlantıları + paketler (varsa) + etkinlik türleri + tarih aralığı + teklif talep. Teklif formu kurumsal CRM'ye gidebilir. Canlıya almadan önce açık gizlilik bildirimi, talep minimizasyonu, spam koruması, e-posta servis güvenliği ve ticari takip workflow'u gerekir.

Düğün organizasyonu için `Event` schema ancak **gerçek tarihli kamu etkinliği** varsa uygundur. Sürekli sunulan düğün hizmeti bir etkinlik ilanı değildir.

## Demo kabul sınırları

Rezervasyon arayüzü simüle, menu yönetimi sadece lokal, düğün formu hiçbir şey göndermez; gerçek müsaitlik/uygun fiyat/menü/allergen/iletişim/satış sözleşmesi yoktur.
