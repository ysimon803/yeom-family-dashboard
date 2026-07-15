"use client";

import { formatCurrency } from "@/lib/formatCurrency";

type Props = {
  retirementAssets: number;
  annualExpense: number;
};

export default function RetirementIncomeCard({
  retirementAssets,
  annualExpense,
}: Props) {
  const annualIncome =
    retirementAssets * 0.04;

  const monthlyIncome =
    annualIncome / 12;

  const coverage =
    Math.min(
      (annualIncome / annualExpense) * 100,
      100
    );

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        💰 Retirement Income
      </h2>

      <div className="mt-6 space-y-4">
        <Row
          label="Annual Income"
          value={annualIncome}
        />

        <Row
          label="Monthly Income"
          value={monthlyIncome}
        />

        <div>
          <div className="mb-2 flex justify-between">
            <span>Expense Coverage</span>

            <span className="font-bold">
              {coverage.toFixed(1)}%
            </span>
          </div>

          <div className="h-4 w-full rounded-full bg-slate-200">
            <div
              className="h-4 rounded-full bg-green-500"
              style={{
                width: `${coverage}%`,
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