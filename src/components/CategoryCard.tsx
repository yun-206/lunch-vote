"use client";

import { useState } from "react";
import { Category } from "@/data/menuData";
import { VoteState } from "@/hooks/useVote";

type Props = {
  category: Category;
  votes: VoteState;
  myVotes: Set<string>;
  onVote: (menuId: string) => void;
  onAddItem: (categoryId: string, name: string) => void;
  topMenuId: string | null;
  isFinalized: boolean;
};

export default function CategoryCard({
  category,
  votes,
  myVotes,
  onVote,
  onAddItem,
  topMenuId,
  isFinalized,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  const maxVote = Math.max(...category.items.map((i) => votes[i.id] || 0), 1);

  const handleAdd = () => {
    if (newItemName.trim()) {
      onAddItem(category.id, newItemName.trim());
      setNewItemName("");
      setAdding(false);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden"
      style={{ borderTopColor: category.color, borderTopWidth: 3 }}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-2">
        <span className="text-2xl">{category.emoji}</span>
        <h2 className="font-bold text-gray-800 text-lg">{category.name}</h2>
        <span
          className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: category.color + "20", color: category.color }}
        >
          {category.items.reduce((s, i) => s + (votes[i.id] || 0), 0)}표
        </span>
      </div>

      {/* Items */}
      <div className="px-3 pb-3 flex flex-wrap gap-2">
        {category.items.map((item) => {
          const count = votes[item.id] || 0;
          const isMine = myVotes.has(item.id);
          const isTop = item.id === topMenuId && count > 0;
          const barWidth =
            maxVote > 0 ? Math.round((count / maxVote) * 100) : 0;

          return (
            <button
              key={item.id}
              onClick={() => !isFinalized && onVote(item.id)}
              disabled={isFinalized}
              className={`
                relative group flex items-center gap-1.5 px-3 py-2 rounded-xl
                border-2 text-sm font-medium transition-all duration-200 overflow-hidden
                ${isFinalized ? "cursor-default" : "cursor-pointer hover:scale-105"}
                ${
                  isTop
                    ? "border-yellow-400 bg-yellow-50 shadow-md"
                    : isMine
                    ? "border-opacity-100 text-white"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300"
                }
              `}
              style={
                isMine
                  ? { borderColor: category.color, background: category.color }
                  : {}
              }
            >
              {/* vote bar bg */}
              {count > 0 && !isMine && (
                <span
                  className="absolute inset-0 opacity-10 transition-all duration-500"
                  style={{
                    width: `${barWidth}%`,
                    background: category.color,
                  }}
                />
              )}

              {isTop && <span className="text-base">👑</span>}
              <span className="relative z-10">{item.name}</span>
              {count > 0 && (
                <span
                  className={`relative z-10 text-xs font-bold px-1.5 py-0.5 rounded-full
                    ${isMine ? "bg-white/30 text-white" : "text-white"}
                  `}
                  style={!isMine ? { background: category.color } : {}}
                >
                  {count}
                </span>
              )}
              {item.custom && (
                <span className="relative z-10 text-xs opacity-60">✨</span>
              )}
            </button>
          );
        })}

        {/* Add button */}
        {!isFinalized &&
          (adding ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                  if (e.key === "Escape") setAdding(false);
                }}
                placeholder="메뉴 이름"
                autoFocus
                className="border-2 border-orange-300 rounded-xl px-3 py-2 text-sm w-28 outline-none focus:border-orange-400"
              />
              <button
                onClick={handleAdd}
                className="w-8 h-8 rounded-xl bg-orange-400 text-white text-lg font-bold hover:bg-orange-500 transition"
              >
                ✓
              </button>
              <button
                onClick={() => setAdding(false)}
                className="w-8 h-8 rounded-xl bg-gray-200 text-gray-600 hover:bg-gray-300 transition text-sm"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 text-sm hover:border-orange-300 hover:text-orange-400 transition-all"
            >
              <span className="text-base leading-none">+</span>
              <span>추가</span>
            </button>
          ))}
      </div>
    </div>
  );
}
