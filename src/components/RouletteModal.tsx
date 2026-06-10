"use client";

import { useEffect, useState } from "react";

type Props = {
  tiedMenus: { menuId: string; name: string; count: number }[];
  onSelected: (menuId: string, name: string) => void;
};

export default function RouletteModal({ tiedMenus, onSelected }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [speed, setSpeed] = useState(80);
  const [done, setDone] = useState(false);
  const [winner, setWinner] = useState<{ menuId: string; name: string } | null>(null);

  useEffect(() => {
    let idx = 0;
    let interval = 80;
    let elapsed = 0;
    const totalDuration = 3000;

    const spin = () => {
      idx = (idx + 1) % tiedMenus.length;
      setCurrentIdx(idx);
      elapsed += interval;

      // 점점 느려지기
      if (elapsed > totalDuration * 0.5) interval = 150;
      if (elapsed > totalDuration * 0.75) interval = 300;
      if (elapsed > totalDuration * 0.9) interval = 500;

      if (elapsed >= totalDuration) {
        // 최종 랜덤 선택
        const picked = tiedMenus[Math.floor(Math.random() * tiedMenus.length)];
        setWinner(picked);
        setDone(true);
        return;
      }
      setTimeout(spin, interval);
    };

    setTimeout(spin, interval);
  }, []);

  useEffect(() => {
    if (done && winner) {
      const t = setTimeout(() => {
        onSelected(winner.menuId, winner.name);
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [done, winner]);

  const current = tiedMenus[currentIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl text-center">
        <div className="text-4xl mb-2">{done ? "🎉" : "🎲"}</div>
        <h2 className="text-xl font-black text-gray-900 mb-1">
          {done ? "운명이 결정됐다!" : "동점! 운명의 룰렛"}
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          {done
            ? "잠시 후 결과가 표시돼요"
            : `${tiedMenus.length}개 메뉴가 동점이에요 🎲`}
        </p>

        {/* 룰렛 디스플레이 */}
        <div
          className={`
            relative mx-auto w-52 h-20 rounded-2xl flex items-center justify-center
            text-white text-2xl font-black shadow-lg transition-all duration-150
            ${done ? "bg-yellow-400 scale-110" : "bg-orange-500"}
          `}
        >
          {done ? (
            <span className="animate-pulse">{winner?.name}</span>
          ) : (
            <span>{current?.name}</span>
          )}
        </div>

        {/* 후보 목록 */}
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {tiedMenus.map((m, i) => (
            <span
              key={m.menuId}
              className={`text-sm px-3 py-1 rounded-full font-medium transition-all
                ${!done && i === currentIdx
                  ? "bg-orange-500 text-white scale-110 shadow"
                  : done && m.menuId === winner?.menuId
                  ? "bg-yellow-400 text-white scale-110 shadow"
                  : "bg-gray-100 text-gray-500"
                }`}
            >
              {m.name} ({m.count}표)
            </span>
          ))}
        </div>

        {done && (
          <p className="text-xs text-gray-400 mt-4 animate-pulse">
            결과 화면으로 이동 중...
          </p>
        )}
      </div>
    </div>
  );
}
