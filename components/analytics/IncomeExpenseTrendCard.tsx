"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { formatCurrency } from "@/lib/formatCurrency";

type Props = {
  income: number;
  expenses: number;
};

export default function IncomeExpenseTrendCard({
  income,
  expenses,
}: Props) {
  const data = [
    {
      month: "Mar",
      income: income * 0.95,
      expenses: expenses * 0.92,
    },
    {
      month: "Apr",
      income: income * 0.98,
      expenses: expenses * 0.95,
    },
    {
      month: "May",
      income,
      expenses,
    },
    {
      month: "Jun",
      income: income * 1.02,
      expenses: expenses * 0.98,
    },
    {
      month: "Jul",
      income: income * 1.03,
      expenses: expenses,
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        📈 Income vs Expense Trend
      </h2>

      <div className="mt-8 h-80">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={data}>
            <XAxis dataKey="month" />

            <YAxis
              tickFormatter={(value) =>
                `$${Math.round(Number(value) / 1000)}k`
              }
            />

            <Tooltip
              formatter={(value) =>
                formatCurrency(Number(value))
              }
            />

            <Line
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#16a34a"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#dc2626"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}