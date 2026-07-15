"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { formatCurrency } from "@/lib/formatCurrency";

type Props = {
  currentBalance: number;
  annualContribution: number;
  annualReturn?: number;
  currentAge: number;
  retirementAge: number;
};

export default function RetirementProjectionChart({
  currentBalance,
  annualContribution,
  annualReturn = 8,
  currentAge,
  retirementAge,
}: Props) {
  const data = [];

  let balance = currentBalance;

  for (
    let age = currentAge;
    age <= retirementAge;
    age++
  ) {
    data.push({
      age,
      balance: Math.round(balance),
    });

    balance =
      balance * (1 + annualReturn / 100) +
      annualContribution;
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        📈 Retirement Projection
      </h2>

      <div className="mt-6 h-96">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="age" />

            <YAxis
              tickFormatter={(value) =>
                formatCurrency(value)
              }
            />

            <Tooltip
              formatter={(value) =>
                formatCurrency(Number(value))
              }
            />

            <Line
              type="monotone"
              dataKey="balance"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}