"use client";

type Props = {
  totalVotes: number;
  topMenuName: string | null;
  topMenuCount: number;
  onFinalize: () => void;
  isFinalized: boolean;
  onReset: () => void;
};

export default function Header({
  totalVotes,
  topMenuName,
  topMenuCount,
  onFinalize,
  isFinalized,
  onReset,
}: Props) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="font-black text-orange-500 text-xl leading-tight">
            🍱 오늘 뭐 먹지?
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {totalVotes > 0 ? (
              <>
                총 <span className="font-bold text-gray-600">{totalVotes}표</span>
                {topMenuName && (
                  <>
                    {" "}
                    · 선두{" "}
                    <span className="font-bold text-orange-500">
                      {topMenuName}
                    </span>{" "}
                    ({topMenuCount}표)
                  </>
                )}
              </>
            ) : (
              "메뉴를 클릭해서 투표하세요 👆"
            )}
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          {isFinalized ? (
            <button
              onClick={onReset}
              className="px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition"
            >
              🔄 초기화
            </button>
          ) : (
            <button
              onClick={onFinalize}
              disabled={totalVotes === 0}
              className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-bold
                hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              🎯 결정!
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
