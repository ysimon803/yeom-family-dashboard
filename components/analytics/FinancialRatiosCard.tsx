"use client";

type Props = {
  savingsRate: number;
  debtRatio: number;
  investmentRate: number;
};

export default function FinancialRatiosCard({
  savingsRate,
  debtRatio,
  investmentRate,
}: Props) {
  const rows = [
    {
      label: "💰 Savings Rate",
      value: `${savingsRate.toFixed(1)}%`,
    },
    {
      label: "🏦 Investment Rate",
      value: `${investmentRate.toFixed(1)}%`,
    },
    {
      label: "🏠 Debt Ratio",
      value: `${debtRatio.toFixed(1)}%`,
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        📋 Financial Ratios
      </h2>

      <div className="mt-6 space-y-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex justify-between border-b py-3"
          >
            <span>{row.label}</span>

            <span className="font-bold">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}