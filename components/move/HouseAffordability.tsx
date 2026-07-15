type Props = {
  monthlyIncome: number;
  monthlyHousing: number;
};

export default function HouseAffordability({
  monthlyIncome,
  monthlyHousing,
}: Props) {

  const ratio =
    monthlyHousing / monthlyIncome;

  let status = "Excellent";
  let color = "text-green-600";

  if (ratio > 0.28) {
    status = "Good";
    color = "text-yellow-600";
  }

  if (ratio > 0.36) {
    status = "Risky";
    color = "text-red-600";
  }

  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        🏠 Affordability
      </h2>

      <div className="mt-8">

        <div className="text-6xl font-bold">

          {(ratio * 100).toFixed(1)}%

        </div>

        <div className={`mt-4 text-3xl font-bold ${color}`}>

          {status}

        </div>

        <p className="mt-6 text-slate-600">

          Housing Cost ÷ Monthly Income

        </p>

      </div>

    </div>

  );

}