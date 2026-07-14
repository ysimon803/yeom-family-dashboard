"use client";

type VestingItem = {
  year: number;
  rsu: number;
  options: number;
};

type Props = {
  items: VestingItem[];
};

export default function EquityVestingTimeline({
  items,
}: Props) {

  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        📊 TI Equity Vesting Timeline
      </h2>

      <div className="mt-8 space-y-4">

        {items.map((item) => (

          <div
            key={item.year}
            className="rounded-xl bg-slate-100 p-5"
          >

            <div className="flex justify-between">

              <span className="text-xl font-bold">
                {item.year}
              </span>

              <span className="font-bold text-blue-600">
                Total $
                {Math.round(
                  item.rsu + item.options
                ).toLocaleString()}
              </span>

            </div>


            <div className="mt-4 flex justify-between">

              <span>
                RSU
              </span>

              <span className="font-semibold">
                ${item.rsu.toLocaleString()}
              </span>

            </div>


            <div className="mt-2 flex justify-between">

              <span>
                Stock Options
              </span>

              <span className="font-semibold">
                ${item.options.toLocaleString()}
              </span>

            </div>


          </div>

        ))}

      </div>

    </div>

  );

}