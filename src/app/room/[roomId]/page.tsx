"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { subscribeToRoom, castVote, addCustomItemToRoom, finalizeRoom, Room } from "@/lib/roomActions";
import { INITIAL_CATEGORIES, Category } from "@/data/menuData";
import CategoryCard from "@/components/CategoryCard";
import VoteChart from "@/components/VoteChart";
import ResultModal from "@/components/ResultModal";
import RoomHeader from "@/components/RoomHeader";
import NicknameModal from "@/components/NicknameModal";
import RouletteModal from "@/components/RouletteModal";
import KakaoMap from "@/components/KakaoMap";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null);
  const [myVotes, setMyVotes] = useState<Set<string>>(new Set());
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tiedMenus, setTiedMenus] = useState<{ menuId: string; name: string; count: number }[] | null>(null);
  const [mapQuery, setMapQuery] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToRoom(roomId, (data) => {
      if (!data) { setNotFound(true); }
      else {
        setRoom(data);
        if (data.finalized) setShowResult(true);
        // 기본 지도 쿼리: 위치 + 음식점
        if (!mapQuery && data.location) setMapQuery(`${data.location} 음식점`);
        else if (!mapQuery) setMapQuery("신림역 음식점");
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [roomId]);

  const mergedCategories: Category[] = INITIAL_CATEGORIES.map((cat) => {
    const customs = room?.customItems?.[cat.id] || [];
    return { ...cat, items: [...cat.items, ...customs.map((c) => ({ ...c, custom: true }))] };
  });

  const votes = room?.votes || {};
  const location = room?.location || "신림역";

  const getTopMenuItem = useCallback(() => {
    let maxCount = 0, topMenuId = "";
    Object.entries(votes).forEach(([id, voters]) => {
      const count = Array.isArray(voters) ? voters.length : 0;
      if (count > maxCount) { maxCount = count; topMenuId = id; }
    });
    if (!topMenuId || maxCount === 0) return null;
    for (const cat of mergedCategories) {
      const item = cat.items.find((i) => i.id === topMenuId);
      if (item) return { menuId: topMenuId, name: item.name, count: maxCount, categoryId: cat.id };
    }
    return null;
  }, [votes, mergedCategories]);

  const getTiedMenus = useCallback(() => {
    let maxCount = 0;
    Object.values(votes).forEach((v) => { const c = Array.isArray(v) ? v.length : 0; if (c > maxCount) maxCount = c; });
    if (maxCount === 0) return [];
    const tied: { menuId: string; name: string; count: number }[] = [];
    Object.entries(votes).forEach(([id, voters]) => {
      const count = Array.isArray(voters) ? voters.length : 0;
      if (count === maxCount) {
        for (const cat of mergedCategories) {
          const item = cat.items.find((i) => i.id === id);
          if (item) { tied.push({ menuId: id, name: item.name, count }); break; }
        }
      }
    });
    return tied;
  }, [votes, mergedCategories]);

  const getCategoryVoteSummary = useCallback(() => {
    return mergedCategories.map((cat) => ({
      categoryId: cat.id, name: cat.name, emoji: cat.emoji,
      total: cat.items.reduce((s, i) => s + (Array.isArray(votes[i.id]) ? votes[i.id].length : 0), 0),
      color: cat.color,
    }));
  }, [mergedCategories, votes]);

  const totalVotes = Object.values(votes).reduce((s, v) => s + (Array.isArray(v) ? v.length : 0), 0);
  const top = getTopMenuItem();

  const handleVote = async (menuId: string, menuName: string) => {
    if (room?.finalized || !nickname) return;
    const isVoted = myVotes.has(menuId);
    const next = new Set(myVotes);
    isVoted ? next.delete(menuId) : next.add(menuId);
    setMyVotes(next);
    await castVote(roomId, menuId, nickname, isVoted);
    // 클릭한 메뉴로 지도 업데이트
    if (!isVoted) setMapQuery(`${location} ${menuName}`);
  };

  const handleCategoryMapUpdate = (categoryName: string) => {
    setMapQuery(`${location} ${categoryName}`);
  };

  const handleAddItem = async (categoryId: string, name: string) => {
    await addCustomItemToRoom(roomId, categoryId, { id: `custom-${categoryId}-${Date.now()}`, name });
  };

  const handleFinalize = async () => {
    if (totalVotes === 0) return;
    const tied = getTiedMenus();
    if (tied.length > 1) { setTiedMenus(tied); }
    else if (top) { await finalizeRoom(roomId, top.menuId); }
  };

  const handleRouletteResult = async (menuId: string) => {
    setTiedMenus(null);
    await finalizeRoom(roomId, menuId);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const finalCategory = room?.finalMenuId
    ? mergedCategories.find((c) => c.items.some((i) => i.id === room.finalMenuId)) : null;
  const finalMenuItem = room?.finalMenuId
    ? mergedCategories.flatMap((c) => c.items).find((i) => i.id === room.finalMenuId) : null;

  if (loading) return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center">
      <div className="text-center"><div className="text-5xl mb-3 animate-bounce">🍱</div><p className="text-gray-500">불러오는 중...</p></div>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-3">😅</div>
        <p className="text-gray-700 font-bold">방을 찾을 수 없어요</p>
        <a href="/" className="mt-4 inline-block text-orange-500 underline text-sm">새 방 만들기</a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-orange-50/50">
      {!nickname && <NicknameModal onConfirm={(name) => setNickname(name)} />}
      {tiedMenus && <RouletteModal tiedMenus={tiedMenus} onSelected={(menuId) => handleRouletteResult(menuId)} />}

      <RoomHeader
        title={room?.title || ""} date={room?.date || ""}
        location={room?.location || ""}
        totalVotes={totalVotes} topMenuName={top?.name ?? null} topMenuCount={top?.count ?? 0}
        onFinalize={handleFinalize} isFinalized={!!room?.finalized}
        onCopyLink={handleCopyLink} copied={copied} nickname={nickname}
      />

      {/* 2단 레이아웃 */}
      <div className="flex h-[calc(100vh-56px)]">

        {/* 왼쪽: 투표 패널 */}
        <div className="w-full lg:w-1/2 overflow-y-auto px-4 py-4 space-y-4">
          <VoteChart summary={getCategoryVoteSummary()} />

          {mergedCategories.map((category) => (
            <CategoryCardWithMap
              key={category.id}
              category={category}
              votes={votes}
              myVotes={myVotes}
              onVote={(menuId, menuName) => handleVote(menuId, menuName)}
              onCategoryClick={() => handleCategoryMapUpdate(category.name)}
              onAddItem={handleAddItem}
              topMenuId={top?.menuId ?? null}
              isFinalized={!!room?.finalized}
            />
          ))}

          <p className="text-center text-xs text-gray-400 pb-6">방 ID: {roomId}</p>
        </div>

        {/* 오른쪽: 지도 패널 (데스크톱만) */}
        <div className="hidden lg:flex lg:w-1/2 flex-col sticky top-0 h-full border-l border-orange-100">
          <div className="bg-orange-50 px-4 py-2 text-xs font-medium text-orange-600 flex items-center gap-2 border-b border-orange-100">
            <span>🗺️</span>
            <span className="flex-1 truncate">{mapQuery}</span>
            <button
              onClick={() => setMapQuery(`${location} 음식점`)}
              className="text-gray-400 hover:text-orange-400 transition text-xs"
            >
              초기화
            </button>
          </div>
          <div className="flex-1">
            <KakaoMap query={mapQuery} height="100%" />
          </div>
        </div>
      </div>

      {showResult && room?.finalMenuId && finalMenuItem && finalCategory && (
        <ResultModal
          menuName={finalMenuItem.name} menuId={room.finalMenuId}
          categoryId={finalCategory.id} location={room.location}
          voteCount={Array.isArray(votes[room.finalMenuId]) ? votes[room.finalMenuId].length : 0}
          onClose={() => setShowResult(false)}
          onReset={() => { window.location.href = "/"; }}
        />
      )}
    </div>
  );
}

// 지도 연동 CategoryCard 래퍼
function CategoryCardWithMap({
  category, votes, myVotes, onVote, onCategoryClick, onAddItem, topMenuId, isFinalized
}: {
  category: Category;
  votes: { [menuId: string]: string[] };
  myVotes: Set<string>;
  onVote: (menuId: string, menuName: string) => void;
  onCategoryClick: () => void;
  onAddItem: (categoryId: string, name: string) => void;
  topMenuId: string | null;
  isFinalized: boolean;
}) {
  return (
    <div onClick={onCategoryClick}>
      <CategoryCard
        category={category}
        votes={votes}
        myVotes={myVotes}
        onVote={onVote}
        onAddItem={onAddItem}
        topMenuId={topMenuId}
        isFinalized={isFinalized}
      />
    </div>
  );
}
