"use client";

import { useEffect, useState } from "react";
import { Restaurant, getRestaurantsByMenuId } from "@/data/menuData";
import RestaurantCard from "./RestaurantCard";

type Props = {
  menuName: string;
  menuId: string;
  categoryId: string;
  voteCount: number;
  onClose: () => void;
  onReset: () => void;
};

export default function ResultModal({
  menuName,
  menuId,
  categoryId,
  voteCount,
  onClose,
  onReset,
}: Props) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [confetti, setConfetti] = useState(true);

  useEffect(() => {
    // 해당 메뉴 맛집만 — 없으면 빈 배열
    const byMenu = getRestaurantsByMenuId(menuId);
    setRestaurants(byMenu.slice(0, 5));
    const t = setTimeout(() => setConfetti(false), 3000);
    return () => clearTimeout(t);
  }, [menuId]);

  const naverSearchUrl = `https://map.naver.com/v5/search/신림역 ${menuName}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-b from-orange-500 to-orange-400 text-white p-6 rounded-t-3xl text-center">
          {confetti && (
            <div className="absolute inset-0 overflow-hidden rounded-t-3xl pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute text-xl animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    animationDuration: `${0.5 + Math.random()}s`,
                    top: `${Math.random() * 100}%`,
                  }}
                >
                  {["🎉", "🎊", "✨", "🍽️"][Math.floor(Math.random() * 4)]}
                </span>
              ))}
            </div>
          )}
          <div className="relative z-10">
            <p className="text-orange-100 text-sm font-medium mb-1">
              오늘의 점심 메뉴 결정! 🎉
            </p>
            <h2 className="text-4xl font-black mb-1">{menuName}</h2>
            <p className="text-orange-100 text-sm">{voteCount}표로 1위 🏆</p>
          </div>
        </div>

        {/* Restaurants */}
        <div className="p-4">
          {restaurants.length > 0 ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-bold text-gray-800">
                  📍 신림역 근처 {menuName} 맛집
                </h3>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  TOP {restaurants.length}
                </span>
              </div>
              <div className="space-y-3">
                {restaurants.map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            </>
          ) : (
            /* 맛집 데이터 없을 때 */
            <div className="text-center py-6">
              <div className="text-4xl mb-3">🗺️</div>
              <p className="font-bold text-gray-800 mb-1">
                {menuName} 맛집 데이터가 없어요
              </p>
              <p className="text-gray-400 text-sm mb-5">
                네이버 지도에서 신림역 근처 맛집을 찾아보세요!
              </p>
              <a
                href={naverSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold transition-colors"
              >
                🗺️ 네이버 지도에서 "{menuName}" 검색
              </a>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
          >
            닫기
          </button>
          <button
            onClick={onReset}
            className="flex-1 py-3 rounded-2xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
          >
            🔄 다시 투표
          </button>
        </div>
      </div>
    </div>
  );
}
