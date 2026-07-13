import { house } from "@/data/house";

export default function HouseCard() {
  const equity = house.currentValue - house.mortgage;

  const progress = Math.min(
    (equity / (house.targetPrice * 0.20)) * 100,
    100
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">
        🏠 House Planner
      </h2>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span>Current Home</span>
          <span>${house.currentValue.toLocaleString()}</span>
        </div>

        <div className="flex justify-between">
          <span>Mortgage</span>
          <span>${house.mortgage.toLocaleString()}</span>
        </div>

        <div className="flex justify-between font-semibold">
          <span>Equity</span>
          <span>${equity.toLocaleString()}</span>
        </div>

        <div className="mt-6">

          <div className="flex justify-between mb-2 text-sm">
            <span>2028 Frisco Goal</span>
            <span>{progress.toFixed(1)}%</span>
          </div>

          <div className="h-3 rounded-full bg-slate-200">
            <div
              className="h-3 rounded-full bg-blue-600"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

        </div>

      </div>
    </div>
  );
}