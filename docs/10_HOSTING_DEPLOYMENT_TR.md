# Almanya hosting ve gelecekte kurulum seçenekleri

**Mevcut karar:** Vercel **kullanılmayacak**, canlı deploy **yapılmayacak**; yerel Windows demosu. Gerçek hosting şirketi henüz hatırlanmıyor, bu nedenle kesin ürün önerisi veya maliyet taahhüdü verilmez.

## Üretim için seçenekleri değerlendirme

Almanya pazarında değerlendirilebilecek örnek sağlayıcılar: **Hetzner**, **IONOS**, **netcup**, **mittwald**. Next.js 16 SSR/Node.js çalışma ortamı, sürekli uygulama süreçleri, proxy/TLS, veritabanı, yedekleme ve kurumsal DPA desteği **spesifik plan üzerinde** kontrol edilmelidir. Paylaşımlı web hosting tüm Next SSR gereksinimlerini karşılamayabilir.

## Karar kıstasları

- Frankfurt/Nürnberg veya uygun AB bölgesinde veri merkezi; sözleşme ve veri aktarımı.
- Node.js uygulama süreci/PM2 veya konteyner, runtime versiyonu, monitoring, health checks, log retention.
- Domains/DNS: 5 bağımsız `Host`, ayrı TLS, 301 redirect ve HSTS, her birine ayrı canonical.
- PostgreSQL managed/self-managed, SSL, en az yetki, yedekleme ve geri dönüş testi.
- WAF/rate limit, secrets vault, upload/media storage, object storage/CDN; görsellerin üçüncü tarafa aktarım denetimi.
- Tek deployment mı 5 bağımsız deployment mı kararı, ortak hata alanı ve sürüm onayıyla verilmeli.

## Önce mimari, sonra aktarma

Önce 5 gerçek URL listesi, yayın yetkilisi, eski web siteleri SEO URL envanteri, sıfır kesinti/301 planı; sonra staging, içerik göçü, entegrasyon testleri. Bilinmeyen host/deployment için gerçek production ortamını yapılandırmaya veya taşımaya başlanmaz.

**Bu ZIP, hosting konfigürasyonunun hazır olduğu anlamına gelmez.**
