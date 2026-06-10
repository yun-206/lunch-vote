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
  const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
  return (
    <html lang="ko">
      <head>
        <script
          id="kakao-map-script"
          type="text/javascript"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&libraries=services&autoload=false`}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
