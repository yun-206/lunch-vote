"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom } from "@/lib/roomActions";

export default function Home() {
  const router = useRouter();
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!date) return;
    setLoading(true);
    try {
      const roomTitle = title.trim() || `${date} 점심 투표`;
      const roomId = await createRoom(date, roomTitle);
      router.push(`/room/${roomId}`);
    } catch (e) {
      alert("방 만들기 실패. Firebase 설정을 확인해주세요.");
      setLoading(false);
    }
  };

  const formatDateKr = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🍱</div>
          <h1 className="text-3xl font-black text-gray-900">오늘 뭐 먹지?</h1>
          <p className="text-gray-500 mt-2 text-sm">팀원들과 함께 점심 메뉴를 골라봐요</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-orange-100 p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              📅 언제 먹을 거야?
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base font-medium focus:outline-none focus:border-orange-400 transition"
            />
            {date && (
              <p className="text-orange-500 text-xs font-medium mt-1.5 ml-1">
                {formatDateKr(date)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              ✏️ 방 이름 (선택)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예) 6월 팀 점심, 금요일 회식"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-orange-400 transition"
              maxLength={30}
            />
          </div>

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
