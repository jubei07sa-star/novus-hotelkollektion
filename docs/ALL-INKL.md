# ALL-INKL: statische Hotelwebsites mit PHP und MySQL

## Was jetzt wo läuft

Die bestehenden React-/Next.js-Komponenten bleiben die Quelle für Design und Inhalte. Der Export erzeugt pro Domain eine eigene Website mit fertigem HTML, CSS und JavaScript. Auf ALL-INKL laufen weder Node.js noch `next start`.

PHP übernimmt ausschließlich Anmeldung, Menüverwaltung, PDF-Dateien und Kontaktformulare. MySQL/MariaDB speichert Benutzer, Tagesmenüs, PDF-Metadaten und vorübergehende Kontaktkopien. Reservierungen und Zahlungen werden nicht intern abgewickelt. Tanne und Adler verlinken ihre vorhandenen Anbieter. Fehlende Anbieterlinks bleiben bis zur Lieferung beim bestehenden Kontaktweg.

## Entwicklungs- und Exportablauf

1. `npm ci` (Node.js >=20.9 zum Entwickeln und Bauen, nicht auf dem Hosting erforderlich).
2. Änderungen an `src/` vornehmen; `npm run dev` bleibt für die bisherige Designvorschau verfügbar. Der PHP-Backendbetrieb wird im ALL-INKL-Export getestet.
3. `npm run build:allinkl` erzeugt sechs **nicht indexierbare lokale Testpakete** in `dist-allinkl/` mit den Ports 3300–3305. Diese Pakete nicht als Livewebsite hochladen.
4. In `allinkl.sites.json` alle sechs freigegebenen HTTPS-Adressen eintragen. Die Novus-Global-Domain ist absichtlich noch `https://novus-global.example`: es wurde keine Domain gekauft oder erfunden. Der Produktionsbuild verweigert diesen Platzhalter.
5. `npm run build:allinkl:production` erzeugt die indexierbaren Livepakete. `npm run check:allinkl` prüft HTML, Meta-Texte, canonicals, interne Verweise, Assets, Sprache und Sitemap.

`--site=landhotel-tanne` kann für eine einzelne Website angehängt werden. Bei Änderungen gemeinsamer Komponenten alle sechs Websites neu bauen. Generierte Dateien in `work/allinkl-build/` und `dist-allinkl/` nicht manuell bearbeiten.

## Ordner im Hostingkonto

Alle Website-Ordner und `private` liegen nebeneinander. In KAS wird jede Domain direkt auf ihren jeweiligen Website-Ordner gesetzt:

```
hotel-network/
  collection/           <- Novus-Global-Domain, zentrale /verwaltung/
  landhotel-tanne/       <- Tanne-Domain
  hotel-adler/           <- Adler-Domain
  goldenen-wagen/        <- Wagen-Domain
  ochsen-binzen/         <- Ochsen-Domain
  krone-wiechs/          <- Krone-Domain
  private/              <- KEINE Domain auf diesen Ordner oder dessen Eltern setzen!
    config.php          <- nur im Hosting, niemals in Git
    bootstrap.php
    schema.sql
    manage.php
    storage/pdf/        <- hochgeladene PDFs, nicht direkt im Web erreichbar
```

Die PHP-Endpunkte finden den gemeinsamen privaten Ordner zwei Ebenen oberhalb ihrer eigenen Datei. ALL-INKL muss PHP-Dateizugriff auf diesen gemeinsamen Ordner zulassen (KAS/open_basedir prüfen). Die `.htaccess` in `private` ist eine zusätzliche Sperre, kein Ersatz für die Trennung vom Webroot.

## Hosting einrichten

