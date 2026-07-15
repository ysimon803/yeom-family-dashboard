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

  let message =
    "Your portfolio is well diversified.";

  if (companyRisk > 40) {
    message =
      "High concentration in Texas Instruments equity. Consider diversifying as RSUs vest.";
  } else if (companyRisk > 25) {
    message =
      "Moderate employer stock concentration. Continue monitoring.";
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