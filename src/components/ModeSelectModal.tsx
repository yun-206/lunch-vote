"use client";

type Props = {
  onSelect: (mode: "food" | "cafe") => void;
};

export default function ModeSelectModal({ onSelect }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🍱</div>
          <h2 className="text-xl font-black text-gray-900">오늘 뭐 할 거야?</h2>
          <p className="text-gray-400 text-sm mt-1">메뉴 종류를 골라봐요</p>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={() => onSelect("food")}
            className="flex items-center gap-4 p-4 rounded-2xl border-2 border-orange-200 bg-orange-50 hover:bg-orange-100 hover:border-orange-400 transition-all group">
            <span className="text-4xl">🍽️</span>
            <div className="text-left">
              <p className="font-bold text-gray-900 text-lg">음식점</p>
              <p className="text-gray-500 text-sm">한식, 양식, 중식 등 메뉴 투표</p>
            </div>
            <span className="ml-auto text-orange-400 group-hover:translate-x-1 transition-transform">→</span>
          </button>
          <button onClick={() => onSelect("cafe")}
            className="flex items-center gap-4 p-4 rounded-2xl border-2 border-amber-200 bg-amber-50 hover:bg-amber-100 hover:border-amber-400 transition-all group">
            <span className="text-4xl">☕</span>
            <div className="text-left">
              <p className="font-bold text-gray-900 text-lg">카페</p>
              <p className="text-gray-500 text-sm">카페 브랜드 투표 + 주변 카페 지도</p>
            </div>
            <span className="ml-auto text-amber-400 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
