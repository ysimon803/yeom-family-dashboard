"use client";

import { formatCurrency } from "@/lib/formatCurrency";

type Props = {
  retirement: number;
  rsu: number;
  stockOptions: number;
  cash: number;
  homeEquity: number;
};

export default function PortfolioAllocationCard({
  retirement,
  rsu,
  stockOptions,
  cash,
  homeEquity,
}: Props) {
  const assets = [
    {
      label: "Retirement",
      value: retirement,
    },
    {
      label: "RSU",
      value: rsu,
    },
    {
      label: "Stock Options",
      value: stockOptions,
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

  const total = assets.reduce(
    (sum, asset) => sum + asset.value,
    0
  );

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        📊 Portfolio Allocation
      </h2>

      <div className="mt-6 space-y-4">
        {assets.map((asset) => {
          const percent =
            total === 0
              ? 0
              : (asset.value / total) * 100;

          return (
            <div
              key={asset.label}
              className="flex justify-between border-b py-3"
            >
              <span>{asset.label}</span>

              <div className="text-right">
                <div className="font-bold">
                  {formatCurrency(asset.value)}
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
          Total Portfolio
        </div>

        <div className="mt-2 text-center text-3xl font-bold">
          {formatCurrency(total)}
        </div>
      </div>
    </div>
  );
}