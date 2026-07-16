"use client";

import { formatCurrency } from "@/lib/formatCurrency";

type Props = {
  cash: number;
  monthlyExpense: number;
};

export default function EmergencyFundAdvisorCard({
  cash,
  monthlyExpense,
}: Props) {
  const months =
    monthlyExpense > 0
      ? cash / monthlyExpense
      : 0;

  let color = "";
  let message = "";

  if (months >= 6) {
    color = "text-green-600";
    message =
      "Excellent. Your emergency fund is well funded.";
  } else if (months >= 3) {
    color = "text-yellow-600";
    message =
      "Your emergency fund is adequate, but increasing it to 6 months would improve financial resilience.";
  } else {
    color = "text-red-600";
    message =
      "Emergency fund is below the recommended level. Consider prioritizing additional cash savings.";
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        🚨 Emergency Fund Advisor
      </h2>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between">
          <span>Cash Available</span>

          <span className="font-bold">
            {formatCurrency(cash)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Monthly Expenses</span>

          <span className="font-bold">
            {formatCurrency(monthlyExpense)}
          </span>
        </div>

        <div className={`text-3xl font-bold ${color}`}>
          {months.toFixed(1)} Months
        </div>

        <div className="rounded-xl bg-slate-100 p-4">
          {message}
        </div>
      </div>
    </div>
  );
}