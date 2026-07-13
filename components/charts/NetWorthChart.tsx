"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { netWorthHistory } from "@/data/history";

export default function NetWorthChart() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
      <h2 className="mb-6 text-xl font-semibold">
        📈 Net Worth Trend
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={netWorthHistory}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis
              tickFormatter={(v) => `$${v / 1000}k`}
            />

            <Tooltip
              formatter={(value) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format(Number(value))
              }
            />

            <Line
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={4}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}