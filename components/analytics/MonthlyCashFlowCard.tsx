"use client";

import { formatCurrency } from "@/lib/formatCurrency";

type Props = {
  income: number;
  savings: number;
};

export default function MonthlyCashFlowCard({
  income,
  savings,
}: Props) {
  const expenses =
    income - savings;

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        💳 Monthly Cash Flow
      </h2>

      <div className="mt-6 space-y-4">
        <Row
          label="Monthly Income"
          value={income}
        />

        <Row
          label="Monthly Savings"
          value={savings}
        />

        <Row
          label="Monthly Expenses"
          value={expenses}
        />

        <hr />

        <Row
          label="Cash Flow"
          value={income - expenses}
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