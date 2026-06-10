import { db } from "./firebase";
import { ref, set, get, update, onValue, off } from "firebase/database";

export type Room = {
  id: string;
  date: string;
  title: string;
  createdAt: number;
  votes: { [menuId: string]: string[] }; // menuId -> 닉네임 배열
  customItems: { [categoryId: string]: { id: string; name: string }[] };
  finalized: boolean;
  finalMenuId: string | null;
};

export function generateRoomId(date: string): string {
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${date.replace(/-/g, "")}-${random}`;
}

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

export async function getRoom(roomId: string): Promise<Room | null> {
  const snapshot = await get(ref(db, `rooms/${roomId}`));
  if (!snapshot.exists()) return null;
  return snapshot.val() as Room;
}

// 투표: 닉네임 배열로 관리
export async function castVote(
  roomId: string,
  menuId: string,
  nickname: string,
  isRemoving: boolean
): Promise<void> {
  const voteRef = ref(db, `rooms/${roomId}/votes/${menuId}`);
  const snapshot = await get(voteRef);
  const current: string[] = snapshot.exists() ? (snapshot.val() as string[]) : [];

  let updated: string[];
  if (isRemoving) {
    updated = current.filter((n) => n !== nickname);
  } else {
    if (current.includes(nickname)) return;
    updated = [...current, nickname];
  }
  await set(voteRef, updated);
}

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

export async function finalizeRoom(
  roomId: string,
  finalMenuId: string
): Promise<void> {
  await update(ref(db, `rooms/${roomId}`), {
    finalized: true,
    finalMenuId,
  });
}

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
