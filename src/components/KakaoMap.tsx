"use client";

type Props = {
  query: string;
  height?: string;
};

export default function KakaoMap({ query, height = "300px" }: Props) {
  const encodedQuery = encodeURIComponent(query);
  const src = `https://map.kakao.com/?q=${encodedQuery}`;

  return (
    <iframe
      src={src}
      style={{ width: "100%", height, border: "none" }}
      className="rounded-2xl"
      title="카카오맵"
      allowFullScreen
    />
  );
}
