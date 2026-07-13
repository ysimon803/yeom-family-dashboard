type Props = {
  monthlyIncome: number;
  mortgage: number;
};

export default function MonthlySummary({
  monthlyIncome,
  mortgage,
}: Props) {
  const savings =
    monthlyIncome - mortgage;

  const savingsRate =
    monthlyIncome > 0
      ? Math.round(
          (savings / monthlyIncome) * 100
        )
      : 0;

  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        Monthly Summary
      </h2>

      <div className="mt-8">

        <div className="text-slate-500">
          Monthly Income
        </div>

        <div className="mt-2 text-5xl font-bold text-green-600">
          ${monthlyIncome.toLocaleString()}
        </div>

      </div>

      <div className="mt-10">

        <div className="text-slate-500">
          Mortgage
        </div>

        <div className="mt-2 text-4xl font-bold text-red-600">
          ${mortgage.toLocaleString()}
        </div>

      </div>

      <div className="mt-10">

        <div className="text-slate-500">
          Estimated Monthly Savings
        </div>

        <div className="mt-2 text-4xl font-bold text-blue-600">
          ${savings.toLocaleString()}
        </div>

      </div>

      <div className="mt-10">

        <div className="text-slate-500">
          Savings Rate
        </div>

        <div className="mt-2 text-5xl font-bold">
          {savingsRate}%
        </div>

      </div>

    </div>
  );
}