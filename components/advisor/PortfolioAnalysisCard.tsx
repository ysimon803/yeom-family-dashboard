"use client";

import { formatCurrency } from "@/lib/formatCurrency";

type Props = {
  retirement: number;
  rsu: number;
  stockOptions: number;
  cash: number;
};

export default function PortfolioAnalysisCard({
  retirement,
  rsu,
  stockOptions,
  cash,
}: Props) {
  const total =
    retirement +
    rsu +
    stockOptions +
    cash;

  const companyRisk =
    ((rsu + stockOptions) / total) * 100;

  let message = "";
  let color = "";
  let level = "";

  if (companyRisk >= 60) {
    level = "Very High";
    color = "text-red-600";
    message =
      "Your portfolio is heavily concentrated in Texas Instruments stock. Consider gradually diversifying as RSUs vest and options are exercised.";
  } else if (companyRisk >= 40) {
    level = "High";
    color = "text-orange-500";
    message =
      "Employer stock concentration is relatively high. A gradual diversification strategy may reduce risk.";
  } else if (companyRisk >= 25) {
    level = "Moderate";
    color = "text-yellow-600";
    message =
      "Your portfolio has a moderate employer stock allocation. Continue monitoring.";
  } else {
    level = "Low";
    color = "text-green-600";
    message =
      "Your portfolio is well diversified.";
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        📊 Portfolio Analysis
      </h2>

      <div className="mt-6 space-y-4">
        <Row
          label="Retirement"
          value={retirement}
        />

        <Row
          label="RSU"
          value={rsu}
        />

        <Row
          label="Stock Options"
          value={stockOptions}
        />

        <Row
          label="Cash"
          value={cash}
        />

        <hr />

        <div className="rounded-xl bg-blue-50 p-5">
          <div className="text-sm text-slate-500">
            Company Stock Allocation
          </div>

          <div className="mt-2 text-3xl font-bold">
            {companyRisk.toFixed(1)}%
          </div>
          <div className={`mt-1 font-bold ${color}`}>
            {level}
          </div>
          
          <p className="mt-4 text-sm">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>

      <span className="font-bold">
        {formatCurrency(value)}
      </span>
    </div>
  );
}