"use client";

import { formatCurrency } from "@/lib/formatCurrency";

type Props = {
  cash: number;
  retirement: number;
  homeEquity: number;
};

export default function AssetAllocationCard({
  cash,
  retirement,
  homeEquity,
}: Props) {
  const total =
    cash +
    retirement +
    homeEquity;

  const assets = [
    {
      label: "Cash",
      value: cash,
      color: "bg-green-500",
    },
    {
      label: "Retirement",
      value: retirement,
      color: "bg-blue-500",
    },
    {
      label: "Home Equity",
      value: homeEquity,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        📊 Asset Allocation
      </h2>

      <div className="mt-6 space-y-5">
        {assets.map((asset) => {
          const percent =
            total === 0
              ? 0
              : (asset.value / total) * 100;

          return (
            <div key={asset.label}>
              <div className="mb-2 flex justify-between">
                <span>{asset.label}</span>

                <span className="font-bold">
                  {formatCurrency(asset.value)}
                </span>
              </div>

              <div className="h-4 w-full rounded-full bg-slate-200">
                <div
                  className={`${asset.color} h-4 rounded-full`}
                  style={{
                    width: `${percent}%`,
                  }}
                />
              </div>

              <div className="mt-1 text-right text-sm text-slate-500">
                {percent.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}