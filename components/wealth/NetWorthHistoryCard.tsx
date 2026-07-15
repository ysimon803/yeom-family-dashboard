"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { formatCurrency } from "@/lib/formatCurrency";

type Props = {
  currentNetWorth: number;
};

export default function NetWorthHistoryCard({
  currentNetWorth,
}: Props) {
  const data = [
    {
      year: "2024",
      value: currentNetWorth * 0.55,
    },
    {
      year: "2025",
      value: currentNetWorth * 0.72,
    },
    {
      year: "2026",
      value: currentNetWorth,
    },
    {
      year: "2027",
      value: currentNetWorth * 1.18,
    },
    {
      year: "2028",
      value: currentNetWorth * 1.38,
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        📈 Net Worth History
      </h2>

      <div className="mt-8 h-80">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={data}>
            <XAxis dataKey="year" />

            <YAxis
              tickFormatter={(value) =>
                `$${Math.round(value / 1000)}k`
              }
            />

            <Tooltip
                formatter={(value) =>
                formatCurrency(Number(value))
            }
            />

            <Line
              type="monotone"
              dataKey="value"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}