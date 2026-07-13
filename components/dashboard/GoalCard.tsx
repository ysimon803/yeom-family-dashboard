type Props = {
  target: number;
  current: number;
};

export default function GoalCard({
  target,
  current,
}: Props) {
  const progress = Math.min(
    Math.round((current / target) * 100),
    100
  );

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="text-2xl font-bold">
        🏡 2028 Home Goal
      </h2>

      <div className="mt-6 text-slate-500">
        Target Down Payment
      </div>

      <div className="mt-2 text-4xl font-bold">
        ${target.toLocaleString()}
      </div>

      <div className="mt-8 text-slate-500">
        Current Savings
      </div>

      <div className="mt-2 text-3xl font-bold text-green-600">
        ${current.toLocaleString()}
      </div>

      <div className="mt-8 h-4 rounded-full bg-slate-200">
        <div
          className="h-4 rounded-full bg-blue-600"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-4 text-lg font-semibold">
        {progress}% Complete
      </div>
    </div>
  );
}