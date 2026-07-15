"use client";

import { formatCurrency } from "@/lib/formatCurrency";

type Props = {
  currentNetWorth: number;
  homePrice: number;
  downPaymentPercent: number;
};

export default function HomePurchaseImpact({
  currentNetWorth,
  homePrice,
  downPaymentPercent,
}: Props) {
  const downPayment =
    homePrice * (downPaymentPercent / 100);

  const remainingNetWorth =
    currentNetWorth - downPayment;

  const impact =
    currentNetWorth > 0
      ? (downPayment / currentNetWorth) * 100
      : 0;

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        🏠 Home Purchase Impact
      </h2>

      <div className="mt-6 space-y-4">
        <Row
          label="Current Net Worth"
          value={currentNetWorth}
        />

        <Row
          label={`Down Payment (${downPaymentPercent}%)`}
          value={downPayment}
        />

        <Row
          label="Remaining Net Worth"
          value={remainingNetWorth}
        />

        <hr />

        <div className="flex justify-between">
          <span>Impact on Net Worth</span>

          <span className="font-bold">
            {impact.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-slate-100 p-4 text-center text-lg font-bold">
        {impact <= 25 && "✅ Low Financial Impact"}

        {impact > 25 && impact <= 40 && "🟡 Moderate Financial Impact"}

        {impact > 40 && "⚠️ High Financial Impact"}
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