# Hotel interactions

Development mode logs the same sanitized payload with `[HotelEvent]` for verification; production does not log events.

Status: local event hooks only; no GA4/GTM script, network request, browser storage or event backlog.

Listen for `window` event `hotel:interaction`. Its `detail` contains:
`event`, `hotel_slug`, `hotel_name`, `page_path`, `interaction_method`, `event_version: 1`.
The route excludes query strings and fragments. Never append names, emails, phone numbers, dates, guest counts, message text or booking IDs.

| Event | Trigger |
| --- | --- |
| `whatsapp_click` | WhatsApp link activation |
| `reservation_click` | Room booking page CTA, room portal or room inquiry link |
| `restaurant_reservation_click` | Restaurant portal, labelled restaurant inquiry or brunch reservation CTA |
| `reservation_page_view` | Arrival on `/buchen`, including client-side navigation |
| `contact_page_view` | Arrival on `/kontakt`, including client-side navigation |
| `contact_click` | Other telephone and email links |

Clicks are intent signals, not completed bookings or sent messages. Do not configure them as purchase events. External booking completion requires verified integration with the booking provider.

## Future GA4 connection

1. Obtain the approved measurement ID/property layout and hosting details.
2. Add an optional analytics consent category with equally accessible acceptance/rejection and revocation. Existing necessary-only selections do not authorize analytics.
3. Load GA4 and attach the event forwarding listener only after explicit analytics consent. Block page-view transmission before consent too.
4. Forward the allowlisted event fields only. Register hotel parameters as custom dimensions. Decide which intent signals to mark as key events.
5. Do not replay pre-consent interactions. On revocation stop forwarding immediately and apply the provider's required cleanup.
6. Update the privacy notice, provider/contracts/retention and test consent states plus GA4 DebugView on all four domains. Review cross-domain linking separately; it is currently disabled.

Tests: `node --test work/release-check/events.test.cjs`.
