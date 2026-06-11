"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { subscribeToRoom, castVote, addCustomItemToRoom, finalizeRoom, Room } from "@/lib/roomActions";
import { INITIAL_CATEGORIES, CAFE_ITEMS, Category, MenuItem } from "@/data/menuData";
import CategoryCard from "@/components/CategoryCard";
import CafeVotePanel from "@/components/CafeVotePanel";
import VoteChart from "@/components/VoteChart";
import ResultModal from "@/components/ResultModal";
import RoomHeader from "@/components/RoomHeader";
import NicknameModal from "@/components/NicknameModal";
import RouletteModal from "@/components/RouletteModal";
import ModeSelectModal from "@/components/ModeSelectModal";
import KakaoMap from "@/components/KakaoMap";

type Mode = "food" | "cafe";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [myVotes, setMyVotes] = useState<Set<string>>(new Set());
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tiedMenus, setTiedMenus] = useState<{ menuId: string; name: string; count: number }[] | null>(null);
  const [mapQuery, setMapQuery] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToRoom(roomId, (data) => {
      if (!data) { setNotFound(true); }
      else { setRoom(data); if (data.finalized) setShowResult(true); }
      setLoading(false);
    });
    return unsubscribe;
  }, [roomId]);

  const location = room?.location || "신림역";

  useEffect(() => {
    if (mode === "cafe") setMapQuery(`${location} 카페`);
    else if (mode === "food") setMapQuery(`${location} 음식점`);
  }, [mode, location]);

  const mergedCategories: Category[] = INITIAL_CATEGORIES.map((cat) => {
    const customs = room?.customItems?.[cat.id] || [];
    return { ...cat, items: [...cat.items, ...customs.map((c) => ({ ...c, custom: true }))] };
  });

  const customCafes: MenuItem[] = (room?.customItems?.["cafe"] || []).map((c) => ({ ...c, custom: true }));
  const votes = room?.votes || {};

  const getAllItems = useCallback(() => {
    if (mode === "cafe") return [...CAFE_ITEMS, ...customCafes];
    return mergedCategories.flatMap((c) => c.items);
  }, [mode, mergedCategories, customCafes]);

  const getTopMenuItem = useCallback(() => {
    const items = getAllItems();
    let maxCount = 0, topMenuId = "";
    Object.entries(votes).forEach(([id, voters]) => {
      const count = Array.isArray(voters) ? voters.length : 0;
      if (count > maxCount) { maxCount = count; topMenuId = id; }
    });
    if (!topMenuId || maxCount === 0) return null;
    const item = items.find((i) => i.id === topMenuId);
    if (item) return { menuId: topMenuId, name: item.name, count: maxCount, categoryId: mode === "cafe" ? "cafe" : "" };
    return null;
  }, [votes, getAllItems, mode]);

  const getTiedMenus = useCallback(() => {
    let maxCount = 0;
    Object.values(votes).forEach((v) => { const c = Array.isArray(v) ? v.length : 0; if (c > maxCount) maxCount = c; });
    if (maxCount === 0) return [];
    const items = getAllItems();
    const tied: { menuId: string; name: string; count: number }[] = [];
    Object.entries(votes).forEach(([id, voters]) => {
      const count = Array.isArray(voters) ? voters.length : 0;
      if (count === maxCount) {
        const item = items.find((i) => i.id === id);
        if (item) tied.push({ menuId: id, name: item.name, count });
      }
    });
    return tied;
  }, [votes, getAllItems]);

  const getCategoryVoteSummary = useCallback(() => {
    if (mode === "cafe") return [];
    return mergedCategories.map((cat) => ({
      categoryId: cat.id, name: cat.name, emoji: cat.emoji,
      total: cat.items.reduce((s, i) => s + (Array.isArray(votes[i.id]) ? votes[i.id].length : 0), 0),
      color: cat.color,
    }));
  }, [mergedCategories, votes, mode]);

  const totalVotes = Object.values(votes).reduce((s, v) => s + (Array.isArray(v) ? v.length : 0), 0);
  const top = getTopMenuItem();

  const handleVote = async (menuId: string, menuName: string) => {
    if (room?.finalized || !nickname) return;
    const isVoted = myVotes.has(menuId);
    const next = new Set(myVotes);
    isVoted ? next.delete(menuId) : next.add(menuId);
    setMyVotes(next);
    await castVote(roomId, menuId, nickname, isVoted);
    if (!isVoted) setMapQuery(`${location} ${menuName}`);
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

  const finalMenuItem = room?.finalMenuId ? getAllItems().find((i) => i.id === room.finalMenuId) : null;

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
      {nickname && !mode && <ModeSelectModal onSelect={(m) => setMode(m)} />}
      {tiedMenus && <RouletteModal tiedMenus={tiedMenus} onSelected={(menuId) => handleRouletteResult(menuId)} />}
      <RoomHeader
        title={room?.title || ""} date={room?.date || ""}
        location={room?.location || ""}
        totalVotes={totalVotes} topMenuName={top?.name ?? null} topMenuCount={top?.count ?? 0}
        onFinalize={handleFinalize} isFinalized={!!room?.finalized}
        onCopyLink={handleCopyLink} copied={copied} nickname={nickname}
        mode={mode} onSwitchMode={() => setMode(null)}
      />
      <div className="flex h-[calc(100vh-56px)]">
        <div className="w-full lg:w-1/2 overflow-y-auto px-4 py-4 space-y-4">
          {mode === "food" && (
            <>
              <VoteChart summary={getCategoryVoteSummary()} />
              {mergedCategories.map((category) => (
                <div key={category.id} onClick={() => setMapQuery(`${location} ${category.name}`)}>
                  <CategoryCard
                    category={category} votes={votes} myVotes={myVotes}
                    onVote={handleVote} onAddItem={handleAddItem}
                    topMenuId={top?.menuId ?? null} isFinalized={!!room?.finalized}
                  />
                </div>
              ))}
            </>
          )}
          {mode === "cafe" && (
            <CafeVotePanel
              votes={votes} myVotes={myVotes} customCafes={customCafes}
              onVote={handleVote}
              onAddItem={(name) => handleAddItem("cafe", name)}
              isFinalized={!!room?.finalized}
            />
          )}
          <p className="text-center text-xs text-gray-400 pb-6">방 ID: {roomId}</p>
        </div>
        <div className="hidden lg:flex lg:w-1/2 flex-col sticky top-0 h-full border-l border-orange-100">
          <div className="bg-orange-50 px-4 py-2 text-xs font-medium text-orange-600 flex items-center justify-between border-b border-orange-100">
            <span>🗺️ {mapQuery}</span>
            <button onClick={() => setMapQuery(`${location} ${mode === "cafe" ? "카페" : "음식점"}`)}
              className="text-gray-400 hover:text-orange-400 transition text-xs">초기화</button>
          </div>
          <div className="flex-1">
            {mapQuery && <KakaoMap query={mapQuery} height="100%" />}
          </div>
        </div>
      </div>
      {showResult && room?.finalMenuId && finalMenuItem && (
        <ResultModal
          menuName={finalMenuItem.name} menuId={room.finalMenuId}
          categoryId={mode === "cafe" ? "cafe" : ""}
          location={room.location}
          voteCount={Array.isArray(votes[room.finalMenuId]) ? votes[room.finalMenuId].length : 0}
          onClose={() => setShowResult(false)}
          onReset={() => { window.location.href = "/"; }}
        />
      )}
    </div>
  );
}
