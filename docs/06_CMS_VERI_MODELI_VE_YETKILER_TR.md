# Merkezi CMS, tenant izolasyonu ve veri modeli

Önerilen mantıksal varlıklar: `Hotel`, `Domain`, `BrandTheme`, `StaffUser`, `Role`, `Page`, `LocalizedBlock`, `RoomType`, `RoomMedia`, `Restaurant`, `Menu`, `MenuSection`, `MenuItem`, `DailySpecial`, `Allergen`, `EventVenue`, `EventInquiry`, `MediaAsset`, `SEORecord`, `Publication`, `AuditLog`, `PMSIntegration`, `ReservationReference`.

**Her iş kaydında hotel_id**, foreign-key / RLS (uygunsa), auth scope ve audit alanı. Kullanıcı otel 1 editörü otel 2 medyasını düzenleyemez; API sadece kontrol paneli filtrelemesine güvenmez. Domain -> hotel_id eşleştirmesi onaylı ve tekil olmalı. Domain değişiklikleri admin onayıyla yapılmalı.

Örnek roller:

| Rol | Yetki |
|---|---|
| Group Owner | 5 otelin yönetsel görünümü, rol ataması, kritik publish onayı |
| Hotel Manager | Yalnızca atanmış otel sayfalarını/menülerini onaylar |
| Restaurant Editor | Kendi otelinin günlük menüsünü draft olarak düzenler |
| Media Editor | Otel görsellerini ekler; hak/alt alanları zorunludur |
| Analyst | Sadece görevlendirildiği raporları okur |

**Durum akışı:** draft → review → approved → scheduled → published → expired → archived; doğrulanmış `published_at`, `valid_from`, `valid_to`. Otomatik tarihi geçen Tagesmenü public'den çıkarılmalı ve fallback olarak genel Speisekarte görünmeli.

**Production seçenekleri:** Payload CMS veya Strapi + PostgreSQL; önce hosting firması, ekip deneyimi ve GDPR gereksinimleriyle karşılaştırılmalı. Bu demo gerçek CMS kurmaz; `src/lib/hotels.ts` örnek içerikler ve yerel menü API'si vardır.

**Güvenlik:** tenant cross-read / cross-write testleri, rate limit, CSRF ve auth, secrets yönetimi, migration plan, backup/restore testi. Bir siteye yapılan içerik değişikliği diğerinin domainini/sitemap'ini/JSON-LD'sini bozmayacak.
