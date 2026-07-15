"use client";

import { formatCurrency } from "@/lib/formatCurrency";

type Props = {
  targetPrice: number;
  downPercent: number;
  cashAvailable: number;
  investments: number;
  homeSaleProceeds: number;
};

export default function MoveReadinessCard({
  targetPrice,
  downPercent,
  cashAvailable,
  investments,
  homeSaleProceeds,
}: Props) {
  const downPayment =
    targetPrice * (downPercent / 100);

  const totalAvailable =
    cashAvailable +
    investments +
    homeSaleProceeds;

  const remaining =
    totalAvailable - downPayment;

  const ready = remaining >= 0;

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        🚚 Move Readiness
      </h2>

      <div className="mt-6 space-y-4">
        <Row
          label="Cash"
          value={cashAvailable}
        />

        <Row
          label="Investments"
          value={investments}
        />

        <Row
          label="Home Sale Proceeds"
          value={homeSaleProceeds}
        />

        <hr />

        <Row
          label="Total Available"
          value={totalAvailable}
        />

        <Row
          label="Required Down Payment"
          value={downPayment}
        />

        <hr />

        <Row
          label={ready ? "Remaining Cash" : "Cash Needed"}
          value={Math.abs(remaining)}
        />
      </div>

      <div
        className={`mt-8 rounded-xl p-4 text-center text-lg font-bold ${
          ready
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {ready
          ? "✅ Ready to Move"
          : "⚠️ More Savings Required"}
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