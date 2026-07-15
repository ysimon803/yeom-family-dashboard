"use client";

import { formatCurrency } from "@/lib/formatCurrency";

type Props = {
  annualIncome: number;
  annualSavings: number;
  annualExpenses: number;
  estimatedGrowth: number;
};

export default function YearlyFinancialSummaryCard({
  annualIncome,
  annualSavings,
  annualExpenses,
  estimatedGrowth,
}: Props) {
  const rows = [
    {
      label: "💰 Annual Income",
      value: annualIncome,
    },
    {
      label: "💵 Annual Savings",
      value: annualSavings,
    },
    {
      label: "💳 Annual Expenses",
      value: annualExpenses,
    },
    {
      label: "📈 Estimated Investment Growth",
      value: estimatedGrowth,
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        📅 Yearly Financial Summary
      </h2>

      <div className="mt-6 space-y-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex justify-between border-b py-3"
          >
            <span>{row.label}</span>

            <span className="font-bold">
              {formatCurrency(row.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}