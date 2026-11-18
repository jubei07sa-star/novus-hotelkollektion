# Almanya yayın öncesi hukuki ve kalite kontrol noktaları

Bu dosya hukuki görüş değil, üretime çıkışa yönelik kontrol kapsamıdır.

- `Impressum` otel/işletmeciye özgü tam yasal künyeyle doldurulmalı; demo placeholder yayınlanamaz.
- `Datenschutz` veri sorumlusu, hosting, log, analytics, formlar, booking provider, e-posta, cookie ve üçüncü taraf içerik akışları için gerçek metin olmalı.
- DSGVO/GDPR: veri minimizasyonu, saklama süreleri, erişim-kaldırma, işlemci sözleşmeleri (AVV/DPA), veri aktarımları ve erişim günlükleri.
- TDDDG ve çerez/onay yönetimi; çerez gereksinimleri fiili teknik taramayla değerlendirilmeli. Yetkisiz pazarlama/izleme açılmamalı.
- Almanya'da BFSG/EAA uygulanabilirliği, istisnalar ve sözleşme türüne göre kontrol edilmeli. Teknik hedef WCAG 2.2 AA; tek başına WCAG testi yasal yeterlilik kanıtı değildir.
- Menü içeriğinde alerjen ve zorunlu gıda bilgileri fiili işletme yükümlülüğüne göre yönetilmeli; demo fiyat/yemek bilgileri üretime taşınmamalı.
- Düğün formunda açık amaç, güvenli taşıma, anti-spam, çocuk/minor verisi koruması ve gerçek gönderim altyapısı.
- Booking API ve ödeme işlemi için PCI kapsamı, hosted provider, 3DS, idempotency ve çifte rezervasyonu önleme testleri.
- Fotoğrafların lisansları ve kişi rızaları, otel kanıtı ve fotoğraf doğruluğu kontrol edilmeli.
- Harici Unsplash demo bağlantısı canlı sitede önceden değerlendirilmeden kullanılmamalı.
- TLS, security headers, dependency scanning, backup/restore, otel bazında en az yetki ve erişim denetimi.

**Çıkış koşulu:** Kullanıcı/firma yasal bilgi ve servis kararlarını onaylar; ilgili uzman kontrolü ve test sonucuna göre yasal sayfalar/çerez/erişilebilirlik uygulaması yayınlanır. Şu an `noindex`, demo statüsünde kalır.
