"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { emitHotelEvent, publicPagePath, resolveHotelClick } from "@/lib/hotel-events";

export function HotelEvents({slug,name}:{slug:string;name:string}) {
  const pathname=usePathname();
  const previous=useRef("");
  useEffect(()=>{
    const path=publicPagePath(pathname);
    const key=`${slug}:${path}`;
    if(previous.current===key)return;
    previous.current=key;
    const event=path==="/kontakt"?"contact_page_view":path==="/buchen"?"reservation_page_view":null;
    if(event)emitHotelEvent({event,hotel_slug:slug,hotel_name:name,page_path:path,interaction_method:"navigation",event_version:1});
  },[pathname,slug,name]);
  useEffect(()=>{
    function click(e:MouseEvent){
      if(e.type==="auxclick"&&e.button!==1)return;
      const target=e.target instanceof Element?e.target.closest<HTMLAnchorElement>("a[href]"):null;
      if(!target||target.hasAttribute("download"))return;
      const action=resolveHotelClick(target.getAttribute("href")||"",location.origin,target.dataset.hotelEvent);
      if(action)emitHotelEvent({...action,hotel_slug:slug,hotel_name:name,page_path:publicPagePath(location.pathname),event_version:1});
    }
    document.addEventListener("click",click,true);
    document.addEventListener("auxclick",click,true);
    return()=>{document.removeEventListener("click",click,true);document.removeEventListener("auxclick",click,true);};
  },[slug,name]);
  return null;
}
