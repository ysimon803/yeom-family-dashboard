type Props = {
  total: number;
};

export default function InvestmentSummary({
  total,
}: Props) {

  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <p className="text-slate-500">
        Total Investments
      </p>

      <h1 className="mt-4 text-5xl font-bold text-blue-600">

        ${Math.round(total).toLocaleString()}

      </h1>

    </div>

  );

}