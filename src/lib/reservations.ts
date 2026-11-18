import { tanne } from "./tanne";
import { adler } from "./adler";
import { wagen } from "./wagen";
export type ReservationMode="room"|"table";
export function reservationTarget(slug:string,mode:ReservationMode){
  const table=mode==="table";
  const event=table?"restaurant_reservation_click" as const:"reservation_click" as const;
  if(slug==="landhotel-tanne"||slug==="hotel-adler")return {href:slug==="landhotel-tanne"?(table?tanne.table:tanne.booking):(table?adler.restaurantBooking:adler.booking),label:table?"Tisch reservieren":"Zimmer & Preise",note:"Termin und Verfügbarkeit wählen Sie im Buchungsportal des Hauses.",external:true,event};
  if(slug==="goldenen-wagen")return {href:`mailto:${wagen.email}?subject=${encodeURIComponent(table?"Tischanfrage im Goldenen Wagen":"Zimmeranfrage im Goldenen Wagen")}`,label:table?"Tisch anfragen":"Zimmer anfragen",note:"Ihre Anfrage öffnen Sie in Ihrem E-Mail-Programm. Das Hotel bestätigt persönlich.",external:false,event};
  return {href:`/buchen?anliegen=${table?"restaurant":"zimmer"}`,label:table?"Restaurantbesuch planen":"Aufenthalt planen",note:"Wünsche zusammenstellen. Verbindliche Angebote folgen zum Betriebsstart.",external:false,event};
}
