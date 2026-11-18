export const contactTopics = [
  ["general", "Allgemeine Frage"], ["room", "Übernachtung"], ["restaurant", "Restaurant"],
  ["event", "Feier & Anlass"], ["wellness", "Wellness"], ["meeting", "Seminar & Tagung"],
] as const;
export type ContactTopic = typeof contactTopics[number][0];
export type ContactFields = { name: string; email: string; phone: string; message: string; arrival: string; departure: string; date: string; time: string; people: string };
export type ContactErrors = Partial<Record<keyof ContactFields, string>>;
export const emptyContact: ContactFields = { name: "", email: "", phone: "", message: "", arrival: "", departure: "", date: "", time: "", people: "" };
export function validateContact(fields: ContactFields, topic: ContactTopic): ContactErrors {
  const errors: ContactErrors = {};
  if (fields.name.trim().length < 2) errors.name = "Bitte geben Sie Ihren Namen ein.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
  if (topic === "room" && fields.arrival && fields.departure && fields.departure <= fields.arrival) errors.departure = "Die Abreise muss nach der Anreise liegen.";
  if (topic !== "general" && fields.people && (!/^\d+$/.test(fields.people) || Number(fields.people) < 1 || Number(fields.people) > 999)) errors.people = "Bitte geben Sie eine Personenzahl zwischen 1 und 999 ein.";
  if (fields.message.trim().length < 10) errors.message = "Bitte beschreiben Sie Ihr Anliegen mit mindestens 10 Zeichen.";
  return errors;
}
const dateText = (value: string) => value ? value.split("-").reverse().join(".") : "Noch offen";
export function contactSummary(hotel: string, topic: ContactTopic, fields: ContactFields) {
  const lines = [`Anfrage an ${hotel}`, `Anliegen: ${contactTopics.find(([id]) => id === topic)?.[1]}`, `Name: ${fields.name.trim()}`, `E-Mail: ${fields.email.trim()}`];
  if (fields.phone.trim()) lines.push(`Telefon: ${fields.phone.trim()}`);
  if (topic === "room") lines.push(`Anreise: ${dateText(fields.arrival)}`, `Abreise: ${dateText(fields.departure)}`);
  else if (topic !== "general") { lines.push(`Wunschtermin: ${dateText(fields.date)}`); if (topic === "restaurant" && fields.time) lines.push(`Uhrzeit: ${fields.time}`); }
  if (topic !== "general" && fields.people) lines.push(`Personen: ${fields.people}`);
  return lines.join("\n") + "\n\n" + fields.message.trim();
}
