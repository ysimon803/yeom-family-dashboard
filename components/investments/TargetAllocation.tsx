export default function TargetAllocation() {

  const targets = [

    {
      name: "S&P 500",
      target: 60,
    },
    {
      name: "NASDAQ",
      target: 20,
    },
    {
      name: "Semiconductor",
      target: 10,
    },
    {
      name: "International",
      target: 10,
    },

  ];

  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">

        Target Allocation

      </h2>

      <div className="mt-8 space-y-5">

        {targets.map((item) => (

          <div key={item.name}>

            <div className="flex justify-between">

              <span>{item.name}</span>

              <span>{item.target}%</span>

            </div>

            <div className="mt-2 h-3 rounded-full bg-slate-200">

              <div
                className="h-3 rounded-full bg-blue-600"
                style={{
                  width: `${item.target}%`,
                }}
              />

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}