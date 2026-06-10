"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

type Props = {
  query: string; // 검색어 (예: "신림역 김치찌개")
  height?: string;
};

export default function KakaoMap({ query, height = "300px" }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!query || !mapRef.current) return;

    const initMap = () => {
      const { kakao } = window;
      if (!kakao) return;

      kakao.maps.load(() => {
        const container = mapRef.current;
        if (!container) return;

        const options = {
          center: new kakao.maps.LatLng(37.4849, 126.9294), // 신림역 기본
          level: 4,
        };

        const map = new kakao.maps.Map(container, options);
        mapInstanceRef.current = map;

        // 장소 검색
        const ps = new kakao.maps.services.Places();
        ps.keywordSearch(query, (data: any[], status: string) => {
          if (status !== kakao.maps.services.Status.OK) return;

          const bounds = new kakao.maps.LatLngBounds();
          const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

          data.slice(0, 5).forEach((place, i) => {
            const position = new kakao.maps.LatLng(place.y, place.x);

            const marker = new kakao.maps.Marker({
              map,
              position,
              title: place.place_name,
            });

            kakao.maps.event.addListener(marker, "click", () => {
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

    // 카카오맵 SDK 로드
    if (window.kakao && window.kakao.maps) {
      initMap();
    } else {
      const script = document.getElementById("kakao-map-script");
      if (script) {
        script.addEventListener("load", initMap);
      }
    }
  }, [query]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height }}
      className="rounded-2xl overflow-hidden"
    />
  );
}
