"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  subscribeToRoom,
  castVote,
  addCustomItemToRoom,
  finalizeRoom,
  Room,
} from "@/lib/roomActions";
import { INITIAL_CATEGORIES, Category } from "@/data/menuData";
import CategoryCard from "@/components/CategoryCard";
import VoteChart from "@/components/VoteChart";
import ResultModal from "@/components/ResultModal";
import RoomHeader from "@/components/RoomHeader";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [myVotes, setMyVotes] = useState<Set<string>>(new Set());
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);

  // 실시간 구독
  useEffect(() => {
    const unsubscribe = subscribeToRoom(roomId, (data) => {
      if (!data) {
        setNotFound(true);
      } else {
        setRoom(data);
        if (data.finalized) setShowResult(true);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [roomId]);

  // 카테고리에 커스텀 아이템 합치기
  const mergedCategories: Category[] = INITIAL_CATEGORIES.map((cat) => {
    const customs = room?.customItems?.[cat.id] || [];
    return {
      ...cat,
      items: [
        ...cat.items,
        ...customs.map((c) => ({ ...c, custom: true })),
      ],
    };
  });

  const votes = room?.votes || {};

  const getTopMenuItem = useCallback(() => {
    let maxCount = 0;
    let topMenuId = "";
    Object.entries(votes).forEach(([id, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topMenuId = id;
      }
    });
    if (!topMenuId || maxCount === 0) return null;
    for (const cat of mergedCategories) {
      const item = cat.items.find((i) => i.id === topMenuId);
      if (item)
        return { menuId: topMenuId, name: item.name, count: maxCount, categoryId: cat.id };
    }
    return null;
  }, [votes, mergedCategories]);

  const getCategoryVoteSummary = useCallback(() => {
    return mergedCategories.map((cat) => ({
      categoryId: cat.id,
      name: cat.name,
      emoji: cat.emoji,
      total: cat.items.reduce((s, i) => s + (votes[i.id] || 0), 0),
      color: cat.color,
    }));
  }, [mergedCategories, votes]);

  const totalVotes = Object.values(votes).reduce((s, v) => s + v, 0);
  const top = getTopMenuItem();

  const handleVote = async (menuId: string) => {
    if (room?.finalized) return;
    const isVoted = myVotes.has(menuId);
    const next = new Set(myVotes);
    if (isVoted) {
      next.delete(menuId);
    } else {
      next.add(menuId);
    }
    setMyVotes(next);
    await castVote(roomId, menuId, isVoted ? -1 : 1);
  };

  const handleAddItem = async (categoryId: string, name: string) => {
    const id = `custom-${categoryId}-${Date.now()}`;
    await addCustomItemToRoom(roomId, categoryId, { id, name });
  };

  const handleFinalize = async () => {
    if (!top) return;
    await finalizeRoom(roomId, top.menuId);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const finalCategory = room?.finalMenuId
    ? mergedCategories.find((c) => c.items.some((i) => i.id === room.finalMenuId))
    : null;

  const finalMenuItem = room?.finalMenuId
    ? mergedCategories.flatMap((c) => c.items).find((i) => i.id === room.finalMenuId)
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3 animate-bounce">🍱</div>
          <p className="text-gray-500">불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3">😅</div>
          <p className="text-gray-700 font-bold">방을 찾을 수 없어요</p>
          <a href="/" className="mt-4 inline-block text-orange-500 underline text-sm">
            새 방 만들기
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50/50">
      <RoomHeader
        title={room?.title || ""}
        date={room?.date || ""}
        totalVotes={totalVotes}
        topMenuName={top?.name ?? null}
        topMenuCount={top?.count ?? 0}
        onFinalize={handleFinalize}
        isFinalized={!!room?.finalized}
        onCopyLink={handleCopyLink}
        copied={copied}
      />

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        <VoteChart summary={getCategoryVoteSummary()} />

        {mergedCategories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            votes={votes}
            myVotes={myVotes}
            onVote={handleVote}
            onAddItem={handleAddItem}
            topMenuId={top?.menuId ?? null}
            isFinalized={!!room?.finalized}
          />
        ))}

        <p className="text-center text-xs text-gray-400 pb-6">
          방 ID: {roomId} · 신림역 기준
        </p>
      </main>

      {showResult && room?.finalMenuId && finalMenuItem && finalCategory && (
        <ResultModal
          menuName={finalMenuItem.name}
          menuId={room.finalMenuId}
          categoryId={finalCategory.id}
          voteCount={votes[room.finalMenuId] || 0}
          onClose={() => setShowResult(false)}
          onReset={() => { window.location.href = "/"; }}
        />
      )}
    </div>
  );
}
