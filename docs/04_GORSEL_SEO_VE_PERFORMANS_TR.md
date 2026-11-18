# Görsel ağırlıklı premium otel siteleri: medya mimarisi

Otel satışında gerçek fotoğraf kalitesi kritiktir. Demo Unsplash URL'leriyle başlar; üretimde rastgele stok fotoğrafı **asla gerçek oda/mekân kanıtı gibi sunulmaz**. Telif/hak/rıza, çekim tarihi ve otel eşleştirmesi belgelenmelidir.

## Medya metadata sözleşmesi

```
media_id; hotel_id; page_id; component_slot; source_file;
source_author; license_id; rights_expiry; original_width; original_height;
subject; room_type_id; cuisine_category; locale; alt_de;
caption_de; credit_de; focal_x; focal_y; moderation_status; published_at;
width_variants; format_variants; checksum
```

Dosya adlandırma örnekleri: `landhotel-tanne-doppelzimmer-fensterblick-01.webp`, `hotel-am-see-restaurant-terrasse-02.avif`. Brand/konum/oda doğru değilse dosya adı SEO için şişirilmez. `alt` görselin anlamını ve bağlamını açıklamalı; anahtar kelime doldurma yapılmamalı. Dekoratif fotoğraf ise uygun `alt=""` kullanılabilir. Galerilerde her resmin benzersiz, gerçek nesne açıklaması tercih edilir.

## Görsel SEO

- Next.js `next/image` ile responsive `srcset`, `sizes`, lazy loading. LCP hero görseli öncelikli (yalnızca gerçekten ekranda görünüyorsa); diğerleri lazy.
- AVIF/WebP kullan, orijinal kaliteli masterı koru; aşırı sıkıştırma/renk bozma premium hissini düşürür.
- Masaüstü hero, mobil hero, restoran, oda, düğün, galeri için farklı focal point. CSS `object-position`, görsel boyutu ve aspect-ratio yönetimi.
- Medya dosyaları robots tarafından engellenmemeli; gerçek görseller mümkünse güvenilir otel domaini/CDN üzerinden, sabit ve crawlable URL'lerle servis edilmeli.
- OpenGraph ve sosyal paylaşıma uygun görsel; alt sayfalara özel OG görselleri. Gerçek galeri varsa ImageObject sözleşmesi veri kaynağından üretilebilir; her görsel için schema aşırılığı eklenmez.
- Görsellerin konum bilgisini rastgele EXIF üzerinden açığa çıkarma; hassas metadata temizleme ve hak zinciri kontrolü.

## Performans ve erişilebilirlik kalite hedefleri

Ölçülecek hedefler: mobil Core Web Vitals **LCP ≤ 2.5s**, **INP ≤ 200ms**, **CLS ≤ 0.1** (75. persentil gerçek kullanıcı ölçümü). Bunlar garanti değil, test hedefidir.

- Uygun responsive grid; yatay scroll yok; minimum mobil dokunma alanları; okunabilir kontrast; `prefers-reduced-motion` desteği.
- Slider ve ağır otomatik video zorunlu değil. Motion animasyonları LCP'yi engellememeli.
- Fotoğraflarda doğru `sizes`; sadece hero eager, galeri lazy; tarayıcı tarafından resim ağırlığı ölçümü.
- Harici analitik/chat widget'larını varsayılan engelli tut; onay ve performans bütçesiyle dahil et.
- Lighthouse, WebPageTest, Chrome DevTools ağ şelalesi; 4G orta sınıf mobil cihazla gözle test.

## Demo sınırı

`images.unsplash.com` internet bağlantısı gerektirir; HTML ve tasarım offline açıldığında fallback SVG kullanılabilir. Bu dosyalar gerçek otel fotoğrafları değildir. Demo için Google Lighthouse skor vaadi verilmez.
