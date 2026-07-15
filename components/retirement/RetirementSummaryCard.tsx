"use client";

import { formatCurrency } from "@/lib/formatCurrency";

type Props = {
  retirementAssets: number;
  annualContribution: number;
  targetRetirement: number;
};

export default function RetirementSummaryCard({
  retirementAssets,
  annualContribution,
  targetRetirement,
}: Props) {
  const progress =
    targetRetirement > 0
      ? (retirementAssets / targetRetirement) * 100
      : 0;

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        🏖 Retirement Summary
      </h2>

      <div className="mt-6 space-y-4">
        <Row
          label="Current Retirement Assets"
          value={retirementAssets}
        />

        <Row
          label="Annual Contribution"
          value={annualContribution}
        />

        <Row
          label="Target Retirement"
          value={targetRetirement}
        />

        <hr />

        <div>
          <div className="mb-2 flex justify-between">
            <span>Progress</span>
            <span className="font-bold">
              {progress.toFixed(1)}%
            </span>
          </div>

          <div className="h-3 w-full rounded-full bg-gray-200">
            <div
              className="h-3 rounded-full bg-green-500"
              style={{
                width: `${Math.min(progress, 100)}%`,
              }}
            />
          </div>
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