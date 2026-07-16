"use client";

import { formatCurrency } from "@/lib/formatCurrency";

type Props = {
  cash: number;
  targetHomePrice: number;
  downPaymentPercent: number;
};

export default function HomePurchaseAdvisorCard({
  cash,
  targetHomePrice,
  downPaymentPercent,
}: Props) {
  const targetDown =
    targetHomePrice *
    (downPaymentPercent / 100);

  const progress =
    Math.min(
      (cash / targetDown) * 100,
      100
    );

  let message = "";

  if (progress >= 100) {
    message =
      "Excellent! Your current cash already covers your target down payment.";
  } else if (progress >= 75) {
    message =
      "You are getting close to your down payment goal.";
  } else if (progress >= 50) {
    message =
      "Good progress. Continue saving consistently.";
  } else {
    message =
      "Your down payment fund still needs significant growth.";
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        🏡 Home Purchase Advisor
      </h2>

      <div className="mt-6 space-y-4">

        <div className="flex justify-between">
          <span>Target Down Payment</span>

          <span className="font-bold">
            {formatCurrency(targetDown)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Current Cash</span>

          <span className="font-bold">
            {formatCurrency(cash)}
          </span>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex justify-between">
            <span>Progress</span>

            <span>
              {progress.toFixed(1)}%
            </span>
          </div>

          <div className="h-3 rounded-full bg-slate-200">
            <div
              className="h-3 rounded-full bg-green-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-blue-50 p-5">
          {message}
        </div>

      </div>
    </div>
  );
}