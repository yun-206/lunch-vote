"use client";

import { useState } from "react";
import { CAFE_ITEMS, MenuItem } from "@/data/menuData";

type Props = {
  votes: { [menuId: string]: string[] };
  myVotes: Set<string>;
  customCafes: MenuItem[];
  onVote: (menuId: string, menuName: string) => void;
  onAddItem: (name: string) => void;
  isFinalized: boolean;
};

export default function CafeVotePanel({ votes, myVotes, customCafes, onVote, onAddItem, isFinalized }: Props) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const allItems = [...CAFE_ITEMS, ...customCafes];
  const getCount = (id: string) => (votes[id] || []).length;
  const getVoters = (id: string) => votes[id] || [];
  const maxVote = Math.max(...allItems.map((i) => getCount(i.id)), 1);
  const topId = allItems.reduce((top, item) => getCount(item.id) > getCount(top) ? item.id : top, "");

  const handleAdd = () => {
    if (newName.trim()) { onAddItem(newName.trim()); setNewName(""); setAdding(false); }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden"
      style={{ borderTopColor: "#F59E0B", borderTopWidth: 3 }}>
      <div className="px-4 py-3 flex items-center gap-2">
        <span className="text-2xl">☕</span>
        <h2 className="font-bold text-gray-800 text-lg">카페</h2>
        <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
          {allItems.reduce((s, i) => s + getCount(i.id), 0)}표
        </span>
      </div>
      <div className="px-3 pb-3 flex flex-wrap gap-2">
        {allItems.map((item) => {
          const count = getCount(item.id);
          const voters = getVoters(item.id);
          const isMine = myVotes.has(item.id);
          const isTop = item.id === topId && count > 0;
          const barWidth = maxVote > 0 ? Math.round((count / maxVote) * 100) : 0;
          return (
            <div key={item.id} className="flex flex-col gap-1">
              <button
                onClick={() => !isFinalized && onVote(item.id, item.name)}
                disabled={isFinalized}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-200 overflow-hidden
                  ${isFinalized ? "cursor-default" : "cursor-pointer hover:scale-105"}
                  ${isTop ? "border-yellow-400 bg-yellow-50 shadow-md" : isMine ? "text-white" : "border-gray-200 bg-gray-50 text-gray-700"}`}
                style={isMine ? { borderColor: "#F59E0B", background: "#F59E0B" } : {}}
              >
                {count > 0 && !isMine && (
                  <span className="absolute inset-0 opacity-10" style={{ width: `${barWidth}%`, background: "#F59E0B" }} />
                )}
                {isTop && <span className="text-base">👑</span>}
                <span className="relative z-10">{item.name}</span>
                {count > 0 && (
                  <span className={`relative z-10 text-xs font-bold px-1.5 py-0.5 rounded-full ${isMine ? "bg-white/30 text-white" : "text-white"}`}
                    style={!isMine ? { background: "#F59E0B" } : {}}>{count}</span>
                )}
                {item.custom && <span className="relative z-10 text-xs opacity-60">✨</span>}
              </button>
              {voters.length > 0 && (
                <div className="flex flex-wrap gap-1 px-1">
                  {voters.map((n) => <span key={n} className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">{n}</span>)}
                </div>
              )}
            </div>
          );
        })}
        {!isFinalized && (adding ? (
          <div className="flex items-center gap-1">
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setAdding(false); }}
              placeholder="카페 이름" autoFocus
              className="border-2 border-amber-300 rounded-xl px-3 py-2 text-sm w-28 outline-none focus:border-amber-400" />
            <button onClick={handleAdd} className="w-8 h-8 rounded-xl bg-amber-400 text-white font-bold hover:bg-amber-500 transition">✓</button>
            <button onClick={() => setAdding(false)} className="w-8 h-8 rounded-xl bg-gray-200 text-gray-600 hover:bg-gray-300 transition text-sm">✕</button>
          </div>
        ) : (
          <button onClick={() => setAdding(true)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 text-sm hover:border-amber-300 hover:text-amber-400 transition-all">
            <span className="text-base leading-none">+</span><span>추가</span>
          </button>
        ))}
      </div>
    </div>
  );
}
