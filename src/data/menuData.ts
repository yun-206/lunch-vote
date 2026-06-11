export type MenuItem = {
  id: string;
  name: string;
  custom?: boolean;
};

export type Category = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  items: MenuItem[];
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "korean", name: "한식", emoji: "🍲", color: "#FF6B35",
    items: [
      { id: "kimchi-jjigae", name: "김치찌개" }, { id: "kimchi-jjim", name: "김치찜" },
      { id: "jjimdak", name: "찜닭" }, { id: "jeyuk", name: "제육" },
      { id: "gobdori", name: "곱도리탕" }, { id: "bibimbap", name: "비빔밥" },
      { id: "cupbap", name: "컵밥" }, { id: "gukbap", name: "국밥" },
      { id: "bossam", name: "보쌈" }, { id: "jokbal", name: "족발" },
      { id: "korean-etc", name: "기타" },
    ],
  },
  {
    id: "western", name: "양식", emoji: "🍝", color: "#E8A838",
    items: [
      { id: "pasta", name: "파스타" }, { id: "pizza", name: "피자" },
      { id: "risotto", name: "리조또" }, { id: "steak", name: "스테이크" },
      { id: "western-etc", name: "기타" },
    ],
  },
  {
    id: "chinese", name: "중식", emoji: "🥟", color: "#D94F3D",
    items: [
      { id: "jajang", name: "짜장면" }, { id: "jjamppong", name: "짬뽕" },
      { id: "malatang", name: "마라탕" }, { id: "marashangguo", name: "마라샹궈" },
      { id: "chinese-etc", name: "기타" },
    ],
  },
  {
    id: "japanese", name: "일식", emoji: "🍱", color: "#6B9ECC",
    items: [
      { id: "donkasu", name: "돈까스" }, { id: "sushi", name: "초밥" },
      { id: "ramen", name: "라멘" }, { id: "curry", name: "카레" },
      { id: "okonomiyaki", name: "오꼬노미야끼" }, { id: "japanese-etc", name: "기타" },
    ],
  },
  {
    id: "bunsik", name: "분식", emoji: "🌮", color: "#7CB87C",
    items: [
      { id: "tteokbokki", name: "떡볶이" }, { id: "sundae", name: "순대" },
      { id: "twigim", name: "튀김" }, { id: "guksu", name: "국수" },
      { id: "gimbap", name: "김밥" }, { id: "bunsik-etc", name: "기타" },
    ],
  },
  {
    id: "other", name: "기타", emoji: "🌍", color: "#9B7DB8",
    items: [
      { id: "vietnam", name: "베트남 음식" }, { id: "thai", name: "태국 음식" },
      { id: "mexican", name: "멕시칸" }, { id: "burger", name: "버거" },
      { id: "other-etc", name: "기타" },
    ],
  },
];

export const CAFE_ITEMS: MenuItem[] = [
  { id: "starbucks", name: "스타벅스" },
  { id: "twosome", name: "투썸플레이스" },
  { id: "ediya", name: "이디야" },
  { id: "mega", name: "메가커피" },
  { id: "compose", name: "컴포즈커피" },
  { id: "paik", name: "빽다방" },
  { id: "paulbassett", name: "폴바셋" },
  { id: "hollys", name: "할리스" },
  { id: "angelinus", name: "엔젤리너스" },
];

export type Restaurant = {
  id: string; name: string; address: string; rating: number;
  review: string; tags: string[]; naverMapUrl: string;
  menuIds: string[]; categories: string[];
};

export const RESTAURANTS: Restaurant[] = [
  { id: "r1", name: "신림 김치찌개 명가", address: "서울 관악구 신림동 533-12", rating: 4.5,
    review: "뚝배기에 나오는 깊은 맛 김치찌개, 점심 정식 강추!", tags: ["혼밥가능", "점심특선"],
    naverMapUrl: "https://map.naver.com/v5/search/신림역 김치찌개", menuIds: ["kimchi-jjigae", "kimchi-jjim"], categories: ["korean"] },
  { id: "r2", name: "찜닭&제육 골목식당", address: "서울 관악구 신림로 340", rating: 4.3,
    review: "양 많고 맛있는 찜닭, 두 명이 먹기 딱 좋은 양", tags: ["2인이상", "양많음", "가성비"],
    naverMapUrl: "https://map.naver.com/v5/search/신림역 찜닭", menuIds: ["jjimdak", "jeyuk"], categories: ["korean"] },
  { id: "r3", name: "국밥이최고야", address: "서울 관악구 신림동 105-3", rating: 4.4,
    review: "24시간 운영, 해장용으로도 완벽한 순대국밥", tags: ["24시간", "혼밥가능"],
    naverMapUrl: "https://map.naver.com/v5/search/신림역 국밥", menuIds: ["gukbap", "sundae"], categories: ["korean"] },
  { id: "r10", name: "돈까스 신림본가", address: "서울 관악구 신림로 317", rating: 4.6,
    review: "두께 2cm 수제 돈까스, 점심에 줄 서는 맛집", tags: ["줄서는맛집", "혼밥가능"],
    naverMapUrl: "https://map.naver.com/v5/search/신림역 돈까스", menuIds: ["donkasu"], categories: ["japanese"] },
  { id: "r13", name: "신림 떡볶이 원조", address: "서울 관악구 신림동 533-5", rating: 4.7,
    review: "30년 전통 로제 떡볶이, 순대&튀김 세트 필수", tags: ["전통맛집", "테이크아웃"],
    naverMapUrl: "https://map.naver.com/v5/search/신림역 떡볶이", menuIds: ["tteokbokki", "sundae", "twigim"], categories: ["bunsik"] },
];

export function getRestaurantsByMenuId(menuId: string): Restaurant[] {
  return RESTAURANTS.filter((r) => r.menuIds.includes(menuId)).slice(0, 5);
}
