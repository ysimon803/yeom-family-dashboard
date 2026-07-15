"use client";

type Props = {
  homePrice: number;
};

const OPTIONS = [20, 25, 30, 35];

export default function DownPaymentStrategy({
  homePrice,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        🏦 Down Payment Strategy
      </h2>

      <div className="mt-6 space-y-4">

        {OPTIONS.map((percent) => {

          const down =
            homePrice *
            percent /
            100;

          const loan =
            homePrice -
            down;

          const monthly =
            calculateMortgage(
              loan
            );

          return (

            <div
              key={percent}
              className="rounded-xl border p-4"
            >

              <div className="flex justify-between">

                <span className="font-bold">

                  {percent}%

                </span>

                <span>

                  ${Math.round(down).toLocaleString()}

                </span>

              </div>

              <div className="mt-2 text-sm text-slate-500">

                Mortgage

              </div>

              <div className="font-semibold">

                ${Math.round(monthly).toLocaleString()}/mo

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
}

function calculateMortgage(
  loan:number
){

  const monthlyRate =
    0.065 / 12;

  const months =
    30 * 12;

  return (

    loan *

    (

      monthlyRate *

      Math.pow(
        1 + monthlyRate,
        months
      )

    )

    /

    (

      Math.pow(
        1 + monthlyRate,
        months
      )

      - 1

    )

  );

}