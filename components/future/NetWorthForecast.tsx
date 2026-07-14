"use client";

type Equity = {
  year: number;
  value: number;
};

type Props = {
  currentNetWorth: number;
  yearlyGrowth?: number;
  years?: number;
  equity?: Equity[];
};

type DataPoint = {
  year: number;
  netWorth: number;
};

export default function NetWorthForecast({
  currentNetWorth,
  yearlyGrowth = 7,
  years = 20,
  equity = [],
}: Props) {

  const forecast: DataPoint[] = [];

  let value = currentNetWorth;

  for (
    let year = 2026;
    year <= 2026 + years;
    year++
  ) {

    const equityValue =
      equity
        .filter(
          (item) =>
            item.year === year
        )
        .reduce(
          (sum, item) =>
            sum + item.value,
          0
        );


    forecast.push({

      year,

      netWorth:
        value + equityValue,

    });


    value =
      value *
      (1 + yearlyGrowth / 100);

  }


  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">

        📈 Net Worth Forecast

      </h2>


      <div className="mt-8 space-y-4">

        {forecast.map((item) => (

          <div
            key={item.year}
            className="flex justify-between border-b py-3"
          >

            <span className="font-semibold">

              {item.year}

            </span>


            <span className="font-bold text-blue-600">

              ${Math.round(
                item.netWorth
              ).toLocaleString()}

            </span>


          </div>

        ))}

      </div>

    </div>

  );

}