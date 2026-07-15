"use client";

type Props = {
  currentBalance: number;
  targetBalance: number;
};

export default function RetirementReadinessCard({
  currentBalance,
  targetBalance,
}: Props) {
  const progress = Math.min(
    (currentBalance / targetBalance) * 100,
    100
  );

  let color = "bg-red-500";

  if (progress >= 80) {
    color = "bg-green-500";
  } else if (progress >= 50) {
    color = "bg-yellow-500";
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        📈 Retirement Readiness
      </h2>

      <div className="mt-8">
        <div className="mb-3 flex justify-between">
          <span>Progress</span>

          <span className="font-bold">
            {progress.toFixed(1)}%
          </span>
        </div>

        <div className="h-5 w-full rounded-full bg-slate-200">
          <div
            className={`h-5 rounded-full ${color}`}
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="mt-6 text-center text-3xl font-bold">
          {progress.toFixed(1)}%
        </div>

        <div className="mt-2 text-center text-slate-500">
          Retirement Goal Completion
        </div>
      </div>
    </div>
  );
}