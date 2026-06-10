// 메뉴 데이터
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
    id: "korean",
    name: "한식",
    emoji: "🍲",
    color: "#FF6B35",
    items: [
      { id: "kimchi-jjigae", name: "김치찌개" },
      { id: "kimchi-jjim", name: "김치찜" },
      { id: "jjimdak", name: "찜닭" },
      { id: "jeyuk", name: "제육" },
      { id: "gobdori", name: "곱도리탕" },
      { id: "bibimbap", name: "비빔밥" },
      { id: "cupbap", name: "컵밥" },
      { id: "gukbap", name: "국밥" },
      { id: "bossam", name: "보쌈" },
      { id: "jokbal", name: "족발" },
      { id: "korean-etc", name: "기타" },
    ],
  },
  {
    id: "western",
    name: "양식",
    emoji: "🍝",
    color: "#E8A838",
    items: [
      { id: "pasta", name: "파스타" },
      { id: "pizza", name: "피자" },
      { id: "risotto", name: "리조또" },
      { id: "steak", name: "스테이크" },
      { id: "western-etc", name: "기타" },
    ],
  },
  {
    id: "chinese",
    name: "중식",
    emoji: "🥟",
    color: "#D94F3D",
    items: [
      { id: "jajang", name: "짜장면" },
      { id: "jjamppong", name: "짬뽕" },
      { id: "malatang", name: "마라탕" },
      { id: "marashangguo", name: "마라샹궈" },
      { id: "chinese-etc", name: "기타" },
    ],
  },
  {
    id: "japanese",
    name: "일식",
    emoji: "🍱",
    color: "#6B9ECC",
    items: [
      { id: "donkasu", name: "돈까스" },
      { id: "sushi", name: "초밥" },
      { id: "ramen", name: "라멘" },
      { id: "curry", name: "카레" },
      { id: "okonomiyaki", name: "오꼬노미야끼" },
      { id: "japanese-etc", name: "기타" },
    ],
  },
  {
    id: "bunsik",
    name: "분식",
    emoji: "🌮",
    color: "#7CB87C",
    items: [
      { id: "tteokbokki", name: "떡볶이" },
      { id: "sundae", name: "순대" },
      { id: "twigim", name: "튀김" },
      { id: "guksu", name: "국수" },
      { id: "gimbap", name: "김밥" },
      { id: "bunsik-etc", name: "기타" },
    ],
  },
  {
    id: "other",
    name: "기타",
    emoji: "🌍",
    color: "#9B7DB8",
    items: [
      { id: "vietnam", name: "베트남 음식" },
      { id: "thai", name: "태국 음식" },
      { id: "mexican", name: "멕시칸" },
      { id: "burger", name: "버거" },
      { id: "other-etc", name: "기타" },
    ],
  },
];

// 신림역 근처 맛집 하드코딩 데이터
export type Restaurant = {
  id: string;
  name: string;
  address: string;
  rating: number;
  review: string;
  tags: string[];
  naverMapUrl: string;
  menuIds: string[]; // 해당 맛집이 매칭되는 메뉴 id 목록
  categories: string[]; // 카테고리 id
};

