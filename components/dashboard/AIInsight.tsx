import { portfolio } from "@/data/portfolio";
import { getHouseProgress } from "@/lib/calculations";

export default function AIInsight() {
  const tiExposure =
    (portfolio.ti.total / portfolio.netWorth) * 100;

  const progress = getHouseProgress();

  let message = "";

  if (tiExposure > 35) {
    message =
      "Your TI exposure is relatively high. Consider gradually diversifying future RSU vesting into cash or broad index funds.";
  } else {
    message =
      "Your investment diversification is in a healthy range.";
  }

  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">
        🤖 AI Financial Advisor
      </h2>

      <div className="space-y-3 text-sm text-slate-700">

        <div className="flex justify-between">
          <span>Net Worth</span>
          <strong>
            ${portfolio.netWorth.toLocaleString()}
          </strong>
        </div>

        <div className="flex justify-between">
          <span>TI Allocation</span>
          <strong>{tiExposure.toFixed(1)}%</strong>
        </div>

        <div className="flex justify-between">
          <span>House Goal Progress</span>
          <strong>{progress.toFixed(1)}%</strong>
        </div>

        <hr />

        <p>{message}</p>

      </div>
    </div>
  );
}