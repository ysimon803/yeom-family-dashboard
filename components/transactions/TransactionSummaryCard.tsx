"use client";

import { formatCurrency } from "@/lib/formatCurrency";
import type { Transaction } from "@/types/transaction";

type Props = {
  transactions: Transaction[];
};

export default function TransactionSummaryCard({
  transactions,
}: Props) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netCashFlow = income - expense;

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="rounded-2xl bg-green-100 p-6">
        <p className="text-sm text-slate-600">
          Income
        </p>

        <h2 className="mt-2 text-3xl font-bold text-green-700">
          {formatCurrency(income)}
        </h2>
      </div>

      <div className="rounded-2xl bg-red-100 p-6">
        <p className="text-sm text-slate-600">
          Expense
        </p>

        <h2 className="mt-2 text-3xl font-bold text-red-700">
          {formatCurrency(expense)}
        </h2>
      </div>

      <div className="rounded-2xl bg-blue-100 p-6">
        <p className="text-sm text-slate-600">
          Net Cash Flow
        </p>

        <h2
          className={`mt-2 text-3xl font-bold ${
            netCashFlow >= 0
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {formatCurrency(netCashFlow)}
        </h2>
      </div>
    </div>
  );
}