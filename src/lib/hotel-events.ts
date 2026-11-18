export const hotelEventNames = ["whatsapp_click", "reservation_click", "restaurant_reservation_click", "contact_click", "reservation_page_view", "contact_page_view", "contact_form_preview"] as const;
export type HotelEventName = typeof hotelEventNames[number];
export type HotelEvent = {
  event: HotelEventName;
  hotel_slug: string;
  hotel_name: string;
  page_path: string;
  interaction_method: "navigation" | "portal" | "whatsapp" | "phone" | "email" | "form";
  event_version: 1;
};

// Deliberately omit URLs, query strings, messages and form values from event data.
export function publicPagePath(path: string): string {
  const clean = path.split(/[?#]/)[0].replace(/^\/hotels\/[^/]+/, "");
  return clean.replace(/\/$/, "") || "/";
}

export function resolveHotelClick(href: string, origin: string, explicit?: string): Pick<HotelEvent, "event" | "interaction_method"> | null {
  let url: URL;
  try { url = new URL(href, origin); } catch { return null; }
  const method = url.protocol === "tel:" ? "phone" : url.protocol === "mailto:" ? "email" : url.hostname === "wa.me" ? "whatsapp" : url.origin === origin ? "navigation" : "portal";
  if (explicit && hotelEventNames.includes(explicit as HotelEventName)) return {event: explicit as HotelEventName, interaction_method: method};
  if (url.hostname === "wa.me" && url.protocol === "https:") return {event: "whatsapp_click", interaction_method: "whatsapp"};
  if (url.protocol === "https:" && url.hostname === "reservierung.gastroguide.de") return {event: "restaurant_reservation_click", interaction_method: "portal"};
  if (url.protocol === "https:" && url.hostname === "zimmersoftware.de") return {event: "reservation_click", interaction_method: "portal"};
  if (method === "phone" || method === "email") return {event: "contact_click", interaction_method: method};
  if (url.origin === origin && publicPagePath(url.pathname) === "/buchen") return {event: "reservation_click", interaction_method: "navigation"};
  return null;
}

export function emitHotelEvent(detail: HotelEvent) {
  // Local, transient integration hook only. No storage, network, dataLayer or GA4.
  // A future analytics adapter must check explicit analytics consent BEFORE forwarding.
  window.dispatchEvent(new CustomEvent<HotelEvent>("hotel:interaction", {detail}));
  if (process.env.NODE_ENV === "development") console.debug(`[HotelEvent] ${JSON.stringify(detail)}`);
}
