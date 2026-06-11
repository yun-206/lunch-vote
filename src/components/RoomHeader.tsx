"use client";

type Props = {
  title: string;
  date: string;
  location?: string;
  totalVotes: number;
  topMenuName: string | null;
  topMenuCount: number;
  onFinalize: () => void;
  isFinalized: boolean;
  onCopyLink: () => void;
  copied: boolean;
  nickname: string | null;
  mode: "food" | "cafe" | null;
  onSwitchMode: () => void;
};

export default function RoomHeader({ title, date, location, totalVotes, topMenuName, topMenuCount, onFinalize, isFinalized, onCopyLink, copied, nickname, mode, onSwitchMode }: Props) {
  const formatDateKr = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return `${d.getMonth() + 1}/${d.getDate()} (${days[d.getDay()]})`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-full px-4 py-3">
        <div className="flex items-center gap-2">
          <a href="/" className="text-xl shrink-0">🍱</a>
          {mode && (
            <button onClick={onSwitchMode}
              className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border-2 transition
                ${mode === "cafe" ? "border-amber-300 bg-amber-50 text-amber-600 hover:bg-amber-100" : "border-orange-300 bg-orange-50 text-orange-600 hover:bg-orange-100"}`}>
              {mode === "cafe" ? "☕ 카페" : "🍽️ 음식점"}
            </button>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-gray-900 text-base truncate">{title}</h1>
              <span className="text-xs text-gray-400 shrink-0">{formatDateKr(date)}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {location && <span className="text-orange-400 mr-1.5">📍{location}</span>}
              {totalVotes > 0 ? (
                <>총 <span className="font-bold text-gray-600">{totalVotes}표</span>
                  {topMenuName && <> · 선두 <span className="font-bold text-orange-500">{topMenuName}</span> ({topMenuCount}표)</>}
                </>
              ) : "메뉴를 클릭해서 투표하세요 👆"}
            </p>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button onClick={onCopyLink}
              className={`px-3 py-2 rounded-xl text-sm font-semibold border-2 transition-all
                ${copied ? "border-green-400 bg-green-50 text-green-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
              {copied ? "✓ 복사됨" : "🔗 초대"}
            </button>
            {!isFinalized ? (
              <button onClick={onFinalize} disabled={totalVotes === 0}
                className="px-3 py-2 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition">
                🎯 결정!
              </button>
            ) : (
              <a href="/" className="px-3 py-2 rounded-xl border-2 border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition">
                🔄 새 방
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
