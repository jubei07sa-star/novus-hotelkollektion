# Lokale Prüfung — 18. November 2026

Die Änderung wurde ausschließlich lokal vorgenommen. Kein Upload zu ALL-INKL, GitHub oder Vercel.

## Nachgewiesen

- Sechs getrennte statische Exporte ohne laufenden Next.js-Server: Kollektion und fünf Hotels.
- 69 öffentliche HTML-Seiten, 4.156 lokale Verweise inklusive 1.656 Asset-Verweisen geprüft. Titel, Beschreibungen, deutsche Sprache, canonical-Adressen und Sitemap-Dateien vorhanden; verlinkte lokale Dateien/Seiten vorhanden. JSON-LD-Blöcke parsebar. Keine `/_next/image`-Abhängigkeit.
- Fehlerseiten und Verwaltung aus Sitemaps ausgeschlossen. Verwaltung stets `noindex`.
- Produktionsmodus separat für 14 Tanne-Seiten geprüft: indexierbare Meta-Angaben, HTTPS-canonicals und Sitemap. Im isolierten Audit diente die bestehende Vercel-Kollektionsadresse als Hub-Adresse; es wurde nichts veröffentlicht. Das eigentliche Domainprofil enthält bis zur Auswahl weiterhin den gesperrten `.example`-Platzhalter.
- TypeScript-Prüfung und vorhandene Architekturprüfung erfolgreich; `git diff --check` ohne Patchfehler.
- PHP 8.4.27: Syntaxprüfung aller neuen PHP-Dateien erfolgreich. MySQL-Kompatibilität mit einer ausschließlich lokalen MariaDB 11.4.5 geprüft.
- 25 HTTP-Prüfungen: Anmeldung, CSRF, unberechtigtes Schreiben, Trennung der Hotelseiten, Menü speichern/lesen/kopieren/löschen, Datum/Allergene validieren, falsche PDF ablehnen, PDF speichern/herunterladen, Kontaktformular prüfen/speichern und Anfragelimit.
- Browser: Kontaktformular bis zur Erfolgsmeldung, Verwaltung anmelden, Menü bearbeiten/speichern, Kopieren auf einen weiteren Tag und Wochenentwurf speichern. Gespeichertes Tagesmenü auf der Tanne-Speisekarte sichtbar. Wechsel von Startseite zu Zimmerseite über die Navigation erfolgreich.
- Alle fünf Kontaktseiten bei 390, 820 und 1440 CSS-Pixeln ohne horizontales Überlaufen oder festgestellte defekte Bilder. Zentrale Verwaltung bei denselben Breiten ohne Überlaufen; mobile Menüseite visuell geprüft. Weitere Hotel-Startseiten und externe Buchungsübersicht bei Mobilbreite geprüft. Keine Browserfehler in den geprüften Kernabläufen.
- Test-E-Mails wurden nur in lokale Testdateien geschrieben; kein Versand an Hotelpostfächer. Zugangsdaten und Testdaten liegen außerhalb des auslieferbaren Pakets.

## Noch nicht auf dem tatsächlichen Hosting geprüft

ALL-INKL-KAS-Konfiguration, gemeinsame private Pfadfreigabe/open_basedir, Apache/.htaccess-Regeln, HTTPS-Weiterleitung, echte E-Mail-Zustellung und SPF/DKIM, tatsächliche Datenbankrechte, Cronjob und Sicherungen. Die lokale PHP-Vorschau interpretiert Apache-Regeln nicht.

Die Alt-URL-Liste und passende 301-Weiterleitungen sind vor dem Relaunch mit den bestehenden Websites/Search Console abzugleichen. Die Indexierbarkeit ist vorbereitet; Google-Aufnahme oder Ranking sind damit nicht garantiert.

## Reproduzieren

- `npm run lint:types`
- `node scripts/check-architecture.mjs`
- `npm run build:allinkl`
- `npm run check:allinkl`
- `node scripts/test-allinkl-api.mjs` nur mit dem isolierten lokalen Testsystem auf Port 3300, den Testzugängen in `work/runtime/test-secrets.json` und leerem Test-Ratelimit. Der Test verweigert einen Server ohne ausdrücklich aktiven lokalen Mail-Testmodus. Testdaten gehören niemals in eine Live-Datenbank.

Hinweise zum echten Betrieb und späteren Änderungen: `ALL-INKL.md`.
