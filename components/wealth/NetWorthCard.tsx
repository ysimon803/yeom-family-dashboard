"use client";

import { formatCurrency } from "@/lib/formatCurrency";

type Props = {
  assets: number;
  liabilities: number;
};

export default function NetWorthCard({
  assets,
  liabilities,
}: Props) {
  const netWorth =
    assets - liabilities;

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        💎 Net Worth
      </h2>

      <div className="mt-8 space-y-5">
        <Row
          label="Total Assets"
          value={assets}
        />

        <Row
          label="Total Liabilities"
          value={liabilities}
        />

        <hr />

        <Row
          label="Net Worth"
          value={netWorth}
        />
      </div>

      <div className="mt-8 rounded-xl bg-indigo-100 p-4 text-center">
        <div className="text-sm text-slate-500">
          Current Net Worth
        </div>

        <div className="mt-2 text-3xl font-bold text-indigo-700">
          {formatCurrency(netWorth)}
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>

      <span className="font-bold">
        {formatCurrency(value)}
      </span>
    </div>
  );
}