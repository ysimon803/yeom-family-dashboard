"use client";

type Props = {
  homeValue: number;
  mortgage: number;
  annualGrowth?: number;
};

export default function HomeEquityForecast({
  homeValue,
  mortgage,
  annualGrowth = 3,
}: Props) {

  const years = [];

  let value = homeValue;
  let loan = mortgage;

  for (let year = 2026; year <= 2028; year++) {

    years.push({
      year,
      value,
      loan,
      equity: value - loan,
    });

    value *= 1 + annualGrowth / 100;
    loan -= 12000;

  }

  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        🏠 Home Equity Forecast
      </h2>

      <table className="mt-8 w-full">

        <thead>

          <tr className="border-b">

            <th className="py-3 text-left">Year</th>
            <th className="text-right">Home Value</th>
            <th className="text-right">Mortgage</th>
            <th className="text-right">Equity</th>

          </tr>

        </thead>

        <tbody>

          {years.map((item) => (

            <tr
              key={item.year}
              className="border-b"
            >

              <td className="py-4">{item.year}</td>

              <td className="text-right">
                ${Math.round(item.value).toLocaleString()}
              </td>

              <td className="text-right">
                ${Math.round(item.loan).toLocaleString()}
              </td>

              <td className="text-right font-bold text-green-600">
                ${Math.round(item.equity).toLocaleString()}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}