export const RESTAURANTS: Restaurant[] = [
  // 한식
  {
    id: "r1",
    name: "신림 김치찌개 명가",
    address: "서울 관악구 신림동 533-12",
    rating: 4.5,
    review: "뚝배기에 나오는 깊은 맛 김치찌개, 점심 정식 강추!",
    tags: ["혼밥가능", "점심특선", "주차불가"],
    naverMapUrl: "https://map.naver.com/v5/search/신림역 김치찌개",
    menuIds: ["kimchi-jjigae", "kimchi-jjim"],
    categories: ["korean"],
  },
  {
    id: "r2",
    name: "찜닭&제육 골목식당",
    address: "서울 관악구 신림로 340",
    rating: 4.3,
    review: "양 많고 맛있는 찜닭, 두 명이 먹기 딱 좋은 양",
    tags: ["2인이상", "양많음", "가성비"],
    naverMapUrl: "https://map.naver.com/v5/search/신림역 찜닭",
    menuIds: ["jjimdak", "jeyuk"],
    categories: ["korean"],
  },
  {
    id: "r3",
    name: "국밥이최고야",
    address: "서울 관악구 신림동 105-3",
    rating: 4.4,
    review: "24시간 운영, 해장용으로도 완벽한 순대국밥",
    tags: ["24시간", "혼밥가능", "해장"],
    naverMapUrl: "https://map.naver.com/v5/search/신림역 국밥",
    menuIds: ["gukbap", "sundae"],
    categories: ["korean", "bunsik"],
  },
  {
    id: "r4",
    name: "보쌈족발 신림본점",
    address: "서울 관악구 신림로 299",
    rating: 4.6,
    review: "쫄깃한 족발에 새우젓 조합, 포장도 가능해요",
    tags: ["포장가능", "단체가능", "배달가능"],
    naverMapUrl: "https://map.naver.com/v5/search/신림역 보쌈족발",
    menuIds: ["bossam", "jokbal"],
    categories: ["korean"],
  },
  {
    id: "r5",
    name: "비빔컵밥 한그릇",
    address: "서울 관악구 신림동 440-22",
    rating: 4.1,
    review: "빠르고 저렴하게 한 끼, 직장인 점심에 제격",
    tags: ["빠른식사", "저렴", "혼밥가능"],
    naverMapUrl: "https://map.naver.com/v5/search/신림역 비빔밥",
    menuIds: ["bibimbap", "cupbap"],
    categories: ["korean"],
  },
  // 양식
  {
    id: "r6",
    name: "파스타공방 신림점",
    address: "서울 관악구 신림로 371",
    rating: 4.4,
    review: "직접 만든 생면 파스타, 크림&오일 모두 맛있음",
    tags: ["데이트", "혼밥가능", "조용한"],
    naverMapUrl: "https://map.naver.com/v5/search/신림역 파스타",
    menuIds: ["pasta", "risotto"],
    categories: ["western"],
  },
  {
    id: "r7",
    name: "피자앤그릴 신림",
    address: "서울 관악구 신림동 1637",
    rating: 4.2,
    review: "화덕피자와 스테이크를 한 곳에서, 런치 세트 합리적",
    tags: ["런치세트", "단체가능", "주차가능"],
    naverMapUrl: "https://map.naver.com/v5/search/신림역 피자",
    menuIds: ["pizza", "steak"],
    categories: ["western"],
  },
  // 중식
  {
    id: "r8",
    name: "홍콩반점 신림점",
    address: "서울 관악구 신림로 285",
    rating: 4.3,
    review: "짜장&짬뽕 둘 다 맛있는 정직한 중국집",
    tags: ["배달가능", "포장가능", "가성비"],
    naverMapUrl: "https://map.naver.com/v5/search/신림역 중국집",
    menuIds: ["jajang", "jjamppong"],
    categories: ["chinese"],
  },
  {
    id: "r9",
    name: "마라왕 신림본점",
    address: "서울 관악구 신림동 337-8",
    rating: 4.5,
    review: "마라탕은 4단계 추천, 마라샹궈는 2인분부터",
    tags: ["매운맛", "2인이상", "인스타감성"],
    naverMapUrl: "https://map.naver.com/v5/search/신림역 마라탕",
    menuIds: ["malatang", "marashangguo"],
    categories: ["chinese"],
  },
  // 일식
  {
    id: "r10",
    name: "돈까스 신림본가",
    address: "서울 관악구 신림로 317",
    rating: 4.6,
    review: "두께 2cm 수제 돈까스, 점심에 줄 서는 맛집",
    tags: ["줄서는맛집", "혼밥가능", "웨이팅있음"],
    naverMapUrl: "https://map.naver.com/v5/search/신림역 돈까스",
    menuIds: ["donkasu"],
    categories: ["japanese"],
  },
  {
    id: "r11",
    name: "신림 라멘집",
    address: "서울 관악구 신림동 88-1",
    rating: 4.4,
    review: "진한 돈코츠 육수, 초밥 세트도 함께 운영",
    tags: ["혼밥가능", "일본감성", "조용한"],
    naverMapUrl: "https://map.naver.com/v5/search/신림역 라멘",
    menuIds: ["ramen", "sushi"],
    categories: ["japanese"],
  },
  {
    id: "r12",
    name: "카레하우스 신림",
    address: "서울 관악구 신림로 355",
    rating: 4.2,
    review: "일본식 카레 전문점, 치즈 토핑 강력 추천",
    tags: ["혼밥가능", "빠른식사", "가성비"],
    naverMapUrl: "https://map.naver.com/v5/search/신림역 카레",
    menuIds: ["curry"],
    categories: ["japanese"],
  },
  // 분식
  {
    id: "r13",
    name: "신림 떡볶이 원조",
    address: "서울 관악구 신림동 533-5",
    rating: 4.7,
    review: "30년 전통 로제 떡볶이, 순대&튀김 세트 필수",
    tags: ["전통맛집", "테이크아웃", "저렴"],
    naverMapUrl: "https://map.naver.com/v5/search/신림역 떡볶이",
    menuIds: ["tteokbokki", "sundae", "twigim"],
    categories: ["bunsik"],
  },
  {
    id: "r14",
    name: "김밥천국 신림점",
    address: "서울 관악구 신림로 268",
    rating: 3.9,
    review: "빠르고 저렴한 한 끼, 국수+김밥 콤보 추천",
    tags: ["24시간", "빠른식사", "혼밥가능"],
    naverMapUrl: "https://map.naver.com/v5/search/신림역 김밥",
    menuIds: ["gimbap", "guksu"],
    categories: ["bunsik"],
  },
  // 기타
  {
    id: "r15",
    name: "쌀국수 신림",
    address: "서울 관악구 신림동 1605-12",
    rating: 4.3,
    review: "진한 육수의 베트남 쌀국수, 태국 요리도 메뉴 있음",
    tags: ["이국적", "혼밥가능", "가성비"],
    naverMapUrl: "https://map.naver.com/v5/search/신림역 베트남음식",
    menuIds: ["vietnam", "thai"],
    categories: ["other"],
  },
  {
    id: "r16",
    name: "멕시카나 버거 신림",
    address: "서울 관악구 신림로 302",
    rating: 4.1,
    review: "수제버거와 타코, 점심 세트 가성비 최고",
    tags: ["수제버거", "테이크아웃", "인스타감성"],
    naverMapUrl: "https://map.naver.com/v5/search/신림역 버거",
    menuIds: ["burger", "mexican"],
    categories: ["other"],
  },
];

// 메뉴 id로 맛집 찾기
export function getRestaurantsByMenuId(menuId: string): Restaurant[] {
  return RESTAURANTS.filter((r) => r.menuIds.includes(menuId)).slice(0, 5);
}

// 카테고리 id로 맛집 찾기
export function getRestaurantsByCategory(categoryId: string): Restaurant[] {
  return RESTAURANTS.filter((r) => r.categories.includes(categoryId)).slice(
    0,
    5
  );
}
