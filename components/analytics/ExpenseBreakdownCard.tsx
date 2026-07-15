"use client";

import { formatCurrency } from "@/lib/formatCurrency";

type Props = {
  housing: number;
  transportation: number;
  food: number;
  insurance: number;
  other: number;
};

export default function ExpenseBreakdownCard({
  housing,
  transportation,
  food,
  insurance,
  other,
}: Props) {
  const items = [
    { label: "🏠 Housing", value: housing },
    { label: "🚗 Transportation", value: transportation },
    { label: "🍽 Food", value: food },
    { label: "🛡 Insurance", value: insurance },
    { label: "📦 Other", value: other },
  ];

  const total = items.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        📊 Expense Breakdown
      </h2>

      <div className="mt-6 space-y-4">
        {items.map((item) => {
          const percent =
            total === 0
              ? 0
              : (item.value / total) * 100;

          return (
            <div
              key={item.label}
              className="flex justify-between border-b py-3"
            >
              <span>{item.label}</span>

              <div className="text-right">
                <div className="font-bold">
                  {formatCurrency(item.value)}
                </div>

                <div className="text-sm text-slate-500">
                  {percent.toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl bg-slate-100 p-4 text-center">
        <div className="text-sm text-slate-500">
          Total Monthly Expenses
        </div>

        <div className="mt-2 text-3xl font-bold">
          {formatCurrency(total)}
        </div>
      </div>
    </div>
  );
}