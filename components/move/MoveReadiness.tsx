type Props = {
  currentFund: number;
  targetFund: number;
};

export default function MoveReadiness({
  currentFund,
  targetFund,
}: Props) {

  const progress =
    Math.min(
      (currentFund / targetFund) * 100,
      100
    );

  let message =
    "🟢 Ready";

  let color =
    "text-green-600";

  if (progress < 90) {

    message =
      "🟡 Almost Ready";

    color =
      "text-yellow-600";

  }

  if (progress < 70) {

    message =
      "🔴 Keep Saving";

    color =
      "text-red-600";

  }

  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        🤖 Move Readiness
      </h2>

      <div className="mt-8">

        <div className="text-5xl font-bold">

          {progress.toFixed(1)}%

        </div>

        <div className={`mt-4 text-3xl font-bold ${color}`}>

          {message}

        </div>

        <div className="mt-8 h-4 rounded-full bg-slate-200">

          <div
            className="h-4 rounded-full bg-blue-600"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

    </div>

  );

}