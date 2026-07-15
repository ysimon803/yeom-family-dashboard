"use client";

import { formatCurrency } from "@/lib/formatCurrency";

type Props = {
  currentBalance: number;
  targetBalance: number;
};

export default function RetirementGoalCard({
  currentBalance,
  targetBalance,
}: Props) {
  const progress =
    targetBalance > 0
      ? (currentBalance / targetBalance) * 100
      : 0;

  const remaining =
    Math.max(targetBalance - currentBalance, 0);

  const achieved =
    currentBalance >= targetBalance;

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        🎯 Retirement Goal
      </h2>

      <div className="mt-6 space-y-4">
        <Row
          label="Current Balance"
          value={currentBalance}
        />

        <Row
          label="Target Balance"
          value={targetBalance}
        />

        <Row
          label="Remaining"
          value={remaining}
        />

        <hr />

        <div>
          <div className="mb-2 flex justify-between">
            <span>Goal Progress</span>

            <span className="font-bold">
              {progress.toFixed(1)}%
            </span>
          </div>

          <div className="h-3 w-full rounded-full bg-gray-200">
            <div
              className={`h-3 rounded-full ${
                achieved
                  ? "bg-green-500"
                  : "bg-blue-500"
              }`}
              style={{
                width: `${Math.min(progress, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div
        className={`mt-8 rounded-xl p-4 text-center text-lg font-bold ${
          achieved
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {achieved
          ? "🎉 Retirement Goal Achieved!"
          : "💰 Keep Investing!"}
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