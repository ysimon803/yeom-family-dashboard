"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Investment = {
  ticker: string;
  balance: number;
};

type Props = {
  investments: Investment[];
};

const COLORS = [
  "#2563EB",
  "#7C3AED",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
];

export default function InvestmentPieChart({
  investments,
}: Props) {
  const grouped = investments.reduce(
    (acc, item) => {
      const ticker = item.ticker || "Other";

      acc[ticker] =
        (acc[ticker] || 0) + Number(item.balance);

      return acc;
    },
    {} as Record<string, number>
  );

  const chartData = Object.entries(grouped).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        📊 Investment Allocation
      </h2>

      <div className="mt-6 h-80">

        <ResponsiveContainer>

          <PieChart>

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label
            >

              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[index % COLORS.length]
                  }
                />
              ))}

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

      <div className="mt-6 space-y-2">

        {chartData.map((item) => (

          <div
            key={item.name}
            className="flex justify-between"
          >

            <span>{item.name}</span>

            <span className="font-bold">
              ${item.value.toLocaleString()}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}