"use client";

import { formatCurrency } from "@/lib/formatCurrency";

type Props = {
  annualExpense: number;
};

export default function FIRENumberCard({
  annualExpense,
}: Props) {
  const fireNumber =
    annualExpense * 25;

  const monthlyIncome =
    annualExpense / 12;

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        🔥 FIRE Number
      </h2>

      <div className="mt-6 space-y-4">
        <Row
          label="Annual Expenses"
          value={annualExpense}
        />

        <Row
          label="Monthly Expenses"
          value={monthlyIncome}
        />

        <hr />

        <Row
          label="Target FIRE Number"
          value={fireNumber}
        />
      </div>

      <div className="mt-8 rounded-xl bg-orange-100 p-4 text-center text-lg font-bold text-orange-700">
        25× Annual Expenses Rule
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