- PHP 8.2 oder neuer mit PDO MySQL, mbstring, fileinfo und sessions; MySQL/MariaDB und HTTPS für alle sechs Domains. Passende Domainkapazität im vorhandenen Tarif prüfen.
- `private/config.example.php` einmalig nach `private/config.php` kopieren. Datenbankzugang, mindestens 32 zufällige Zeichen als `secret`, privaten Speicherpfad, echte Absenderadresse und die fünf tatsächlichen Kontaktpostfächer eintragen. `secure_cookies` im Livebetrieb immer `true`, `mail_transport` immer `mail`.
- `schema.sql` über phpMyAdmin importieren. Alternativ mit SSH: `php private/manage.php install`.
- Einen Administrator mit `php private/manage.php user` anlegen. Das Kommando liest `{"email":"...","password":"..."}` von stdin; das Passwort darf nicht in Kommandozeilenargumente oder Git gelangen. 14–72 UTF-8-Bytes. Ohne SSH lokal mit PHP `password_hash(..., PASSWORD_DEFAULT)` erzeugen und in phpMyAdmin einen Benutzer mit E-Mail und diesem Hash in `users` anlegen. Niemals Klartextpasswörter in `password_hash` speichern. Beim Anlegen/Ändern Zugangsdaten durch den Betreiber festlegen lassen.
- Dateirechte so eng wie im Hostingkonto möglich setzen; PHP benötigt Schreibrecht nur auf `private/storage`. Verzeichnisberechtigungen nicht pauschal auf 777 setzen.
- Kontaktmail nutzt ALL-INKLs lokale PHP-Mailzustellung. Absenderpostfach, zulässiger Versand, SPF/DKIM und Empfang im Zielpostfach mit einer vereinbarten Testnachricht prüfen. Ein `mail()`-Erfolg bestätigt die Annahme durch den Maildienst, nicht die Zustellung im Postfach. SMTP kann bei Bedarf als zusätzlicher Transport ergänzt werden.
- Täglichen Cronjob `php /absoluter/pfad/private/manage.php prune` konfigurieren. Er entfernt Kontaktkopien nach 30 Tagen und abgelaufene Begrenzungsdaten. Die 30-Tage-Angabe der Datenschutzerklärung setzt diesen Job voraus. Gegebenenfalls mit ALL-INKL klären, wie der CLI-Cronjob im vorhandenen Tarif angelegt wird.
- Datenbank und `private/storage/pdf` regelmäßig sichern; Wiederherstellung testen. Bei Updates niemals `config.php`, Datenbank oder hochgeladene PDFs überschreiben/löschen. Die Anwendung legt keine automatische Sicherung an.

## SEO und Umzug

- Texte, Titel, Beschreibung, strukturierte Daten und Bildbeschreibungen stehen bereits im HTML; sie benötigen keinen Node.js-Prozess und keine Client-Domainumschaltung.
- Jede Domain bekommt ihre eigene Sitemap und canonical-Adressen. Verwaltung, APIs und Fehlerseiten stehen nicht in der Sitemap. Die Verwaltung bleibt immer `noindex`.
- Der Livebuild erlaubt Indexierung; Testbuilds bleiben gesperrt. Bestehende Domains möglichst beibehalten. Nach dem Upload tatsächliche robots.txt und Meta-Robots prüfen.
- Vor einem Domainwechsel oder Relaunch die bisherigen URLs aus Search Console/Sitemap inventarisieren und passende permanente Weiterleitungen pro Domain ergänzen. Nicht alle alten Unterseiten pauschal auf die Startseite umleiten. Beispielsweise muss bei Krone die bisherige `/de`-Struktur gezielt zugeordnet werden. Dieser Abgleich ist noch vor dem Livewechsel erforderlich.
- Sitemaps nach Veröffentlichung in Search Console einreichen. Technische Indexierbarkeit garantiert weder Aufnahme noch eine bestimmte Platzierung bei Google.
- Tagesmenüs werden aktuell aus PHP nachgeladen, feste Speisekarten und Hoteltexte stehen im HTML. Menüänderungen im Panel benötigen keinen neuen Export. Änderungen an festen Texten, Fotos oder Grundkarten benötigen einen neuen Export. Soll jedes täglich wechselnde Gericht garantiert ohne JavaScript im HTML stehen, ist ergänzendes serverseitiges Rendering oder ein automatisierter Export nach Menüänderung erforderlich.

## Noch vor Veröffentlichung zu klären

Novus-Global-Domain, bestätigte Kontaktpostfächer, Hosting-/Datenbankzugang, erste Administratorzugänge, fehlende externe Reservierungslinks, alte URL-Weiterleitungen, freigegebene Betreiber-/Bild-/Menüangaben und rechtliche Endprüfung. Ochsen und Krone enthalten weiterhin die Hinweise auf die geplante Betriebsphase. Keine ungeprüfte Übernahme oder Betriebsöffnung behaupten.

## Weiter mit ChatGPT / Codex

Dieses Repository bleibt bearbeitbar: gewünschte Änderung beschreiben, bestehende Komponenten anpassen, Export und Prüfungen ausführen, dann die freigegebenen Website-Dateien hochladen. Die sechs Websites werden aus einer gemeinsamen Quelle erzeugt; sechs getrennte Codeprojekte sind nicht erforderlich. GitHub und Vercel wurden durch diese Umstellung nicht aktualisiert.

## Referenzen

- Next.js: https://nextjs.org/docs/app/guides/static-exports
- PHP PDO: https://www.php.net/manual/en/pdo.prepared-statements.php
- PHP Mail: https://www.php.net/manual/en/function.mail.php
- ALL-INKL: https://all-inkl.com/en/webhosting
- Datenschutzinformationen: https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en
