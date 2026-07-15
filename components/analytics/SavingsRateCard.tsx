"use client";

type Props = {
  income: number;
  savings: number;
};

export default function SavingsRateCard({
  income,
  savings,
}: Props) {
  const rate =
    income === 0
      ? 0
      : (savings / income) * 100;

  let color = "bg-red-500";
  let level = "Needs Improvement";

  if (rate >= 30) {
    color = "bg-green-500";
    level = "Excellent";
  } else if (rate >= 20) {
    color = "bg-yellow-500";
    level = "Good";
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        💵 Savings Rate
      </h2>

      <div className="mt-8">
        <div className="mb-3 flex justify-between">
          <span>Monthly Savings Rate</span>

          <span className="font-bold">
            {rate.toFixed(1)}%
          </span>
        </div>

        <div className="h-5 w-full rounded-full bg-slate-200">
          <div
            className={`${color} h-5 rounded-full`}
            style={{
              width: `${Math.min(rate, 100)}%`,
            }}
          />
        </div>

        <div className="mt-6 text-center text-3xl font-bold">
          {level}
        </div>
      </div>
    </div>
  );
}