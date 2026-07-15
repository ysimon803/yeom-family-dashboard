"use client";

type Props = {
  score: number;
};

export default function FinancialHealthScoreCard({
  score,
}: Props) {
  let color = "text-red-500";
  let label = "Needs Improvement";

  if (score >= 80) {
    color = "text-green-600";
    label = "Excellent";
  } else if (score >= 60) {
    color = "text-yellow-600";
    label = "Good";
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        ❤️ Financial Health Score
      </h2>

      <div className="mt-10 text-center">
        <div
          className={`text-7xl font-bold ${color}`}
        >
          {score}
        </div>

        <div className="mt-4 text-xl font-semibold">
          {label}
        </div>

        <div className="mt-6 h-5 w-full rounded-full bg-slate-200">
          <div
            className="h-5 rounded-full bg-green-500"
            style={{
              width: `${score}%`,
            }}
          />
        </div>

        <div className="mt-6 text-sm text-slate-500">
          Overall financial condition
        </div>
      </div>
    </div>
  );
}