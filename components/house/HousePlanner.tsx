import { house } from "@/data/house";
import {
  getHouseEquity,
  getHouseProgress,
  getDownPaymentGoal,
  getRemainingDownPayment,
} from "@/lib/calculations";

function money(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function HousePlanner() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        🏠 2028 House Planner
      </h2>

      <div className="mt-6 space-y-3">

        <div className="flex justify-between">
          <span>Current Home</span>
          <strong>{money(house.currentValue)}</strong>
        </div>

        <div className="flex justify-between">
          <span>Mortgage</span>
          <strong>{money(house.mortgage)}</strong>
        </div>

        <div className="flex justify-between">
          <span>Home Equity</span>
          <strong>{money(getHouseEquity())}</strong>
        </div>

        <div className="flex justify-between">
          <span>Cash</span>
          <strong>{money(house.cashAvailable)}</strong>
        </div>

        <hr />

        <div className="flex justify-between">
          <span>Target Down Payment</span>
          <strong>{money(getDownPaymentGoal())}</strong>
        </div>

        <div className="flex justify-between">
          <span>Remaining</span>
          <strong>{money(getRemainingDownPayment())}</strong>
        </div>

      </div>

      <div className="mt-8">

        <div className="mb-2 flex justify-between text-sm">
          <span>Progress</span>
          <span>{getHouseProgress().toFixed(1)}%</span>
        </div>

        <div className="h-3 rounded-full bg-slate-200">

          <div
            className="h-3 rounded-full bg-blue-600 transition-all"
            style={{
              width: `${getHouseProgress()}%`,
            }}
          />

        </div>

      </div>

      <div className="mt-6 rounded-xl bg-blue-50 p-4 text-sm text-slate-700">
        <strong>AI Insight</strong>
        <br />
        Current progress reflects only your home equity and cash. In the next version,
        projected RSU vesting, bonuses, and annual savings will be included to estimate
        your 2028 Frisco home readiness.
      </div>
    </div>
  );
}