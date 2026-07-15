"use client";

type Props = {
  rsu: number;
  stockOptions: number;
  totalAssets: number;
};

export default function ConcentrationRiskCard({
  rsu,
  stockOptions,
  totalAssets,
}: Props) {
  const companyStock =
    rsu + stockOptions;

  const percent =
    totalAssets === 0
      ? 0
      : (companyStock / totalAssets) * 100;

  let level = "Low";
  let color = "bg-green-500";

  if (percent >= 40) {
    level = "High";
    color = "bg-red-500";
  } else if (percent >= 20) {
    level = "Moderate";
    color = "bg-yellow-500";
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        ⚠️ Company Stock Risk
      </h2>

      <div className="mt-6">
        <div className="mb-3 flex justify-between">
          <span>TI Equity Allocation</span>

          <span className="font-bold">
            {percent.toFixed(1)}%
          </span>
        </div>

        <div className="h-5 w-full rounded-full bg-slate-200">
          <div
            className={`${color} h-5 rounded-full`}
            style={{
              width: `${Math.min(percent,100)}%`,
            }}
          />
        </div>

        <div className="mt-6 rounded-xl bg-slate-100 p-4 text-center">
          <div className="text-sm text-slate-500">
            Risk Level
          </div>

          <div className="mt-2 text-3xl font-bold">
            {level}
          </div>
        </div>

        <div className="mt-6 text-sm text-slate-600">
          Recommended:
          Keep employer stock below
          approximately 20% of total
          investable assets.
        </div>
      </div>
    </div>
  );
}