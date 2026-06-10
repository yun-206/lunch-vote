# 🍱 오늘 뭐 먹지? — 점심 메뉴 투표 앱

신림역 근처 직장인/팀원들을 위한 점심 메뉴 투표 웹앱.

## 빠른 시작

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Vercel 배포

```bash
# 1. Vercel CLI 설치 (처음 한 번만)
npm i -g vercel

# 2. 배포
vercel

# 이후 재배포
vercel --prod
```

## 기능

- 🗳️ **카테고리별 투표** — 한식/양식/중식/일식/분식/기타
- 👑 **1위 하이라이트** — 가장 많은 표를 받은 항목에 왕관 표시
- 📊 **실시간 차트** — 카테고리별 Bar + Radar 차트
- ➕ **커스텀 메뉴 추가** — 각 카테고리에 + 버튼으로 직접 추가
- 🎯 **최종 결정** — 결정 버튼 클릭 시 결과 모달 + 맛집 5곳 카드
- 🗺️ **네이버 지도 연결** — 각 맛집 "네이버 지도에서 보기" 버튼

## 나중에 카카오맵 붙이기

`src/data/menuData.ts`의 `naverMapUrl` 값을 카카오맵 URL로 교체하면 끝:

```ts
// 변경 전
naverMapUrl: "https://map.naver.com/v5/search/신림역 김치찌개"

// 변경 후
naverMapUrl: "https://map.kakao.com/?q=신림역 김치찌개"
```

## 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (차트)
- Vercel 배포
