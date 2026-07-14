"use client";

type Props = {
  currentAssets: number;
  monthlyContribution: number;
  yearlyGrowth?: number;
  years?: number;
};

export default function RetirementForecast({
  currentAssets,
  monthlyContribution,
  yearlyGrowth = 7,
  years = 30,
}: Props) {

  const data = [];

  let value = currentAssets;

  for (
    let year = 2026;
    year <= 2026 + years;
    year++
  ) {

    value =
      value * (1 + yearlyGrowth / 100) +
      monthlyContribution * 12;

    data.push({
      year,
      value,
    });

  }


  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        💰 Retirement Forecast
      </h2>


      <div className="mt-8 space-y-4">

        {data.map((item) => (

          <div
            key={item.year}
            className="flex justify-between border-b py-3"
          >

            <span className="font-semibold">
              {item.year}
            </span>


            <span className="font-bold text-green-600">

              ${Math.round(
                item.value
              ).toLocaleString()}

            </span>

          </div>

        ))}

      </div>

    </div>

  );

}