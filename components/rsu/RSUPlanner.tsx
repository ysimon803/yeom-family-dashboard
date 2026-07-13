import { rsuGrants } from "@/data/rsu";
import { getNextVest } from "@/lib/rsu";

export default function RSUPlanner() {
  const nextVest = getNextVest();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">
        📅 RSU Planner
      </h2>

      <div className="space-y-3">

        <div className="flex justify-between">
          <span>Total Grants</span>
          <strong>{rsuGrants.length}</strong>
        </div>

        <div className="flex justify-between">
          <span>Next Vest</span>
          <strong>{nextVest.vestDate}</strong>
        </div>

        <div className="flex justify-between">
          <span>Shares</span>
          <strong>{nextVest.shares}</strong>
        </div>

      </div>

      <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-slate-700">
        <strong>Recommendation</strong>

        <p className="mt-2">
          Review the upcoming vest before the vesting date.
          In a future version, this card will estimate taxes,
          cash proceeds, and the impact on your 2028 house fund.
        </p>
      </div>
    </div>
  );
}