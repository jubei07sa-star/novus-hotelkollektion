import type { Hotel } from "@/lib/hotels";

export function WhatsAppButton({hotel}:{hotel:Hotel}) {
  const message=`Guten Tag! Ich melde mich über die Website von ${hotel.name} (${hotel.region}). Ich interessiere mich für Ihr Hotel und habe eine Frage. Können Sie mir bitte weiterhelfen? Vielen Dank!`;
  const url=`https://wa.me/4917621040296?text=${encodeURIComponent(message)}`;
  return <a className="hotel-whatsapp" href={url} target="_blank" rel="noopener noreferrer" aria-label={`${hotel.name} über WhatsApp kontaktieren (neues Fenster)`} title="Hallo! Wie können wir Ihnen helfen? Schreiben Sie uns auf WhatsApp.">
    <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.47 0 .12 5.35.12 11.93c0 2.1.55 4.16 1.6 5.97L.02 24l6.25-1.64a11.9 11.9 0 0 0 5.77 1.47h.01c6.58 0 11.93-5.35 11.93-11.93 0-3.18-1.24-6.18-3.46-8.42ZM12.05 21.8a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.71.97.99-3.62-.23-.37a9.88 9.88 0 0 1-1.52-5.26c0-5.47 4.45-9.92 9.93-9.92a9.85 9.85 0 0 1 7.01 2.91 9.85 9.85 0 0 1 2.9 7.01c0 5.47-4.45 9.87-9.97 9.87Zm5.44-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.8-1.49-1.78-1.66-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.09 4.49.71.3 1.26.48 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z"/></svg>
    <span>Fragen? WhatsApp</span>
  </a>;
}
