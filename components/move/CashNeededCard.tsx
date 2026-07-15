"use client";

import { formatCurrency } from "@/lib/formatCurrency";

type Props = {
  targetPrice: number;
  downPercent: number;
  closingPercent?: number;
};

export default function CashNeededCard({
  targetPrice,
  downPercent,
  closingPercent = 3,
}: Props) {
  const downPayment =
    targetPrice * (downPercent / 100);

  const closingCost =
    targetPrice * (closingPercent / 100);

  const totalNeeded =
    downPayment + closingCost;

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        💵 Cash Needed
      </h2>

      <div className="mt-6 space-y-4">
        <Row
          label="Target Home Price"
          value={targetPrice}
        />

        <Row
          label={`Down Payment (${downPercent}%)`}
          value={downPayment}
        />

        <Row
          label={`Closing Cost (${closingPercent}%)`}
          value={closingCost}
        />

        <hr />

        <Row
          label="Total Cash Needed"
          value={totalNeeded}
        />
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