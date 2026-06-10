"use client";

import { Restaurant } from "@/data/menuData";

type Props = {
  restaurant: Restaurant;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-base ${
            star <= Math.floor(rating)
              ? "text-yellow-400"
              : star - 0.5 <= rating
              ? "text-yellow-300"
              : "text-gray-200"
          }`}
        >
          ★
        </span>
      ))}
      <span className="text-sm font-bold text-gray-700 ml-1">{rating}</span>
    </div>
  );
}

export default function RestaurantCard({ restaurant }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 flex flex-col gap-2 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-bold text-gray-900 text-base leading-tight">
          {restaurant.name}
        </h4>
        <StarRating rating={restaurant.rating} />
      </div>

      <p className="text-gray-500 text-xs flex items-center gap-1">
        <span>📍</span>
        {restaurant.address}
      </p>

      <p className="text-gray-700 text-sm leading-relaxed bg-orange-50 rounded-xl px-3 py-2">
        "{restaurant.review}"
      </p>

      <div className="flex flex-wrap gap-1">
        {restaurant.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      <a
        href={restaurant.naverMapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors"
      >
        <span>🗺️</span>
        네이버 지도에서 보기
      </a>
    </div>
  );
}
