import { db } from "./firebase";
import { ref, set, get, update, onValue, off } from "firebase/database";
import { INITIAL_CATEGORIES } from "@/data/menuData";

export type Room = {
  id: string;
  date: string; // "2026-06-10" 형식
  title: string;
  createdAt: number;
  votes: { [menuId: string]: number };
  customItems: { [categoryId: string]: { id: string; name: string }[] };
  finalized: boolean;
  finalMenuId: string | null;
};

// 방 ID 생성 (날짜 기반 + 랜덤 4자리)
export function generateRoomId(date: string): string {
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${date.replace(/-/g, "")}-${random}`;
}

// 방 만들기
export async function createRoom(date: string, title: string): Promise<string> {
  const roomId = generateRoomId(date);
  const room: Room = {
    id: roomId,
    date,
    title,
    createdAt: Date.now(),
    votes: {},
    customItems: {},
    finalized: false,
    finalMenuId: null,
  };
  await set(ref(db, `rooms/${roomId}`), room);
  return roomId;
}

// 방 가져오기
export async function getRoom(roomId: string): Promise<Room | null> {
  const snapshot = await get(ref(db, `rooms/${roomId}`));
  if (!snapshot.exists()) return null;
  return snapshot.val() as Room;
}

// 투표하기
export async function castVote(
  roomId: string,
  menuId: string,
  delta: number // +1 or -1
): Promise<void> {
  const voteRef = ref(db, `rooms/${roomId}/votes/${menuId}`);
  const snapshot = await get(voteRef);
  const current = snapshot.exists() ? (snapshot.val() as number) : 0;
  await set(voteRef, Math.max(0, current + delta));
}

// 커스텀 메뉴 추가
export async function addCustomItemToRoom(
  roomId: string,
  categoryId: string,
  item: { id: string; name: string }
): Promise<void> {
  const room = await getRoom(roomId);
  const existing = room?.customItems?.[categoryId] || [];
  await update(ref(db, `rooms/${roomId}/customItems`), {
    [categoryId]: [...existing, item],
  });
}

// 최종 결정
export async function finalizeRoom(
  roomId: string,
  finalMenuId: string
): Promise<void> {
  await update(ref(db, `rooms/${roomId}`), {
    finalized: true,
    finalMenuId,
  });
}

// 실시간 구독
export function subscribeToRoom(
  roomId: string,
  callback: (room: Room | null) => void
): () => void {
  const roomRef = ref(db, `rooms/${roomId}`);
  onValue(roomRef, (snapshot) => {
    callback(snapshot.exists() ? (snapshot.val() as Room) : null);
  });
  return () => off(roomRef);
}
