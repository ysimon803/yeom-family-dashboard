"use client";

import { formatCurrency } from "@/lib/formatCurrency";

type Props = {
  retirement: number;
  cash: number;
  homeEquity: number;
};

export default function InvestmentBreakdownCard({
  retirement,
  cash,
  homeEquity,
}: Props) {
  const total =
    retirement +
    cash +
    homeEquity;

  const rows = [
    {
      label: "Retirement",
      value: retirement,
    },
    {
      label: "Cash",
      value: cash,
    },
    {
      label: "Home Equity",
      value: homeEquity,
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        📁 Investment Breakdown
      </h2>

      <div className="mt-6 space-y-4">
        {rows.map((row) => {
          const percent =
            total === 0
              ? 0
              : (row.value / total) * 100;

          return (
            <div
              key={row.label}
              className="flex justify-between border-b py-3"
            >
              <span>{row.label}</span>

              <div className="text-right">
                <div className="font-bold">
                  {formatCurrency(row.value)}
                </div>

                <div className="text-sm text-slate-500">
                  {percent.toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl bg-slate-100 p-4">
        <div className="text-center text-sm text-slate-500">
          Total Invested Assets
        </div>

        <div className="mt-2 text-center text-3xl font-bold">
          {formatCurrency(total)}
        </div>
      </div>
    </div>
  );
}