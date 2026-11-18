import { getHotel } from "@/lib/hotels";
import { HotelPageContext } from "@/components/HotelPageContext";
export default async function SectionLayout({children,params}:{children:React.ReactNode;params:Promise<{hotelSlug:string}>}){const hotel=getHotel((await params).hotelSlug);return <>{hotel&&<HotelPageContext hotel={hotel} section="restaurant"/>}{children}</>;}
