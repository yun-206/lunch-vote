"use client";

import { useState } from "react";

type Props = {
  onConfirm: (nickname: string) => void;
};

const EMOJIS = ["😊", "😎", "🤩", "🥳", "😋", "🍱", "🔥", "👑"];

export default function NicknameModal({ onConfirm }: Props) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(EMOJIS[0]);

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onConfirm(`${emoji}${trimmed}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">👋</div>
          <h2 className="text-xl font-black text-gray-900">닉네임을 입력해줘!</h2>
          <p className="text-gray-400 text-sm mt-1">투표할 때 이름이 표시돼요</p>
        </div>

        {/* 이모지 선택 */}
        <div className="flex justify-center gap-2 mb-4">
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              className={`text-xl w-9 h-9 rounded-xl transition-all
                ${emoji === e ? "bg-orange-100 scale-110 shadow-sm" : "hover:bg-gray-100"}`}
            >
              {e}
            </button>
          ))}
        </div>

        {/* 미리보기 */}
        {name.trim() && (
          <div className="text-center mb-3">
            <span className="inline-block bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              {emoji}{name.trim()}
            </span>
          </div>
        )}

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="이름 입력 (예: 홍길동)"
          maxLength={8}
          autoFocus
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-orange-400 transition mb-4"
        />

        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="w-full py-3.5 rounded-2xl bg-orange-500 text-white font-bold text-base
            hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          입장하기 🚀
        </button>
      </div>
    </div>
  );
}
