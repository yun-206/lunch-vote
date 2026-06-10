"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

type CategorySummary = {
  categoryId: string;
  name: string;
  emoji: string;
  total: number;
  color: string;
};

type Props = {
  summary: CategorySummary[];
};

export default function VoteChart({ summary }: Props) {
  const hasData = summary.some((s) => s.total > 0);

  if (!hasData) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 text-center">
        <p className="text-4xl mb-2">🍽️</p>
        <p className="text-gray-400 text-sm">메뉴를 클릭하면 차트가 보여요</p>
      </div>
    );
  }

  const radarData = summary.map((s) => ({
    subject: s.emoji + " " + s.name,
    value: s.total,
  }));

  const barData = summary.filter((s) => s.total > 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-4 space-y-4">
      <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
        <span>📊</span> 카테고리별 현황
      </h3>

      {/* Bar chart */}
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barData}
            margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#666" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#aaa" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number) => [`${value}표`, "투표수"]}
              contentStyle={{
                borderRadius: 12,
                border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                fontSize: 13,
              }}
            />
            <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {barData.map((entry) => (
                <Cell key={entry.categoryId} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar chart */}
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} margin={{ top: 0, bottom: 0 }}>
            <PolarGrid stroke="#f0ece6" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 11, fill: "#888" }}
            />
            <Radar
              name="투표"
              dataKey="value"
              stroke="#FF6B35"
              fill="#FF6B35"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Tooltip
              formatter={(value: number) => [`${value}표`, "투표"]}
              contentStyle={{
                borderRadius: 12,
                border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                fontSize: 13,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
