"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createRoom } from "@/lib/roomActions";
import KakaoMap from "@/components/KakaoMap";

declare global {
  interface Window { kakao: any; }
}

type PlaceSuggestion = {
  place_name: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
};

export default function Home() {
  const router = useRouter();
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [mapQuery, setMapQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  // 장소 검색 자동완성
  useEffect(() => {
    if (!locationInput.trim() || locationInput === location) {
      setSuggestions([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!window.kakao?.maps?.services) return;
      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(locationInput, (data: PlaceSuggestion[], status: string) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setSuggestions(data.slice(0, 5));
        } else {
          setSuggestions([]);
        }
      });
    }, 350);
  }, [locationInput]);

  const handleSelectPlace = (place: PlaceSuggestion) => {
    setLocation(place.place_name);
    setLocationInput(place.place_name);
    setMapQuery(place.place_name);
    setSuggestions([]);
  };

  const handleCreate = async () => {
    if (!date) return;
    setLoading(true);
    try {
      const roomTitle = title.trim() || `${date} 점심 투표`;
      const roomId = await createRoom(date, roomTitle, location);
      router.push(`/room/${roomId}`);
    } catch {
      alert("방 만들기 실패. 다시 시도해주세요.");
      setLoading(false);
    }
  };

  const formatDateKr = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">🍱</div>
          <h1 className="text-3xl font-black text-gray-900">오늘 뭐 먹지?</h1>
          <p className="text-gray-500 mt-2 text-sm">팀원들과 함께 점심 메뉴를 골라봐요</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-orange-100 p-6 space-y-4">
          {/* 날짜 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">📅 언제 먹을 거야?</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base font-medium focus:outline-none focus:border-orange-400 transition"
            />
            {date && <p className="text-orange-500 text-xs font-medium mt-1.5 ml-1">{formatDateKr(date)}</p>}
          </div>

          {/* 방 이름 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">✏️ 방 이름 (선택)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예) 6월 팀 점심, 금요일 회식"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-orange-400 transition"
              maxLength={30}
            />
          </div>

          {/* 위치 검색 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">📍 어디서 먹어? (선택)</label>
            <div className="relative">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="예) 신림역, 강남구청, 판교역"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-orange-400 transition"
              />
              {/* 자동완성 */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectPlace(s)}
                      className="w-full text-left px-4 py-3 hover:bg-orange-50 transition border-b border-gray-50 last:border-0"
                    >
                      <p className="font-medium text-gray-800 text-sm">{s.place_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{s.road_address_name || s.address_name}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 지도 미리보기 */}
          {mapQuery && (
            <div className="rounded-2xl overflow-hidden border border-orange-100">
              <div className="bg-orange-50 px-3 py-2 text-xs font-medium text-orange-600 flex items-center gap-1">
                <span>📍</span> {mapQuery} 주변
              </div>
              <KakaoMap query={mapQuery} height="220px" />
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={loading || !date}
            className="w-full py-4 rounded-2xl bg-orange-500 text-white font-bold text-lg
              hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed
              transition-all active:scale-95 shadow-sm shadow-orange-200"
          >
            {loading ? "방 만드는 중..." : "🎯 투표 방 만들기"}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          방을 만들면 링크로 친구들을 초대할 수 있어요
        </p>
      </div>
    </div>
  );
}
