"use client";

import { formatCurrency } from "@/lib/formatCurrency";

type Props = {
  retirementAssets: number;
};

export default function SafeWithdrawalCard({
  retirementAssets,
}: Props) {
  const annualWithdrawal =
    retirementAssets * 0.04;

  const monthlyWithdrawal =
    annualWithdrawal / 12;

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        💵 Safe Withdrawal
      </h2>

      <div className="mt-6 space-y-4">
        <Row
          label="Portfolio"
          value={retirementAssets}
        />

        <Row
          label="Annual (4%)"
          value={annualWithdrawal}
        />

        <Row
          label="Monthly"
          value={monthlyWithdrawal}
        />
      </div>

      <div className="mt-8 rounded-xl bg-green-100 p-4 text-center font-bold text-green-700">
        Based on the 4% Rule
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