import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "오늘 뭐 먹지? 🍱",
  description: "점심 메뉴 투표 앱 — 신림역 근처 맛집 추천",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
