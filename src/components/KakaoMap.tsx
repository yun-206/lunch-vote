"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window { kakao: any; }
}

type Props = {
  query: string;
  height?: string;
};

export default function KakaoMap({ query, height = "300px" }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!query || !mapRef.current) return;

    const loadMap = () => {
      window.kakao.maps.load(() => {
        if (!mapRef.current) return;
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(37.4849, 126.9294),
          level: 4,
        });
        mapInstanceRef.current = map;
        const ps = new window.kakao.maps.services.Places();
        const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });
        ps.keywordSearch(query, (data: any[], status: string) => {
          if (status !== window.kakao.maps.services.Status.OK) return;
          const bounds = new window.kakao.maps.LatLngBounds();
          data.slice(0, 5).forEach((place) => {
            const position = new window.kakao.maps.LatLng(place.y, place.x);
            const marker = new window.kakao.maps.Marker({ map, position });
            window.kakao.maps.event.addListener(marker, "click", () => {
              infowindow.setContent(
                `<div style="padding:6px 10px;font-size:13px;font-weight:bold;max-width:180px">
                  ${place.place_name}
                  <div style="font-size:11px;color:#888;font-weight:normal;margin-top:2px">${place.road_address_name || place.address_name}</div>
                </div>`
              );
              infowindow.open(map, marker);
            });
            bounds.extend(position);
          });
          map.setBounds(bounds);
        });
      });
    };

    if (window.kakao && window.kakao.maps) {
      loadMap();
    } else {
      // SDK 스크립트 로드 대기
      const script = document.getElementById("kakao-map-script") as HTMLScriptElement;
      if (script) {
        const onLoad = () => loadMap();
        script.addEventListener("load", onLoad);
        return () => script.removeEventListener("load", onLoad);
      } else {
        // 스크립트 직접 주입
        const newScript = document.createElement("script");
        newScript.id = "kakao-map-script-dynamic";
        newScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`;
        newScript.addEventListener("load", loadMap);
        document.head.appendChild(newScript);
      }
    }
  }, [query]);

  return (
    <div ref={mapRef} style={{ width: "100%", height }} className="rounded-2xl overflow-hidden" />
  );
}
