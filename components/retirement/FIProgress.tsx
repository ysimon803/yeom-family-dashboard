type Props = {
  currentAssets: number;
  targetAssets: number;
};

export default function FIProgress({
  currentAssets,
  targetAssets,
}: Props) {

  const progress =
    Math.min(
      (currentAssets / targetAssets) * 100,
      100
    );


  let status =
    "Building Wealth";

  if (progress >= 100) {
    status = "🎉 Financial Independent";
  } else if (progress >= 75) {
    status = "🟢 Almost There";
  } else if (progress >= 50) {
    status = "🟡 Half Way";
  }


  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        🔥 Financial Independence Progress
      </h2>


      <div className="mt-8">

        <div className="text-6xl font-bold text-blue-600">

          {progress.toFixed(1)}%

        </div>


        <div className="mt-4 text-2xl font-bold">

          {status}

        </div>


        <div className="mt-8 h-5 rounded-full bg-slate-200">

          <div

            className="h-5 rounded-full bg-green-600"

            style={{
              width: `${progress}%`,
            }}

          />

        </div>


        <div className="mt-6 flex justify-between">

          <span>
            Current
          </span>

          <span className="font-bold">

            ${Math.round(
              currentAssets
            ).toLocaleString()}

          </span>

        </div>


        <div className="mt-2 flex justify-between">

          <span>
            FI Target
          </span>

          <span className="font-bold">

            ${Math.round(
              targetAssets
            ).toLocaleString()}

          </span>

        </div>


      </div>

    </div>

  );

}