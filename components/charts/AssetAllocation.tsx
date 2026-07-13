"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import { portfolio } from "@/data/portfolio";

const data = [
  {
    name: "Retirement",
    value: portfolio.retirement.total,
  },
  {
    name: "TI Equity",
    value: portfolio.ti.total,
  },
  {
    name: "Cash",
    value: portfolio.cash,
  },
  {
    name: "Home Equity",
    value: portfolio.house.equity,
  },
];

const COLORS = [
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];

export default function AssetAllocation() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">
        🥧 Asset Allocation
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label={(entry) => entry.name}
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format(Number(value))
              }
            />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}